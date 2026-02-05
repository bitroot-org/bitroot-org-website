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
MAX_CONTENT_LENGTH = 15000  # Max chars per URL to avoid token limits


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
    """Fetch tweet content using Twitter's oEmbed API."""
    try:
        # Normalize Twitter/X URLs
        # Convert x.com to twitter.com (oEmbed works better with twitter.com)
        # Remove /i/ from URL path (e.g., x.com/i/status/123 -> twitter.com/status/123)
        normalized_url = url.replace('x.com', 'twitter.com')
        normalized_url = re.sub(r'/i/status/', '/anyuser/status/', normalized_url)

        # Use Twitter's oEmbed API - free, no auth required
        oembed_url = f"https://publish.twitter.com/oembed?url={normalized_url}&omit_script=true"
        logger.info(f"Original URL: {url}")
        logger.info(f"Normalized URL: {normalized_url}")
        logger.info(f"Fetching Twitter oEmbed: {oembed_url}")

        resp = requests.get(oembed_url, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        # Extract text from HTML response
        html_content = data.get("html", "")
        soup = BeautifulSoup(html_content, "html.parser")
        tweet_text = soup.get_text(separator=" ", strip=True)

        # Clean up the text (remove "— Author (@handle) Date" suffix pattern)
        tweet_text = re.sub(r'\s*—\s*[^(]+\(@\w+\)\s*\w+\s*\d+,\s*\d+\s*$', '', tweet_text)

        author_name = data.get("author_name", "")
        author_handle = data.get("author_url", "").split("/")[-1] if data.get("author_url") else ""

        # Build content with context
        content = f"Tweet by {author_name} (@{author_handle}):\n\n{tweet_text}"
        description = tweet_text[:250] if len(tweet_text) > 250 else tweet_text

        # Try to get image from tweet page directly (og:image)
        image_url = None
        try:
            headers = {"User-Agent": "Mozilla/5.0 (compatible; BitrootBlogAgent/1.0)"}
            page_resp = requests.get(url, headers=headers, timeout=10)
            if page_resp.ok:
                page_soup = BeautifulSoup(page_resp.text, "html.parser")
                og_image = page_soup.find("meta", property="og:image")
                if og_image and og_image.get("content"):
                    img = og_image["content"]
                    # Skip default Twitter profile images
                    if "profile_images" not in img and "default_profile" not in img:
                        image_url = img
                        logger.info(f"Found og:image from Twitter page: {image_url}")
        except Exception as img_err:
            logger.warning(f"Could not fetch Twitter page for image: {img_err}")

        logger.info("=" * 60)
        logger.info(f"EXTRACTED TWITTER DATA FROM: {url}")
        logger.info("=" * 60)
        logger.info(f"Author: {author_name} (@{author_handle})")
        logger.info(f"Tweet text: {tweet_text}")
        logger.info(f"Image URL: {image_url}")
        logger.info("=" * 60)

        return {
            "url": url,
            "content": content,
            "image": image_url,
            "description": description,
            "success": True
        }

    except Exception as e:
        logger.error(f"Failed to fetch Twitter content: {str(e)}")
        return {"url": url, "content": f"Failed to fetch tweet: {str(e)}", "image": None, "description": None, "success": False}


def fetch_url_content(url):
    """Fetch and extract text content, image, and description from a URL."""
    # Handle Twitter/X URLs specially
    if 'twitter.com' in url or 'x.com' in url:
        logger.info(f"Detected Twitter/X URL, using oEmbed API")
        return fetch_twitter_content(url)

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; BitrootBlogAgent/1.0)"
        }
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")

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
        logger.info(f"Image URL: {image_url}")
        logger.info(f"Description: {description}")
        logger.info(f"Content length: {len(text)} chars")
        logger.info(f"Content preview (first 500 chars):\n{text[:500]}")
        logger.info("=" * 60)

        return {"url": url, "content": text, "image": image_url, "description": description, "success": True}

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


def generate_post(client, issue_data, fetched_contents):
    """Use Groq to synthesize a blog post from the fetched content."""
    # Build context from fetched content
    sources_text = ""
    for item in fetched_contents:
        if item["success"]:
            sources_text += f"\n\n--- Source: {item['url']} ---\n{item['content']}"

    if not sources_text.strip():
        logger.error("No source content available to generate post")
        return None

    # Log source content being sent to AI
    logger.info("=" * 60)
    logger.info("SOURCE CONTENT BEING SENT TO AI")
    logger.info("=" * 60)
    logger.info(f"Issue title: {issue_data['title']}")
    logger.info(f"Issue angle: {issue_data.get('angle')}")
    logger.info(f"Total source text length: {len(sources_text)} chars")
    logger.info(f"Source text preview (first 1000 chars):\n{sources_text[:1000]}")
    logger.info("=" * 60)

    prompt = f"""You are a skilled technical writer for Bitroot, a technology company.

Write an original, insightful blog post based on the following source materials. Your post should:
- Be 600-1200 words
- Have a clear, engaging title that reflects the ACTUAL topic of the source material
- Synthesize ideas from the sources into your own original analysis
- Add your own insights and perspective
- Be written in a professional but accessible tone
- Include practical takeaways for readers
- NOT copy text directly from sources
- NOT include phrases like "according to" or "the article says"
- NOT use generic titles like "Building a Strong Foundation" - be specific to the topic

Topic/Title hint: {issue_data['title']}
{f"Angle/Focus: {issue_data['angle']}" if issue_data.get('angle') else ""}

Source materials:
{sources_text}

Output format:
Return ONLY a JSON object with these fields (no markdown code blocks, no extra text):
{{
  "title": "Your Post Title",
  "tags": ["tag1", "tag2"],
  "excerpt": "A 1-2 sentence summary for preview",
  "content": "The full markdown content of the post (use proper markdown formatting with ## for headings)"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a technical blog writer. Always respond with valid JSON only, no markdown code blocks."
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


def create_post_file(post_data, source_urls, image_url=None, source_excerpt=None):
    """Create a markdown file with frontmatter."""
    today = datetime.now().strftime("%Y-%m-%d")

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

    # Create post with frontmatter
    post = frontmatter.Post(post_data["content"])
    post.metadata = {
        "title": post_data["title"],
        "date": today,
        "tags": post_data.get("tags", []),
        "excerpt": excerpt,
        "image": image_url,
        "sources": source_urls,
    }

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

            # Get image and description from sources (use first found)
            source_image = None
            source_excerpt = None
            for item in fetched_contents:
                if item.get("image") and not source_image:
                    source_image = item["image"]
                if item.get("description") and not source_excerpt:
                    source_excerpt = item["description"]
                # Stop if we have both
                if source_image and source_excerpt:
                    break

            # Create file
            filepath = create_post_file(post_data, issue_data["urls"], source_image, source_excerpt)
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
