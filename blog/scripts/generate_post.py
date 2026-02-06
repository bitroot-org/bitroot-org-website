#!/usr/bin/env python3
"""
Blog Post Generator Agent

Processes GitHub issues labeled 'blog-link', fetches content from URLs,
and uses Groq to synthesize original blog posts.
"""

import os
import re
import json
import logging
from datetime import datetime

import requests
from bs4 import BeautifulSoup
import frontmatter
from groq import Groq

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Configuration
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
REPO_NAME = os.environ.get("REPO_NAME", "")
ISSUE_NUMBER = os.environ.get("ISSUE_NUMBER")
EVENT_NAME = os.environ.get("EVENT_NAME", "workflow_dispatch")

POSTS_DIR = "blog/posts"
MEDIA_DIR = "blog/media"
MAX_CONTENT_LENGTH = 15000  # Max chars per URL to avoid token limits
MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50MB max video size


def setup_groq():
    """Initialize Groq client."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable not set")
    return Groq(api_key=GROQ_API_KEY)


def get_github_issues():
    """Fetch open issues with 'blog-link' label."""
    if not GITHUB_TOKEN or not REPO_NAME:
        raise ValueError("GITHUB_TOKEN and REPO_NAME must be set")

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    # If triggered by specific issue, only process that one
    if EVENT_NAME == "issues" and ISSUE_NUMBER:
        url = f"https://api.github.com/repos/{REPO_NAME}/issues/{ISSUE_NUMBER}"
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        return [resp.json()]

    # Otherwise, get all open issues with blog-link label
    url = f"https://api.github.com/repos/{REPO_NAME}/issues"
    params = {"labels": "blog-link", "state": "open"}
    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()


def parse_issue(issue):
    """Extract URLs and optional angle from issue body."""
    body = issue.get("body", "") or ""
    title = issue.get("title", "Blog Post")

    # Extract URLs
    url_pattern = r"https?://[^\s<>\"\']+"
    urls = re.findall(url_pattern, body)

    # Extract angle (text after URLs or labeled with "Angle:")
    angle_match = re.search(r"(?:angle|topic|focus)[:\s]*(.+)", body, re.IGNORECASE)
    angle = angle_match.group(1).strip() if angle_match else None

    # If no explicit angle, use remaining text after URLs
    if not angle:
        remaining = re.sub(url_pattern, "", body).strip()
        remaining = re.sub(r"\s+", " ", remaining)
        if len(remaining) > 10:
            angle = remaining

    return {
        "title": title,
        "urls": urls,
        "angle": angle,
        "issue_number": issue.get("number"),
    }


def fetch_twitter_content(url):
    """Fetch tweet content using fxtwitter API (better media support)."""
    try:
        # Extract tweet ID from URL
        # Handles: twitter.com/user/status/123, x.com/user/status/123, x.com/i/status/123
        tweet_id_match = re.search(r'/status/(\d+)', url)
        if not tweet_id_match:
            raise ValueError(f"Could not extract tweet ID from URL: {url}")

        tweet_id = tweet_id_match.group(1)
        logger.info(f"Original URL: {url}")
        logger.info(f"Tweet ID: {tweet_id}")

        # Use fxtwitter API - provides direct media URLs
        api_url = f"https://api.fxtwitter.com/status/{tweet_id}"
        logger.info(f"Fetching from fxtwitter API: {api_url}")

        resp = requests.get(api_url, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        tweet = data.get("tweet", {})

        # Extract tweet text
        tweet_text = tweet.get("text", "")
        author_name = tweet.get("author", {}).get("name", "")
        author_handle = tweet.get("author", {}).get("screen_name", "")

        # Build content with context
        content = f"Tweet by {author_name} (@{author_handle}):\n\n{tweet_text}"
        description = tweet_text[:250] if len(tweet_text) > 250 else tweet_text

        # Extract media (images, GIFs, videos)
        image_url = None
        video_url = None
        media_list = []

        media = tweet.get("media", {})

        # Handle images
        if media.get("photos"):
            for photo in media["photos"]:
                img_url = photo.get("url")
                if img_url:
                    media_list.append({"type": "image", "url": img_url})
                    if not image_url:
                        image_url = img_url

        # Handle videos
        if media.get("videos"):
            for video in media["videos"]:
                vid_url = video.get("url")
                thumb_url = video.get("thumbnail_url")
                if vid_url:
                    media_list.append({"type": "video", "url": vid_url, "thumbnail": thumb_url})
                    if not video_url:
                        video_url = vid_url
                    if not image_url and thumb_url:
                        image_url = thumb_url

        # Handle GIFs (Twitter treats them as videos)
        if media.get("gifs"):
            for gif in media["gifs"]:
                gif_url = gif.get("url")
                thumb_url = gif.get("thumbnail_url")
                if gif_url:
                    media_list.append({"type": "gif", "url": gif_url, "thumbnail": thumb_url})
                    if not video_url:
                        video_url = gif_url
                    if not image_url and thumb_url:
                        image_url = thumb_url

        # Fallback to mosaic or external media
        if not image_url:
            mosaic = media.get("mosaic", {})
            if mosaic.get("formats", {}).get("jpeg"):
                image_url = mosaic["formats"]["jpeg"]

        if not image_url and media.get("external", {}).get("thumbnail_url"):
            image_url = media["external"]["thumbnail_url"]

        logger.info("=" * 60)
        logger.info(f"EXTRACTED TWITTER DATA FROM: {url}")
        logger.info("=" * 60)
        logger.info(f"Author: {author_name} (@{author_handle})")
        logger.info(f"Tweet text: {tweet_text[:200]}...")
        logger.info(f"Image URL: {image_url}")
        logger.info(f"Video URL: {video_url}")
        logger.info(f"Media count: {len(media_list)}")
        logger.info("=" * 60)

        return {
            "url": url,
            "title": f"{author_name} on X" if author_name else None,
            "content": content,
            "image": image_url,
            "video": video_url,
            "media": media_list,
            "description": description,
            "success": True
        }

    except Exception as e:
        logger.error(f"Failed to fetch Twitter content via fxtwitter: {str(e)}")
        # Fallback to oEmbed
        return fetch_twitter_content_oembed(url)


def fetch_twitter_content_oembed(url):
    """Fallback: Fetch tweet content using Twitter's oEmbed API."""
    try:
        normalized_url = url.replace('x.com', 'twitter.com')
        normalized_url = re.sub(r'/i/status/', '/anyuser/status/', normalized_url)

        oembed_url = f"https://publish.twitter.com/oembed?url={normalized_url}&omit_script=true"
        logger.info(f"Fallback to oEmbed: {oembed_url}")

        resp = requests.get(oembed_url, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        html_content = data.get("html", "")
        soup = BeautifulSoup(html_content, "html.parser")
        tweet_text = soup.get_text(separator=" ", strip=True)
        tweet_text = re.sub(r'\s*—\s*[^(]+\(@\w+\)\s*\w+\s*\d+,\s*\d+\s*$', '', tweet_text)

        author_name = data.get("author_name", "")
        author_handle = data.get("author_url", "").split("/")[-1] if data.get("author_url") else ""

        content = f"Tweet by {author_name} (@{author_handle}):\n\n{tweet_text}"
        description = tweet_text[:250] if len(tweet_text) > 250 else tweet_text

        return {
            "url": url,
            "title": f"{author_name} on X" if author_name else None,
            "content": content,
            "image": None,
            "video": None,
            "media": [],
            "description": description,
            "success": True
        }

    except Exception as e:
        logger.error(f"oEmbed fallback also failed: {str(e)}")
        return {"url": url, "content": f"Failed to fetch tweet: {str(e)}", "image": None, "video": None, "media": [], "description": None, "success": False}


def fetch_social_media_content(url):
    """Fetch content from Threads or Instagram posts via og:tags.

    Both platforms render og:tags server-side. This handler extracts:
    - og:title, og:description for text content
    - og:video / og:video:url for video URLs (preferred over thumbnail images)
    - og:image as fallback (but filtered to avoid play-button thumbnails)
    """
    try:
        platform = "Instagram" if "instagram.com" in url else "Threads"
        logger.info(f"Fetching {platform} post: {url}")

        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

        # Extract all og:tags
        og_title = soup.find("meta", property="og:title")
        og_desc = soup.find("meta", property="og:description")
        og_image = soup.find("meta", property="og:image")
        og_type = soup.find("meta", property="og:type")

        # Extract video tags (Instagram/Threads serve these for video posts)
        og_video = soup.find("meta", property="og:video")
        og_video_url = soup.find("meta", property="og:video:url")
        og_video_secure = soup.find("meta", property="og:video:secure_url")
        og_video_type = soup.find("meta", property="og:video:type")

        title = og_title["content"] if og_title else ""
        description = og_desc["content"] if og_desc else ""
        content_type = og_type["content"] if og_type else ""

        # Determine video URL (prefer secure_url > video:url > video)
        video_url = None
        for v_tag in [og_video_secure, og_video_url, og_video]:
            if v_tag and v_tag.get("content"):
                video_url = v_tag["content"]
                break

        # Determine image URL
        image_url = og_image["content"] if og_image else None

        # If this is a video post, the og:image is just a thumbnail with play button
        # Try to find a cleaner image or flag it
        is_video_post = bool(video_url) or content_type == "video" or (
            "video" in (og_video_type["content"] if og_video_type else "").lower()
        )

        if is_video_post and image_url:
            logger.info(f"Video post detected - og:image is likely a thumbnail with play button overlay")
            # For video posts, we'll use the video and let the frontend show
            # a poster frame from the video itself rather than the bad thumbnail

        # Clean up HTML entities
        if description:
            description = (description
                .replace("&#xfa;", "ú")
                .replace("&#xc1;", "Á")
                .replace("&#064;", "@")
                .replace("&amp;", "&")
                .replace("&#x27;", "'")
                .replace("&quot;", '"'))

        # Extract username from title (format: "Username (@handle) on Threads/Instagram")
        author_match = re.search(r"(.+?)\s*\(@(\w+)\)", title) if title else None
        author_name = author_match.group(1) if author_match else ""
        author_handle = author_match.group(2) if author_match else ""

        # Build content
        if author_name:
            content = f"{platform} post by {author_name} (@{author_handle}):\n\n{description}"
        else:
            content = description

        logger.info("=" * 60)
        logger.info(f"EXTRACTED {platform.upper()} DATA FROM: {url}")
        logger.info("=" * 60)
        logger.info(f"Author: {author_name} (@{author_handle})")
        logger.info(f"Content type: {content_type}")
        logger.info(f"Description: {description[:200]}...")
        logger.info(f"Image URL: {image_url}")
        logger.info(f"Video URL: {video_url}")
        logger.info(f"Is video post: {is_video_post}")
        logger.info("=" * 60)

        # Warn if content is too short
        if len(description) < 100:
            logger.warning(f"{platform} post has very short content ({len(description)} chars) - may not be suitable for blog generation")

        return {
            "url": url,
            "title": title,
            "content": content,
            "image": image_url if not is_video_post else None,  # Skip thumbnail for video posts
            "video": video_url,
            "media": [],
            "description": description,
            "success": True
        }

    except Exception as e:
        logger.error(f"Failed to fetch {platform} content: {str(e)}")
        return {"url": url, "content": f"Failed to fetch: {str(e)}", "image": None, "video": None, "media": [], "description": None, "success": False}


def fetch_url_content(url):
    """Fetch and extract text content, image, and description from a URL."""
    # Handle Twitter/X URLs specially
    if 'twitter.com' in url or 'x.com' in url:
        logger.info(f"Detected Twitter/X URL, using fxtwitter API")
        return fetch_twitter_content(url)

    # Handle Threads/Instagram URLs
    if 'threads.net' in url or 'threads.com' in url:
        logger.info(f"Detected Threads URL, extracting og:tags")
        return fetch_social_media_content(url)

    if 'instagram.com' in url:
        logger.info(f"Detected Instagram URL, extracting og:tags")
        return fetch_social_media_content(url)

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; BitrootBlogAgent/1.0)"
        }
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

        # Extract page title from og:title or <title> tag
        page_title = None
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            page_title = og_title["content"].strip()
        if not page_title:
            title_tag = soup.find("title")
            if title_tag and title_tag.string:
                page_title = title_tag.string.strip()

        # Try to extract image (og:image, twitter:image, or first large image)
        image_url = None

        # Try og:image first
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            image_url = og_image["content"]

        # Try twitter:image
        if not image_url:
            twitter_image = soup.find("meta", {"name": "twitter:image"})
            if twitter_image and twitter_image.get("content"):
                image_url = twitter_image["content"]

        # Try first significant image in content
        if not image_url:
            for img in soup.find_all("img", src=True):
                src = img["src"]
                # Skip small images, icons, logos
                if any(skip in src.lower() for skip in ["icon", "logo", "avatar", "badge", "button"]):
                    continue
                # Check for width/height attributes suggesting larger image
                width = img.get("width", "")
                height = img.get("height", "")
                if width and int(width) < 200:
                    continue
                if height and int(height) < 150:
                    continue
                image_url = src
                break

        # Extract description/excerpt from source
        description = None

        # Try og:description first (most reliable for social sharing)
        og_desc = soup.find("meta", property="og:description")
        if og_desc and og_desc.get("content"):
            description = og_desc["content"].strip()

        # Try meta description
        if not description:
            meta_desc = soup.find("meta", {"name": "description"})
            if meta_desc and meta_desc.get("content"):
                description = meta_desc["content"].strip()

        # Try twitter:description
        if not description:
            twitter_desc = soup.find("meta", {"name": "twitter:description"})
            if twitter_desc and twitter_desc.get("content"):
                description = twitter_desc["content"].strip()

        # Remove script, style, nav, footer elements
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()

        # Try to find main content
        main_content = (
            soup.find("article")
            or soup.find("main")
            or soup.find(class_=re.compile(r"content|article|post", re.I))
            or soup.find("body")
        )

        if main_content:
            text = main_content.get_text(separator="\n", strip=True)
        else:
            text = soup.get_text(separator="\n", strip=True)

        # Fallback: extract first 2-3 sentences from content if no description found
        if not description and text:
            # Split into sentences and take first 2-3
            sentences = re.split(r'(?<=[.!?])\s+', text[:1000])
            if sentences:
                # Take up to 3 sentences, max ~250 chars
                excerpt_sentences = []
                char_count = 0
                for sent in sentences[:3]:
                    if char_count + len(sent) > 250:
                        break
                    excerpt_sentences.append(sent)
                    char_count += len(sent)
                if excerpt_sentences:
                    description = " ".join(excerpt_sentences)

        # Clean up whitespace
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = text[:MAX_CONTENT_LENGTH]

        # Log extracted data
        logger.info("=" * 60)
        logger.info(f"EXTRACTED DATA FROM: {url}")
        logger.info("=" * 60)
        logger.info(f"Page title: {page_title}")
        logger.info(f"Image URL: {image_url}")
        logger.info(f"Description: {description}")
        logger.info(f"Content length: {len(text)} chars")
        logger.info(f"Content preview (first 500 chars):\n{text[:500]}")
        logger.info("=" * 60)

        return {"url": url, "title": page_title, "content": text, "image": image_url, "description": description, "success": True}

    except Exception as e:
        logger.error(f"Failed to fetch {url}: {str(e)}")
        return {"url": url, "content": f"Failed to fetch: {str(e)}", "image": None, "description": None, "success": False}


def get_fallback_image(query):
    """Get a fallback image when no source image is available.

    Note: source.unsplash.com is deprecated. We now return None and let
    the frontend handle fallback images based on tags.
    """
    # No longer using Unsplash Source as it's deprecated
    # Frontend will use tag-based fallback images from posts-loader.js
    logger.info(f"No source image available, frontend will use tag-based fallback")
    return None


def download_media(url, slug, media_type="video"):
    """Download video/GIF and save locally.

    Args:
        url: The media URL to download
        slug: Post slug for naming the file
        media_type: 'video' or 'gif'

    Returns:
        Local path relative to blog root, or None if download fails
    """
    try:
        logger.info(f"Downloading {media_type} from: {url}")

        # Determine file extension
        if '.mp4' in url or media_type == 'video':
            ext = 'mp4'
        elif '.gif' in url or media_type == 'gif':
            ext = 'gif'
        elif '.webm' in url:
            ext = 'webm'
        else:
            ext = 'mp4'  # Default to mp4

        # Create media directory
        os.makedirs(MEDIA_DIR, exist_ok=True)

        # Generate filename
        filename = f"{slug}.{ext}"
        filepath = os.path.join(MEDIA_DIR, filename)

        # Download the file
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://twitter.com/",
        }

        # Stream download to handle large files
        with requests.get(url, headers=headers, stream=True, timeout=60) as resp:
            resp.raise_for_status()

            # Check content length
            content_length = resp.headers.get('content-length')
            if content_length and int(content_length) > MAX_VIDEO_SIZE:
                logger.warning(f"Video too large ({content_length} bytes), skipping download")
                return None

            # Download in chunks
            total_size = 0
            with open(filepath, 'wb') as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        total_size += len(chunk)
                        if total_size > MAX_VIDEO_SIZE:
                            logger.warning(f"Video exceeded max size during download, aborting")
                            os.remove(filepath)
                            return None

        logger.info(f"Downloaded {media_type} to: {filepath} ({total_size} bytes)")

        # Return path relative to blog root (for use in HTML)
        return f"media/{filename}"

    except Exception as e:
        logger.error(f"Failed to download {media_type}: {str(e)}")
        return None


def generate_post(client, issue_data, fetched_contents):
    """Use Groq to synthesize a blog post from the fetched content."""
    # Build context from fetched content
    sources_text = ""
    source_titles = []
    for item in fetched_contents:
        if item["success"]:
            sources_text += f"\n\n--- Source: {item['url']} ---\n{item['content']}"
            if item.get("title"):
                source_titles.append(item["title"])

    if not sources_text.strip():
        logger.error("No source content available to generate post")
        return None

    # Use source page title if available, otherwise fall back to issue title
    title_hint = source_titles[0] if source_titles else issue_data["title"]

    # Log source content being sent to AI
    logger.info("=" * 60)
    logger.info("SOURCE CONTENT BEING SENT TO AI")
    logger.info("=" * 60)
    logger.info(f"Issue title: {issue_data['title']}")
    logger.info(f"Source page title(s): {source_titles}")
    logger.info(f"Title hint used: {title_hint}")
    logger.info(f"Issue angle: {issue_data.get('angle')}")
    logger.info(f"Total source text length: {len(sources_text)} chars")
    logger.info(f"Source text preview (first 1000 chars):\n{sources_text[:1000]}")
    logger.info("=" * 60)

    prompt = f"""You are a community news contributor for Bitroot, sharing exciting tech updates and discoveries from around the internet.

Write a blog post announcing/sharing this news with our community. Your writing style should be:
- Like a passionate tech enthusiast sharing a cool discovery with friends
- "We spotted this...", "Here's what caught our attention...", "The community is buzzing about..."
- Excited but informative - share WHY this matters to developers/tech enthusiasts
- Feel like a curator bringing interesting finds to the community

Your post should:
- Be 400-800 words (concise and punchy)
- Have a clear, specific title about the actual news/update
- IMPORTANT: Create your OWN unique title by reading the source content. Do NOT just copy the source page title below. Paraphrase it into a catchy, newsworthy headline.
- Explain what the update/news is and why it's interesting
- Add context about why this matters to developers or the tech community
- Include your take on the implications or potential use cases
- NOT copy text directly from sources
- NOT be dry or corporate - be genuinely enthusiastic

CRITICAL FORMATTING REQUIREMENTS:
- Structure with clear ## headings
- SHORT paragraphs (2-3 sentences max)
- Use bullet points for features/benefits
- Include at least 3 section headings
- Double newlines between paragraphs

Example tone:
"We just spotted an exciting update from [Company] that's worth sharing with the community..."
"Here's why this matters for developers..."
"What caught our attention about this..."

Source page title: {title_hint}
{f"Angle/Focus: {issue_data['angle']}" if issue_data.get('angle') else ""}

Source materials:
{sources_text}

Output format:
Return ONLY a JSON object with these fields (no markdown code blocks, no extra text):
{{
  "title": "Your Own Paraphrased Title (DO NOT copy the source title verbatim)",
  "tags": ["tag1", "tag2"],
  "excerpt": "A 1-2 sentence summary for preview cards",
  "content": "The full markdown content with ## headings and short paragraphs"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a community tech news contributor, sharing exciting discoveries with fellow developers. Write with enthusiasm like sharing cool finds with friends. Always respond with valid JSON only, no markdown code blocks."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=4096,
    )

    response_text = response.choices[0].message.content.strip()

    # Log raw AI response
    logger.info("=" * 60)
    logger.info("RAW AI RESPONSE")
    logger.info("=" * 60)
    logger.info(f"Response length: {len(response_text)} chars")
    logger.debug(f"Full response:\n{response_text}")
    logger.info("=" * 60)

    # Try to parse JSON from response
    # Remove markdown code blocks if present
    if response_text.startswith("```"):
        response_text = re.sub(r"^```\w*\n?", "", response_text)
        response_text = re.sub(r"\n?```$", "", response_text)

    # Clean control characters that break JSON parsing
    # Replace actual newlines in string values with \n escape sequences
    def clean_json_string(s):
        # First, try to parse as-is
        try:
            return json.loads(s)
        except json.JSONDecodeError:
            pass

        # Extract JSON object
        json_match = re.search(r"\{[\s\S]*\}", s)
        if not json_match:
            raise ValueError(f"No JSON object found in response: {s[:500]}")

        json_str = json_match.group()

        # Fix common issues: control characters in string values
        # This is a simplified fix - replace literal newlines inside strings
        # by finding quoted strings and escaping newlines within them
        fixed = []
        in_string = False
        escape_next = False
        for char in json_str:
            if escape_next:
                fixed.append(char)
                escape_next = False
                continue
            if char == '\\':
                fixed.append(char)
                escape_next = True
                continue
            if char == '"':
                in_string = not in_string
                fixed.append(char)
                continue
            if in_string and char == '\n':
                fixed.append('\\n')
                continue
            if in_string and char == '\r':
                fixed.append('\\r')
                continue
            if in_string and char == '\t':
                fixed.append('\\t')
                continue
            fixed.append(char)

        return json.loads(''.join(fixed))

    try:
        parsed = clean_json_string(response_text)
    except (json.JSONDecodeError, ValueError) as e:
        logger.error(f"JSON parsing failed: {e}")
        logger.error(f"Response text: {response_text[:1000]}")
        raise ValueError(f"Could not parse JSON from response: {str(e)}")

    # Log parsed/generated post data
    logger.info("=" * 60)
    logger.info("GENERATED POST DATA")
    logger.info("=" * 60)
    logger.info(f"Title: {parsed.get('title')}")
    logger.info(f"Tags: {parsed.get('tags')}")
    logger.info(f"Excerpt: {parsed.get('excerpt')}")
    logger.info(f"Content length: {len(parsed.get('content', ''))} chars")
    logger.info(f"Content preview (first 500 chars):\n{parsed.get('content', '')[:500]}")
    logger.info("=" * 60)

    return parsed


def create_post_file(post_data, source_urls, image_url=None, source_excerpt=None, video_url=None, media_list=None):
    """Create a markdown file with frontmatter."""
    from datetime import timezone
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    published_at = now.isoformat()  # Full ISO timestamp with UTC offset for display

    # Generate slug from title
    slug = re.sub(r"[^\w\s-]", "", post_data["title"].lower())
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = slug[:50].strip("-")

    filename = f"{today}-{slug}.md"
    filepath = os.path.join(POSTS_DIR, filename)

    # If no image from sources, use fallback (frontend will handle tag-based images)
    if not image_url:
        tags = post_data.get("tags", [])
        query = " ".join(tags[:2]) if tags else post_data["title"][:30]
        image_url = get_fallback_image(query)

    # Use source excerpt if available, fallback to AI-generated excerpt
    excerpt = source_excerpt if source_excerpt else post_data.get("excerpt", "")

    # Download video/GIF if available (to avoid hotlink blocking)
    local_video = None
    if video_url:
        # Determine if it's a GIF based on URL or media list
        is_gif = '.gif' in video_url or (media_list and any(m.get('type') == 'gif' for m in media_list))
        local_video = download_media(video_url, f"{today}-{slug}", "gif" if is_gif else "video")

    # Create post with frontmatter
    post = frontmatter.Post(post_data["content"])
    post.metadata = {
        "title": post_data["title"],
        "date": today,
        "published_at": published_at,
        "tags": post_data.get("tags", []),
        "excerpt": excerpt,
        "image": image_url,
        "sources": source_urls,
    }

    # Add local video path if download succeeded
    if local_video:
        post.metadata["video"] = local_video
        logger.info(f"Video saved locally: {local_video}")
    elif video_url:
        # Keep original URL as fallback (might work for non-Twitter sources)
        post.metadata["video"] = video_url
        logger.warning(f"Using original video URL (download failed): {video_url}")

    # Add media gallery if multiple media items
    if media_list and len(media_list) > 1:
        post.metadata["media"] = media_list

    os.makedirs(POSTS_DIR, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(frontmatter.dumps(post))

    return filepath


def comment_on_issue(issue_number, message):
    """Add a comment to the GitHub issue."""
    if not GITHUB_TOKEN or not REPO_NAME:
        return

    url = f"https://api.github.com/repos/{REPO_NAME}/issues/{issue_number}/comments"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    data = {"body": message}
    requests.post(url, headers=headers, json=data)


def close_issue(issue_number):
    """Close the GitHub issue after processing."""
    if not GITHUB_TOKEN or not REPO_NAME:
        return

    url = f"https://api.github.com/repos/{REPO_NAME}/issues/{issue_number}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    data = {"state": "closed"}
    requests.patch(url, headers=headers, json=data)


def main():
    print("Starting blog post generator...")

    # Setup
    client = setup_groq()
    issues = get_github_issues()

    if not issues:
        print("No issues with 'blog-link' label found.")
        return

    print(f"Found {len(issues)} issue(s) to process")

    for issue in issues:
        issue_data = parse_issue(issue)
        issue_num = issue_data["issue_number"]

        print(f"\nProcessing issue #{issue_num}: {issue_data['title']}")

        if not issue_data["urls"]:
            print(f"  No URLs found in issue #{issue_num}")
            comment_on_issue(
                issue_num,
                "No URLs found in this issue. Please add URLs to generate a post.",
            )
            continue

        print(f"  Found {len(issue_data['urls'])} URL(s)")

        # Fetch content from each URL
        fetched_contents = []
        for url in issue_data["urls"]:
            print(f"  Fetching: {url}")
            content = fetch_url_content(url)
            fetched_contents.append(content)
            if content["success"]:
                print(f"    Fetched {len(content['content'])} chars")
            else:
                print(f"    Failed: {content['content']}")

        # Generate post
        print("  Generating post with Groq (Llama 3.3 70B)...")
        try:
            post_data = generate_post(client, issue_data, fetched_contents)
            if not post_data:
                print("  Failed to generate post - no content")
                comment_on_issue(
                    issue_num, "Failed to generate post - could not fetch any content from the provided URLs."
                )
                continue

            # Get image, video, media and description from sources (use first found)
            source_image = None
            source_video = None
            source_media = []
            source_excerpt = None
            for item in fetched_contents:
                if item.get("image") and not source_image:
                    source_image = item["image"]
                if item.get("video") and not source_video:
                    source_video = item["video"]
                if item.get("media"):
                    source_media.extend(item["media"])
                if item.get("description") and not source_excerpt:
                    desc = item["description"]
                    # Only use source excerpt if it's a proper short summary (< 200 chars)
                    # Social media og:descriptions are often the full post text - skip those
                    if len(desc) <= 200:
                        source_excerpt = desc
                    else:
                        logger.info(f"Source description too long ({len(desc)} chars), using AI-generated excerpt instead")

            # Create file
            filepath = create_post_file(
                post_data,
                issue_data["urls"],
                source_image,
                source_excerpt,
                source_video,
                source_media if source_media else None
            )
            print(f"  Created: {filepath}")

            # Comment on issue
            comment_on_issue(
                issue_num,
                f"Blog post generated. A PR will be created with the new post.\n\n**Title:** {post_data['title']}\n\n**File:** `{filepath}`",
            )

            # Close the issue
            close_issue(issue_num)
            print(f"  Closed issue #{issue_num}")

        except Exception as e:
            print(f"  Error generating post: {e}")
            comment_on_issue(issue_num, f"Error generating post: {str(e)}")

    print("\nDone!")


if __name__ == "__main__":
    main()
