"""Make the repo README.md the single source for the site home page.

The README is authored for GitHub: its internal links are repo-relative
(e.g. `guide/START-HERE.md`) and it has no styled button. For the MkDocs site
home (which lives inside `docs_dir: guide`) we transform that same content:

  - strip the leading `guide/` from relative links so they resolve from the
    home page (where `START-HERE.md` etc. are siblings), and
  - replace each `<!-- site-button | Label | target.md -->` marker with a real
    Material button.

GitHub renders the HTML-comment marker as nothing, so the README stays clean
there while the site gets a button. Edit README.md only; the site home cannot
drift because it *is* the README.
"""

import re
from pathlib import Path

# <!-- site-button | Start Here → | START-HERE.md -->
_BUTTON = re.compile(
    r"<!--\s*site-button\s*\|\s*(?P<label>.+?)\s*\|\s*(?P<target>\S+)\s*-->"
)


def on_page_read_source(page, config, **kwargs):
    # Only override the home page; let every other page load normally.
    if page.file.src_uri != "index.md":
        return None

    readme = Path(config["docs_dir"]).parent / "README.md"
    text = readme.read_text(encoding="utf-8")

    # Repo-relative links -> home-relative links, e.g. (guide/X.md) -> (X.md).
    text = re.sub(r"\]\(guide/", "](", text)

    # Markers -> Material buttons.
    text = _BUTTON.sub(
        lambda m: f"[{m.group('label')}]({m.group('target')})"
        "{ .md-button .md-button--primary }",
        text,
    )

    return text
