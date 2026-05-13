from __future__ import annotations
"""
WILD Programme — Course Portal Builder
=======================================
Generates all HTML files for the course portal from .md source files.

Usage:
    python build_course.py

Requirements:
    pip install markdown
"""

import sys
import subprocess
import importlib

# ---------------------------------------------------------------------------
# Ensure markdown library is installed
# ---------------------------------------------------------------------------

# ensure_markdown()



import os
import re
import markdown as md_lib

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

BASE_DIR        = r"C:\Users\freez\OneDrive\Desktop\WILD Bizz"
CONTENT_DIR     = os.path.join(BASE_DIR, "06 - Course Content")
PORTAL_DIR      = os.path.join(BASE_DIR, "09 - Course Portal")
BRAND_DIR       = os.path.join(BASE_DIR, "08 - Brand Assets")

# Source markdown files
MD_TIER1        = os.path.join(CONTENT_DIR, "Tier_1_Biohacker_Foundation.md")
MD_T2_BODY      = os.path.join(CONTENT_DIR, "Tier_2_Body_Written.md")
MD_T2_SOUL      = os.path.join(CONTENT_DIR, "Tier_2_Biohacker_Advanced.md")
MD_T2_INTEG     = os.path.join(CONTENT_DIR, "Tier_2_Integration_Module.md")
MD_T3_BODY      = os.path.join(CONTENT_DIR, "Tier_3_Body_Written.md")
MD_T3_MIND_BR   = os.path.join(CONTENT_DIR, "Tier_3_Mind_Breathing.md")
MD_T3_MIND      = os.path.join(CONTENT_DIR, "Tier_3_Mind_Written.md")
MD_T3_SOUL      = os.path.join(CONTENT_DIR, "Tier_3_Video_Scripts.md")
MD_T3_CAPSTONE  = os.path.join(CONTENT_DIR, "Tier_3_Capstone.md")

# ---------------------------------------------------------------------------
# Global counters
# ---------------------------------------------------------------------------

files_created = 0
files_skipped = 0

# ---------------------------------------------------------------------------
# Markdown → HTML conversion
# ---------------------------------------------------------------------------

MD_EXTENSIONS = ["extra", "fenced_code", "tables", "nl2br"]

def md_to_html(text: str) -> str:
    """Convert a markdown string to an HTML fragment."""
    return md_lib.markdown(text, extensions=MD_EXTENSIONS)

# ---------------------------------------------------------------------------
# Markdown file parsing helpers
# ---------------------------------------------------------------------------

def read_file(path: str) -> str | None:
    """Read a file, returning None and logging if not found."""
    if not os.path.exists(path):
        print(f"  [SKIP] File not found: {path}")
        global files_skipped
        files_skipped += 1
        return None
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def split_on_heading(text: str, pattern: str) -> list[tuple[str, str]]:
    """
    Split `text` into sections wherever a line matches `pattern` (regex).
    Returns list of (heading_line, section_body) tuples.
    The heading line is the full matched line (without newline).
    """
    lines = text.split("\n")
    sections = []
    current_heading = None
    current_body = []

    for line in lines:
        if re.match(pattern, line):
            if current_heading is not None:
                sections.append((current_heading, "\n".join(current_body).strip()))
            current_heading = line
            current_body = []
        else:
            if current_heading is not None:
                current_body.append(line)

    if current_heading is not None:
        sections.append((current_heading, "\n".join(current_body).strip()))

    return sections


def extract_title_from_heading(heading: str) -> str:
    """
    Given a heading like '## LESSON 1: WHAT IS WILD?' or
    '# B1: The Sleep-Nutrition Axis', extract the human-readable title.
    Strips leading #, label codes like 'LESSON 1:', 'B1:', 'BODY 1:', etc.
    """
    # Remove leading # characters and whitespace
    title = re.sub(r"^#+\s*", "", heading).strip()
    # Remove prefix codes: LESSON N:, B1:, BODY N:, MIND N:, SOUL N:, CAPSTONE:
    title = re.sub(
        r"^(LESSON\s+\d+|B\d+|BODY\s+\d+|MIND\s+\d+|SOUL\s+\d+|CAPSTONE)\s*[:\-]\s*",
        "", title, flags=re.IGNORECASE
    ).strip()
    # Clean up — em-dash variants
    title = title.replace(" — ", " — ")
    return title

# ---------------------------------------------------------------------------
# HTML writing helpers
# ---------------------------------------------------------------------------

def write_html(path: str, html: str):
    """Write an HTML string to file, creating parent directories as needed."""
    global files_created
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    files_created += 1
    print(f"  [OK]   {os.path.relpath(path, PORTAL_DIR)}")


def css_path(depth: int) -> str:
    """Return relative path to course.css from a file `depth` levels deep."""
    return "../" * depth + "css/course.css"


def js_path(depth: int) -> str:
    """Return relative path to course.js from a file `depth` levels deep."""
    return "../" * depth + "js/course.js"


# ---------------------------------------------------------------------------
# Sidebar builder
# ---------------------------------------------------------------------------

def build_sidebar(sections: list[dict], current_slug: str, depth: int) -> str:
    """
    Build sidebar HTML.

    `sections` is a list of dicts:
        {
            "label": "BODY",          # section header label (or None)
            "lessons": [
                {"slug": "body-01", "title": "Advanced Nutrition", "file": "body-01.html"},
                ...
            ]
        }

    `current_slug` is the slug of the lesson currently being rendered.
    `depth` is how many directories deep the current file is (for path prefix).
    """
    prefix = "../" * (depth - 1)   # depth=1 means file is in tier1/, no extra prefix needed
    items_html = ""
    for section in sections:
        if section.get("label"):
            label_lower = section["label"].lower()
            items_html += (
                f'\n  <div class="track-section">'
                f'<span class="track-label {label_lower}">&#9679; {section["label"].title()} Track</span>'
                f'</div>\n'
            )
        for lesson in section["lessons"]:
            active_class = " active" if lesson["slug"] == current_slug else ""
            href = f'{prefix}{lesson["file"]}'
            lesson_id = lesson["slug"]
            items_html += (
                f'  <a href="{href}" class="sidebar-item{active_class}" data-lesson-id="{lesson_id}">'
                f'{lesson["title"]}</a>\n'
            )

    return f"""<nav class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <span class="logo-wild">WILD</span>
    <span class="logo-sub">Programme</span>
  </div>
  <a href="{prefix}index.html" class="sidebar-back">← All Tiers</a>
{items_html.rstrip()}
  <div class="sidebar-progress">
    <span class="sidebar-progress-text">0% complete</span>
    <div class="sidebar-progress-bar"><div class="sidebar-progress-fill"></div></div>
  </div>
</nav>"""


# ---------------------------------------------------------------------------
# Lesson page builder
# ---------------------------------------------------------------------------

def build_lesson_page(
    title: str,
    lesson_label: str,
    pillar: str,
    content_md: str,
    thumbnail_path: str,
    prev_href: str | None,
    next_href: str | None,
    sidebar_html: str,
    depth: int,
    integration_pending: bool = False,
    audio_night: int | None = None,
    duration_mins: int = 12,
) -> str:
    """
    Build a complete lesson HTML page.

    Parameters
    ----------
    title           : Lesson title (human-readable, no code prefix)
    lesson_label    : e.g. "Lesson 1", "Body 3", "Soul 7"
    pillar          : "body" | "mind" | "soul" | "integration" | "capstone"
    content_md      : Raw markdown content for this lesson
    thumbnail_path  : Relative URL path to hero thumbnail
    prev_href       : Relative URL to previous lesson (or None)
    next_href       : Relative URL to next lesson (or None)
    sidebar_html    : Pre-built sidebar HTML string
    depth           : Directory depth (1 = tier1/, 2 = unused here)
    integration_pending : If True, prepend an integration-pending banner
    audio_night     : If set (int), add an audio placeholder for that night number
    duration_mins   : Estimated video duration in minutes
    """
    # Pill badge class
    badge_class = {
        "body": "body",
        "mind": "mind",
        "soul": "soul",
        "integration": "integration",
        "capstone": "capstone",
    }.get(pillar.lower(), "soul")

    badge_label = pillar.upper()

    # Navigation links
    nav_prev = (
        f'<a href="{prev_href}" class="nav-prev">Previous</a>'
        if prev_href
        else '<a class="nav-prev nav-disabled">Previous</a>'
    )
    nav_next = (
        f'<a href="{next_href}" class="nav-next">Next</a>'
        if next_href
        else '<a class="nav-next nav-disabled">Next</a>'
    )

    # Integration pending banner
    pending_banner = ""
    if integration_pending:
        pending_banner = """\
    <div class="integration-pending">
      <span>&#9889;</span>
      <span>Integration Pending: This module will be populated with content from the nutrition course integration. Check back for updates.</span>
    </div>
"""

    # Audio placeholder (Tier 1 only)
    audio_html = ""
    if audio_night is not None:
        audio_html = f"""\
    <div class="audio-placeholder" tabindex="0" role="button" aria-label="Audio guide placeholder">
      <span class="audio-icon">&#127911;</span>
      <div class="placeholder-text">
        <span class="placeholder-title">Audio practice guide &mdash; Night {audio_night}</span>
        <span class="placeholder-sub">Coming soon &mdash; available at launch</span>
      </div>
      <span class="duration-badge">~15 minutes</span>
    </div>
"""

    # Convert content markdown → HTML
    content_html = md_to_html(content_md) if content_md.strip() else "<p>Content coming soon.</p>"

    # Escaped title for <title> tag
    safe_title = title.replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")

    # Derive tier_id and lesson_id for data attributes
    # lesson_label examples: "Lesson 1", "Body 3", "Soul 7", "Mind 2", "Integration", "Capstone"
    label_lower = lesson_label.lower()
    if label_lower.startswith("lesson"):
        tier_id_attr = "tier1"
        num_match = re.search(r"\d+", lesson_label)
        lesson_id_attr = f"lesson-{num_match.group()}" if num_match else "lesson-1"
    elif label_lower.startswith("integration"):
        tier_id_attr = "tier2"
        lesson_id_attr = "integration"
    elif label_lower.startswith("capstone"):
        tier_id_attr = "tier3"
        lesson_id_attr = "capstone"
    else:
        # body / mind / soul with number
        parts = lesson_label.lower().split()
        tier_id_attr = "tier2" if badge_class in ("body", "soul", "integration") and label_lower.startswith(("body", "soul")) else "tier3"
        if len(parts) >= 2:
            lesson_id_attr = f"{parts[0]}-{parts[1]}"
        else:
            lesson_id_attr = parts[0]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{safe_title} &mdash; WILD Programme</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{css_path(depth)}">
</head>
<body data-tier-id="{tier_id_attr}" data-lesson-id="{lesson_id_attr}">
<div id="reading-progress"></div>

{sidebar_html}

  <main class="lesson-main" data-page="lesson">

    <!-- Hero -->
    <div class="lesson-hero" style="background-image:url('{thumbnail_path}')">
      <div class="hero-content">
        <span class="pillar-badge {badge_class}">{badge_label}</span>
        <span class="lesson-number">{lesson_label}</span>
        <h1 class="lesson-title">{title}</h1>
      </div>
    </div>

    <!-- Video placeholder -->
    <div class="video-placeholder" tabindex="0" role="button" aria-label="Video lesson placeholder">
      <div class="play-btn" aria-hidden="true"><span class="play-triangle"></span></div>
      <div class="placeholder-text">
        <span class="placeholder-title">Video lesson</span>
        <span class="placeholder-sub">Coming soon &mdash; check back after launch</span>
      </div>
      <span class="duration-badge">~{duration_mins} minutes</span>
    </div>

{audio_html}
{pending_banner}
    <!-- Written content -->
    <div class="lesson-content">
      {content_html}
    </div>

    <!-- Lesson navigation -->
    <nav class="lesson-nav">
      {nav_prev}
      {nav_next}
    </nav>

  </main>

  <script src="{js_path(depth)}"></script>
</body>
</html>
"""


# ---------------------------------------------------------------------------
# Index page builders
# ---------------------------------------------------------------------------

def build_tier_index(
    tier_num: int,
    tier_title: str,
    cover_img: str,
    lesson_count: int,
    price: str,
    pillar_tags: list[str],
    sections: list[dict],
    depth: int,
) -> str:
    """
    Build a tier dashboard index.html.

    `sections` is the same structure as used by build_sidebar():
        [{"label": "BODY", "lessons": [{"title": ..., "file": ..., "slug": ...}, ...]}, ...]
    """
    # Build lesson cards
    cards_html = ""
    card_num = 0
    for section in sections:
        if section.get("label"):
            label_lower = section["label"].lower()
            cards_html += (
                f'\n      <div class="track-section">'
                f'<span class="track-label {label_lower}">&#9679; {section["label"].title()} Track</span>'
                f'</div>\n'
            )
        for lesson in section["lessons"]:
            card_num += 1
            lesson_id = lesson["slug"]
            pillar_label = section.get("label", "").title() if section.get("label") else "Foundation"
            pending_class = " pending" if lesson.get("integration_pending") else ""
            cards_html += f"""\
      <a href="{lesson['file']}" class="lesson-card{pending_class}" data-lesson-id="{lesson_id}">
        <div class="card-number">{card_num}</div>
        <div class="card-info">
          <span class="card-title">{lesson['title']}</span>
          <span class="card-sub">{pillar_label} Track</span>
        </div>
        <span class="card-arrow">&#8594;</span>
      </a>
"""

    pillar_badges = "".join(
        f'<span class="pillar-badge {p.lower()}">{p.upper()}</span>' for p in pillar_tags
    )
    back_link = "../" * depth + "index.html"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tier {tier_num}: {tier_title} &mdash; WILD Programme</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{css_path(depth)}">
</head>
<body data-page="dashboard" data-tier-id="tier{tier_num}">

  <header class="tier-header" style="background-image: url('{cover_img}');">
    <div class="tier-header-overlay"></div>
    <div class="tier-header-content">
      <a href="{back_link}" class="back-home">&#8592; All Tiers</a>
      <div class="tier-pillars">{pillar_badges}</div>
      <h1 class="tier-title">Tier {tier_num}: {tier_title}</h1>
      <div class="tier-meta">
        <span>{lesson_count} lessons</span>
        <span>{price}</span>
      </div>
    </div>
  </header>

  <main class="tier-main">
    <div class="lesson-grid">
{cards_html.rstrip()}
    </div>
  </main>

  <script src="{js_path(depth)}"></script>
</body>
</html>
"""


def build_home_index() -> str:
    """Build the top-level index.html with three tier cards."""
    return """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WILD Programme &mdash; Course Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/course.css">
</head>
<body class="home" data-page="home">

  <header class="home-header">
    <h1 class="home-title">WILD Programme</h1>
    <p class="home-subtitle">Wake-Initiated Lucid Dreaming &mdash; Complete Course Portal</p>
  </header>

  <main class="home-main">
    <div class="tier-cards-grid">

      <!-- Tier 1 -->
      <a href="tier1/index.html" class="tier-card tier1">
        <div class="tier-card-cover" style="background-image: url('../08 - Brand Assets/Tier_Covers/cover_tier1.png');"></div>
        <div class="tier-card-body">
          <div class="tier-card-pillars">
            <span class="pillar-badge soul">SOUL</span>
          </div>
          <h2 class="tier-card-title">Tier 1: Foundation</h2>
          <p class="tier-card-meta">7 lessons</p>
          <p class="tier-card-price">&pound;50</p>
          <p class="tier-card-desc">
            The complete WILD starter system. Understand your sleep architecture,
            build dream recall, and achieve your first conscious dream entry in
            seven structured nights.
          </p>
          <span class="tier-card-cta">Start Course &#8594;</span>
        </div>
      </a>

      <!-- Tier 2 -->
      <a href="tier2/index.html" class="tier-card tier2">
        <div class="tier-card-cover" style="background-image: url('../08 - Brand Assets/Tier_Covers/cover_tier2.png');"></div>
        <div class="tier-card-body">
          <div class="tier-card-pillars">
            <span class="pillar-badge body">BODY</span>
            <span class="pillar-badge soul">SOUL</span>
          </div>
          <h2 class="tier-card-title">Tier 2: Advanced Practitioner</h2>
          <p class="tier-card-meta">24 lessons</p>
          <p class="tier-card-price">&pound;100</p>
          <p class="tier-card-desc">
            Precision nutrition and physiology for deeper REM access (Body track),
            plus twelve advanced induction and control techniques (Soul track),
            unified in a single integration module.
          </p>
          <span class="tier-card-cta">Enter Tier 2 &#8594;</span>
        </div>
      </a>

      <!-- Tier 3 -->
      <a href="tier3/index.html" class="tier-card tier3">
        <div class="tier-card-cover" style="background-image: url('../08 - Brand Assets/Tier_Covers/cover_tier3.png');"></div>
        <div class="tier-card-body">
          <div class="tier-card-pillars">
            <span class="pillar-badge body">BODY</span>
            <span class="pillar-badge mind">MIND</span>
            <span class="pillar-badge soul">SOUL</span>
          </div>
          <h2 class="tier-card-title">Tier 3: Master</h2>
          <p class="tier-card-meta">27 lessons</p>
          <p class="tier-card-price">&pound;200</p>
          <p class="tier-card-desc">
            Advanced neuroperformance physiology, deep psychological integration,
            and mastery-level lucid dreaming techniques &mdash; unified in a final
            capstone protocol.
          </p>
          <span class="tier-card-cta">Enter Tier 3 &#8594;</span>
        </div>
      </a>

    </div>
  </main>

  <script src="js/course.js"></script>
</body>
</html>
"""


# ---------------------------------------------------------------------------
# CSS and JS stubs (written once if the files don't already exist)
# ---------------------------------------------------------------------------

COURSE_CSS = """\
/* =========================================================
   WILD Programme — Course Portal Stylesheet
   ========================================================= */

:root {
  --bg-dark:       #0d0f14;
  --bg-card:       #14171f;
  --bg-sidebar:    #0a0c11;
  --accent-gold:   #c9a84c;
  --accent-blue:   #3b82f6;
  --accent-teal:   #0ea5e9;
  --text-primary:  #e8eaf0;
  --text-muted:    #8b90a0;
  --border:        #1f2430;
  --body-pill:     #22c55e;
  --mind-pill:     #a855f7;
  --soul-pill:     #f59e0b;
  --integ-pill:    #06b6d4;
  --cap-pill:      #ec4899;
  --sidebar-w:     280px;
  --progress-h:    3px;
  --hero-h:        320px;
  --font-main:     'Inter', system-ui, sans-serif;
  --font-display:  'Space Grotesk', system-ui, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg-dark);
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 16px;
  line-height: 1.7;
  min-height: 100vh;
}

a { color: var(--accent-teal); text-decoration: none; }
a:hover { text-decoration: underline; }

h1, h2, h3, h4 { font-family: var(--font-display); }

/* ----- Reading progress bar ----- */
#reading-progress {
  position: fixed;
  top: 0; left: 0;
  height: var(--progress-h);
  width: 0%;
  background: linear-gradient(90deg, var(--accent-gold), var(--accent-teal));
  z-index: 1000;
  transition: width 0.1s ease;
}

/* ----- Sidebar ----- */
.sidebar {
  position: fixed;
  top: 0; left: 0;
  width: var(--sidebar-w);
  height: 100vh;
  overflow-y: auto;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  z-index: 200;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.logo-wild {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-gold);
  letter-spacing: 0.05em;
}

.logo-sub {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.sidebar-back {
  display: block;
  padding: 10px 16px;
  color: var(--text-muted);
  font-size: 13px;
  letter-spacing: 0.03em;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-back:hover { color: var(--text-primary); text-decoration: none; }

.track-section {
  padding: 14px 16px 4px;
}

.track-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
}

.track-label.body   { color: var(--body-pill); }
.track-label.mind   { color: var(--mind-pill); }
.track-label.soul   { color: var(--soul-pill); }
.track-label.integration { color: var(--integ-pill); }
.track-label.capstone    { color: var(--cap-pill); }

.sidebar-item {
  display: block;
  padding: 9px 16px;
  font-size: 13px;
  color: var(--text-muted);
  border-left: 2px solid transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.sidebar-item:hover {
  background: rgba(255,255,255,0.03);
  color: var(--text-primary);
  border-left-color: var(--border);
  text-decoration: none;
}

.sidebar-item.active {
  color: var(--text-primary);
  border-left-color: var(--accent-gold);
  background: rgba(201,168,76,0.06);
}

.sidebar-progress {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-progress-text {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.sidebar-progress-bar {
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.sidebar-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--accent-gold), var(--accent-teal));
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ----- Main content area ----- */
.lesson-main {
  margin-left: var(--sidebar-w);
  max-width: 860px;
  padding: 0 0 80px;
}

/* ----- Lesson hero ----- */
.lesson-hero {
  position: relative;
  height: var(--hero-h);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(13,15,20,0.95) 0%, rgba(13,15,20,0.4) 100%);
}

.hero-content {
  position: relative;
  padding: 32px 40px;
  z-index: 1;
}

.lesson-number {
  display: block;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.lesson-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  margin-top: 8px;
}

/* ----- Pillar badges ----- */
.pillar-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-right: 6px;
}

.pillar-badge.body        { background: rgba(34,197,94,0.2);  color: var(--body-pill); }
.pillar-badge.mind        { background: rgba(168,85,247,0.2); color: var(--mind-pill); }
.pillar-badge.soul        { background: rgba(245,158,11,0.2); color: var(--soul-pill); }
.pillar-badge.integration { background: rgba(6,182,212,0.2);  color: var(--integ-pill); }
.pillar-badge.capstone    { background: rgba(236,72,153,0.2); color: var(--cap-pill); }

/* ----- Video / Audio placeholders ----- */
.video-placeholder,
.audio-placeholder {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 32px 40px;
  padding: 24px 28px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 15px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.video-placeholder:hover,
.audio-placeholder:hover {
  border-color: var(--accent-teal);
}

.play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(14,165,233,0.15);
  border: 1px solid rgba(14,165,233,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.play-triangle {
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 7px 0 7px 13px;
  border-color: transparent transparent transparent var(--accent-teal);
  margin-left: 3px;
}

.audio-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.placeholder-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.placeholder-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.placeholder-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.duration-badge {
  margin-left: auto;
  font-size: 12px;
  background: rgba(255,255,255,0.06);
  padding: 3px 10px;
  border-radius: 20px;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ----- Integration pending banner ----- */
.integration-pending {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 40px 24px;
  padding: 16px 20px;
  background: rgba(6,182,212,0.08);
  border: 1px solid rgba(6,182,212,0.25);
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 14px;
}

.integration-pending span:first-child {
  color: var(--integ-pill);
  flex-shrink: 0;
  font-size: 16px;
}

/* ----- Lesson content ----- */
.lesson-content {
  padding: 8px 40px 40px;
}

.lesson-content h2,
.lesson-content h3,
.lesson-content h4 {
  color: var(--text-primary);
  margin: 32px 0 12px;
  line-height: 1.3;
}

.lesson-content h2 { font-size: 1.5rem; }
.lesson-content h3 { font-size: 1.2rem; }
.lesson-content h4 { font-size: 1rem; font-weight: 600; color: var(--accent-gold); }

.lesson-content p { margin-bottom: 18px; color: var(--text-primary); }

.lesson-content ul,
.lesson-content ol {
  margin: 0 0 18px 24px;
  color: var(--text-primary);
}

.lesson-content li { margin-bottom: 6px; }

.lesson-content strong { color: var(--text-primary); }

.lesson-content em { color: var(--accent-teal); font-style: italic; }

.lesson-content blockquote {
  border-left: 3px solid var(--accent-gold);
  margin: 24px 0;
  padding: 12px 20px;
  color: var(--text-muted);
  background: rgba(201,168,76,0.05);
  border-radius: 0 6px 6px 0;
}

.lesson-content code {
  background: rgba(255,255,255,0.07);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
}

.lesson-content pre {
  background: rgba(0,0,0,0.4);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin-bottom: 18px;
}

.lesson-content pre code { background: none; padding: 0; }

.lesson-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 32px 0;
}

.lesson-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 18px;
  font-size: 14px;
}

.lesson-content th {
  background: rgba(255,255,255,0.05);
  padding: 10px 14px;
  text-align: left;
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.lesson-content td {
  padding: 8px 14px;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

/* ----- Lesson navigation ----- */
.lesson-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 40px;
  padding: 24px 0;
  border-top: 1px solid var(--border);
}

.nav-prev,
.nav-next {
  display: inline-block;
  padding: 10px 20px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-muted);
  transition: background 0.15s, color 0.15s;
}

.nav-prev:hover,
.nav-next:hover {
  background: var(--bg-card);
  color: var(--text-primary);
  text-decoration: none;
}

.nav-prev.nav-disabled,
.nav-next.nav-disabled {
  opacity: 0.25;
  pointer-events: none;
}

/* ----- Home page ----- */
body.home { display: flex; flex-direction: column; align-items: center; }

.home-header {
  text-align: center;
  padding: 80px 24px 40px;
}

.home-title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.home-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
}

.home-main {
  width: 100%;
  max-width: 1100px;
  padding: 0 24px 80px;
}

.tier-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.tier-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  color: inherit;
}

.tier-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-gold);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  text-decoration: none;
}

.tier-card-cover {
  height: 180px;
  background-size: cover;
  background-position: center;
}

.tier-card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tier-card-pillars { display: flex; gap: 6px; flex-wrap: wrap; }

.tier-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tier-card-meta { font-size: 13px; color: var(--text-muted); }

.tier-card-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent-gold);
}

.tier-card-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  flex: 1;
}

.tier-card-cta {
  display: inline-block;
  margin-top: 8px;
  padding: 10px 20px;
  background: rgba(201,168,76,0.12);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-gold);
  text-align: center;
  transition: background 0.15s;
}

.tier-card:hover .tier-card-cta {
  background: rgba(201,168,76,0.2);
}

.tier-card.tier1:hover { border-color: var(--soul-pill); }
.tier-card.tier2:hover { border-color: var(--body-pill); }
.tier-card.tier3:hover { border-color: var(--mind-pill); }

/* ----- Tier index page ----- */
.tier-header {
  position: relative;
  height: 260px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}

.tier-header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(13,15,20,0.98) 0%, rgba(13,15,20,0.4) 100%);
}

.tier-header-content {
  position: relative;
  padding: 32px 40px;
  z-index: 1;
  width: 100%;
}

.back-home {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--text-muted);
}

.back-home:hover { color: var(--text-primary); }

.tier-pillars { margin-bottom: 10px; }

.tier-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tier-meta {
  margin-top: 8px;
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--text-muted);
}

.tier-main {
  max-width: 900px;
  padding: 40px;
}

.section-heading {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 24px 0 8px;
}

.lesson-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lesson-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 15px;
  transition: background 0.15s, border-color 0.15s;
}

.lesson-card:hover {
  background: rgba(255,255,255,0.03);
  border-color: var(--accent-gold);
  text-decoration: none;
}

.lesson-card.pending {
  opacity: 0.65;
}

.card-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.card-sub {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.card-arrow {
  font-size: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.lesson-card:hover .card-arrow {
  color: var(--accent-gold);
}

/* ----- Responsive ----- */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .lesson-main {
    margin-left: 0;
    padding: 0 0 60px;
  }
  .lesson-content,
  .lesson-nav,
  .video-placeholder,
  .audio-placeholder,
  .integration-pending {
    margin-left: 16px;
    margin-right: 16px;
    padding-left: 16px;
    padding-right: 16px;
  }
  .hero-content { padding: 24px 16px; }
  .lesson-title { font-size: 1.5rem; }
  .tier-main { padding: 24px 16px; }
  .tier-header-content { padding: 24px 16px; }
  .tier-cards-grid { grid-template-columns: 1fr; }
}
"""

COURSE_JS = """\
// WILD Programme — Course Portal Script

// Reading progress bar
(function () {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

// Sidebar lesson completion progress tracker
(function () {
  const body = document.body;
  const tierId = body.dataset.tierId;
  const lessonId = body.dataset.lessonId;
  if (!tierId || !lessonId) return;

  const storageKey = 'wild_progress_' + tierId;
  let visited = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (!visited.includes(lessonId)) {
    visited.push(lessonId);
    localStorage.setItem(storageKey, JSON.stringify(visited));
  }

  const allItems = document.querySelectorAll('.sidebar-item[data-lesson-id]');
  const total = allItems.length;
  if (!total) return;

  const completedCount = Array.from(allItems).filter(
    (el) => visited.includes(el.dataset.lessonId)
  ).length;
  const pct = Math.round((completedCount / total) * 100);

  const progressText = document.querySelector('.sidebar-progress-text');
  const progressFill = document.querySelector('.sidebar-progress-fill');
  if (progressText) progressText.textContent = pct + '% complete';
  if (progressFill) progressFill.style.width = pct + '%';
})();

// Smooth active link highlight update on scroll (optional enhancement)
// Highlights headings in sidebar as user scrolls through lesson content
(function () {
  const headings = document.querySelectorAll('.lesson-content h2, .lesson-content h3');
  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // No sidebar anchor links by default, but hook is here for extension
        }
      });
    },
    { rootMargin: '0px 0px -60% 0px' }
  );

  headings.forEach((h) => observer.observe(h));
})();
"""


def write_css_js():
    """Write course.css and course.js — skip if files already exist on disk."""
    css_file = os.path.join(PORTAL_DIR, "css", "course.css")
    js_file  = os.path.join(PORTAL_DIR, "js",  "course.js")

    os.makedirs(os.path.dirname(css_file), exist_ok=True)
    os.makedirs(os.path.dirname(js_file),  exist_ok=True)

    for path, content in [(css_file, COURSE_CSS), (js_file, COURSE_JS)]:
        if os.path.exists(path):
            print(f"  [--]   {os.path.relpath(path, PORTAL_DIR)} (kept existing)")
            continue
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        global files_created
        files_created += 1
        print(f"  [OK]   {os.path.relpath(path, PORTAL_DIR)}")


# ---------------------------------------------------------------------------
# Per-tier builders
# ---------------------------------------------------------------------------

# ---- TIER 1 ----------------------------------------------------------------

def build_tier1():
    print("\n[Tier 1] Building Foundation lessons...")
    raw = read_file(MD_TIER1)
    if raw is None:
        return

    # Split on '## LESSON N:'
    sections_raw = split_on_heading(raw, r"^##\s+LESSON\s+\d+")
    if not sections_raw:
        print("  [WARN] No LESSON headings found in Tier 1 file.")
        return

    lesson_titles = [extract_title_from_heading(h) for h, _ in sections_raw]
    lesson_slugs  = [f"lesson-{i+1:02d}" for i in range(len(sections_raw))]
    lesson_files  = [f"{s}.html" for s in lesson_slugs]

    # Thumbnail filenames (pre-existing in 08 - Brand Assets)
    thumbnails = [
        "t1_01_what_is_wild.png",
        "t1_02_sleep_architecture.png",
        "t1_03_dream_recall.png",
        "t1_04_wbtb.png",
        "t1_05_hypnagogic.png",
        "t1_06_7night_protocol.png",
        "t1_07_integration.png",
    ]

    # Sidebar structure
    sidebar_sections = [
        {
            "label": None,
            "lessons": [
                {
                    "slug": lesson_slugs[i],
                    "title": f"Lesson {i+1}: {lesson_titles[i]}",
                    "file": lesson_files[i],
                }
                for i in range(len(sections_raw))
            ],
        }
    ]

    tier_dir = os.path.join(PORTAL_DIR, "tier1")

    for i, (heading, body) in enumerate(sections_raw):
        slug  = lesson_slugs[i]
        title = lesson_titles[i]
        thumb = thumbnails[i] if i < len(thumbnails) else "t1_01_what_is_wild.png"
        thumb_path = f"../../08 - Brand Assets/Thumbnails/Tier_1/{thumb}"

        prev_href = lesson_files[i - 1] if i > 0 else None
        next_href = lesson_files[i + 1] if i < len(sections_raw) - 1 else None

        sidebar_html = build_sidebar(
            sidebar_sections, current_slug=slug, depth=1
        )

        page = build_lesson_page(
            title          = title,
            lesson_label   = f"Lesson {i+1}",
            pillar         = "soul",
            content_md     = body,
            thumbnail_path = thumb_path,
            prev_href      = prev_href,
            next_href      = next_href,
            sidebar_html   = sidebar_html,
            depth          = 1,
            integration_pending = False,
            audio_night    = i + 1,   # Audio placeholders for all 7 lessons
            duration_mins  = 12,
        )
        write_html(os.path.join(tier_dir, f"{slug}.html"), page)

    # Tier 1 index
    index_sections = [
        {
            "label": None,
            "lessons": [
                {
                    "slug": lesson_slugs[i],
                    "title": lesson_titles[i],
                    "file": lesson_files[i],
                    "label": f"Lesson {i+1}",
                    "integration_pending": False,
                }
                for i in range(len(sections_raw))
            ],
        }
    ]
    cover = "../08 - Brand Assets/Tier_Covers/cover_tier1.png"
    index_html = build_tier_index(
        tier_num      = 1,
        tier_title    = "Foundation",
        cover_img     = cover,
        lesson_count  = len(sections_raw),
        price         = "£50",
        pillar_tags   = ["soul"],
        sections      = index_sections,
        depth         = 1,
    )
    write_html(os.path.join(tier_dir, "index.html"), index_html)


# ---- TIER 2 ----------------------------------------------------------------

def build_tier2():
    print("\n[Tier 2] Building Advanced Practitioner lessons...")

    # --- Body track ---
    raw_body = read_file(MD_T2_BODY)
    body_sections = []
    if raw_body:
        raw_body_sections = split_on_heading(raw_body, r"^#\s+B\d+")
        body_sections = raw_body_sections

    # --- Soul track ---
    raw_soul = read_file(MD_T2_SOUL)
    soul_sections = []
    if raw_soul:
        raw_soul_sections = split_on_heading(raw_soul, r"^##\s+LESSON\s+\d+")
        soul_sections = raw_soul_sections

    # --- Integration ---
    raw_integ = read_file(MD_T2_INTEG)

    tier_dir = os.path.join(PORTAL_DIR, "tier2")

    # Integration-pending body modules (B9, B10, B11 — indices 8, 9, 10)
    BODY_PENDING = {8, 9, 10}

    # Build sidebar lesson lists
    body_lesson_list = []
    for i, (h, _) in enumerate(body_sections):
        title = extract_title_from_heading(h)
        body_lesson_list.append({
            "slug":  f"body-{i+1:02d}",
            "title": f"B{i+1}: {title}",
            "file":  f"body-{i+1:02d}.html",
        })

    soul_lesson_list = []
    for i, (h, _) in enumerate(soul_sections):
        title = extract_title_from_heading(h)
        soul_lesson_list.append({
            "slug":  f"soul-{i+1:02d}",
            "title": f"Soul {i+1}: {title}",
            "file":  f"soul-{i+1:02d}.html",
        })

    integ_entry = {"slug": "integration", "title": "Integration: Your Body-Soul Protocol", "file": "integration.html"}

    sidebar_sections = [
        {"label": "BODY",        "lessons": body_lesson_list},
        {"label": "SOUL",        "lessons": soul_lesson_list},
        {"label": "INTEGRATION", "lessons": [integ_entry]},
    ]

    # Body thumbnails
    body_thumbs = [
        "t2b_01_sleep_nutrition.png",
        "t2b_02_circadian_eating.png",
        "t2b_03_blood_sugar.png",
        "t2b_04_gut_brain.png",
        "t2b_05_inflammation.png",
        "t2b_06_exercise_timing.png",
        "t2b_07_supplements.png",
        "t2b_08_hrv.png",
        "t2b_09_integration.png",   # used for B9-B11
        "t2b_09_integration.png",
        "t2b_09_integration.png",
    ]

    # Soul thumbnails
    soul_thumbs = [
        "t2s_01_advanced_sleep.png",
        "t2s_02_ssild.png",
        "t2s_03_fild_deild.png",
        "t2s_04_supplements.png",
        "t2s_05_entry_methods.png",
        "t2s_06_stabilisation.png",
        "t2s_07_dream_control.png",
        "t2s_08_sleep_paralysis.png",
        "t2s_09_failure_analysis.png",
        "t2s_10_purposeful_dreaming.png",
        "t2s_11_30day_protocol.png",
        "t2s_12_sustainable_practice.png",
    ]

    # All lesson slugs in order (for prev/next linking across tracks)
    all_slugs = (
        [f"body-{i+1:02d}" for i in range(len(body_sections))] +
        [f"soul-{i+1:02d}" for i in range(len(soul_sections))] +
        ["integration"]
    )

    def prev_next(slug):
        idx = all_slugs.index(slug) if slug in all_slugs else -1
        p = (all_slugs[idx - 1] + ".html") if idx > 0 else None
        n = (all_slugs[idx + 1] + ".html") if idx < len(all_slugs) - 1 else None
        return p, n

    # Render Body lessons
    for i, (heading, body) in enumerate(body_sections):
        slug  = f"body-{i+1:02d}"
        title = extract_title_from_heading(heading)
        thumb = body_thumbs[i] if i < len(body_thumbs) else "t2b_01_sleep_nutrition.png"
        thumb_path = f"../../08 - Brand Assets/Thumbnails/Tier_2_Body/{thumb}"
        is_pending = i in BODY_PENDING
        prev_h, next_h = prev_next(slug)

        page = build_lesson_page(
            title          = title,
            lesson_label   = f"Body {i+1}",
            pillar         = "body",
            content_md     = body,
            thumbnail_path = thumb_path,
            prev_href      = prev_h,
            next_href      = next_h,
            sidebar_html   = build_sidebar(sidebar_sections, slug, depth=1),
            depth          = 1,
            integration_pending = is_pending,
            duration_mins  = 14,
        )
        write_html(os.path.join(tier_dir, f"{slug}.html"), page)

    # Render Soul lessons
    for i, (heading, body) in enumerate(soul_sections):
        slug  = f"soul-{i+1:02d}"
        title = extract_title_from_heading(heading)
        thumb = soul_thumbs[i] if i < len(soul_thumbs) else "t2s_01_advanced_sleep.png"
        thumb_path = f"../../08 - Brand Assets/Thumbnails/Tier_2_Soul/{thumb}"
        prev_h, next_h = prev_next(slug)

        page = build_lesson_page(
            title          = title,
            lesson_label   = f"Soul {i+1}",
            pillar         = "soul",
            content_md     = body,
            thumbnail_path = thumb_path,
            prev_href      = prev_h,
            next_href      = next_h,
            sidebar_html   = build_sidebar(sidebar_sections, slug, depth=1),
            depth          = 1,
            duration_mins  = 14,
        )
        write_html(os.path.join(tier_dir, f"{slug}.html"), page)

    # Render Integration lesson
    integ_body = ""
    if raw_integ:
        # Find the lesson content section (everything after first heading)
        sections_raw = split_on_heading(raw_integ, r"^##\s+")
        integ_body = "\n\n".join(b for _, b in sections_raw) if sections_raw else raw_integ

    prev_h, next_h = prev_next("integration")
    page = build_lesson_page(
        title          = "Your Body-Soul Protocol",
        lesson_label   = "Integration",
        pillar         = "integration",
        content_md     = integ_body,
        thumbnail_path = "../../08 - Brand Assets/Thumbnails/Tier_2_Body/t2b_09_integration.png",
        prev_href      = prev_h,
        next_href      = next_h,
        sidebar_html   = build_sidebar(sidebar_sections, "integration", depth=1),
        depth          = 1,
        duration_mins  = 18,
    )
    write_html(os.path.join(tier_dir, "integration.html"), page)

    # Tier 2 index
    total = len(body_sections) + len(soul_sections) + 1
    index_sections = [
        {
            "label": "BODY",
            "lessons": [
                {
                    "slug":  f"body-{i+1:02d}",
                    "title": extract_title_from_heading(h),
                    "file":  f"body-{i+1:02d}.html",
                    "label": f"B{i+1}",
                    "integration_pending": i in BODY_PENDING,
                }
                for i, (h, _) in enumerate(body_sections)
            ],
        },
        {
            "label": "SOUL",
            "lessons": [
                {
                    "slug":  f"soul-{i+1:02d}",
                    "title": extract_title_from_heading(h),
                    "file":  f"soul-{i+1:02d}.html",
                    "label": f"Soul {i+1}",
                    "integration_pending": False,
                }
                for i, (h, _) in enumerate(soul_sections)
            ],
        },
        {
            "label": "INTEGRATION",
            "lessons": [
                {
                    "slug":  "integration",
                    "title": "Your Body-Soul Protocol",
                    "file":  "integration.html",
                    "label": "Integration",
                    "integration_pending": False,
                }
            ],
        },
    ]
    cover = "../08 - Brand Assets/Tier_Covers/cover_tier2.png"
    index_html = build_tier_index(
        tier_num     = 2,
        tier_title   = "Advanced Practitioner",
        cover_img    = cover,
        lesson_count = total,
        price        = "£100",
        pillar_tags  = ["body", "soul"],
        sections     = index_sections,
        depth        = 1,
    )
    write_html(os.path.join(tier_dir, "index.html"), index_html)


# ---- TIER 3 ----------------------------------------------------------------

def build_tier3():
    print("\n[Tier 3] Building Master lessons...")

    # Body track (BODY 1-9, BODY 7-9 pending)
    raw_body = read_file(MD_T3_BODY)
    body_sections = []
    if raw_body:
        body_sections = split_on_heading(raw_body, r"^##?\s+BODY\s+\d+")

    BODY_PENDING = {6, 7, 8}  # 0-indexed: BODY 7, 8, 9

    # Mind track: Mind 1 from breathing file, Mind 2-7 from written file
    raw_mind_br = read_file(MD_T3_MIND_BR)
    mind_br_body = ""
    if raw_mind_br:
        br_sections = split_on_heading(raw_mind_br, r"^##\s+MIND\s+1")
        # Take the first (and only) section body; strip the video script half
        if br_sections:
            # The written lesson content is before '## MIND 1 SCRIPT'
            body_text = br_sections[0][1]
            # Cut off the video script section if present
            script_cut = re.search(r"^##\s+MIND\s+1\s+SCRIPT", body_text, re.MULTILINE)
            if script_cut:
                body_text = body_text[:script_cut.start()].strip()
            mind_br_body = body_text

    raw_mind = read_file(MD_T3_MIND)
    mind_written_sections = []
    if raw_mind:
        mind_written_sections = split_on_heading(raw_mind, r"^##\s+MIND\s+\d+")

    # Mind 1 = Breathing, Mind 2-7 = MIND 1-6 from written file
    mind_titles_all = ["Breathing — The Body-Mind Bridge"] + [
        extract_title_from_heading(h) for h, _ in mind_written_sections
    ]
    mind_bodies_all = [mind_br_body] + [b for _, b in mind_written_sections]

    # Soul track (SOUL 1-10 from Tier_3_Video_Scripts.md)
    raw_soul = read_file(MD_T3_SOUL)
    soul_sections = []
    if raw_soul:
        soul_sections = split_on_heading(raw_soul, r"^##\s+SOUL\s+\d+")
        # Strip delivery notes and video script markers from each body
        cleaned_soul = []
        for h, b in soul_sections:
            # Remove lines that are purely delivery notes [*...*] or [Delivery:...]
            b_clean = re.sub(r"^\*\[.*?\]\*\s*$", "", b, flags=re.MULTILINE)
            b_clean = re.sub(r"^---\s*$", "", b_clean, flags=re.MULTILINE)
            b_clean = b_clean.strip()
            cleaned_soul.append((h, b_clean))
        soul_sections = cleaned_soul

    # Capstone
    raw_capstone = read_file(MD_T3_CAPSTONE)
    capstone_body = ""
    if raw_capstone:
        cap_sections = split_on_heading(raw_capstone, r"^##\s+CAPSTONE")
        capstone_body = cap_sections[0][1] if cap_sections else raw_capstone

    tier_dir = os.path.join(PORTAL_DIR, "tier3")

    # Body thumbnails
    body_thumbs = [
        "t3b_01_neuroperformance_nutrition.png",
        "t3b_02_nootropic_cycling.png",
        "t3b_03_hrv_optimisation.png",
        "t3b_04_fasting.png",
        "t3b_05_cold_heat.png",
        "t3b_06_circadian_biology.png",
        "t3b_01_neuroperformance_nutrition.png",  # pending fallback
        "t3b_01_neuroperformance_nutrition.png",
        "t3b_01_neuroperformance_nutrition.png",
    ]

    # Mind thumbnails (7 total: mind-01 to mind-07)
    mind_thumbs = [
        "t3m_01_breathing.png",
        "t3m_02_psychology.png",
        "t3m_03_emotional_regulation.png",
        "t3m_04_vagal_tone.png",
        "t3m_05_shadow.png",
        "t3m_06_trauma.png",
        "t3m_07_metacognition.png",
    ]

    # Soul thumbnails
    soul_thumbs = [
        "t3s_01_third_state.png",
        "t3s_02_extended_lucidity.png",
        "t3s_03_dream_architecture.png",
        "t3s_04_dream_characters.png",
        "t3s_05_dream_control.png",
        "t3s_06_time_dilation.png",
        "t3s_07_shared_dreaming.png",
        "t3s_08_somatic_healing.png",
        "t3s_09_creative.png",
        "t3s_10_mastery.png",
    ]

    # Sidebar structure
    body_sidebar_list = []
    for i, (h, _) in enumerate(body_sections):
        t = extract_title_from_heading(h)
        body_sidebar_list.append({
            "slug":  f"body-{i+1:02d}",
            "title": f"Body {i+1}: {t}",
            "file":  f"body-{i+1:02d}.html",
        })

    mind_sidebar_list = []
    for i, t in enumerate(mind_titles_all):
        mind_sidebar_list.append({
            "slug":  f"mind-{i+1:02d}",
            "title": f"Mind {i+1}: {t}",
            "file":  f"mind-{i+1:02d}.html",
        })

    soul_sidebar_list = []
    for i, (h, _) in enumerate(soul_sections):
        t = extract_title_from_heading(h)
        soul_sidebar_list.append({
            "slug":  f"soul-{i+1:02d}",
            "title": f"Soul {i+1}: {t}",
            "file":  f"soul-{i+1:02d}.html",
        })

    capstone_entry = {"slug": "capstone", "title": "Capstone: The Complete System", "file": "capstone.html"}

    sidebar_sections = [
        {"label": "BODY", "lessons": body_sidebar_list},
        {"label": "MIND", "lessons": mind_sidebar_list},
        {"label": "SOUL", "lessons": soul_sidebar_list},
        {"label": "CAPSTONE", "lessons": [capstone_entry]},
    ]

    # Ordered slugs for prev/next linking
    all_slugs = (
        [f"body-{i+1:02d}" for i in range(len(body_sections))] +
        [f"mind-{i+1:02d}" for i in range(len(mind_titles_all))] +
        [f"soul-{i+1:02d}" for i in range(len(soul_sections))] +
        ["capstone"]
    )

    def prev_next(slug):
        idx = all_slugs.index(slug) if slug in all_slugs else -1
        p = (all_slugs[idx - 1] + ".html") if idx > 0 else None
        n = (all_slugs[idx + 1] + ".html") if idx < len(all_slugs) - 1 else None
        return p, n

    # Render Body lessons
    for i, (heading, body) in enumerate(body_sections):
        slug  = f"body-{i+1:02d}"
        title = extract_title_from_heading(heading)
        thumb = body_thumbs[i] if i < len(body_thumbs) else "t3b_01_neuroperformance_nutrition.png"
        thumb_path = f"../../08 - Brand Assets/Thumbnails/Tier_3_Body/{thumb}"
        is_pending = i in BODY_PENDING
        prev_h, next_h = prev_next(slug)

        page = build_lesson_page(
            title          = title,
            lesson_label   = f"Body {i+1}",
            pillar         = "body",
            content_md     = body,
            thumbnail_path = thumb_path,
            prev_href      = prev_h,
            next_href      = next_h,
            sidebar_html   = build_sidebar(sidebar_sections, slug, depth=1),
            depth          = 1,
            integration_pending = is_pending,
            duration_mins  = 16,
        )
        write_html(os.path.join(tier_dir, f"{slug}.html"), page)

    # Render Mind lessons (1-7)
    for i, (title, body) in enumerate(zip(mind_titles_all, mind_bodies_all)):
        slug  = f"mind-{i+1:02d}"
        thumb = mind_thumbs[i] if i < len(mind_thumbs) else "t3m_01_breathing.png"
        thumb_path = f"../../08 - Brand Assets/Thumbnails/Tier_3_Mind/{thumb}"
        prev_h, next_h = prev_next(slug)

        page = build_lesson_page(
            title          = title,
            lesson_label   = f"Mind {i+1}",
            pillar         = "mind",
            content_md     = body,
            thumbnail_path = thumb_path,
            prev_href      = prev_h,
            next_href      = next_h,
            sidebar_html   = build_sidebar(sidebar_sections, slug, depth=1),
            depth          = 1,
            duration_mins  = 16,
        )
        write_html(os.path.join(tier_dir, f"{slug}.html"), page)

    # Render Soul lessons
    for i, (heading, body) in enumerate(soul_sections):
        slug  = f"soul-{i+1:02d}"
        title = extract_title_from_heading(heading)
        thumb = soul_thumbs[i] if i < len(soul_thumbs) else "t3s_01_third_state.png"
        thumb_path = f"../../08 - Brand Assets/Thumbnails/Tier_3_Soul/{thumb}"
        prev_h, next_h = prev_next(slug)

        page = build_lesson_page(
            title          = title,
            lesson_label   = f"Soul {i+1}",
            pillar         = "soul",
            content_md     = body,
            thumbnail_path = thumb_path,
            prev_href      = prev_h,
            next_href      = next_h,
            sidebar_html   = build_sidebar(sidebar_sections, slug, depth=1),
            depth          = 1,
            duration_mins  = 15,
        )
        write_html(os.path.join(tier_dir, f"{slug}.html"), page)

    # Render Capstone
    prev_h, next_h = prev_next("capstone")
    page = build_lesson_page(
        title          = "The Complete System",
        lesson_label   = "Capstone",
        pillar         = "capstone",
        content_md     = capstone_body,
        thumbnail_path = "../../08 - Brand Assets/Thumbnails/Tier_3_Capstone/t3_capstone.png",
        prev_href      = prev_h,
        next_href      = next_h,
        sidebar_html   = build_sidebar(sidebar_sections, "capstone", depth=1),
        depth          = 1,
        duration_mins  = 20,
    )
    write_html(os.path.join(tier_dir, "capstone.html"), page)

    # Tier 3 index
    total = (
        len(body_sections) +
        len(mind_titles_all) +
        len(soul_sections) +
        1  # capstone
    )
    index_sections = [
        {
            "label": "BODY",
            "lessons": [
                {
                    "slug":  f"body-{i+1:02d}",
                    "title": extract_title_from_heading(h),
                    "file":  f"body-{i+1:02d}.html",
                    "label": f"Body {i+1}",
                    "integration_pending": i in BODY_PENDING,
                }
                for i, (h, _) in enumerate(body_sections)
            ],
        },
        {
            "label": "MIND",
            "lessons": [
                {
                    "slug":  f"mind-{i+1:02d}",
                    "title": t,
                    "file":  f"mind-{i+1:02d}.html",
                    "label": f"Mind {i+1}",
                    "integration_pending": False,
                }
                for i, t in enumerate(mind_titles_all)
            ],
        },
        {
            "label": "SOUL",
            "lessons": [
                {
                    "slug":  f"soul-{i+1:02d}",
                    "title": extract_title_from_heading(h),
                    "file":  f"soul-{i+1:02d}.html",
                    "label": f"Soul {i+1}",
                    "integration_pending": False,
                }
                for i, (h, _) in enumerate(soul_sections)
            ],
        },
        {
            "label": "CAPSTONE",
            "lessons": [
                {
                    "slug":  "capstone",
                    "title": "The Complete System",
                    "file":  "capstone.html",
                    "label": "Capstone",
                    "integration_pending": False,
                }
            ],
        },
    ]
    cover = "../08 - Brand Assets/Tier_Covers/cover_tier3.png"
    index_html = build_tier_index(
        tier_num     = 3,
        tier_title   = "Master",
        cover_img    = cover,
        lesson_count = total,
        price        = "£200",
        pillar_tags  = ["body", "mind", "soul"],
        sections     = index_sections,
        depth        = 1,
    )
    write_html(os.path.join(tier_dir, "index.html"), index_html)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    global files_created, files_skipped

    print("=" * 60)
    print("  WILD Programme — Course Portal Builder")
    print("=" * 60)
    print(f"\nPortal output dir: {PORTAL_DIR}")
    print(f"Content source:    {CONTENT_DIR}\n")

    # Write static assets
    print("[Assets] Writing CSS and JS...")
    write_css_js()

    # Write home index
    print("\n[Home] Writing index.html...")
    write_html(os.path.join(PORTAL_DIR, "index.html"), build_home_index())

    # Build tiers
    build_tier1()
    build_tier2()
    build_tier3()

    print("\n" + "=" * 60)
    print(f"  BUILD COMPLETE")
    print(f"  Files created : {files_created}")
    print(f"  Files skipped : {files_skipped}  (source not found)")
    print("=" * 60)


if __name__ == "__main__":
    main()
