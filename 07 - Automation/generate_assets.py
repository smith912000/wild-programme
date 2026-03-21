"""
WILD Programme -- Stability AI Batch Asset Generator
Generates all course graphics, thumbnails, protocol cards, and social assets.

Requirements:
    pip install requests pillow python-dotenv

Usage:
    python generate_assets.py              # generate everything
    python generate_assets.py --tier 1     # tier 1 thumbnails only
    python generate_assets.py --type thumbs
    python generate_assets.py --type social
    python generate_assets.py --type protocol
    python generate_assets.py --type covers
    python generate_assets.py --type diagrams
"""

import requests
import os
import sys
import time
import argparse
from pathlib import Path
from dotenv import load_dotenv

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("Pillow not installed -- images will be generated without text overlays.")
    print("Install with: pip install pillow\n")

# ---------------------------------------------
# CONFIG
# ---------------------------------------------

load_dotenv(Path(__file__).parent / ".env")
API_KEY = os.environ.get("STABILITY_API_KEY")
BASE_URL = "https://api.stability.ai"
ENDPOINT = f"{BASE_URL}/v2beta/stable-image/generate/core"

# Output root
OUT_ROOT = Path(__file__).parent.parent / "08 - Brand Assets"

# Brand palette (for text overlays)
BRAND = {
    "bg":       "#05060F",   # near-black navy
    "accent":   "#4A9EFF",   # electric blue
    "accent2":  "#7B5FFF",   # violet
    "white":    "#F0F4FF",
    "dim":      "#6B7280",
}

# Style per asset type
STYLE = {
    "thumb":    "digital-art",
    "protocol": "cinematic",
    "cover":    "cinematic",
    "social":   "digital-art",
    "diagram":  "digital-art",
}

# Base negative prompt applied to everything
NEG = "blurry, low quality, watermark, text, logo, signature, ugly, deformed, noise, pixelated, overexposed, washed out, bright background, white background, cartoon, childish"

# ---------------------------------------------
# ASSET DEFINITIONS
# ---------------------------------------------

# Each entry: (filename_stem, prompt, aspect_ratio, style_override_or_None, text_overlay_or_None)

THUMBNAILS_TIER1 = [
    ("t1_01_what_is_wild",
     "person lying in bed, eyes closed, ethereal glowing neural pathways emanating from the brain, deep navy background, electric blue light, photorealistic, ultra detailed, cinematic lighting",
     "16:9", None,
     ("What Is WILD?", "T1 -- Lesson 1")),

    ("t1_02_sleep_architecture",
     "scientific visualization of sleep cycles, REM phases shown as glowing sine waves, dark background, neon blue and violet waveforms, EEG readout, ultra detailed technical illustration",
     "16:9", None,
     ("Your Sleep Architecture", "T1 -- Lesson 2")),

    ("t1_03_dream_recall",
     "abstract brain with fragmented dream imagery dissolving into darkness, dark navy background, electric blue memory fragments, photorealistic neural art",
     "16:9", None,
     ("Dream Recall", "T1 -- Lesson 3")),

    ("t1_04_wbtb",
     "dark bedroom, alarm clock glowing 4am, person sitting up in bed with glowing blue neural aura, cinematic lighting, deep shadows",
     "16:9", None,
     ("The WBTB Protocol", "T1 -- Lesson 4")),

    ("t1_05_hypnagogic",
     "hypnagogic phosphene patterns, geometric fractals forming from darkness, electric blue and violet neural firing patterns, transition from dark to dream, ultra detailed",
     "16:9", None,
     ("Hypnagogic Navigation", "T1 -- Lesson 5")),

    ("t1_06_7night_protocol",
     "seven glowing orbs arranged in a timeline on dark background, each representing a night of practice, electric blue to violet gradient progression, cinematic depth of field",
     "16:9", None,
     ("The 7-Night Protocol", "T1 -- Lesson 6")),

    ("t1_07_integration",
     "person meditating, glowing neural connections between sleeping and waking states, split composition dark night to bright day, electric blue energy pathways",
     "16:9", None,
     ("Integration & Next Steps", "T1 -- Lesson 7")),
]

THUMBNAILS_TIER2_BODY = [
    ("t2b_01_sleep_nutrition",
     "dark artistic food science visualization, tryptophan molecular structure glowing electric blue, neural pathway leading from food to sleeping brain, dark background",
     "16:9", None,
     ("The Sleep-Nutrition Axis", "T2 Body -- Lesson 1")),

    ("t2b_02_circadian_eating",
     "circadian clock superimposed over food, dark background, electric blue time rings, brain and digestive system connected by glowing neural pathway, scientific art",
     "16:9", None,
     ("Circadian Eating", "T2 Body -- Lesson 2")),

    ("t2b_03_blood_sugar",
     "glucose molecule glowing, CGM sensor data visualization on dark background, brain activity waves, electric blue data streams, clinical scientific aesthetic",
     "16:9", None,
     ("Blood Sugar & Dream Depth", "T2 Body -- Lesson 3")),

    ("t2b_04_gut_brain",
     "gut-brain axis visualization, glowing blue vagal nerve pathway connecting stomach and brain, dark background, neural network aesthetic, photorealistic scientific art",
     "16:9", None,
     ("The Gut-Brain Axis", "T2 Body -- Lesson 4")),

    ("t2b_05_inflammation",
     "dark background with glowing inflammatory markers being suppressed by neural signals, blue and red contrast, molecular science visualization, cinematic",
     "16:9", None,
     ("Anti-Inflammatory Nutrition", "T2 Body -- Lesson 5")),

    ("t2b_06_exercise_timing",
     "athletic figure surrounded by glowing circadian rhythm rings, sleep architecture waves in background, dark background, electric blue timing markers",
     "16:9", None,
     ("Exercise Timing & Sleep", "T2 Body -- Lesson 6")),

    ("t2b_07_supplements",
     "supplement capsules with molecular structures glowing electric blue and violet, galantamine chemical structure, dark background, pharmaceutical science aesthetic",
     "16:9", None,
     ("Foundational Supplements", "T2 Body -- Lesson 7")),

    ("t2b_08_hrv",
     "HRV waveform visualization on dark background, heart rate variability data streams in electric blue, wearable device glowing, clinical data aesthetic",
     "16:9", None,
     ("HRV & Sleep Tracking", "T2 Body -- Lesson 8")),

    ("t2b_09_integration",
     "body and dream state merge visualization, two overlapping systems becoming one, dark background, electric blue and violet flowing integration, cinematic",
     "16:9", None,
     ("Your Body-Soul Protocol", "T2 -- Integration")),
]

THUMBNAILS_TIER2_SOUL = [
    ("t2s_01_advanced_sleep",
     "precision sleep architecture diagram, multiple REM cycles visualized as glowing neural waves, dark background, ultra detailed scientific visualization",
     "16:9", None,
     ("Advanced Sleep Architecture", "T2 Soul -- Lesson 1")),

    ("t2s_02_ssild",
     "cyclic sensory loop visualization, sight sound touch represented as three interweaving neural pathways, dark background, electric blue",
     "16:9", None,
     ("SSILD -- Cyclic Sensory Method", "T2 Soul -- Lesson 2")),

    ("t2s_03_fild_deild",
     "person lying perfectly still, micro finger movements triggering dream entry, neural activation around fingertips, dark bedroom, electric blue neural art",
     "16:9", None,
     ("FILD & DEILD", "T2 Soul -- Lesson 3")),

    ("t2s_04_supplements",
     "galantamine molecular structure glowing, cholinergic pathway in brain illuminated electric blue, dark background, neuroscience visualization",
     "16:9", None,
     ("Supplement Protocols", "T2 Soul -- Lesson 4")),

    ("t2s_05_entry_methods",
     "six different doorways of light in a dark dreamscape, each a different entry technique, electric blue and violet light, surreal but scientific",
     "16:9", None,
     ("6 Hypnagogic Entry Methods", "T2 Soul -- Lesson 5")),

    ("t2s_06_stabilisation",
     "lucid dream environment crystallizing into stability, hands rubbing together with neural sparks, dark dreamscape becoming vivid, cinematic",
     "16:9", None,
     ("Dream Stabilisation", "T2 Soul -- Lesson 6")),

    ("t2s_07_dream_control",
     "dreamer directing dream environment with outstretched hand, luminous dream architecture shifting, dark background, electric blue intent energy",
     "16:9", None,
     ("Dream Control", "T2 Soul -- Lesson 7")),

    ("t2s_08_sleep_paralysis",
     "sleep paralysis represented as glowing chains dissolving, brain in REM state visible, transformation from fear to awareness, dark cinematic",
     "16:9", None,
     ("Sleep Paralysis Mastery", "T2 Soul -- Lesson 8")),

    ("t2s_09_failure_analysis",
     "data analysis dashboard of dream practice failures, diagnostic charts on dark background, electric blue problem-solution visualization",
     "16:9", None,
     ("Failure Analysis", "T2 Soul -- Lesson 9")),

    ("t2s_10_purposeful_dreaming",
     "dreamer at a creative workstation inside a dream, ideas and solutions flowing as glowing data streams, dark surreal environment",
     "16:9", None,
     ("Purposeful Dreaming", "T2 Soul -- Lesson 10")),

    ("t2s_11_30day_protocol",
     "30-day calendar timeline glowing on dark background, progress arc in electric blue, neural performance chart trending upward",
     "16:9", None,
     ("The 30-Day Protocol", "T2 Soul -- Lesson 11")),

    ("t2s_12_sustainable_practice",
     "long winding neural pathway stretching into distance, consistent practice visualized as recurring wave pattern, dark background, electric blue",
     "16:9", None,
     ("Sustainable Practice", "T2 Soul -- Lesson 12")),
]

THUMBNAILS_TIER3_BODY = [
    ("t3b_01_neuroperformance_nutrition",
     "brain surrounded by precision nutrition compounds, neurotransmitter synthesis pathway glowing, dark background, advanced scientific visualization",
     "16:9", None,
     ("Neuroperformance Nutrition", "T3 Body -- Lesson 1")),

    ("t3b_02_nootropic_cycling",
     "nootropic compounds cycling in orbital pattern around brain, galantamine and alpha-GPC molecular structures glowing, dark background",
     "16:9", None,
     ("Nootropic Cycling", "T3 Body -- Lesson 2")),

    ("t3b_03_hrv_optimisation",
     "heart rate variability waveform achieving coherence, resonance frequency visualization, dark background, electric blue sine wave, biofeedback data",
     "16:9", None,
     ("HRV Optimisation", "T3 Body -- Lesson 3")),

    ("t3b_04_fasting",
     "fasting metabolic state visualization, ketone bodies glowing, sleep architecture waves showing deep SWS enhancement, dark background",
     "16:9", None,
     ("Fasting & Sleep Architecture", "T3 Body -- Lesson 4")),

    ("t3b_05_cold_heat",
     "cold water immersion and sauna split composition, hormetic stress response visualization, noradrenaline molecule glowing, dark cinematic background",
     "16:9", None,
     ("Cold, Heat & Hormetic Stressors", "T3 Body -- Lesson 5")),

    ("t3b_06_circadian_biology",
     "SCN master clock in brain glowing, circadian rhythm 24-hour cycle visualization, melatonin and cortisol waves, dark background, electric blue",
     "16:9", None,
     ("Circadian Biology", "T3 Body -- Lesson 6")),
]

THUMBNAILS_TIER3_MIND = [
    ("t3m_01_breathing",
     "heart and brain connected by glowing breath pathway, HRV coherence waveform, parasympathetic nervous system illuminated, dark background, electric blue",
     "16:9", None,
     ("Breathing -- Body-Mind Bridge", "T3 Mind -- Lesson 1")),

    ("t3m_02_psychology",
     "default mode network glowing in brain, dream psychology visualization, prefrontal cortex illuminated during lucid state, dark background",
     "16:9", None,
     ("Psychology of the Dream State", "T3 Mind -- Lesson 2")),

    ("t3m_03_emotional_regulation",
     "HPA axis cascade visualization, cortisol regulation pathway, nervous system calming from red to electric blue, dark background",
     "16:9", None,
     ("Emotional Regulation", "T3 Mind -- Lesson 3")),

    ("t3m_04_vagal_tone",
     "vagus nerve pathway glowing from brainstem through chest and abdomen, 80 percent afferent fibres visualization, dark background, electric blue",
     "16:9", None,
     ("Vagal Tone & Mind-Body Signal", "T3 Mind -- Lesson 4")),

    ("t3m_05_shadow",
     "shadow self emerging from darkness and being observed with curiosity not fear, dark dreamscape, electric blue awareness light, cinematic",
     "16:9", None,
     ("Shadow Integration", "T3 Mind -- Lesson 5")),

    ("t3m_06_trauma",
     "somatic processing visualization, body holding tension dissolving into calm neural patterns, dark background, therapeutic light",
     "16:9", None,
     ("Trauma & Somatic Processing", "T3 Mind -- Lesson 6")),

    ("t3m_07_metacognition",
     "meta-awareness visualization, mind observing itself, prefrontal cortex and default mode network in dialogue, dark background, electric blue",
     "16:9", None,
     ("Metacognition & Integration", "T3 Mind -- Lesson 7")),
]

THUMBNAILS_TIER3_SOUL = [
    ("t3s_01_third_state",
     "third state between waking and sleeping, gamma oscillation visualization 40hz, anterior prefrontal cortex glowing, dark background, scientific neural art",
     "16:9", None,
     ("The Third State", "T3 Soul -- Lesson 1")),

    ("t3s_02_extended_lucidity",
     "long stable lucid dream environment, attention anchor technique visualization, 90 minute duration indicator, dark dreamscape, electric blue",
     "16:9", None,
     ("Extended Lucidity", "T3 Soul -- Lesson 2")),

    ("t3s_03_dream_architecture",
     "predictive processing model visualized as dream construction, dream environment building from expectation, dark surreal architecture",
     "16:9", None,
     ("Dream Architecture", "T3 Soul -- Lesson 3")),

    ("t3s_04_dream_characters",
     "autonomous dream characters with their own neural signatures, dreamer interacting with complex entities, dark dreamscape",
     "16:9", None,
     ("Dream Characters", "T3 Soul -- Lesson 4")),

    ("t3s_05_dream_control",
     "advanced dream control through indirect technique, dream environment reshaping through expectation not force, dark surreal landscape",
     "16:9", None,
     ("Advanced Dream Control", "T3 Soul -- Lesson 5")),

    ("t3s_06_time_dilation",
     "time dilation in dream state, subjective time expansion visualization, deep state access, dark void with electric blue time waves",
     "16:9", None,
     ("Time Dilation & Deep State", "T3 Soul -- Lesson 6")),

    ("t3s_07_shared_dreaming",
     "two minds in parallel dreamspace, shared consciousness visualization, honest scientific framing, dark background, electric blue connection",
     "16:9", None,
     ("Shared & Mutual Dreaming", "T3 Soul -- Lesson 7")),

    ("t3s_08_somatic_healing",
     "somatic healing in dream state, body awareness in lucid dream, emotional processing visualization, dark therapeutic dreamscape",
     "16:9", None,
     ("Somatic Healing in the Dream", "T3 Soul -- Lesson 8")),

    ("t3s_09_creative",
     "REM creative state visualization, reduced associative inhibition, unusual connections forming as glowing idea web, dark background",
     "16:9", None,
     ("Creative Maximisation", "T3 Soul -- Lesson 9")),

    ("t3s_10_mastery",
     "long practice arc visualization, 1000 nights represented as glowing constellation, mastery as depth not quantity, dark cinematic",
     "16:9", None,
     ("Mastery -- The Long Practice", "T3 Soul -- Lesson 10")),
]

THUMBNAIL_CAPSTONE = [
    ("t3_capstone",
     "three pillars body mind soul unifying into single integrated system, electric blue violet and white light merging, dark background, cinematic epic",
     "16:9", None,
     ("The Complete System", "T3 -- Capstone")),
]

PROTOCOL_CARDS = [
    ("protocol_night1",
     "night one circadian preparation, sleep environment optimization, moonlit bedroom, dark navy background, electric blue circadian clock, protocol card aesthetic",
     "1:1", "cinematic",
     ("Night 1", "Circadian Preparation")),

    ("protocol_night2",
     "night two REM optimization, sleep timing precision, dark background, glowing REM cycle waves, electric blue scientific visualization",
     "1:1", "cinematic",
     ("Night 2", "REM Optimisation")),

    ("protocol_night3",
     "night three hypnagogic entry, geometric phosphene patterns emerging from darkness, transition state visualization, electric blue fractals",
     "1:1", "cinematic",
     ("Night 3", "Hypnagogic Entry")),

    ("protocol_night4",
     "night four deepening transition, WILD threshold approaching, dark void with glowing awareness light, deeper dream state",
     "1:1", "cinematic",
     ("Night 4", "Deepening the Transition")),

    ("protocol_night5",
     "night five sleep paralysis navigation, atonia visualization as protective state not fear, dark background, calm electric blue light",
     "1:1", "cinematic",
     ("Night 5", "Sleep Paralysis Navigation")),

    ("protocol_night6",
     "night six lucidity stabilization, vivid stable dream environment, hands rubbing technique, electric blue stability field, dark dreamscape",
     "1:1", "cinematic",
     ("Night 6", "Lucidity Stabilisation")),

    ("protocol_night7",
     "night seven performance integration, waking and dreaming states connected, insights flowing between states, electric blue neural bridge",
     "1:1", "cinematic",
     ("Night 7", "Performance Integration")),

    ("protocol_overview",
     "seven night WILD protocol overview, seven glowing phases in arc formation, dark background, electric blue to violet gradient, master plan visualization",
     "16:9", "cinematic",
     ("7-Night WILD Protocol", "Master Overview")),
]

COURSE_DIAGRAMS = [
    ("diagram_body_mind_soul",
     "three interlocking circles body mind soul, Venn diagram style, dark background, body in electric blue, mind in violet, soul in white, professional scientific diagram",
     "16:9", "digital-art",
     ("Body · Mind · Soul", "The Three-Pillar System")),

    ("diagram_sleep_architecture",
     "sleep stage architecture diagram, N1 N2 N3 REM cycles visualized, dark background, WILD target window highlighted in electric blue, scientific chart",
     "16:9", "digital-art",
     ("Sleep Architecture", "Understanding Your Cycles")),

    ("diagram_supplement_timing",
     "supplement timing chart on dark background, galantamine timing window highlighted, circadian timeline, electric blue markers, clinical data visualization",
     "16:9", "digital-art",
     ("Supplement Timing", "Protocol Reference Chart")),

    ("diagram_hrv",
     "HRV coherence diagram, low HRV vs high HRV comparison, heart rate variability explained visually, dark background, electric blue waveforms",
     "16:9", "digital-art",
     ("Heart Rate Variability", "Your Readiness Signal")),

    ("diagram_circadian",
     "24 hour circadian timeline, cortisol and melatonin curves, light and dark phases, WILD optimal window marked, dark background, electric blue",
     "16:9", "digital-art",
     ("Circadian Biology", "The Master Timeline")),

    ("diagram_breathing_hrv",
     "coherent breathing resonance at 5.5 breaths per minute, HRV coherence waveform, baroreflex resonance visualization, dark background, electric blue",
     "16:9", "digital-art",
     ("Breathing & HRV Coherence", "5.5 Breaths Per Minute")),
]

TIER_COVERS = [
    ("cover_tier1",
     "tier one soul track, person at threshold of dream, moonlit figure, WILD technique entry, dark cinematic background, electric blue soul energy, premium course cover",
     "16:9", "cinematic",
     ("WILD Foundations", "Tier 1 -- Soul")),

    ("cover_tier2",
     "tier two body and soul tracks, athletic figure with glowing neural dream state above, body optimization meets consciousness, dark premium background, electric blue and violet",
     "16:9", "cinematic",
     ("WILD Advanced", "Tier 2 -- Body + Soul")),

    ("cover_tier3",
     "tier three body mind soul complete system, three pillars of light merging, premium dark background, epic cinematic composition, electric blue violet white",
     "16:9", "cinematic",
     ("WILD Master", "Tier 3 -- Body + Mind + Soul")),
]

SOCIAL_ASSETS = [
    ("social_ig_carousel_bg",
     "dark navy background with subtle electric blue neural network texture, minimal, clean, repeatable slide background for educational content",
     "1:1", "digital-art", None),

    ("social_ig_reel_cover",
     "bold dark background, electric blue light streak, dramatic cinematic frame suitable for Instagram Reel cover, vertical format, premium brand",
     "9:16", "cinematic", None),

    ("social_ig_story_bg",
     "dark navy gradient background, electric blue accent light, clean minimal Instagram Story background, vertical format",
     "9:16", "digital-art", None),

    ("social_yt_thumbnail_template",
     "dark background with dramatic electric blue lighting, space for bold text overlay, cinematic YouTube thumbnail background, high contrast",
     "16:9", "cinematic", None),

    ("social_yt_endscreen",
     "dark background with glowing subscribe button area, YouTube end screen template background, electric blue accent, professional",
     "16:9", "digital-art", None),

    ("social_x_quote_bg",
     "dark navy background with subtle texture, electric blue accent line, clean minimal Twitter X quote card background",
     "16:9", "digital-art", None),

    ("social_reddit_bg",
     "clean dark background suitable for Reddit data visualization post, minimal grid lines in electric blue, professional data aesthetic",
     "16:9", "digital-art", None),

    ("og_image",
     "premium dark background with WILD Protocol branding area, electric blue neural network, 7 night protocol visual, social preview card aesthetic",
     "16:9", "cinematic", None),
]

# ---------------------------------------------
# ALL ASSETS MAP
# ---------------------------------------------

ALL_ASSETS = {
    "thumbs_t1":    (THUMBNAILS_TIER1,      OUT_ROOT / "Thumbnails" / "Tier_1"),
    "thumbs_t2b":   (THUMBNAILS_TIER2_BODY, OUT_ROOT / "Thumbnails" / "Tier_2_Body"),
    "thumbs_t2s":   (THUMBNAILS_TIER2_SOUL, OUT_ROOT / "Thumbnails" / "Tier_2_Soul"),
    "thumbs_t3b":   (THUMBNAILS_TIER3_BODY, OUT_ROOT / "Thumbnails" / "Tier_3_Body"),
    "thumbs_t3m":   (THUMBNAILS_TIER3_MIND, OUT_ROOT / "Thumbnails" / "Tier_3_Mind"),
    "thumbs_t3s":   (THUMBNAILS_TIER3_SOUL, OUT_ROOT / "Thumbnails" / "Tier_3_Soul"),
    "thumbs_cap":   (THUMBNAIL_CAPSTONE,    OUT_ROOT / "Thumbnails" / "Tier_3_Capstone"),
    "protocol":     (PROTOCOL_CARDS,        OUT_ROOT / "Protocol_Cards"),
    "diagrams":     (COURSE_DIAGRAMS,       OUT_ROOT / "Diagrams"),
    "covers":       (TIER_COVERS,           OUT_ROOT / "Tier_Covers"),
    "social":       (SOCIAL_ASSETS,         OUT_ROOT / "Social_Templates"),
}

# ---------------------------------------------
# GENERATION
# ---------------------------------------------

def generate_image(prompt: str, aspect_ratio: str, style_preset: str) -> bytes | None:
    """Call Stability AI Core endpoint. Returns raw PNG bytes or None on failure."""
    for attempt in range(3):
        try:
            resp = requests.post(
                ENDPOINT,
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Accept": "image/*",
                },
                files={"none": ""},
                data={
                    "prompt": prompt,
                    "negative_prompt": NEG,
                    "aspect_ratio": aspect_ratio,
                    "output_format": "png",
                    "style_preset": style_preset,
                },
                timeout=60,
            )
            if resp.status_code == 200:
                return resp.content
            elif resp.status_code == 429:
                wait = 30 * (attempt + 1)
                print(f"    Rate limited -- waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"    API error {resp.status_code}: {resp.text[:200]}")
                return None
        except requests.exceptions.Timeout:
            print(f"    Timeout on attempt {attempt + 1}")
            time.sleep(5)
        except Exception as e:
            print(f"    Exception: {e}")
            return None
    return None


def add_text_overlay(img_bytes: bytes, title: str, subtitle: str, aspect_ratio: str) -> bytes:
    """Add branded text overlay to image using Pillow."""
    if not PIL_AVAILABLE:
        return img_bytes

    from io import BytesIO
    img = Image.open(BytesIO(img_bytes)).convert("RGBA")
    w, h = img.size

    # Dark gradient overlay at bottom
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Gradient from transparent to semi-dark at bottom third
    for i in range(h // 3):
        alpha = int(180 * (i / (h // 3)))
        y = h - (h // 3) + i
        draw.rectangle([(0, y), (w, y + 1)], fill=(5, 6, 15, alpha))

    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Try to use a system font, fall back to default
    font_large = font_small = None
    font_paths = [
        "C:/Windows/Fonts/SegoeUI-Bold.ttf",
        "C:/Windows/Fonts/Arial Bold.ttf",
        "C:/Windows/Fonts/calibrib.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for fp in font_paths:
        if Path(fp).exists():
            try:
                size_large = max(24, w // 25)
                size_small = max(16, w // 40)
                font_large = ImageFont.truetype(fp, size_large)
                font_small = ImageFont.truetype(fp, size_small)
                break
            except Exception:
                continue

    accent = (74, 158, 255, 255)   # electric blue
    white  = (240, 244, 255, 255)

    # Subtitle (smaller, accent colour, above title)
    sub_y = h - h // 7
    draw.text((w // 20, sub_y - (h // 18)), subtitle.upper(),
              font=font_small, fill=accent)

    # Title (large, white)
    draw.text((w // 20, sub_y - (h // 18) + (h // 22)), title,
              font=font_large, fill=white)

    out = BytesIO()
    img.convert("RGB").save(out, format="PNG")
    return out.getvalue()


def process_group(assets: list, output_dir: Path, label: str):
    """Generate and save a group of assets."""
    output_dir.mkdir(parents=True, exist_ok=True)
    total = len(assets)

    for i, entry in enumerate(assets, 1):
        stem, prompt, aspect, style_override, text = entry
        style = style_override if style_override else STYLE.get(
            "thumb" if "thumb" not in str(output_dir) else "thumb",
            "digital-art"
        )

        out_path = output_dir / f"{stem}.png"

        if out_path.exists():
            print(f"  [{i}/{total}] SKIP (exists): {out_path.name}")
            continue

        print(f"  [{i}/{total}] Generating: {stem}  ({aspect}, {style})")
        img_bytes = generate_image(prompt, aspect, style)

        if img_bytes:
            if text and PIL_AVAILABLE:
                img_bytes = add_text_overlay(img_bytes, text[0], text[1], aspect)
            out_path.write_bytes(img_bytes)
            print(f"           Saved -> {out_path.name}")
        else:
            print(f"           FAILED -- skipping")

        time.sleep(1.2)  # polite rate limiting


# ---------------------------------------------
# CLI
# ---------------------------------------------

def main():
    if not API_KEY:
        print("ERROR: STABILITY_API_KEY not found in .env file.")
        sys.exit(1)

    parser = argparse.ArgumentParser(description="WILD Programme Asset Generator")
    parser.add_argument("--type", choices=["thumbs", "protocol", "diagrams", "covers", "social", "all"],
                        default="all", help="Asset type to generate")
    parser.add_argument("--tier", choices=["1", "2", "3"], help="Thumbnail tier only (use with --type thumbs)")
    args = parser.parse_args()

    print(f"\n{'=' * 55}")
    print("  WILD Programme -- Asset Generator")
    print(f"  Output: {OUT_ROOT}")
    print(f"{'=' * 55}\n")

    groups_to_run = []

    if args.type in ("thumbs", "all"):
        if args.tier == "1" or not args.tier:
            groups_to_run.append(("Thumbnails -- Tier 1 Soul",      ALL_ASSETS["thumbs_t1"]))
        if args.tier == "2" or not args.tier:
            groups_to_run.append(("Thumbnails -- Tier 2 Body",      ALL_ASSETS["thumbs_t2b"]))
            groups_to_run.append(("Thumbnails -- Tier 2 Soul",      ALL_ASSETS["thumbs_t2s"]))
        if args.tier == "3" or not args.tier:
            groups_to_run.append(("Thumbnails -- Tier 3 Body",      ALL_ASSETS["thumbs_t3b"]))
            groups_to_run.append(("Thumbnails -- Tier 3 Mind",      ALL_ASSETS["thumbs_t3m"]))
            groups_to_run.append(("Thumbnails -- Tier 3 Soul",      ALL_ASSETS["thumbs_t3s"]))
            groups_to_run.append(("Thumbnails -- Tier 3 Capstone",  ALL_ASSETS["thumbs_cap"]))

    if args.type in ("protocol", "all"):
        groups_to_run.append(("Protocol Cards",                    ALL_ASSETS["protocol"]))

    if args.type in ("diagrams", "all"):
        groups_to_run.append(("Course Diagrams",                   ALL_ASSETS["diagrams"]))

    if args.type in ("covers", "all"):
        groups_to_run.append(("Tier Cover Images",                 ALL_ASSETS["covers"]))

    if args.type in ("social", "all"):
        groups_to_run.append(("Social Media Templates",            ALL_ASSETS["social"]))

    total_assets = sum(len(g[1][0]) for g in groups_to_run)
    print(f"  Generating {total_assets} assets across {len(groups_to_run)} groups\n")

    for label, (assets, out_dir) in groups_to_run:
        print(f"\n-- {label} ({len(assets)} assets) --")
        process_group(assets, out_dir, label)

    print(f"\n{'=' * 55}")
    print("  DONE. All assets saved to 08 - Brand Assets/")
    print(f"{'=' * 55}\n")


if __name__ == "__main__":
    main()
