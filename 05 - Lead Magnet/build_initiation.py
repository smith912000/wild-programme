"""
7-Night Lucid Dream Initiation — Spiritual Stream Lead Magnet
Mirrors the structure and quality of 7_Night_WILD_Protocol.pdf
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame
from reportlab.pdfgen import canvas as canvas_module

# ── Palette ──────────────────────────────────────────────────────────────────
INK        = colors.HexColor("#0D0D1A")   # near-black page bg
GOLD       = colors.HexColor("#C8A96E")   # warm gold accent
MIST       = colors.HexColor("#E8E0D5")   # parchment body text
DIM        = colors.HexColor("#8A7F74")   # muted secondary text
PANEL      = colors.HexColor("#16152A")   # card/panel bg
BORDER     = colors.HexColor("#2E2B45")   # subtle border
HIGHLIGHT  = colors.HexColor("#9B7FD4")   # violet accent
WHITE      = colors.white

W, H = A4

# ── Page canvas decorator ────────────────────────────────────────────────────
def make_page(canv, doc, page_label="", show_footer=True):
    canv.saveState()
    # background
    canv.setFillColor(INK)
    canv.rect(0, 0, W, H, fill=1, stroke=0)
    # top border line
    canv.setStrokeColor(GOLD)
    canv.setLineWidth(0.5)
    canv.line(18*mm, H - 14*mm, W - 18*mm, H - 14*mm)
    # bottom border line + footer
    canv.line(18*mm, 14*mm, W - 18*mm, 14*mm)
    if show_footer:
        canv.setFont("Helvetica", 7)
        canv.setFillColor(DIM)
        canv.drawString(18*mm, 9*mm, "WILD Programme  |  wildpractice.com")
        canv.drawRightString(W - 18*mm, 9*mm, str(doc.page))
    canv.restoreState()

def first_page(canv, doc):
    make_page(canv, doc, show_footer=False)

def later_pages(canv, doc):
    make_page(canv, doc)

# ── Style factory ─────────────────────────────────────────────────────────────
def S(name, **kw):
    base = ParagraphStyle(name, **kw)
    return base

COVER_LABEL = S("cover_label",
    fontSize=9, leading=13, textColor=GOLD,
    fontName="Helvetica", alignment=TA_CENTER,
    spaceAfter=6)

COVER_TITLE = S("cover_title",
    fontSize=36, leading=42, textColor=WHITE,
    fontName="Helvetica-Bold", alignment=TA_CENTER,
    spaceAfter=4)

COVER_SUBTITLE = S("cover_sub",
    fontSize=15, leading=20, textColor=GOLD,
    fontName="Helvetica-Oblique", alignment=TA_CENTER,
    spaceAfter=10)

COVER_TAGLINE = S("cover_tag",
    fontSize=11, leading=16, textColor=MIST,
    fontName="Helvetica", alignment=TA_CENTER,
    spaceAfter=6)

COVER_DOMAIN = S("cover_domain",
    fontSize=9, leading=13, textColor=DIM,
    fontName="Helvetica", alignment=TA_CENTER)

SECTION_LABEL = S("section_label",
    fontSize=8, leading=11, textColor=GOLD,
    fontName="Helvetica-Bold", alignment=TA_LEFT,
    spaceBefore=6, spaceAfter=2)

H1 = S("h1",
    fontSize=24, leading=30, textColor=WHITE,
    fontName="Helvetica-Bold", alignment=TA_LEFT,
    spaceBefore=4, spaceAfter=6)

H2 = S("h2",
    fontSize=15, leading=20, textColor=GOLD,
    fontName="Helvetica-Bold", alignment=TA_LEFT,
    spaceBefore=10, spaceAfter=4)

H3 = S("h3",
    fontSize=11, leading=15, textColor=HIGHLIGHT,
    fontName="Helvetica-Bold", alignment=TA_LEFT,
    spaceBefore=8, spaceAfter=3)

BODY = S("body",
    fontSize=10, leading=15.5, textColor=MIST,
    fontName="Helvetica", alignment=TA_JUSTIFY,
    spaceAfter=7)

BODY_ITALIC = S("body_italic",
    fontSize=10, leading=15.5, textColor=MIST,
    fontName="Helvetica-Oblique", alignment=TA_JUSTIFY,
    spaceAfter=7)

QUOTE = S("quote",
    fontSize=10.5, leading=16, textColor=GOLD,
    fontName="Helvetica-Oblique", alignment=TA_CENTER,
    spaceBefore=8, spaceAfter=8)

BULLET = S("bullet",
    fontSize=10, leading=15.5, textColor=MIST,
    fontName="Helvetica", alignment=TA_LEFT,
    spaceAfter=3, leftIndent=14, bulletIndent=0)

CAPTION = S("caption",
    fontSize=8, leading=12, textColor=DIM,
    fontName="Helvetica-Oblique", alignment=TA_CENTER,
    spaceAfter=4)

NIGHT_NUM = S("night_num",
    fontSize=48, leading=52, textColor=BORDER,
    fontName="Helvetica-Bold", alignment=TA_RIGHT,
    spaceBefore=0, spaceAfter=0)

def rule(color=GOLD, width=0.5, space_before=4, space_after=8):
    return HRFlowable(width="100%", thickness=width, color=color,
                      spaceBefore=space_before, spaceAfter=space_after)

def panel_table(paragraphs, bg=PANEL):
    """Wrap paragraphs in a tinted panel box."""
    cell = [[p] for p in paragraphs]
    flat_cell = [[Paragraph(" ", BODY)]]
    content = [[p] for p in paragraphs]
    t = Table([[paragraphs]], colWidths=[W - 36*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("ROUNDEDCORNERS", [4]),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 14),
        ("RIGHTPADDING",  (0,0), (-1,-1), 14),
        ("BOX", (0,0), (-1,-1), 0.5, BORDER),
    ]))
    return t

def bullet(text):
    return Paragraph(f"<bullet>&bull;</bullet> {text}", BULLET)

# ── Document ──────────────────────────────────────────────────────────────────
OUT = "C:/Users/freez/OneDrive/Desktop/WILD Bizz/05 - Lead Magnet/7_Night_Lucid_Dream_Initiation.pdf"

doc = SimpleDocTemplate(
    OUT,
    pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm,
    topMargin=20*mm, bottomMargin=22*mm,
    title="7-Night Lucid Dream Initiation",
    author="WILD Programme",
    subject="Consciousness Stream | Free Guide",
)

story = []

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 1 — COVER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
story.append(Spacer(1, 28*mm))
story.append(Paragraph("CONSCIOUSNESS STREAM  |  FREE GUIDE", COVER_LABEL))
story.append(Spacer(1, 6*mm))
story.append(rule(GOLD, 0.8, 0, 8))
story.append(Paragraph("The 7-Night Lucid Dream Initiation", COVER_TITLE))
story.append(rule(GOLD, 0.8, 2, 8))
story.append(Spacer(1, 4*mm))
story.append(Paragraph("A Journey Into Conscious Dreaming", COVER_SUBTITLE))
story.append(Spacer(1, 8*mm))
story.append(Paragraph(
    "Seven nights. Seven thresholds. One continuous awakening.",
    COVER_TAGLINE))
story.append(Spacer(1, 3*mm))
story.append(Paragraph(
    "For seekers, meditators, and anyone called\nto explore the inner landscape of consciousness.",
    COVER_TAGLINE))
story.append(Spacer(1, 18*mm))

# Tradition strip
traditions_data = [["Tibetan Dream Yoga", "Sufi Dreamwork", "Jungian Shadow", "Taoist Inner Alchemy"]]
t = Table(traditions_data, colWidths=[(W - 36*mm)/4]*4)
t.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,-1), PANEL),
    ("TEXTCOLOR",     (0,0), (-1,-1), DIM),
    ("FONTNAME",      (0,0), (-1,-1), "Helvetica"),
    ("FONTSIZE",      (0,0), (-1,-1), 8),
    ("ALIGN",         (0,0), (-1,-1), "CENTER"),
    ("TOPPADDING",    (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ("BOX",           (0,0), (-1,-1), 0.5, BORDER),
    ("LINEAFTER",     (0,0), (-2,-1), 0.5, BORDER),
]))
story.append(t)
story.append(Spacer(1, 14*mm))
story.append(Paragraph("wildpractice.com", COVER_DOMAIN))
story.append(PageBreak())

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 2 — INTRODUCTION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
story.append(Paragraph("INTRODUCTION", SECTION_LABEL))
story.append(Paragraph("The Dream as a Doorway", H1))
story.append(rule())
story.append(Paragraph(
    "For thousands of years, across every major contemplative tradition, practitioners have known something that modern culture forgot: sleep is not an absence of consciousness. It is a different room in the same house.",
    BODY))
story.append(Paragraph(
    "The Tibetans called it Dream Yoga. The Sufis spoke of the Barzakh — the threshold world between the waking and the divine. The Taoists wrote of the inner landscape traversed in dream as the truest mirror of the self. Every tradition that went deep enough arrived at the same discovery: the dreaming mind, made conscious, is one of the most powerful instruments of inner exploration available to a human being.",
    BODY))
story.append(Paragraph(
    "Wake-Induced Lucid Dreaming — WILD — is the direct path into that space. Rather than waiting for lucidity to arise spontaneously within a dream, you remain conscious as you cross the threshold of sleep. You ride the edge of waking and dreaming until the dream world opens around you — and you are fully present within it.",
    BODY))
story.append(Spacer(1, 4*mm))
story.append(Paragraph(
    "\"In the dream state, the mind's natural luminosity is unobstructed. This is what the practitioners have always sought.\"",
    QUOTE))
story.append(Paragraph("— Tenzin Wangyal Rinpoche, The Tibetan Yogas of Dream and Sleep", CAPTION))
story.append(Spacer(1, 4*mm))
story.append(Paragraph(
    "This seven-night initiation is designed as a progressive opening. Each night, you will develop one layer of awareness, one threshold skill, one quality of attention. By night seven, you will have built the complete foundation for sustained lucid dreaming — and a living relationship with your own inner landscape.",
    BODY))
story.append(Paragraph("How to Use This Guide", H2))
story.append(bullet("Read each night's practice in the hour before sleep"))
story.append(bullet("Keep a journal beside your bed — write immediately upon waking, before you move"))
story.append(bullet("Approach each practice with curiosity, not effort. You are not forcing. You are allowing"))
story.append(bullet("The WBTB window (Night 3 onwards) is most powerful between 5–6 hours after you first fall asleep"))
story.append(bullet("If a night does not produce results, do not be discouraged — the practice is working below the surface"))
story.append(PageBreak())

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NIGHTS HELPER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
nights = [
    {
        "num": "01",
        "title": "Awakening to the Body",
        "theme": "Presence & the Hypnagogic Threshold",
        "tradition": "Tibetan Dream Yoga — the practice of maintaining awareness as the body sleeps",
        "intro": (
            "The first night is not about lucid dreaming. It is about becoming radically present to what is already happening as you fall asleep. Tonight, you will meet the hypnagogic state — the perceptual threshold between waking and dreaming — perhaps for the first time with full conscious attention."
        ),
        "what_happens": (
            "As your body relaxes into sleep, your conscious mind normally surrenders alongside it. The hypnagogic state is the brief window when your body is releasing but your awareness can remain. You may notice brief visual flashes, geometric patterns, sounds, or a sense of floating. These are not random — they are the beginning of the dream world forming."
        ),
        "practice_title": "The Witnessing Practice",
        "practice": [
            "Lie in your normal sleep position. Set no alarm tonight.",
            "As you feel drowsiness arriving, do not lean into it as you normally would. Instead, remain as the observer. Notice the sensations without following them into sleep.",
            "Watch the visual field behind your closed eyes. Do not try to control what appears. Only observe.",
            "If you fall asleep — that is fine. You are training the witnessing faculty. Every moment of awareness before sleep deepens the practice.",
            "In the morning: write three things you noticed as you were falling asleep, however fragmentary.",
        ],
        "intention": "Tonight I remain present at the threshold. I watch without grasping.",
        "journal_prompts": [
            "What did you notice in your visual field as you drifted off?",
            "Did any sounds or sensations arise unexpectedly?",
            "What was the last thing you were aware of before waking?",
        ],
    },
    {
        "num": "02",
        "title": "The Language of Symbols",
        "theme": "Dream Recall & Symbolic Awareness",
        "tradition": "Jungian depth psychology — dreams as the voice of the deeper self",
        "intro": (
            "Before you can become lucid in a dream, you must first be able to remember your dreams with clarity and detail. Dream recall is a trainable faculty — and it begins in the first seconds after waking. Tonight's focus is on building that faculty while beginning to develop what Carl Jung called 'symbolic literacy': the ability to read the language your subconscious mind uses to speak."
        ),
        "what_happens": (
            "Dreams do not speak in language. They speak in images, emotions, and symbols. A recurring figure, a colour, a landscape, an action — these carry meaning that the rational mind cannot fully translate, but can learn to feel. The practice of symbolic awareness trains you to receive that meaning rather than immediately explaining it away."
        ),
        "practice_title": "The Dream Recall Ritual",
        "practice": [
            "Before sleep: write one intention in your journal — a question you would like to explore in tonight's dream. Keep it open ('What do I need to see?') rather than directive.",
            "Set your intention as the last thought as you close your eyes.",
            "Upon waking — before you move, before you check your phone — stay still. Keep your eyes closed. Allow the dream to remain in your awareness for 60 seconds.",
            "Then write. Do not edit or interpret — only record. Emotions first, then images, then narrative.",
            "Circle any symbol that appears more than once, or that carries an unexplained emotional weight.",
        ],
        "intention": "Tonight I listen. My dreaming self has something to show me.",
        "journal_prompts": [
            "What symbols appeared? What emotions accompanied them?",
            "Was there a recurring element — a figure, a colour, a place?",
            "What did the dream feel like, even if you cannot remember the content?",
        ],
    },
    {
        "num": "03",
        "title": "The Wake-Back-to-Bed Window",
        "theme": "Timing the Portal",
        "tradition": "Taoist inner alchemy — working with natural cycles and liminal hours",
        "intro": (
            "Tonight, you begin working with the WBTB technique — the single most powerful structural tool for achieving lucid dreaming. The Taoists understood that certain hours of the night carry a different quality of consciousness. Modern sleep science confirms it: REM sleep is most concentrated in the final two hours of a full night's sleep, and this is when the dreaming mind is most active, most vivid, and most accessible to conscious entry."
        ),
        "what_happens": (
            "When you wake after 5–6 hours of sleep and remain awake for 15–30 minutes before returning to sleep, your body re-enters sleep quickly but your mind remains primed for awareness. This brief awakening does not damage your sleep — it redirects your nervous system toward the exact conditions where lucid dreaming becomes most natural."
        ),
        "practice_title": "Opening the Liminal Hour",
        "practice": [
            "Set an alarm for 5.5 hours after you intend to sleep (e.g. sleep at midnight, alarm at 5:30am).",
            "When the alarm wakes you, rise gently. Drink water. Sit for 15–20 minutes in dim light.",
            "During this time: re-read your night's intention. Write briefly in your journal — whatever is present.",
            "Then return to bed. As you settle, silently repeat your intention: 'I remain conscious as I enter the dream.'",
            "Lie still. Allow sleep to come without forcing. The awareness you carry into sleep now has somewhere to land.",
        ],
        "intention": "I wake to open the door. Then I return, and walk through it.",
        "journal_prompts": [
            "How did the WBTB period feel? Alertness level?",
            "Did your dreams after returning to sleep feel different in quality or vividness?",
            "Did you have any moment of recognising you were dreaming?",
        ],
    },
    {
        "num": "04",
        "title": "Sleep Paralysis as Threshold",
        "theme": "Meeting the Gateway Without Fear",
        "tradition": "Shamanic traditions — the threshold guardian and the liminal crossing",
        "intro": (
            "Sleep paralysis frightens most people. Shamanic practitioners across cultures, and Tibetan dream yogis, understand it differently: it is not a malfunction. It is a doorway. When the body reaches full sleep paralysis while awareness remains active, you are standing at the exact threshold between waking and dreaming. This night, you learn to meet that threshold with calm, open curiosity rather than alarm."
        ),
        "what_happens": (
            "Sleep paralysis occurs when the body's natural mechanism that prevents us from acting out our dreams activates while the mind is still partially conscious. The sensations — heaviness, pressure, inability to move — are the body doing exactly what it should. When you remain calm in this state, the dream world opens directly from it. Fear closes the door. Equanimity opens it."
        ),
        "practice_title": "The Threshold Breath",
        "practice": [
            "Use the WBTB method from Night 3 (5.5-hour alarm).",
            "After returning to bed, practise the 4-7-8 breath: inhale for 4, hold for 7, exhale for 8. Repeat 4 cycles.",
            "If you feel the onset of sleep paralysis — heaviness, a sense of pressure, inability to move — do not try to shake yourself awake.",
            "Instead: breathe slowly through your nose. Soften every muscle you can feel. Say inwardly: 'I am safe. This is the doorway.'",
            "Allow your inner vision to open. Do not grasp at what appears — allow it to deepen around you.",
        ],
        "intention": "I meet the threshold guardian with peace. What lies beyond the door is what I came here to find.",
        "journal_prompts": [
            "Did you experience any sleep paralysis sensations? How did you respond?",
            "Did you notice the moment of transition into the dream state?",
            "What arose in the threshold space — images, sounds, feelings?",
        ],
    },
    {
        "num": "05",
        "title": "Entering the Dream Fully",
        "theme": "Crossing the Threshold & Stabilising Lucidity",
        "tradition": "Tibetan Dream Yoga — sustaining rigpa (clear awareness) within the dream",
        "intro": (
            "Tonight is the night many practitioners experience their first WILD — the direct entry from waking into the dream state with full consciousness intact. Whether or not that happens for you tonight, you are building toward it. The practice now focuses on the moment of entry itself, and — crucially — what to do in the first sixty seconds if you find yourself lucid within a dream."
        ),
        "what_happens": (
            "The moment of dream entry during WILD can feel sudden. One moment you are in the threshold, the next the dream world is fully formed around you. This transition can be destabilising if you are not prepared. Excitement, surprise, or grasping at the experience can dissolve the dream immediately. The Tibetan teachings emphasise: when you arrive, be still. Let the dream consolidate around you. Then explore."
        ),
        "practice_title": "The Sixty Seconds of Stillness",
        "practice": [
            "Use the WBTB method. After returning to bed, use the body scan: release tension from feet to crown, progressively.",
            "As you approach the threshold, repeat inwardly: 'I am entering the dream. I remain aware.'",
            "If the dream world forms around you: resist the urge to immediately move or act. Stand or sit within the dream for 60 seconds. Simply observe.",
            "Touch something — a wall, the ground, your own hand. Feel the texture. This grounds and stabilises the dream state.",
            "Then explore freely. Ask a dream figure a question. Examine a symbol. Notice what draws your attention.",
        ],
        "intention": "I enter the dream fully present. I arrive, I settle, and then I explore.",
        "journal_prompts": [
            "Did you experience any moment of lucidity — recognising you were dreaming?",
            "What was the first thing you did or saw?",
            "How long did the lucid state last before you woke or lost awareness?",
        ],
    },
    {
        "num": "06",
        "title": "The Inner Landscape",
        "theme": "Conscious Exploration & Shadow Integration",
        "tradition": "Jungian shadow work — meeting the unconscious face to face",
        "intro": (
            "A lucid dream is not merely a vivid experience. It is direct access to your unconscious mind in its own language. The figures, landscapes, and encounters within your dreams are not random — they carry meaning, pattern, and sometimes challenge. Tonight's practice introduces dream work: the art of engaging with the content of your dreams consciously, with intention, and with the courage to meet whatever arises."
        ),
        "what_happens": (
            "Jung observed that the unconscious communicates through figures he called archetypes — the Shadow, the Anima/Animus, the Wise Elder, the Trickster. Within a lucid dream, you can encounter these figures directly and engage with them. A shadow figure — something threatening or disturbing — is not an enemy. It is a part of yourself seeking integration. Meeting it with curiosity rather than flight is one of the most powerful acts of inner work available."
        ),
        "practice_title": "Meeting the Inner Figure",
        "practice": [
            "Before sleep: identify one recurring figure, symbol, or emotional theme from your dream journal.",
            "Set an intention to meet this element within the dream: 'Tonight I will ask [figure/symbol] what it wants to show me.'",
            "If you become lucid: seek out the figure or allow it to appear. Approach it with openness.",
            "Ask it one question: 'What do you represent?' or 'What do you need?' Then listen — in dream, responses can come as words, images, movements, or feelings.",
            "Upon waking: write what arose immediately. Resist the urge to interpret rationally — allow the symbolic meaning to surface over time.",
        ],
        "intention": "I enter the inner landscape as an explorer, not a controller. What I meet there is part of me.",
        "journal_prompts": [
            "What figure or symbol appeared? Did you engage with it?",
            "What response did it offer — verbal, visual, or felt?",
            "What emotion arose upon waking when you recalled the encounter?",
        ],
    },
    {
        "num": "07",
        "title": "Integration & the Continuing Practice",
        "theme": "Bringing the Dream into the Waking Life",
        "tradition": "All traditions: the dream as mirror and teacher for waking life",
        "intro": (
            "Seven nights. You have crossed the threshold of sleep consciously, developed your dream recall, met the hypnagogic field, worked with paralysis, entered the dream world, and explored its figures. Tonight is not an ending — it is a completion of the foundation, and the opening of a continuing practice. The final night asks a deeper question: what does this practice mean beyond the dream itself?"
        ),
        "what_happens": (
            "Every contemplative tradition that worked with dreams arrived at the same insight: the dream is a mirror. What you discover about your own mind within the dream — its creativity, its fears, its beauty, its shadows — is not separate from who you are in waking life. The quality of awareness you cultivate in lucid dreaming — the ability to recognise that you are inside an experience without being consumed by it — is the same quality that transforms the waking state. This is why the Tibetan masters called dream yoga a preparation for death and for awakening. The dreamer who wakes within the dream is practising the same movement as the meditator who recognises the nature of mind in sitting practice."
        ),
        "practice_title": "The Integration Ceremony",
        "practice": [
            "Before sleep tonight: re-read your full seven nights of journal entries.",
            "Write a brief summary: What shifted? What surprised you? What do you want to continue exploring?",
            "Set a final intention for tonight's dream — not a task, but a quality: 'Tonight I dream with gratitude and openness.'",
            "In the morning: write one insight from the seven nights that you want to carry into your waking life.",
            "This is not the end of the practice. It is the confirmation that the practice has begun.",
        ],
        "intention": "I carry what I have found in the dark into the light of the waking day.",
        "journal_prompts": [
            "What was your most significant dream or experience across the seven nights?",
            "What quality of awareness do you want to cultivate further?",
            "What does it mean to you, personally, that consciousness continues in sleep?",
        ],
    },
]

for night in nights:
    # Night heading strip
    story.append(Paragraph(f"NIGHT {night['num']}", SECTION_LABEL))
    story.append(Paragraph(night["title"], H1))
    story.append(Paragraph(night["theme"], H2))
    story.append(rule())

    # Tradition callout
    t = Table([[Paragraph(f"<i>Rooted in:</i> {night['tradition']}", BODY_ITALIC)]],
              colWidths=[W - 36*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), PANEL),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
        ("LINERIGHT",     (0,0), (0,-1), 2.5, GOLD),
    ]))
    story.append(t)
    story.append(Spacer(1, 6*mm))

    # Intro
    story.append(Paragraph(night["intro"], BODY))
    story.append(Paragraph("What Happens Tonight", H3))
    story.append(Paragraph(night["what_happens"], BODY))

    # Practice box
    story.append(Paragraph(night["practice_title"], H3))
    practice_content = [Paragraph(f"<b>Tonight's Practice</b>", H3)]
    for i, step in enumerate(night["practice"], 1):
        practice_content.append(
            Paragraph(f"<b>{i}.</b>  {step}", BULLET)
        )
    t = Table([[[p for p in practice_content]]], colWidths=[W - 36*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), PANEL),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 14),
        ("RIGHTPADDING",  (0,0), (-1,-1), 14),
        ("BOX",           (0,0), (-1,-1), 0.5, BORDER),
    ]))
    story.append(t)
    story.append(Spacer(1, 5*mm))

    # Intention
    story.append(Paragraph(f"\"{night['intention']}\"", QUOTE))

    # Journal prompts
    story.append(Paragraph("Morning Journal Prompts", H3))
    for jp in night["journal_prompts"]:
        story.append(bullet(jp))

    story.append(PageBreak())

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TRACKING TEMPLATE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
story.append(Paragraph("SEVEN-NIGHT JOURNAL", SECTION_LABEL))
story.append(Paragraph("Your Initiation Record", H1))
story.append(rule())
story.append(Paragraph(
    "Use this template each morning. Write immediately upon waking, before you rise. The dream fades within minutes — your first words capture what later recall cannot.",
    BODY))

headers = ["Night", "WBTB Used?", "Dream Recall (1–5)", "Lucid?", "Key Symbol / Emotion"]
col_widths = [18*mm, 28*mm, 38*mm, 22*mm, (W-36*mm)-18*mm-28*mm-38*mm-22*mm]
header_row = [Paragraph(f"<b>{h}</b>", CAPTION) for h in headers]
rows = [header_row]
for i in range(1, 8):
    rows.append([
        Paragraph(str(i), BODY),
        Paragraph("", BODY),
        Paragraph("", BODY),
        Paragraph("", BODY),
        Paragraph("", BODY),
    ])

log_table = Table(rows, colWidths=col_widths, rowHeights=[12*mm] + [14*mm]*7)
log_table.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,0),  PANEL),
    ("BACKGROUND",    (0,1), (-1,-1), INK),
    ("TEXTCOLOR",     (0,0), (-1,-1), MIST),
    ("GRID",          (0,0), (-1,-1), 0.4, BORDER),
    ("TOPPADDING",    (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING",   (0,0), (-1,-1), 6),
    ("RIGHTPADDING",  (0,0), (-1,-1), 6),
    ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
]))
story.append(log_table)
story.append(Spacer(1, 6*mm))

story.append(Paragraph("After Seven Nights — Reflection", H2))
story.append(Paragraph(
    "Once you have completed the seven nights, return to your journal and answer:", BODY))
for q in [
    "Which night produced the most significant experience? What happened?",
    "What patterns did you notice across the week — in your symbols, emotions, or dream landscapes?",
    "Did you experience any moment of lucidity? What was it like?",
    "What quality of awareness do you most want to deepen in continued practice?",
    "What has this practice revealed about your inner life that your waking mind did not know?",
]:
    story.append(bullet(q))

story.append(PageBreak())

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# WHAT'S NEXT — Course Bridge
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
story.append(Paragraph("BEYOND THE INITIATION", SECTION_LABEL))
story.append(Paragraph("The Path Continues", H1))
story.append(rule())
story.append(Paragraph(
    "Seven nights is an opening. The deeper practice — consistent lucidity, extended dream navigation, shadow integration, and the cultivation of awareness that carries from sleep into waking — takes time, guidance, and community. That is what the WILD Programme is built for.",
    BODY))

story.append(Spacer(1, 4*mm))

tiers = [
    ["TIER 1 — FOUNDATIONS", "£50",
     "The complete seven-module Consciousness Stream course. Builds systematically on what you began here. Covers WILD entry techniques, dream stabilisation, symbol work, shadow integration, and establishing a sustainable nightly practice. Includes the digital dream journal and access to the Consciousness Community."],
    ["TIER 2 — ADVANCED PRACTITIONER", "£100",
     "Deep exploration of extended lucid dream states, intentional dream incubation, astral projection foundations, advanced Tibetan Dream Yoga methods, and working with dream guides. Monthly live workshops with the WILD Programme team. Full community access including weekly ceremonies."],
    ["TIER 3 — MASTER + RETREAT", "£200",
     "The complete mastery path. Includes everything in Tier 2, plus quarterly live workshops, personal guidance sessions, and access to the annual three-day virtual retreat — a deep-immersion experience with a maximum of 30 participants. For serious practitioners."],
]

for t_name, t_price, t_desc in tiers:
    row_data = [
        [Paragraph(t_name, H3), Paragraph(t_price, H2)],
        [Paragraph(t_desc, BODY), Paragraph("", BODY)],
    ]
    t = Table(
        [[Paragraph(f"<b>{t_name}</b>", H3), Paragraph(t_price, H2)],
         [Paragraph(t_desc, BODY), Paragraph("", BODY)]],
        colWidths=[W - 36*mm - 30*mm, 30*mm]
    )
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), PANEL),
        ("BOX",           (0,0), (-1,-1), 0.5, BORDER),
        ("LINEABOVE",     (0,0), (-1,0),  2, HIGHLIGHT),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 14),
        ("RIGHTPADDING",  (0,0), (-1,-1), 14),
        ("SPAN",          (0,1), (-1,1)),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("ALIGN",         (1,0), (1,0),   "RIGHT"),
    ]))
    story.append(t)
    story.append(Spacer(1, 4*mm))

story.append(Spacer(1, 4*mm))
story.append(Paragraph(
    "Begin the course at wildpractice.com",
    QUOTE))

story.append(Spacer(1, 6*mm))

# Glossary
story.append(Paragraph("Glossary of Terms", H2))
glossary = [
    ("WILD", "Wake-Initiated Lucid Dreaming. Maintaining consciousness as the body crosses the threshold into sleep."),
    ("WBTB", "Wake-Back-to-Bed. Waking after 5–6 hours of sleep, remaining awake briefly, then returning to sleep to maximise REM access."),
    ("Hypnagogia", "The perceptual state between waking and sleep. Characterised by visual phosphenes, geometric forms, sounds, and a sense of dissolution of the body boundary."),
    ("Dream Yoga", "The Tibetan Buddhist practice of maintaining awareness throughout all states of consciousness, including sleep and dream."),
    ("Barzakh", "In Sufi tradition, the threshold world — the liminal realm between the waking world and the unseen. The dream state is understood as one expression of this realm."),
    ("Shadow", "In Jungian psychology, the unconscious aspects of the self — qualities, impulses, or memories that have been disowned or suppressed. Often appears symbolically in dreams."),
    ("Lucid Dream", "A dream in which the dreamer is aware that they are dreaming, with varying degrees of cognitive clarity and voluntary control."),
    ("REM Sleep", "Rapid Eye Movement sleep — the phase in which most vivid dreaming occurs, characterised by high brain activity, muscle atonia, and the dreams most accessible to conscious recall."),
]
for term, defn in glossary:
    story.append(Paragraph(f"<b><font color='#C8A96E'>{term}</font></b>  —  {defn}", BODY))

story.append(Spacer(1, 6*mm))
story.append(rule(DIM))
story.append(Paragraph(
    "WILD Programme  |  wildpractice.com  |  Consciousness Stream",
    CAPTION))

# ── Build ──────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=first_page, onLaterPages=later_pages)
print(f"PDF created: {OUT}")
