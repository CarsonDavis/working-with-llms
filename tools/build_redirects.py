#!/usr/bin/env python3
"""Generate the published GitHub Pages tree as redirect stubs.

The guide has MOVED to its canonical home at
https://llms.codebycarson.com/working-with-llms/ . This repo's Pages deploy no
longer publishes the guide itself (the new site builds the guide from this
repo's source at build time); instead it publishes one lightweight HTML stub
per page so that anyone holding an old madebycarson.com/working-with-llms/ link
lands on the corresponding page at the new home.

Each stub does a client-side redirect (meta refresh), declares the new URL as
canonical for SEO, and shows a visible "this guide has moved" link as a
fallback. Deep links are preserved 1:1: every guide/*.md page maps to the same
path on the new site. A root 404.html catch-all bounces any unknown path to the
guide root.

The guide source (guide/, mkdocs.yml, hooks/) is intentionally left untouched
so the new site's CI can keep building the real guide from it.
"""

from __future__ import annotations

import html
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
GUIDE_DIR = REPO_ROOT / "guide"
SITE_DIR = REPO_ROOT / "site"

# Canonical new home. Trailing slash required.
NEW_BASE = "https://llms.codebycarson.com/working-with-llms/"

STUB_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url={dest}">
  <link rel="canonical" href="{dest}">
  <meta name="robots" content="noindex, follow">
  <title>This guide has moved</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif; max-width: 40rem; margin: 15vh auto;
      padding: 0 1.5rem; line-height: 1.6; color: #1a1a1a; }}
    a {{ color: #1565c0; }}
    @media (prefers-color-scheme: dark) {{
      body {{ background: #121212; color: #e0e0e0; }}
      a {{ color: #64b5f6; }}
    }}
  </style>
</head>
<body>
  <h1>This guide has moved</h1>
  <p><strong>Working With LLMs</strong> now lives at its own home. You are being
     redirected&hellip;</p>
  <p>If you are not redirected automatically,
     <a href="{dest}">continue to the new page</a>.</p>
</body>
</html>
"""


def stub(dest: str) -> str:
    return STUB_TEMPLATE.format(dest=html.escape(dest, quote=True))


def write(path: Path, dest: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(stub(dest), encoding="utf-8")
    rel = path.relative_to(SITE_DIR)
    print(f"  {rel}  ->  {dest}")


def main() -> None:
    if SITE_DIR.exists():
        import shutil

        shutil.rmtree(SITE_DIR)
    SITE_DIR.mkdir(parents=True)

    print(f"Generating redirect stubs -> {NEW_BASE}")

    # One stub per guide page, mapped to the same directory-URL path on the new
    # site (matches MkDocs' default use_directory_urls layout).
    for md in sorted(GUIDE_DIR.rglob("*.md")):
        rel = md.relative_to(GUIDE_DIR)
        if rel.name == "index.md":
            url_path = rel.parent.as_posix()
            url_path = "" if url_path == "." else url_path + "/"
        else:
            url_path = rel.with_suffix("").as_posix() + "/"
        dest = NEW_BASE + url_path
        write(SITE_DIR / url_path / "index.html", dest)

    # The old Pages build also published an Eleventy scrolly preview under
    # /scrolly/; the new site has no equivalent, so fall back to the guide root.
    write(SITE_DIR / "scrolly" / "index.html", NEW_BASE)

    # Catch-all: GitHub Pages serves 404.html for any unmatched path.
    write(SITE_DIR / "404.html", NEW_BASE)

    print("Done.")


if __name__ == "__main__":
    main()
