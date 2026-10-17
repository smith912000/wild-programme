"""Builds the WILD public guides in guides/. Edit the content here, then run from the repo root: python3 guides/build_guides.py ."""
import json, sys, html, re, os

REPO = sys.argv[1]
BASE = "https://smith912000.github.io/wild-programme/"
GB = BASE + "guides/"
DATE = "2026-10-16"
DATE_H = "16 October 2026"

SRC = {
 "saunders": ('Saunders, D. T., Roe, C. A., Smith, G., &amp; Clegg, H. (2016). Lucid dreaming incidence: a quality effects meta-analysis of 50 years of research. <i>Consciousness and Cognition</i>, 43, 197–215.', "https://doi.org/10.1016/j.concog.2016.06.002"),
 "ildis": ('Adventure-Heart, D. J. (2020). Findings from the International Lucid Dream Induction Study. <i>Frontiers in Psychology</i>, 11, 1746.', "https://doi.org/10.3389/fpsyg.2020.01746"),
 "stumbrys": ('Stumbrys, T., Erlacher, D., Schädlich, M., &amp; Schredl, M. (2012). Induction of lucid dreams: a systematic review of evidence. <i>Consciousness and Cognition</i>, 21(3), 1456–1475.', "https://doi.org/10.1016/j.concog.2012.07.003"),
 "vallat": ('Vallat, R., &amp; Ruby, P. M. (2019). Is it a good idea to cultivate lucid dreaming? <i>Frontiers in Psychology</i>, 10, 2585.', "https://doi.org/10.3389/fpsyg.2019.02585"),
 "soffer": ('Soffer-Dudek, N. (2020). Are lucid dreams good for us? Are we asking the right question? A call for caution in lucid dream research. <i>Frontiers in Neuroscience</i>, 13, 1423.', "https://doi.org/10.3389/fnins.2019.01423"),
 "konkoly": ('Konkoly, K. R., Paller, K. A., et al. (2021). Real-time dialogue between experimenters and dreamers during REM sleep. <i>Current Biology</i>. Summary from Northwestern University.', "https://news.northwestern.edu/stories/2021/02/lucid-dreams-ken-paller"),
 "sharpless": ('Sharpless, B. A. (2016). A clinician’s guide to recurrent isolated sleep paralysis. <i>Neuropsychiatric Disease and Treatment</i>, 12, 1761–1767.', "https://doi.org/10.2147/NDT.S100307"),
 "nhs": ('NHS. Sleep paralysis.', "https://www.nhs.uk/conditions/sleep-paralysis/"),
 "denis": ('Denis, D., &amp; Poerio, G. L. (2016). Terror and bliss? Commonalities and distinctions between sleep paralysis, lucid dreaming, and their associations with waking life experiences. <i>Journal of Sleep Research</i>.', "https://doi.org/10.1111/jsr.12441"),
 "ableidinger": ('Ableidinger, S., &amp; Holzinger, B. (2023). Sleep paralysis and lucid dreaming: between waking and dreaming. <i>Journal of Clinical Medicine</i>, 12(10), 3437.', "https://doi.org/10.3390/jcm12103437"),
 "ghibellini": ('Ghibellini, R., &amp; Meier, B. (2020). Hypnagogic states are quite common: evidence from a Swiss population. Conference poster, University of Bern (preliminary results).', "https://boris.unibe.ch/154680/"),
}

MARK = '<svg viewBox="0 0 100 120" aria-hidden="true"><g fill="none" stroke="#8A6FE0" stroke-width="6"><circle cx="50" cy="44" r="34"/><circle cx="50" cy="76" r="34"/></g><line x1="50" y1="51" x2="50" y2="69" stroke="#E9C766" stroke-width="7" stroke-linecap="round"/></svg>'
FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120'%3E%3Crect width='100' height='120' fill='%23050309'/%3E%3Cg fill='none' stroke='%236349B8' stroke-width='3'%3E%3Ccircle cx='50' cy='44' r='34'/%3E%3Ccircle cx='50' cy='76' r='34'/%3E%3C/g%3E%3Cline x1='50' y1='52' x2='50' y2='68' stroke='%23C9A84C' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E"

GUIDES = []  # filled below: dict(slug, title, h1, desc, card, minutes, answer, body, faq, sources)

def strip(t):
    return html.unescape(re.sub(r"<[^>]+>", "", t)).strip()

def page(g):
    url = GB + g["slug"]
    others = [o for o in GUIDES if o["slug"] != g["slug"]]
    graph = [
      {"@type": "Article", "@id": url + "#article", "headline": strip(g["h1"]), "description": g["desc"],
       "datePublished": DATE, "dateModified": DATE, "inLanguage": "en-GB", "mainEntityOfPage": url,
       "image": BASE + "og-image.png",
       "author": {"@type": "Organization", "name": "WILD", "url": BASE},
       "publisher": {"@type": "Organization", "name": "WILD", "url": BASE, "logo": {"@type": "ImageObject", "url": BASE + "og-image.png"}},
       "citation": [SRC[k][1] for k in g["sources"]]},
      {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "WILD", "item": BASE},
        {"@type": "ListItem", "position": 2, "name": "Guides", "item": GB},
        {"@type": "ListItem", "position": 3, "name": strip(g["h1"]), "item": url}]},
    ]
    faq_html = ""
    if g["faq"]:
        graph.append({"@type": "FAQPage", "@id": url + "#faq", "mainEntity": [
          {"@type": "Question", "name": strip(q), "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in g["faq"]]})
        faq_html = '<section id="faq"><h2>Questions people ask</h2>' + "".join(f"<h3>{q}</h3><p>{a}</p>" for q, a in g["faq"]) + "</section>"
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)
    srcs = "".join(f'<li>{SRC[k][0]} <a href="{SRC[k][1]}" rel="noopener">{SRC[k][1].replace("https://", "")}</a></li>' for k in g["sources"])
    more = "".join(f'<li><a href="{o["slug"]}"><b>{o["h1"]}</b><span>{o["card"]}</span></a></li>' for o in others)
    return f"""<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{g["title"]}</title>
<meta name="description" content="{g["desc"]}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:title" content="{g["title"]}">
<meta property="og:description" content="{g["desc"]}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{FAVICON}">
<link href="{BASE}assets/fonts/gf-bdfd8e58f1.css" rel="stylesheet">
<link rel="stylesheet" href="../assets/wild.css">
<link rel="stylesheet" href="guides.css">
<script type="application/ld+json">
{ld}
</script>
</head>
<body>
<a class="skip" href="#main">Skip to the guide</a>
<header class="g-top">
  <a class="g-brand" href="../">{MARK} WILD</a>
  <nav aria-label="Main"><a href="./">Guides</a><a href="../#join">Membership</a></nav>
</header>
<main id="main" class="g-main">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="../">WILD</a> / <a href="./">Guides</a> / <span aria-current="page">{g["crumb"]}</span></nav>
  <article>
    <p class="eyebrow">Guide</p>
    <h1>{g["h1"]}</h1>
    <p class="updated">Updated {DATE_H} · {g["minutes"]} minute read · By WILD</p>
    <p class="answer"><strong>Short answer:</strong> {g["answer"]}</p>
{g["body"]}
{faq_html}
    <p class="note">This guide is for education. It is not medical advice. If you have a sleep disorder or a mental health condition, speak to a GP or a sleep specialist before changing how you sleep.</p>
    <section class="sources"><h2>Sources</h2><ol>{srcs}</ol></section>
  </article>
  <section aria-labelledby="more"><h2 id="more">More guides</h2><ul class="cards">{more}</ul></section>
  <section class="cta" aria-labelledby="cta-h">
    <p class="eyebrow">Practise it with others</p>
    <h2 id="cta-h">WILD is this practice, done together</h2>
    <p>A weekly live call, the Science and Spirit tracks, every course and the WILD OS practice app, in one membership.</p>
    <a class="btn" href="../#join">See membership</a>
    <p class="terms">From £13 a month. It renews every month until you cancel, and you can cancel any time from your Whop account.</p>
    <p class="alt">Not ready? <a href="https://discord.gg/jRzKq6Hb6N" rel="noopener">Start free in the Discord</a>.</p>
  </section>
</main>
<footer class="g-foot"><a href="{BASE}02%20-%20Landing%20Pages/legal.html">Privacy &amp; Terms</a> · <a href="mailto:smith@negotiorum.com">Contact</a><br>© 2026 Negotium Maximus Ltd.</footer>
<script src="../assets/company-footer.js" defer></script>
<script id="wild-consent-js" data-legal="../02%20-%20Landing%20Pages/legal.html" src="../assets/consent.js" defer></script>
</body>
</html>
"""

def index_page():
    url = GB
    items = [{"@type": "ListItem", "position": i + 1, "url": GB + g["slug"], "name": strip(g["h1"])} for i, g in enumerate(GUIDES)]
    graph = [
      {"@type": "CollectionPage", "@id": url + "#page", "name": "Lucid dreaming guides", "url": url, "inLanguage": "en-GB",
       "description": IDX_DESC, "publisher": {"@type": "Organization", "name": "WILD", "url": BASE},
       "mainEntity": {"@type": "ItemList", "itemListElement": items}},
      {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "WILD", "item": BASE},
        {"@type": "ListItem", "position": 2, "name": "Guides", "item": url}]},
    ]
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1)
    cards = "".join(f'<li><a href="{g["slug"]}"><b>{g["h1"]}</b><span>{g["card"]}</span></a></li>' for g in GUIDES)
    srcs = "".join(f'<li>{SRC[k][0]} <a href="{SRC[k][1]}" rel="noopener">{SRC[k][1].replace("https://", "")}</a></li>' for k in ["saunders", "konkoly"])
    return f"""<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lucid Dreaming Guides: WILD, Hypnagogia, Sleep Paralysis | WILD</title>
<meta name="description" content="{IDX_DESC}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:title" content="Lucid dreaming guides | WILD">
<meta property="og:description" content="{IDX_DESC}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{FAVICON}">
<link href="{BASE}assets/fonts/gf-bdfd8e58f1.css" rel="stylesheet">
<link rel="stylesheet" href="../assets/wild.css">
<link rel="stylesheet" href="guides.css">
<script type="application/ld+json">
{ld}
</script>
</head>
<body>
<a class="skip" href="#main">Skip to the guides</a>
<header class="g-top">
  <a class="g-brand" href="../">{MARK} WILD</a>
  <nav aria-label="Main"><a href="./" aria-current="page">Guides</a><a href="../#join">Membership</a></nav>
</header>
<main id="main" class="g-main">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="../">WILD</a> / <span aria-current="page">Guides</span></nav>
  <p class="eyebrow">Guides</p>
  <h1>Lucid dreaming guides</h1>
  <p class="answer"><strong>What is lucid dreaming?</strong> A lucid dream is a dream in which you know you are dreaming while it is happening. About half of people have had at least one, and around a quarter have one most months (Saunders et al., 2016). In sleep labs, lucid dreamers have answered questions with eye movements from inside REM sleep (Konkoly et al., 2021).</p>
  <p>WILD stands for wake-initiated lucid dreaming: staying aware as your body falls asleep, and entering the dream already knowing. These guides cover the method, the states you pass through on the way, and how to do it safely. Each one cites its sources.</p>
  <ul class="cards">{cards}</ul>
  <section class="sources"><h2>Sources</h2><ol>{srcs}</ol></section>
  <section class="cta" aria-labelledby="cta-h">
    <p class="eyebrow">Practise it with others</p>
    <h2 id="cta-h">WILD is this practice, done together</h2>
    <p>A weekly live call, the Science and Spirit tracks, every course and the WILD OS practice app, in one membership.</p>
    <a class="btn" href="../#join">See membership</a>
    <p class="terms">From £13 a month. It renews every month until you cancel, and you can cancel any time from your Whop account.</p>
    <p class="alt">Not ready? <a href="https://discord.gg/jRzKq6Hb6N" rel="noopener">Start free in the Discord</a>.</p>
  </section>
</main>
<footer class="g-foot"><a href="{BASE}02%20-%20Landing%20Pages/legal.html">Privacy &amp; Terms</a> · <a href="mailto:smith@negotiorum.com">Contact</a><br>© 2026 Negotium Maximus Ltd.</footer>
<script src="../assets/company-footer.js" defer></script>
<script id="wild-consent-js" data-legal="../02%20-%20Landing%20Pages/legal.html" src="../assets/consent.js" defer></script>
</body>
</html>
"""

IDX_DESC = "Plain, sourced guides to lucid dreaming: how to do WILD, what hypnagogia is, how sleep paralysis connects to lucid dreams, and whether lucid dreaming is safe."

# ---------------------------------------------------------------- 1. How to do WILD
GUIDES.append(dict(
 slug="how-to-wild.html", crumb="How to do WILD",
 title="How to Do WILD: Wake-Initiated Lucid Dreaming | WILD",
 h1="How to do WILD (wake-initiated lucid dreaming)",
 desc="Step-by-step guide to WILD (wake-initiated lucid dreaming): staying aware as your body falls asleep, what you will feel, common mistakes and the research.",
 card="Step by step: staying aware while your body falls asleep, and what you will feel on the way.",
 minutes=8,
 answer="WILD means entering a lucid dream straight from being awake. You let your body fall asleep while a small part of your mind stays watching, then you step into the dream already knowing it is one. It is easiest after about five hours of sleep, when you wake briefly and go back to bed.",
 body="""
    <h2>What is a wake-initiated lucid dream?</h2>
    <p>Most lucid dreams start inside a dream: something odd happens and you realise you are dreaming. A <strong>wake-initiated lucid dream</strong> starts the other way round. You never lose awareness. You watch the drift into sleep, pass through the images and sensations at the edge of sleep (hypnagogia), and arrive in the dream awake.</p>
    <p>Lucid dreaming itself is common. A meta-analysis of 50 years of surveys found that 55% of people have had at least one lucid dream and 23% have one at least once a month (Saunders et al., 2016). WILD is the deliberate version: you choose the moment instead of waiting for it.</p>

    <h2>When is the best time to try WILD?</h2>
    <p>Try it on the way back to sleep in the early morning, not at bedtime. Dreaming sleep (REM) gets longer as the night goes on, so the body drops into dreams faster after a few hours of sleep. At bedtime most people fall into deep sleep and lose the thread.</p>
    <p>The usual set-up is called <strong>wake back to bed</strong>: sleep for around five hours, wake up, stay up for a short while, then go back to bed with the intention to stay aware.</p>

    <h2>How to do WILD, step by step</h2>
    <ol class="steps">
      <li><strong>Set a gentle alarm.</strong> Go to bed at your normal time and set a quiet alarm for about five hours later.</li>
      <li><strong>Wake up properly, but only a little.</strong> Get out of bed, use the bathroom, read your dream journal or a few lines about lucid dreaming. A few minutes is enough for many people. Keep the lights low.</li>
      <li><strong>Lie down and go still.</strong> Lie in a comfortable position. Many people find lying on the back makes the body sensations stronger, which helps WILD but also makes sleep paralysis more likely (see the sleep paralysis guide).</li>
      <li><strong>Relax the body on purpose.</strong> Move your attention slowly from feet to head, letting each part go heavy. Resist the urge to swallow, scratch or turn over.</li>
      <li><strong>Give the mind a light anchor.</strong> Count breaths, or count and repeat a phrase: “one, I’m dreaming; two, I’m dreaming”. The anchor keeps you awake inside; it should be light enough that sleep can still come.</li>
      <li><strong>Watch the threshold, do not grab it.</strong> Colours, faces, fragments of speech and scenes will appear. Watch them as if from the back of a cinema. If you try to hold an image, you wake up; if you forget you are watching, you fall asleep.</li>
      <li><strong>Let the body sensations pass.</strong> Heaviness, tingling, buzzing, a sense of falling or floating are signs the body is going to sleep. Stay calm and keep watching.</li>
      <li><strong>Step into the scene.</strong> When an image becomes a place you are in, rather than a picture you are seeing, move into it. Some people imagine rolling or floating out of the body.</li>
      <li><strong>Steady the dream.</strong> Look at your hands, rub them together, or touch the ground. Calm, slow attention keeps the dream going.</li>
      <li><strong>Write it down.</strong> When you wake, note what happened, including attempts that did not work. The journal is how you learn your own pattern.</li>
    </ol>

    <h2>What does WILD feel like?</h2>
    <p>Each person is different, but the sequence is usually: a relaxed body, loose thoughts, flashes of image and sound (hypnagogia), then strong body sensations, then a scene that takes you in. The body sensations can include vibration, pressure or a sense that you cannot move. That last one is sleep paralysis. It is harmless, and for WILD it means you are close.</p>

    <h2>Common mistakes</h2>
    <ul>
      <li><strong>Trying at bedtime.</strong> Most attempts at the start of the night end in ordinary sleep.</li>
      <li><strong>Staying up too long.</strong> A long wake period can leave you too alert to drift off.</li>
      <li><strong>Watching too hard.</strong> Effort keeps the mind awake. Aim for interest, not concentration.</li>
      <li><strong>Panicking at the vibrations.</strong> They are the doorway, not a problem.</li>
      <li><strong>Trying every night.</strong> Waking on purpose breaks up sleep. Two or three nights a week is a kinder rhythm.</li>
    </ul>

    <h2>How does WILD compare with other techniques?</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Technique</th><th>How it works</th><th>Evidence</th></tr></thead>
      <tbody>
        <tr><td>WILD</td><td>Stay aware while falling asleep</td><td>Widely practised; not tested on its own in the large induction study below</td></tr>
        <tr><td>MILD</td><td>Rehearse noticing you are dreaming as you fall back asleep</td><td>Lucid dreams on 16.5% of nights in week two (Adventure-Heart, 2020)</td></tr>
        <tr><td>SSILD</td><td>Cycle attention through sight, sound and body sensation</td><td>Lucid dreams on 16.9% of nights in week two (Adventure-Heart, 2020)</td></tr>
        <tr><td>Reality checks</td><td>Ask “am I dreaming?” during the day</td><td>Used as a support with the others</td></tr>
      </tbody>
    </table></div>
    <p>The figures come from the International Lucid Dream Induction Study, where 355 people completed the second week. An earlier systematic review of 35 studies found that no technique yet reliably and consistently produces lucid dreams, and that most studies were small (Stumbrys et al., 2012). Expect practice, not a switch.</p>
""",
 faq=[
  ("Is WILD hard for beginners?", "It is often called the hardest method because it asks you to balance staying aware with falling asleep. Many beginners get there by combining it with wake back to bed and a short, calm wake period."),
  ("How long does it take to learn WILD?", "There is no reliable figure. Some people have a WILD in the first week; others take months. Keeping a dream journal and practising two or three mornings a week works better than forcing it nightly."),
  ("Can WILD cause sleep paralysis?", "WILD passes through the same doorway as sleep paralysis, so you may notice it. Sleep paralysis is harmless and passes within minutes. If episodes frighten you or happen often, read the sleep paralysis guide and speak to a GP."),
  ("What is the difference between WILD and MILD?", "MILD sets an intention to notice you are dreaming later, then lets you fall asleep. WILD keeps you aware the whole way through, so you enter the dream already lucid."),
 ],
 sources=["saunders", "ildis", "stumbrys"],
))

# ---------------------------------------------------------------- 2. Hypnagogia
GUIDES.append(dict(
 slug="hypnagogia.html", crumb="Hypnagogia",
 title="Hypnagogia: The State Between Waking and Sleep | WILD",
 h1="Hypnagogia: the state between waking and sleep",
 desc="What hypnagogia is, what hypnagogic images, sounds and body sensations feel like, how common they are, and how to use the threshold of sleep for lucid dreaming.",
 card="The images, sounds and sensations at the edge of sleep, and how to use them.",
 minutes=6,
 answer="Hypnagogia is the in-between state as you fall asleep, when the mind starts to dream before you have fully gone. It brings brief images, sounds, voices and body sensations. It is normal and common, and it is the doorway WILD uses to enter a lucid dream.",
 body="""
    <h2>What is hypnagogia?</h2>
    <p>Hypnagogia (from Greek words for sleep and leading) is the transition from waking into sleep. Thought loosens, the senses turn inward, and dream material starts to appear while you are still partly aware. The same kind of state on waking up is called hypnopompia.</p>

    <h2>What does hypnagogia feel like?</h2>
    <ul>
      <li><strong>Body sensations:</strong> floating, falling, swaying, heaviness, tingling or a sudden jolt.</li>
      <li><strong>Images:</strong> patterns, faces, landscapes, fragments of scenes, often changing quickly.</li>
      <li><strong>Sounds:</strong> voices saying your name or odd sentences, music, bangs or hums.</li>
      <li><strong>Thoughts:</strong> ideas that make perfect sense at the time and none in the morning.</li>
    </ul>

    <h2>How common is hypnagogia?</h2>
    <p>Very common. In preliminary results from a Swiss survey of 480 people, 76.5% reported hypnagogic experiences. Body sensations were the most frequent (92% of those people), then images (59%) and sounds (35%), and most happened at sleep onset (Ghibellini &amp; Meier, 2020). The study was a conference poster, so treat the exact numbers as early.</p>

    <h2>How do you notice hypnagogia on purpose?</h2>
    <ol class="steps">
      <li><strong>Lie still and relax.</strong> The images rarely show while you are moving or thinking hard.</li>
      <li><strong>Rest your attention on the dark behind your eyelids.</strong> Do not look for anything. Just notice.</li>
      <li><strong>Let images come and go.</strong> Naming or chasing an image tends to wake you up.</li>
      <li><strong>Keep a light anchor.</strong> A slow breath count helps you stay on the line between watching and sleeping.</li>
      <li><strong>Note what you saw when you get up.</strong> Over time, you learn your own sequence.</li>
    </ol>

    <h2>How does hypnagogia lead to a lucid dream?</h2>
    <p>In wake-initiated lucid dreaming, hypnagogia is the corridor. As you watch, the images grow steadier and more three-dimensional until a scene surrounds you. If you are still aware at that point, you are in a lucid dream. The <a href="how-to-wild.html">WILD guide</a> walks through the full method.</p>
    <p>Many contemplative traditions also work with this edge of sleep, for example yoga nidra, which keeps awareness while the body rests. WILD draws on both the science and these older practices.</p>

    <h2>When should you speak to a doctor?</h2>
    <p>Hypnagogic images on their own are normal. Speak to a GP if they come with extreme sleepiness during the day or sudden muscle weakness when you laugh or feel strong emotion, as these can be signs of narcolepsy (Sharpless, 2016). Speak to a GP too if the experiences frighten you or stop you sleeping.</p>
""",
 faq=[
  ("Is hypnagogia normal?", "Yes. Most people have some hypnagogic experience, such as a sense of falling or a brief image, as they fall asleep."),
  ("Is hypnagogia the same as a lucid dream?", "No. Hypnagogia is the transition into sleep. A lucid dream is a full dream in which you know you are dreaming. Hypnagogia can lead into a lucid dream if you stay aware through it."),
  ("Why do I hear voices when falling asleep?", "Hearing voices, your name or short phrases as you drift off is a common hypnagogic experience. If it happens while fully awake, or alongside other worries, speak to a GP."),
 ],
 sources=["ghibellini", "sharpless"],
))

# ---------------------------------------------------------------- 3. Sleep paralysis
GUIDES.append(dict(
 slug="sleep-paralysis-and-lucid-dreaming.html", crumb="Sleep paralysis",
 title="Sleep Paralysis and Lucid Dreaming: What to Do | WILD",
 h1="Sleep paralysis and lucid dreaming",
 desc="What sleep paralysis is, why it happens, what to do during an episode, how to prevent it, and how it connects to lucid dreaming and WILD.",
 card="Why it happens, what to do in an episode, and how it links to lucid dreams.",
 minutes=7,
 answer="Sleep paralysis is when you wake up or fall asleep but cannot move or speak for a short time, often with a sense of a presence or pressure. It is frightening but harmless, and it usually passes within minutes. It happens at the same border as wake-initiated lucid dreams, and some people use it as a way in.",
 body="""
    <h2>What is sleep paralysis?</h2>
    <p>During dreaming sleep (REM), the brain switches off most muscles so you do not act out your dreams. Sleep paralysis is when that switch stays on for a moment while you are awake. You can see and hear, but you cannot move your body or speak. The NHS describes it as scary but harmless, lasting up to several minutes.</p>

    <h2>How common is sleep paralysis?</h2>
    <p>A review of 35 studies with over 36,000 people found that 7.6% of the general population have had at least one episode, rising to 28.3% of students and 31.9% of psychiatric patients. Episodes last from seconds to around 20 minutes, with an average of about six (Sharpless, 2016).</p>

    <h2>What does sleep paralysis feel like?</h2>
    <ul>
      <li>Being awake but unable to move, speak or open your eyes.</li>
      <li>Pressure on the chest or a feeling of being held down.</li>
      <li>Sensing a presence in the room, often with strong fear.</li>
      <li>Vivid sights, sounds or touch that feel real.</li>
    </ul>

    <h2>What should you do during an episode?</h2>
    <ol class="steps">
      <li><strong>Remind yourself what it is.</strong> “This is sleep paralysis. It is harmless and it will pass.”</li>
      <li><strong>Stop fighting it.</strong> Struggling tends to feed the fear. Approaches used in therapy for sleep paralysis teach relaxing during the episode instead (Sharpless, 2016).</li>
      <li><strong>Breathe slowly.</strong> Your breathing still works, even if your chest feels heavy.</li>
      <li><strong>Try a small movement.</strong> Many people find that wiggling a finger or toe, or moving the eyes, helps them wake fully.</li>
      <li><strong>Or let it carry you on.</strong> If you are practising lucid dreaming and you feel calm, you can relax into it and let a dream form (see below).</li>
    </ol>

    <h2>How do you prevent sleep paralysis?</h2>
    <p>The NHS suggests:</p>
    <ul>
      <li>Aim for 7 to 9 hours of sleep a night, with regular bed and wake times.</li>
      <li>Exercise regularly, but not in the hour before bed.</li>
      <li>Avoid large meals, smoking, alcohol and caffeine shortly before bed.</li>
      <li>Avoid sleeping on your back, which can make episodes more likely.</li>
    </ul>

    <h2>How is sleep paralysis connected to lucid dreaming?</h2>
    <p>Both happen at the border between waking and REM sleep. In a survey of 1,928 people, those who had more sleep paralysis also tended to have more lucid dreams. The two were linked most strongly when sleep paralysis involved floating or moving sensations. Sleep paralysis was also linked with poorer sleep, anxiety and stress, and lucid dreaming with vivid imagination (Denis &amp; Poerio, 2016).</p>
    <p>Some lucid dreamers treat sleep paralysis as a doorway: relax, stop trying to move, then imagine floating or rolling out of the body until a dream forms. A recent review describes this approach and notes that it still needs to be tested properly (Ableidinger &amp; Holzinger, 2023). In WILD, the same sensations are a sign that you are close. See the <a href="how-to-wild.html">WILD guide</a>.</p>

    <h2>When should you see a GP?</h2>
    <p>Medical help is not usually needed. See a GP if episodes are frequent, if you feel very anxious or scared to go to sleep, or if you are constantly tired (NHS). Mention it too if you have extreme daytime sleepiness or sudden muscle weakness with strong emotion, which can point to narcolepsy (Sharpless, 2016).</p>
""",
 faq=[
  ("Is sleep paralysis dangerous?", "No. The NHS describes it as scary but harmless. It usually passes within a few minutes."),
  ("Can you turn sleep paralysis into a lucid dream?", "Some people do, by relaxing instead of fighting and imagining floating out of the body. Research describes the method but has not yet tested it properly, so treat it as something to try gently, not a guarantee."),
  ("Why do I see a figure during sleep paralysis?", "Your eyes are open but your brain is still partly dreaming, so dream images can appear over the real room. Sensing a presence is one of the most common parts of sleep paralysis."),
  ("Does sleeping on your back cause sleep paralysis?", "Sleeping on your back is linked to more episodes. The NHS suggests avoiding it if sleep paralysis troubles you."),
 ],
 sources=["nhs", "sharpless", "denis", "ableidinger"],
))

# ---------------------------------------------------------------- 4. Safety
GUIDES.append(dict(
 slug="is-lucid-dreaming-safe.html", crumb="Is lucid dreaming safe?",
 title="Is Lucid Dreaming Safe? Risks, Benefits, Evidence | WILD",
 h1="Is lucid dreaming safe?",
 desc="What the research says about lucid dreaming safety: broken sleep from induction, who should be careful, possible benefits and how to protect your sleep.",
 card="What the research says about risks and benefits, and how to protect your sleep.",
 minutes=6,
 answer="For most people, having lucid dreams appears to be safe. The main concerns researchers raise are about the methods: waking yourself up on purpose can break up your sleep. People prone to dissociation or psychosis are advised to be cautious. Practise a few nights a week, protect your sleep, and stop if it makes you feel worse.",
 body="""
    <h2>What do researchers say about lucid dreaming safety?</h2>
    <p>Lucid dreaming is a natural experience: about half of people have had one (Saunders et al., 2016). Researchers have even held two-way conversations with lucid dreamers during REM sleep, with dreamers answering by eye movements, in four labs across four countries (Konkoly et al., 2021).</p>
    <p>The open questions are about doing it on purpose and often. Two review papers have asked researchers to slow down and look for side effects before recommending lucid dreaming widely (Vallat &amp; Ruby, 2019; Soffer-Dudek, 2020).</p>

    <h2>What are the possible risks?</h2>
    <ul>
      <li><strong>Broken sleep.</strong> Methods that wake you in the night “disturb sleep by increasing its fragmentation” and can shorten it (Vallat &amp; Ruby, 2019). People who induce lucid dreams often report more sleep problems, although it is not clear which causes which (Soffer-Dudek, 2020).</li>
      <li><strong>Dissociation.</strong> In one long-term study, people who deliberately induced lucid dreams showed a rise in dissociative and schizotypal experiences, such as feeling detached from yourself or your surroundings. The author calls this a direction for research, not a proven effect (Soffer-Dudek, 2020).</li>
      <li><strong>Psychosis.</strong> Lucid dream practice may strengthen hallucinations in people with a psychotic illness, so caution is advised for them (Vallat &amp; Ruby, 2019; Soffer-Dudek, 2020).</li>
      <li><strong>Sleep paralysis.</strong> Methods like WILD pass through the state where sleep paralysis happens. It is harmless but can be frightening. See the <a href="sleep-paralysis-and-lucid-dreaming.html">sleep paralysis guide</a>.</li>
      <li><strong>Supplements and devices.</strong> Substances and brain stimulation sold for lucid dreaming raise their own safety questions (Vallat &amp; Ruby, 2019). WILD does not use or recommend them.</li>
    </ul>

    <h2>Who should be careful?</h2>
    <ul>
      <li>People with a psychotic illness, or who often feel detached from themselves or reality.</li>
      <li>People with insomnia, a sleep disorder or a job where tiredness is dangerous, such as driving or shift work.</li>
      <li>Anyone whose sleep or mood gets worse after starting.</li>
    </ul>
    <p>If that is you, speak to a GP before you start.</p>

    <h2>What are the possible benefits?</h2>
    <p>People practise lucid dreaming for the experience itself, for creativity, for rehearsing skills and as a way to face nightmares. The evidence for these benefits is still limited. Vallat and Ruby (2019) point out that some of them, such as rehearsing movements, may also be reached while awake, and that other techniques for nightmares already work well without disturbing sleep. Be wary of anyone promising more than the research shows.</p>

    <h2>How do you practise lucid dreaming safely?</h2>
    <ol class="steps">
      <li><strong>Protect your sleep first.</strong> Keep regular bed and wake times and get enough hours.</li>
      <li><strong>Limit night waking.</strong> Use wake back to bed two or three nights a week, not every night.</li>
      <li><strong>Keep it light.</strong> Curiosity works better than pressure, and a missed night is not a failure.</li>
      <li><strong>Stay grounded by day.</strong> Time outside, people and ordinary routines balance the night practice.</li>
      <li><strong>Stop if it harms you.</strong> If you feel more tired, anxious or detached, pause and speak to a GP.</li>
    </ol>
""",
 faq=[
  ("Can lucid dreaming be dangerous?", "Lucid dreams themselves appear harmless for most people. The concerns are broken sleep from methods that wake you in the night, and possible effects for people prone to dissociation or psychosis."),
  ("Can you get stuck in a lucid dream?", "No. Dreams end when the sleep cycle changes or you wake up. Some people have false awakenings, where they dream of waking up, but these end too."),
  ("Does lucid dreaming affect sleep quality?", "Frequent deliberate induction is linked with poorer sleep, especially with methods that wake you in the night. Practising a few nights a week and keeping regular sleep reduces this."),
  ("Is lucid dreaming good for nightmares?", "It has been suggested as a way to reduce nightmares, but the evidence is limited, and other treatments for nightmares already work well. If nightmares trouble you, speak to a GP."),
 ],
 sources=["saunders", "konkoly", "vallat", "soffer"],
))

os.makedirs(os.path.join(REPO, "guides"), exist_ok=True)
for g in GUIDES:
    open(os.path.join(REPO, "guides", g["slug"]), "w", encoding="utf-8").write(page(g))
open(os.path.join(REPO, "guides", "index.html"), "w", encoding="utf-8").write(index_page())
for g in GUIDES:
    print(g["slug"], len(g["title"]), len(g["desc"]))
print("index", len(IDX_DESC))
