#!/usr/bin/env python3
"""
Blog Post Generator Agent

Processes GitHub issues labeled 'blog-link', fetches content from URLs,
and uses Groq to synthesize original blog posts.
"""

import os
import re
import json
from datetime import datetime

import requests
from bs4 import BeautifulSoup
import frontmatter
from groq import Groq

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


def fetch_url_content(url):
    """Fetch and extract text content and image from a URL."""
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

        # Clean up whitespace
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = text[:MAX_CONTENT_LENGTH]

        return {"url": url, "content": text, "image": image_url, "success": True}

    except Exception as e:
        return {"url": url, "content": f"Failed to fetch: {str(e)}", "image": None, "success": False}


def get_unsplash_image(query):
    """Get a relevant image from Unsplash based on query."""
    try:
        # Use Unsplash Source for random relevant image (no API key needed)
        # This redirects to an actual image URL
        search_query = query.replace(" ", ",")[:50]
        return f"https://source.unsplash.com/800x500/?{search_query}"
    except:
        return None


def generate_post(client, issue_data, fetched_contents):
    """Use Groq to synthesize a blog post from the fetched content."""
    # Build context from fetched content
    sources_text = ""
    for item in fetched_contents:
        if item["success"]:
            sources_text += f"\n\n--- Source: {item['url']} ---\n{item['content']}"

    if not sources_text.strip():
        return None

    prompt = f"""You are a skilled technical writer for Bitroot, a technology company that helps startups build their foundation.

Write an original, insightful blog post based on the following source materials. Your post should:
- Be 600-1200 words
- Have a clear, engaging title
- Synthesize ideas from the sources into your own original analysis
- Add your own insights and perspective
- Be written in a professional but accessible tone
- Include practical takeaways for readers
- NOT copy text directly from sources
- NOT include phrases like "according to" or "the article says"

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

    # Try to parse JSON from response
    # Remove markdown code blocks if present
    if response_text.startswith("```"):
        response_text = re.sub(r"^```\w*\n?", "", response_text)
        response_text = re.sub(r"\n?```$", "", response_text)

    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        # Try to extract JSON from response
        json_match = re.search(r"\{[\s\S]*\}", response_text)
        if json_match:
            return json.loads(json_match.group())
        raise ValueError(f"Could not parse JSON from response: {response_text[:500]}")


def create_post_file(post_data, source_urls, image_url=None):
    """Create a markdown file with frontmatter."""
    today = datetime.now().strftime("%Y-%m-%d")

    # Generate slug from title
    slug = re.sub(r"[^\w\s-]", "", post_data["title"].lower())
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = slug[:50].strip("-")

    filename = f"{today}-{slug}.md"
    filepath = os.path.join(POSTS_DIR, filename)

    # If no image from sources, get one from Unsplash based on tags/title
    if not image_url:
        tags = post_data.get("tags", [])
        query = " ".join(tags[:2]) if tags else post_data["title"][:30]
        image_url = get_unsplash_image(query)

    # Create post with frontmatter
    post = frontmatter.Post(post_data["content"])
    post.metadata = {
        "title": post_data["title"],
        "date": today,
        "tags": post_data.get("tags", []),
        "excerpt": post_data.get("excerpt", ""),
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

            # Get image from sources (use first found)
            source_image = None
            for item in fetched_contents:
                if item.get("image"):
                    source_image = item["image"]
                    break

            # Create file
            filepath = create_post_file(post_data, issue_data["urls"], source_image)
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
