#!/usr/bin/env python3
"""
WILD Programme — Course HTML Builder
Converts all 6 markdown course files to polished, themed HTML.

Run from this directory:
    python build_course_html.py

Outputs:
    Tier_1_Biohacker_Foundation.html (green — entry-level tech aesthetic)
    Tier_1_Spiritual_Foundation.html (sky blue — entry-level contemplative)
    Tier_2_Biohacker_Advanced.html   (dark teal — advanced tech aesthetic)
    Tier_2_Spiritual_Advanced.html   (deep purple — contemplative aesthetic)
    Tier_3_Biohacker_Master.html     (dark indigo — prestige tech aesthetic)
    Tier_3_Spiritual_Master.html     (deep gold — ceremonial aesthetic)
"""

import os, re, html as esc

# ─────────────────────────────────────────────────────────
#  FILE MANIFEST
# ─────────────────────────────────────────────────────────
FILES = [
    {
        'input':     'Tier_1_Biohacker_Foundation.md',
        'output':    'Tier_1_Biohacker_Foundation.html',
        'stream':    'bio',
        'tier':      1,
        'title':     'Foundations',
        'subtitle':  'Biohacker Stream',
        'lessons':   7,
        'price':     '£50',
        'community': 'Telegram',
        'accent':    '#3fb950',
        'accent2':   '#2ea043',
        'glow':      'rgba(63,185,80,.18)',
        'badge_bg':  'rgba(63,185,80,.1)',
        'badge_border': 'rgba(63,185,80,.35)',
    },
    {
        'input':     'Tier_1_Spiritual_Foundation.md',
        'output':    'Tier_1_Spiritual_Foundation.html',
        'stream':    'spirit',
        'tier':      1,
        'title':     'Foundations',
        'subtitle':  'Consciousness Stream',
        'lessons':   7,
        'price':     '£50',
        'community': 'Discord',
        'accent':    '#7dd3fc',
        'accent2':   '#38bdf8',
        'glow':      'rgba(125,211,252,.15)',
        'badge_bg':  'rgba(125,211,252,.08)',
        'badge_border': 'rgba(125,211,252,.3)',
    },
    {
        'input':     'Tier_2_Biohacker_Advanced.md',
        'output':    'Tier_2_Biohacker_Advanced.html',
        'stream':    'bio',
        'tier':      2,
        'title':     'Advanced Practitioner',
        'subtitle':  'Biohacker Stream',
        'lessons':   12,
        'price':     '£100',
        'community': 'Telegram',
        'accent':    '#1a9b8a',
        'accent2':   '#14827a',
        'glow':      'rgba(26,155,138,.18)',
        'badge_bg':  'rgba(26,155,138,.12)',
        'badge_border': 'rgba(26,155,138,.35)',
    },
    {
        'input':     'Tier_2_Spiritual_Advanced.md',
        'output':    'Tier_2_Spiritual_Advanced.html',
        'stream':    'spirit',
        'tier':      2,
        'title':     'Advanced Practitioner',
        'subtitle':  'Consciousness Stream',
        'lessons':   12,
        'price':     '£100',
        'community': 'Discord',
        'accent':    '#9b7fd4',
        'accent2':   '#7c5fb8',
        'glow':      'rgba(155,127,212,.18)',
        'badge_bg':  'rgba(155,127,212,.1)',
        'badge_border': 'rgba(155,127,212,.35)',
    },
    {
        'input':     'Tier_3_Biohacker_Master.md',
        'output':    'Tier_3_Biohacker_Master.html',
        'stream':    'bio',
        'tier':      3,
        'title':     'Master Programme',
        'subtitle':  'Biohacker Stream',
        'lessons':   18,
        'price':     '£200',
        'community': 'Telegram',
        'accent':    '#5865f2',
        'accent2':   '#4752c4',
        'glow':      'rgba(88,101,242,.18)',
        'badge_bg':  'rgba(88,101,242,.12)',
        'badge_border': 'rgba(88,101,242,.35)',
    },
    {
        'input':     'Tier_3_Spiritual_Master.md',
        'output':    'Tier_3_Spiritual_Master.html',
        'stream':    'spirit',
        'tier':      3,
        'title':     'Master Programme',
        'subtitle':  'Consciousness Stream',
        'lessons':   18,
        'price':     '£200',
        'community': 'Discord',
        'accent':    '#c8a96e',
        'accent2':   '#a8893e',
        'glow':      'rgba(200,169,110,.18)',
        'badge_bg':  'rgba(200,169,110,.1)',
        'badge_border': 'rgba(200,169,110,.35)',
    },
]

# ─────────────────────────────────────────────────────────
#  MARKDOWN → HTML INLINE
# ─────────────────────────────────────────────────────────
def inline(text):
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*([^*\n]+?)\*',  r'<em>\1</em>',       text)
    text = re.sub(r'`([^`]+?)`',      r'<code>\1</code>',   text)
    text = re.sub(r'\[([^\]]+?)\]\(([^)]+?)\)', r'<a href="\2">\1</a>', text)
    return text

# ─────────────────────────────────────────────────────────
#  ASSET PLACEHOLDER BUILDERS
# ─────────────────────────────────────────────────────────
def video_box(num, title, cfg):
    if cfg['stream'] == 'bio':
        icon, label = '▶', 'VIDEO LESSON'
        meta = f'~15–25 min · Talking head + screen share · Lesson {num}'
    else:
        icon, label = '◈', 'CEREMONY VIDEO'
        meta = f'~15–25 min · Guided visual journey · Threshold {num}'
    return f'''<div class="asset-box asset-video">
  <div class="asset-icon">{icon}</div>
  <div class="asset-body">
    <div class="asset-label">{label}</div>
    <div class="asset-title">{esc.escape(title)}</div>
    <div class="asset-meta">{meta}</div>
  </div>
  <div class="asset-tag">PENDING PRODUCTION</div>
</div>'''

def audio_box(num, cfg):
    if cfg['stream'] == 'bio':
        icon, label = '♫', 'GUIDED AUDIO'
        meta = f'~20–40 min · Binaural beats + WBTB induction protocol · Session {num}'
    else:
        icon, label = '∿', 'GUIDED MEDITATION'
        meta = f'~20–40 min · Theta tones + dream yoga guidance · Evening practice {num}'
    return f'''<div class="asset-box asset-audio">
  <div class="asset-icon">{icon}</div>
  <div class="asset-body">
    <div class="asset-label">{label}</div>
    <div class="asset-title">Practice Audio — Lesson {num}</div>
    <div class="asset-meta">{meta}</div>
  </div>
  <div class="asset-tag">PENDING PRODUCTION</div>
</div>'''

def infographic_box(num, topic, cfg):
    if cfg['stream'] == 'bio':
        icon, label = '◉', 'INFOGRAPHIC'
        meta = 'Visual diagram · A4 PDF · Print-ready reference card'
    else:
        icon, label = '✦', 'SYMBOLIC MAP'
        meta = 'Visual diagram · A4 PDF · Printable altar or journal card'
    return f'''<div class="asset-box asset-infographic">
  <div class="asset-icon">{icon}</div>
  <div class="asset-body">
    <div class="asset-label">{label}</div>
    <div class="asset-title">Lesson {num}: {esc.escape(topic)}</div>
    <div class="asset-meta">{meta}</div>
  </div>
  <div class="asset-tag">PENDING PRODUCTION</div>
</div>'''

def exercise_card(text, stream):
    if stream == 'bio':
        icon, label = '⚡', 'PRACTICE ASSIGNMENT'
    else:
        icon, label = '✦', "TONIGHT'S PRACTICE"
    return f'''<div class="practice-card">
  <div class="practice-header"><span class="practice-icon">{icon}</span><span class="practice-label">{label}</span></div>
  <div class="practice-body">{inline(text)}</div>
</div>'''

def objectives_card(items_html, stream):
    if stream == 'bio':
        label = 'LEARNING OBJECTIVES'
    else:
        label = 'INTENTIONS FOR THIS THRESHOLD'
    return f'''<div class="objectives-card">
  <div class="objectives-label">{label}</div>
  {items_html}
</div>'''

def takeaways_card(items_html, stream):
    if stream == 'bio':
        label = 'KEY TAKEAWAYS'
    else:
        label = 'INSIGHTS FROM THIS THRESHOLD'
    return f'''<div class="takeaways-card">
  <div class="takeaways-label">{label}</div>
  {items_html}
</div>'''

# ─────────────────────────────────────────────────────────
#  MARKDOWN BLOCK PARSER
# ─────────────────────────────────────────────────────────
def parse_body(lines, cfg, lesson_num):
    """Convert a list of body lines to HTML, inserting asset placeholders."""
    output = []
    i = 0
    para_count = 0
    infographic_inserted = False

    while i < len(lines):
        line = lines[i]

        # Skip blank lines between blocks
        if not line.strip():
            i += 1
            continue

        # Table
        if '|' in line and i + 1 < len(lines) and re.match(r'^[\|\s\-:]+$', lines[i+1]):
            rows, i = parse_table(lines, i)
            output.append(rows)
            # Insert infographic hint after any table
            if not infographic_inserted:
                output.append(infographic_box(lesson_num, 'Reference Table — Visual Format', cfg))
                infographic_inserted = True
            continue

        # Bullet list
        if re.match(r'^[-*]\s+', line):
            html, i = parse_list(lines, i)
            output.append(html)
            continue

        # Numbered list
        if re.match(r'^\d+\.\s+', line):
            html, i = parse_list(lines, i, ordered=True)
            output.append(html)
            continue

        # Horizontal rule
        if re.match(r'^---+$', line.strip()):
            i += 1
            continue

        # Heading (h3 within body)
        h3 = re.match(r'^###\s+(.+)', line)
        if h3:
            output.append(f'<h3>{inline(h3.group(1))}</h3>')
            i += 1
            continue

        # Regular paragraph — collect consecutive non-empty lines
        para_lines = []
        while i < len(lines) and lines[i].strip() and not re.match(r'^[-*#|]|\d+\.|\*\*', lines[i]):
            para_lines.append(lines[i])
            i += 1
        if para_lines:
            text = ' '.join(para_lines)
            output.append(f'<p>{inline(text)}</p>')
            para_count += 1
            # Insert infographic after 3rd paragraph if not done yet
            if para_count == 3 and not infographic_inserted and lesson_num <= 9:
                output.append(infographic_box(lesson_num, 'Key Concepts — Visual Reference', cfg))
                infographic_inserted = True
            continue

        # Fallback: emit as paragraph
        output.append(f'<p>{inline(line)}</p>')
        i += 1

    return '\n'.join(filter(None, output))


def parse_list(lines, start, ordered=False):
    items = []
    i = start
    while i < len(lines):
        bullet  = re.match(r'^[-*]\s+(.+)', lines[i])
        numbered = re.match(r'^\d+\.\s+(.+)', lines[i])
        if bullet:
            items.append(f'<li>{inline(bullet.group(1))}</li>')
            i += 1
        elif numbered:
            items.append(f'<li>{inline(numbered.group(1))}</li>')
            i += 1
        elif lines[i].strip() == '' and i+1 < len(lines) and (
            re.match(r'^[-*]\s+', lines[i+1]) or re.match(r'^\d+\.\s+', lines[i+1])
        ):
            i += 1  # Allow single blank line within list
        else:
            break
    tag = 'ol' if ordered else 'ul'
    return f'<{tag}>{"".join(items)}</{tag}>', i


def parse_table(lines, start):
    rows = []
    i = start
    while i < len(lines) and '|' in lines[i]:
        cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
        rows.append(cells)
        i += 1
    if len(rows) < 2:
        return '', start
    header = rows[0]
    body_rows = [r for r in rows[2:] if not all(re.match(r'^[-:]+$', c.strip()) for c in r)]
    thead = '<thead><tr>' + ''.join(f'<th>{inline(c)}</th>' for c in header) + '</tr></thead>'
    tbody = '<tbody>' + ''.join(
        '<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in row) + '</tr>'
        for row in body_rows
    ) + '</tbody>'
    return f'<div class="table-wrap"><table>{thead}{tbody}</table></div>', i


# ─────────────────────────────────────────────────────────
#  LESSON PARSER
# ─────────────────────────────────────────────────────────
def parse_lessons(md_text, cfg):
    """Split markdown into lesson dicts: {num, title, objectives, body_lines, takeaways, practice}"""
    lesson_pattern = re.compile(r'^## LESSON (\d+):\s*(.+)', re.MULTILINE)
    splits = list(lesson_pattern.finditer(md_text))
    lessons = []

    for idx, match in enumerate(splits):
        start = match.end()
        end   = splits[idx+1].start() if idx+1 < len(splits) else len(md_text)
        block = md_text[start:end]

        num   = int(match.group(1))
        title = match.group(2).strip()

        # Extract Learning Objectives
        obj_match = re.search(
            r'\*\*Learning Objectives:\*\*\s*\n((?:[-*]\s+.+\n?)+)',
            block, re.MULTILINE)
        objectives_raw = obj_match.group(1).strip() if obj_match else ''

        # Extract Key Takeaways
        kt_match = re.search(
            r'\*\*Key Takeaways:\*\*\s*\n((?:[-*]\s+.+\n?)+)',
            block, re.MULTILINE)
        takeaways_raw = kt_match.group(1).strip() if kt_match else ''

        # Extract Practice Assignment (grab until next ** section or end)
        pa_match = re.search(
            r'\*\*Practice Assignment:\*\*\s*\n(.+?)(?=\n\*\*|\n## |\Z)',
            block, re.DOTALL)
        practice_raw = pa_match.group(1).strip() if pa_match else ''

        # Body = everything between objectives and key takeaways
        body_start = obj_match.end() if obj_match else 0
        body_end   = kt_match.start() if kt_match else (pa_match.start() if pa_match else len(block))
        body_text  = block[body_start:body_end].strip()

        # Remove any stray **...: ** section headers from body
        body_text = re.sub(r'\*\*[A-Za-z ]+:\*\*\s*\n?', '', body_text)

        lessons.append({
            'num':        num,
            'title':      title,
            'objectives': objectives_raw,
            'body':       body_text,
            'takeaways':  takeaways_raw,
            'practice':   practice_raw,
        })

    return lessons


# ─────────────────────────────────────────────────────────
#  HTML LESSON BLOCK
# ─────────────────────────────────────────────────────────
def render_lesson(lesson, cfg):
    num   = lesson['num']
    title = lesson['title']
    stream = cfg['stream']

    # Format lesson number display
    if stream == 'spirit':
        roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X',
                 'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII']
        num_display = roman[num-1] if num <= 18 else str(num)
        threshold_label = 'THRESHOLD'
        section_class = 'lesson spirit-lesson'
    else:
        num_display = f'{num:02d}'
        threshold_label = 'LESSON'
        section_class = 'lesson bio-lesson'

    # Parse objectives
    strip_b = lambda s: re.sub(r'^[-*]\s+', '', s)
    obj_lines = [l for l in lesson['objectives'].split('\n') if re.match(r'^[-*]\s+', l)]
    obj_items = ''.join('<li>' + inline(strip_b(l)) + '</li>' for l in obj_lines)
    objectives_html = objectives_card('<ul>' + obj_items + '</ul>', stream) if obj_items else ''

    # Parse takeaways
    kt_lines = [l for l in lesson['takeaways'].split('\n') if re.match(r'^[-*]\s+', l)]
    kt_items = ''.join('<li>' + inline(strip_b(l)) + '</li>' for l in kt_lines)
    takeaways_html = takeaways_card('<ul>' + kt_items + '</ul>', stream) if kt_items else ''

    # Body
    body_lines = lesson['body'].split('\n')
    body_html = parse_body(body_lines, cfg, num)

    # Practice
    practice_html = exercise_card(lesson['practice'], stream) if lesson['practice'] else ''

    return f'''
<section id="lesson-{num}" class="{section_class}">
  <div class="lesson-header">
    <div class="lesson-num-wrap">
      <span class="lesson-label-sm">{threshold_label}</span>
      <span class="lesson-num">{num_display}</span>
    </div>
    <h2 class="lesson-title">{esc.escape(title)}</h2>
  </div>

  {video_box(num_display, title, cfg)}

  {objectives_html}

  <div class="lesson-body">
    {body_html}
  </div>

  {takeaways_html}

  {audio_box(num_display, cfg)}

  {practice_html}

  <div class="lesson-complete-wrap">
    <label class="complete-check">
      <input type="checkbox" class="lesson-checkbox" data-lesson="{num}" />
      <span class="complete-label">Mark as complete</span>
    </label>
  </div>
</section>'''


# ─────────────────────────────────────────────────────────
#  CSS — SHARED BASE
# ─────────────────────────────────────────────────────────
def base_css(cfg):
    a  = cfg['accent']
    a2 = cfg['accent2']
    glow = cfg['glow']
    bb   = cfg['badge_bg']
    bbo  = cfg['badge_border']

    if cfg['stream'] == 'bio':
        bg, surface, s2 = '#0d1117', '#161b22', '#21262d'
        border = '#30363d'
        white, text, gray = '#e6edf3', '#c9d1d9', '#8b949e'
    else:
        bg, surface, s2 = '#0a0a14', '#12111f', '#1a1828'
        border = '#2a2840'
        white, text, gray = '#ede8f5', '#c4bfd8', '#8b8aa0'

    return f'''
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
:root {{
  --bg: {bg}; --surface: {surface}; --s2: {s2}; --border: {border};
  --accent: {a}; --a2: {a2}; --glow: {glow};
  --badge-bg: {bb}; --badge-border: {bbo};
  --white: {white}; --text: {text}; --gray: {gray};
  --green: #3fb950; --red: #f85149;
}}
html {{ scroll-behavior: smooth; font-size: 16px; }}
body {{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg); color: var(--text); line-height: 1.75;
}}
a {{ color: var(--accent); }}
a:hover {{ opacity: .8; }}
code {{ background: var(--s2); border: 1px solid var(--border); border-radius: 4px;
        padding: 2px 6px; font-size: .85em; font-family: 'SF Mono', monospace; color: var(--accent); }}
strong {{ color: var(--white); font-weight: 700; }}
em {{ color: var(--accent); font-style: italic; }}
h2 {{ font-size: 1.65rem; font-weight: 800; color: var(--white); letter-spacing: -.02em; line-height: 1.2; }}
h3 {{ font-size: 1.1rem; font-weight: 700; color: var(--white); margin: 28px 0 10px; }}
p  {{ margin-bottom: 1.1em; }}
ul, ol {{ margin: .5em 0 1em 1.5em; }}
li {{ margin-bottom: .35em; }}
/* ── TOP NAV ── */
.top-nav {{
  position: sticky; top: 0; z-index: 200;
  background: rgba({','.join(str(int(bg[i:i+2],16)) for i in (1,3,5))},.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 12px 28px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
}}
.nav-logo {{ font-size: 12px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); }}
.nav-tier  {{ font-size: 12px; color: var(--gray); margin-left: auto; }}
.nav-progress {{ font-size: 12px; font-weight: 700; color: var(--accent); white-space: nowrap; }}
.sidebar-toggle {{ display: none; background: none; border: 1px solid var(--border); border-radius: 6px;
                   padding: 4px 10px; color: var(--text); cursor: pointer; font-size: 13px; }}
/* ── LAYOUT ── */
.layout {{ display: flex; min-height: 100vh; }}
/* ── SIDEBAR (bio only) ── */
.sidebar {{
  width: 280px; min-width: 280px; background: var(--surface);
  border-right: 1px solid var(--border);
  position: sticky; top: 49px; height: calc(100vh - 49px); overflow-y: auto;
  padding: 24px 0;
}}
.sidebar-head {{ padding: 0 20px 20px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }}
.stream-badge {{
  display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px;
  font-weight: 700; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 12px;
  background: var(--badge-bg); border: 1px solid var(--badge-border); color: var(--accent);
}}
.sidebar-progress-label {{ font-size: 11px; color: var(--gray); margin-bottom: 4px; }}
.progress-bar-wrap {{ height: 4px; background: var(--s2); border-radius: 4px; overflow: hidden; }}
.progress-bar {{ height: 100%; background: var(--accent); transition: width .4s; border-radius: 4px; width: 0%; }}
.lesson-nav {{ padding: 4px 0; }}
.lesson-link {{
  display: flex; align-items: center; gap: 10px; padding: 9px 20px;
  text-decoration: none; color: var(--gray); font-size: 13px; border-left: 2px solid transparent;
  transition: all .15s;
}}
.lesson-link:hover {{ color: var(--white); background: var(--s2); border-left-color: var(--border); }}
.lesson-link.active {{ color: var(--accent); background: var(--s2); border-left-color: var(--accent); font-weight: 600; }}
.lesson-link.done {{ color: var(--green); }}
.lesson-link.done .ln {{ color: var(--green); }}
.ln {{ font-size: 10px; font-weight: 700; letter-spacing: .05em; color: var(--gray); min-width: 24px; }}
.lt {{ flex: 1; line-height: 1.3; }}
.lc {{ width: 14px; height: 14px; border: 1px solid var(--border); border-radius: 3px;
       display: flex; align-items: center; justify-content: center; flex-shrink: 0; }}
.lc.checked {{ background: var(--green); border-color: var(--green); }}
.lc.checked::after {{ content: '✓'; font-size: 9px; color: #0d1117; font-weight: 900; }}
/* ── MAIN CONTENT ── */
.content {{ flex: 1; max-width: 820px; padding: 48px 40px; overflow-x: hidden; }}
@media (max-width: 900px) {{ .sidebar {{ display: none; }} .content {{ padding: 32px 20px; }} }}
@media (max-width: 900px) {{ .sidebar.open {{ display: block; position: fixed; top: 49px; left: 0; z-index: 150; height: calc(100vh - 49px); }} .sidebar-toggle {{ display: block; }} }}
/* ── COURSE HERO ── */
.course-hero {{ margin-bottom: 60px; padding: 40px; background: var(--surface);
                border: 1px solid var(--border); border-radius: 16px; }}
.hero-tier-badge {{ display: inline-flex; align-items: center; gap: 8px; background: var(--badge-bg);
                    border: 1px solid var(--badge-border); border-radius: 20px; padding: 5px 16px;
                    font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
                    color: var(--accent); margin-bottom: 20px; }}
.hero-title {{ font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; color: var(--white);
               letter-spacing: -.02em; line-height: 1.15; margin-bottom: 10px; }}
.hero-title em {{ font-style: normal; color: var(--accent); }}
.hero-sub   {{ font-size: 1rem; color: var(--gray); margin-bottom: 28px; line-height: 1.7; max-width: 560px; }}
.hero-stats {{ display: flex; gap: 28px; flex-wrap: wrap; }}
.stat {{ text-align: left; }}
.stat-val {{ font-size: 2rem; font-weight: 800; color: var(--white); line-height: 1; }}
.stat-lbl {{ font-size: 11px; color: var(--gray); text-transform: uppercase; letter-spacing: .1em; }}
/* ── LESSON ── */
.lesson {{ border-top: 1px solid var(--border); padding: 52px 0; scroll-margin-top: 65px; }}
.lesson-header {{ display: flex; align-items: flex-start; gap: 20px; margin-bottom: 32px; }}
.lesson-num-wrap {{ display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }}
.lesson-label-sm {{ font-size: 9px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: var(--gray); }}
.lesson-num {{ font-size: 3rem; font-weight: 900; color: var(--accent); line-height: 1; text-shadow: 0 0 24px var(--glow); }}
.lesson-title {{ padding-top: 8px; }}
/* ── ASSET BOXES ── */
.asset-box {{
  display: flex; align-items: center; gap: 16px;
  padding: 16px 20px; border-radius: 10px; margin: 20px 0;
  border: 1px solid var(--border);
}}
.asset-video    {{ background: rgba(88,101,242,.06);  border-color: rgba(88,101,242,.2); }}
.asset-audio    {{ background: rgba(63,185,80,.06);   border-color: rgba(63,185,80,.2); }}
.asset-infographic {{ background: var(--badge-bg); border-color: var(--badge-border); }}
.asset-icon {{ font-size: 1.4rem; flex-shrink: 0; color: var(--accent); }}
.asset-video .asset-icon {{ color: #5865f2; }}
.asset-audio .asset-icon {{ color: var(--green); }}
.asset-body {{ flex: 1; }}
.asset-label {{ font-size: 9px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--gray); margin-bottom: 2px; }}
.asset-title {{ font-size: .9rem; font-weight: 700; color: var(--white); }}
.asset-meta  {{ font-size: .78rem; color: var(--gray); margin-top: 2px; }}
.asset-tag   {{ font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
                color: var(--gray); background: var(--s2); border: 1px solid var(--border);
                border-radius: 20px; padding: 3px 10px; white-space: nowrap; flex-shrink: 0; }}
/* ── OBJECTIVES / TAKEAWAYS ── */
.objectives-card, .takeaways-card {{
  padding: 20px 24px; border-radius: 10px; margin: 20px 0;
  border-left: 3px solid var(--accent);
}}
.objectives-card {{ background: rgba(88,101,242,.05); border-color: rgba(88,101,242,.4); }}
.takeaways-card  {{ background: var(--badge-bg); border-color: var(--accent); }}
.objectives-label, .takeaways-label {{
  font-size: 9px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 12px;
}}
.objectives-card ul, .takeaways-card ul {{ margin-left: 1em; }}
.objectives-card li, .takeaways-card li {{ color: var(--text); margin-bottom: .3em; font-size: .95rem; }}
/* ── PRACTICE CARD ── */
.practice-card {{
  padding: 20px 24px; border-radius: 10px; margin: 20px 0;
  background: rgba(63,185,80,.06); border: 1px solid rgba(63,185,80,.2);
}}
.practice-header {{ display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }}
.practice-icon  {{ font-size: 1.1rem; color: var(--green); }}
.practice-label {{ font-size: 9px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--green); }}
.practice-body  {{ font-size: .95rem; color: var(--text); line-height: 1.7; }}
/* ── TABLES ── */
.table-wrap {{ overflow-x: auto; margin: 20px 0; border-radius: 8px; border: 1px solid var(--border); }}
table {{ width: 100%; border-collapse: collapse; font-size: .9rem; }}
thead tr {{ background: var(--s2); }}
th {{ padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--gray); border-bottom: 1px solid var(--border); }}
td {{ padding: 10px 14px; border-bottom: 1px solid var(--border); color: var(--text); }}
tr:last-child td {{ border-bottom: none; }}
tr:hover td {{ background: rgba(255,255,255,.02); }}
/* ── COMPLETE CHECK ── */
.lesson-complete-wrap {{ margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--border); }}
.complete-check {{ display: flex; align-items: center; gap: 10px; cursor: pointer; width: fit-content; }}
.complete-check input {{ width: 16px; height: 16px; accent-color: var(--green); cursor: pointer; }}
.complete-label {{ font-size: 13px; color: var(--gray); font-weight: 600; }}
/* ── SPIRIT EXTRAS ── */
.spirit-lesson .lesson-num {{ font-family: Georgia, serif; font-weight: 400; font-size: 2.5rem; }}
.spirit-lesson .lesson-title {{ font-family: Georgia, serif; }}
.spirit-lesson h3 {{ font-family: Georgia, serif; font-weight: 700; }}
.spirit-lesson .lesson-body p {{ font-size: 1.02rem; line-height: 1.85; }}
/* ── FOOTER ── */
.course-footer {{ border-top: 1px solid var(--border); padding: 32px 0 60px; margin-top: 60px;
                  text-align: center; color: var(--gray); font-size: 12px; }}
.course-footer a {{ color: var(--gray); }}
/* ── SPIRIT INDEX ── */
.spirit-index {{ background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
                 padding: 28px; margin-bottom: 52px; }}
.spirit-index-title {{ font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
                        color: var(--accent); margin-bottom: 18px; }}
.spirit-index-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 8px; }}
.spirit-index-link {{ display: block; padding: 10px 14px; border-radius: 8px; text-decoration: none;
                       color: var(--text); font-size: 13px; border: 1px solid transparent;
                       transition: all .15s; line-height: 1.3; }}
.spirit-index-link:hover {{ background: var(--s2); border-color: var(--border); color: var(--white); }}
.spirit-index-num {{ font-size: 10px; color: var(--accent); font-weight: 700; margin-bottom: 2px; }}
'''

# ─────────────────────────────────────────────────────────
#  JAVASCRIPT
# ─────────────────────────────────────────────────────────
def build_js(cfg):
    key = f'wild_t{cfg["tier"]}_{cfg["stream"]}_progress'
    return f'''
const STORAGE_KEY = '{key}';
const total = {cfg['lessons']};
let progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{{}}');

function updateProgress() {{
  const done = Object.values(progress).filter(Boolean).length;
  const pct  = Math.round((done / total) * 100);
  const bar  = document.getElementById('progress-bar');
  const cnt  = document.getElementById('progress-count');
  if (bar) bar.style.width = pct + '%';
  if (cnt) cnt.textContent = done + ' / ' + total + ' complete';
  document.querySelectorAll('.lesson-link').forEach(function(link) {{
    const n = link.dataset.lesson;
    const icon = link.querySelector('.lc');
    if (progress[n]) {{
      link.classList.add('done');
      if (icon) icon.classList.add('checked');
    }} else {{
      link.classList.remove('done');
      if (icon) icon.classList.remove('checked');
    }}
  }});
}}

document.querySelectorAll('.lesson-checkbox').forEach(function(cb) {{
  const n = cb.dataset.lesson;
  cb.checked = !!progress[n];
  cb.addEventListener('change', function() {{
    progress[n] = cb.checked;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    updateProgress();
  }});
}});

// Active lesson highlight on scroll
const observer = new IntersectionObserver(function(entries) {{
  entries.forEach(function(e) {{
    if (e.isIntersecting) {{
      const id = e.target.id;
      const n  = id.replace('lesson-', '');
      document.querySelectorAll('.lesson-link').forEach(function(l) {{ l.classList.remove('active'); }});
      const active = document.querySelector('.lesson-link[data-lesson="' + n + '"]');
      if (active) active.classList.add('active');
    }}
  }});
}}, {{ rootMargin: '-40% 0px -50% 0px', threshold: 0 }});
document.querySelectorAll('.lesson').forEach(function(s) {{ observer.observe(s); }});

// Sidebar toggle on mobile
const toggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
if (toggle && sidebar) {{
  toggle.addEventListener('click', function() {{
    sidebar.classList.toggle('open');
  }});
}}

updateProgress();
'''

# ─────────────────────────────────────────────────────────
#  SIDEBAR (bio stream)
# ─────────────────────────────────────────────────────────
def build_sidebar(lessons, cfg):
    lesson_items = ''
    for l in lessons:
        lesson_items += f'''<a href="#lesson-{l['num']}" class="lesson-link" data-lesson="{l['num']}">
  <span class="ln">{l['num']:02d}</span>
  <span class="lt">{esc.escape(l['title'])}</span>
  <span class="lc"></span>
</a>'''
    return f'''<aside class="sidebar" id="sidebar">
  <div class="sidebar-head">
    <div class="stream-badge">{cfg['subtitle'].upper()}</div>
    <div class="sidebar-progress-label">
      <span id="progress-count">0 / {cfg['lessons']} complete</span>
    </div>
    <div class="progress-bar-wrap"><div class="progress-bar" id="progress-bar"></div></div>
  </div>
  <nav class="lesson-nav">{lesson_items}</nav>
</aside>'''

# ─────────────────────────────────────────────────────────
#  SPIRIT INDEX
# ─────────────────────────────────────────────────────────
def build_spirit_index(lessons, cfg):
    roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X',
             'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII']
    items = ''
    for l in lessons:
        r = roman[l['num']-1] if l['num'] <= 18 else str(l['num'])
        items += f'''<a href="#lesson-{l['num']}" class="spirit-index-link">
  <div class="spirit-index-num">THRESHOLD {r}</div>
  <div>{esc.escape(l['title'])}</div>
</a>'''
    return f'''<div class="spirit-index">
  <div class="spirit-index-title">The Path — All Thresholds</div>
  <div class="spirit-index-grid">{items}</div>
  <div style="margin-top:18px;font-size:12px;color:var(--gray)" id="progress-count">0 / {cfg['lessons']} complete</div>
</div>'''

# ─────────────────────────────────────────────────────────
#  COURSE HERO
# ─────────────────────────────────────────────────────────
def build_hero(cfg, lessons):
    stream_icon = '🔬' if cfg['stream'] == 'bio' else '🌙'
    community_icon = '✈' if cfg['stream'] == 'bio' else '🎮'
    return f'''<div class="course-hero">
  <div class="hero-tier-badge">{stream_icon}&nbsp; Tier {cfg['tier']} · {cfg['subtitle']}</div>
  <h1 class="hero-title">WILD <em>{cfg['title']}</em></h1>
  <p class="hero-sub">{"The complete advanced system — neuroscience-led, data-driven, built for precision practitioners." if cfg['stream']=='bio' else "A deep contemplative journey into the nature of conscious dreaming — rooted in ancient tradition and personal transformation."}</p>
  <div class="hero-stats">
    <div class="stat"><div class="stat-val">{cfg['lessons']}</div><div class="stat-lbl">Lessons</div></div>
    <div class="stat"><div class="stat-val">{cfg['lessons']}</div><div class="stat-lbl">Practice audios</div></div>
    <div class="stat"><div class="stat-val">{cfg['lessons']}</div><div class="stat-lbl">Video sessions</div></div>
    <div class="stat"><div class="stat-val">{cfg['price']}</div><div class="stat-lbl">One-time</div></div>
    <div class="stat"><div class="stat-val">{community_icon}&nbsp;{cfg['community']}</div><div class="stat-lbl">Community</div></div>
  </div>
</div>'''

# ─────────────────────────────────────────────────────────
#  FULL HTML PAGE
# ─────────────────────────────────────────────────────────
def build_page(md_text, cfg):
    lessons = parse_lessons(md_text, cfg)

    sidebar_html = ''
    index_html   = ''
    layout_open  = '<div class="layout">'
    layout_close = '</div>'

    if cfg['stream'] == 'bio':
        sidebar_html = build_sidebar(lessons, cfg)
    else:
        index_html = build_spirit_index(lessons, cfg)

    lesson_blocks = '\n'.join(render_lesson(l, cfg) for l in lessons)

    bg_rgb = '13,17,23' if cfg['stream'] == 'bio' else '10,10,20'

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>WILD {cfg['title']} — {cfg['subtitle']} | WILD Programme</title>
<meta name="robots" content="noindex,nofollow"/>
<style>
{base_css(cfg)}
</style>
</head>
<body>

<nav class="top-nav">
  <button class="sidebar-toggle" id="sidebar-toggle">☰ Lessons</button>
  <span class="nav-logo">⬡ WILD Programme</span>
  <span class="nav-tier">Tier {cfg['tier']} · {cfg['subtitle']} · {cfg['lessons']} Lessons</span>
  {'<span class="nav-progress" id="progress-count">0 / ' + str(cfg['lessons']) + ' complete</span>' if cfg['stream']=='spirit' else ''}
</nav>

{layout_open}
{sidebar_html}
<main class="content">
  {build_hero(cfg, lessons)}
  {index_html}
  {lesson_blocks}
  <footer class="course-footer">
    <p>WILD Programme · {cfg['title']} · {cfg['subtitle']}</p>
    <p style="margin-top:8px">This course is for your personal use only. Do not redistribute or share access. © 2026 WILD Programme</p>
    <p style="margin-top:8px"><a href="mailto:smith@negotiorum.com">smith@negotiorum.com</a></p>
  </footer>
</main>
{layout_close}

<script>
{build_js(cfg)}
</script>
</body>
</html>'''


# ─────────────────────────────────────────────────────────
#  RUNNER
# ─────────────────────────────────────────────────────────
def main():
    base = os.path.dirname(os.path.abspath(__file__))
    for cfg in FILES:
        inp  = os.path.join(base, cfg['input'])
        out  = os.path.join(base, cfg['output'])
        if not os.path.exists(inp):
            print(f'  XX  Not found: {cfg["input"]}')
            continue
        with open(inp, encoding='utf-8') as f:
            md = f.read()
        html = build_page(md, cfg)
        with open(out, 'w', encoding='utf-8') as f:
            f.write(html)
        size_kb = len(html.encode()) // 1024
        print(f'  OK  {cfg["output"]}  ({size_kb} KB)')
    print('\nDone. Open any .html file in your browser to preview.')

if __name__ == '__main__':
    main()
