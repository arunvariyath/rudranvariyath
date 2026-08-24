#!/usr/bin/env python3
"""
Sync the poem list from the YouTube channel into `public/data/poems.json`.

Run locally:
    pip install yt-dlp
    python scripts/update_poems.py

Runs automatically every day via .github/workflows/update-poems.yml
"""

import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import urlopen

CHANNEL_URL = "https://www.youtube.com/channel/UCA__E2cnlxfRKW3PoG5CL0Q/videos"
OUTPUT_PATH = os.path.join("public", "data", "poems.json")


def fetch_videos(channel_url: str) -> list:
    """Return a flat list of video entries for the channel using yt-dlp."""
    print(f"Fetching videos from {channel_url} ...")
    cmd = [
        "yt-dlp",
        "--flat-playlist",
        "--ignore-errors",
        # Ask the YouTube tab extractor for upload dates. Without this, a flat
        # playlist listing returns no date information at all.
        "--extractor-args",
        "youtubetab:approximate_date",
        "-J",
        channel_url,
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    except FileNotFoundError:
        print("ERROR: yt-dlp is not installed. Run: pip install yt-dlp")
        sys.exit(1)
    except subprocess.CalledProcessError as exc:
        print(f"ERROR running yt-dlp: {exc.stderr[:500]}")
        sys.exit(1)

    data = json.loads(result.stdout)
    entries = data.get("entries") or []
    print(f"Found {len(entries)} videos.")
    return entries


def extract_date(video: dict) -> str:
    """
    Return an upload date as `YYYYMMDD`, or "" when unknown.

    yt-dlp may expose the date as `upload_date` (already YYYYMMDD) or as a unix
    `timestamp`, depending on the extractor path taken.
    """
    upload_date = video.get("upload_date")
    if upload_date and str(upload_date).isdigit() and len(str(upload_date)) == 8:
        return str(upload_date)

    timestamp = video.get("timestamp")
    if isinstance(timestamp, (int, float)) and timestamp > 0:
        from datetime import datetime, timezone

        return datetime.fromtimestamp(timestamp, tz=timezone.utc).strftime("%Y%m%d")

    return ""


def is_embeddable(video_id: str) -> bool:
    """
    Return False when YouTube refuses to embed this video.

    The oembed endpoint answers 200 only for videos that allow embedding;
    private / owner-disabled videos get 401 and deleted ones 404. Any network
    hiccup counts as "embeddable" so a flaky connection can never hide content.
    """
    url = (
        "https://www.youtube.com/oembed?url="
        f"{quote(f'https://www.youtube.com/watch?v={video_id}', safe='')}"
        "&format=json"
    )
    try:
        with urlopen(url, timeout=20) as res:
            return res.status == 200
    except HTTPError as exc:
        return exc.code < 400
    except URLError:
        return True


def flag_embeddable(poems: list) -> None:
    """Attach `embeddable: false` to entries the modal player cannot show."""
    ids = [p["poemSrc"] for p in poems]
    with ThreadPoolExecutor(max_workers=16) as pool:
        results = list(pool.map(is_embeddable, ids))

    blocked = sum(1 for ok in results if not ok)
    for poem, ok in zip(poems, results):
        if not ok:
            poem["embeddable"] = False
    print(f"{blocked} video(s) refuse embedding — flagged to open on YouTube.")


def write_poems(videos: list) -> None:
    """Write the poem list in the shape the website expects."""
    poems = []
    for video in videos:
        if not video or not video.get("id"):
            continue

        entry = {
            "poemSrc": video["id"],
            "poemTitle": (video.get("title") or "").strip(),
        }

        # Only include the key when we genuinely know the date — the UI hides
        # the date badge for entries without one rather than showing a guess.
        published_at = extract_date(video)
        if published_at:
            entry["publishedAt"] = published_at

        poems.append(entry)

    if not poems:
        print("No videos found — refusing to overwrite with an empty list.")
        sys.exit(1)

    dated = sum(1 for p in poems if "publishedAt" in p)
    print(f"{dated}/{len(poems)} entries have an upload date.")

    flag_embeddable(poems)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(poems, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"Wrote {len(poems)} poems to {OUTPUT_PATH}")


if __name__ == "__main__":
    write_poems(fetch_videos(CHANNEL_URL))
