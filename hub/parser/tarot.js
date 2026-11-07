/* The Symbolic Parser: tarot data set and link logic.
   78 cards in the Rider-Waite-Smith pattern (Strength VIII, Justice XI), written in plain words from the
   public-domain tradition: the 1909 pictures and the Golden Dawn astrological attributions. Lineages differ
   (Marseille swaps Strength and Justice; some decks move the signs), and the page says so.
   Nothing here predicts. Each record names what stands on the card and what the tradition has attached to it.
   Exposes window.WILD_TAROT. ES5 on purpose, to match the page. */
(function () {
  var ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
  var NUMWORD = ['', 'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  var NUMTHEME = ['', 'initiation', 'pairing', 'growth', 'structure', 'friction', 'harmony', 'testing', 'movement', 'near completion', 'completion and overload'];
  var NUMBER_KEY = ['the void', 'individual will', 'polarity', 'synthesis', 'order', 'disruption', 'harmony', 'introspection', 'restriction', 'culmination'];

  var SIGNS = {
    Aries: { e: 'Fire', rul: 'Mars', opp: 'Libra' }, Taurus: { e: 'Earth', rul: 'Venus', opp: 'Scorpio' },
    Gemini: { e: 'Air', rul: 'Mercury', opp: 'Sagittarius' }, Cancer: { e: 'Water', rul: 'Moon', opp: 'Capricorn' },
    Leo: { e: 'Fire', rul: 'Sun', opp: 'Aquarius' }, Virgo: { e: 'Earth', rul: 'Mercury', opp: 'Pisces' },
    Libra: { e: 'Air', rul: 'Venus', opp: 'Aries' }, Scorpio: { e: 'Water', rul: 'Mars', opp: 'Taurus' },
    Sagittarius: { e: 'Fire', rul: 'Jupiter', opp: 'Gemini' }, Capricorn: { e: 'Earth', rul: 'Saturn', opp: 'Cancer' },
    Aquarius: { e: 'Air', rul: 'Saturn', opp: 'Leo' }, Pisces: { e: 'Water', rul: 'Jupiter', opp: 'Virgo' }
  };

  var SUITS = {
    wands: { name: 'Wands', e: 'Fire', field: 'will', letter: 'W' },
    cups: { name: 'Cups', e: 'Water', field: 'feeling', letter: 'C' },
    swords: { name: 'Swords', e: 'Air', field: 'thought', letter: 'S' },
    pentacles: { name: 'Pentacles', e: 'Earth', field: 'matter', letter: 'P' }
  };

  /* ---------- Major Arcana ---------- */
  var M = [
    { n: 0, name: 'The Fool', short: 'Fool', elem: 'Air', kw: 'beginnings, trust, spontaneity, risk',
      scene: 'A young traveller steps toward the edge of a cliff under a bright sky. A bundle hangs from a stick over one shoulder, a white rose is held loosely in the other hand, and a small white dog leaps at the heels. Snow peaks stand far behind.',
      sym: [['the cliff edge', 'the step taken before the outcome is known'], ['the white dog', 'instinct that goes along without arguing'], ['the bundle', 'what is carried into a new start, and how little of it there is'], ['the white rose', 'clean intent, held without gripping'], ['the high sun', 'nothing hidden, a clear day to begin on']],
      energy: 'The unnumbered point from which the sequence starts. Potential before form, commitment before knowledge.' },
    { n: 1, name: 'The Magician', short: 'Magician', planet: 'Mercury', kw: 'will, skill, initiative, resources',
      scene: 'A figure in a red robe stands at a table with one arm raised holding a wand and the other pointing to the ground. On the table lie a cup, a sword, a wand and a pentacle. An infinity loop floats over the head; roses and lilies grow below.',
      sym: [['raised and lowered hands', '"as above, so below": the channel between two levels'], ['the four tools on the table', 'all four suits laid out, every element within reach'], ['the infinity loop', 'capacity that does not run out when it is used'], ['roses and lilies', 'desire and purity grown in the same garden']],
      energy: 'Will directed by attention. The moment the tools are named and picked up, with Mercury as the carrier.' },
    { n: 2, name: 'The High Priestess', short: 'Priestess', planet: 'Moon', kw: 'intuition, silence, mystery, inner knowing',
      scene: 'A robed woman sits between a black pillar and a white pillar, a crescent moon at her feet. A veil patterned with pomegranates hangs behind her. A scroll lies half-hidden in her lap, only part of its title showing.',
      sym: [['the two pillars', 'a threshold between opposites, held open'], ['the pomegranate veil', 'fruitfulness kept behind the curtain'], ['the half-hidden scroll', 'knowledge that is held, not handed over'], ['the crescent at her feet', 'the lunar cycle as the ground she sits on']],
      energy: 'Receptive knowing. What is understood before it is said, and the discipline of leaving it unsaid.' },
    { n: 3, name: 'The Empress', short: 'Empress', planet: 'Venus', kw: 'abundance, fertility, nurture, sensuality',
      scene: 'A crowned woman reclines on cushions in a field of ripe wheat, a heart-shaped shield bearing the sign of Venus beside her. A stream runs through the trees behind; her crown holds twelve stars.',
      sym: [['the wheat', 'growth at the point of harvest'], ['the twelve-star crown', 'the zodiac year carried as a diadem'], ['the heart shield with the Venus sign', 'love as the working principle'], ['the stream and woods', 'a world that keeps producing']],
      energy: 'Generative abundance. What grows of itself once conditions are right.' },
    { n: 4, name: 'The Emperor', short: 'Emperor', sign: 'Aries', kw: 'structure, authority, stability, protection',
      scene: 'A bearded ruler sits on a stone throne carved with rams’ heads, armour showing beneath a red robe. An ankh-topped sceptre is in one hand and an orb in the other. Bare mountains rise behind him.',
      sym: [['the ram heads', 'Aries, the first sign, set into the seat of rule'], ['the stone throne', 'authority built to outlast its holder'], ['the armour under the robe', 'order maintained by readiness'], ['the barren mountains', 'a ruled land is a cleared and bounded one']],
      energy: 'Ordered authority. The rule that holds a boundary, and what that costs in softness.' },
    { n: 5, name: 'The Hierophant', short: 'Hierophant', sign: 'Taurus', kw: 'tradition, teaching, conformity, institutions',
      scene: 'A robed figure in a triple crown sits between two grey pillars, one hand raised in blessing. Two tonsured figures kneel before him, and two crossed keys lie at the foot of the dais.',
      sym: [['the triple crown', 'authority over three levels: body, mind and spirit, in one common reading'], ['the crossed keys', 'access that is kept and conferred'], ['the kneeling pair', 'the teaching received in a fixed form'], ['the raised hand', 'blessing as a formal act, not a private one']],
      energy: 'Transmitted teaching. Knowledge passed down by a structure that shapes what is passed.' },
    { n: 6, name: 'The Lovers', short: 'Lovers', sign: 'Gemini', kw: 'union, choice, values, alignment',
      scene: 'A naked man and woman stand beneath an angel with open arms and a bright sun. A tree with a serpent stands behind the woman, a tree of flames behind the man. A mountain rises between them in the distance.',
      sym: [['the angel above', 'the relation witnessed from a higher view'], ['the tree with the serpent', 'knowledge and temptation, the woman’s side'], ['the tree of flames', 'the twelve-fold fire of the senses, the man’s side'], ['the mountain between', 'a peak both are oriented toward']],
      energy: 'Union and choice in one picture. A relation that asks which value is being chosen.' },
    { n: 7, name: 'The Chariot', short: 'Chariot', sign: 'Cancer', kw: 'drive, control, momentum, victory',
      scene: 'An armoured figure under a star-spangled canopy stands in a chariot drawn by two sphinxes, one black and one white. A walled city and a river lie behind. No reins are held.',
      sym: [['the black and white sphinxes', 'opposing forces pulling the same way by the driver’s will alone'], ['the starry canopy', 'authority taken from above'], ['the walled city behind', 'the safe ground being left'], ['no reins', 'steering by intention rather than force']],
      energy: 'Will steering opposing forces. Forward motion that depends on one centre holding.' },
    { n: 8, name: 'Strength', short: 'Strength', sign: 'Leo', kw: 'courage, patience, compassion, fortitude',
      scene: 'A woman in white with an infinity loop over her head gently closes the jaws of a lion. She wears a garland of flowers and a flowered belt; the lion’s tail is lowered. Mountains stand in the distance.',
      sym: [['the infinity loop', 'the same sign as the Magician’s, now worn calmly'], ['the lion’s mouth held shut', 'appetite met by presence, not by blows'], ['the white robe and flowers', 'strength that needs no armour'], ['the lowered tail', 'the animal consents']],
      energy: 'Courage as gentleness. Force held in relation instead of overcome.' },
    { n: 9, name: 'The Hermit', short: 'Hermit', sign: 'Virgo', kw: 'solitude, search, guidance, introspection',
      scene: 'A grey-cloaked old figure stands on a snowy summit holding a staff and a lantern. Inside the lantern is a six-pointed star. Nothing else is in the frame but a grey sky.',
      sym: [['the lantern with the six-pointed star', 'a small light that shows only the next step, and joins the upward and downward triangles'], ['the staff', 'support for a slow climb'], ['the summit', 'withdrawal as ascent'], ['the grey cloak', 'being unremarkable on purpose']],
      energy: 'Withdrawal for the sake of insight. A light carried alone that others can still follow.' },
    { n: 10, name: 'Wheel of Fortune', short: 'Wheel', planet: 'Jupiter', kw: 'cycles, turning points, change, fate',
      scene: 'A large wheel hangs in the sky, marked with the letters T-A-R-O, Hebrew letters and alchemical signs. A sphinx with a sword sits on top, a jackal-headed figure rises on one side and a serpent descends on the other. Four winged creatures read in the corners.',
      sym: [['the wheel', 'recurrence; what rises is also what turns'], ['the sphinx on top', 'the still point above the motion'], ['the rising figure and the falling serpent', 'ascent and descent in a single turn'], ['the four winged creatures', 'bull, lion, eagle and man: the four fixed signs, reading the book of the cycle']],
      energy: 'The turning of a cycle. Change that does not answer to a driver, with Jupiter as its expansive planet.' },
    { n: 11, name: 'Justice', short: 'Justice', sign: 'Libra', kw: 'fairness, cause and effect, accountability, truth',
      scene: 'A crowned figure in a red robe sits between two pillars before a purple curtain, holding an upright sword in the right hand and a pair of scales in the left. A small square clasp fastens the cloak.',
      sym: [['the upright sword', 'a judgement that cuts clean'], ['the scales', 'each side weighed before the cut'], ['the pillars and curtain', 'a courtroom as a framing structure'], ['the square clasp', 'rule applied evenly']],
      energy: 'Weighing, then cutting. Cause and effect made visible and accounted for.' },
    { n: 12, name: 'The Hanged Man', short: 'Hanged Man', elem: 'Water', kw: 'surrender, pause, new perspective, sacrifice',
      scene: 'A man hangs upside down by one foot from a T-shaped living tree, the other leg crossed behind. His hands are tied at his back and his face is calm, with a halo of light around the head.',
      sym: [['the living T-shaped tree', 'a support that is alive, not a gallows'], ['the crossed leg', 'a shape held in suspension, close to the number four'], ['the halo', 'what is seen from the inverted position'], ['the calm face', 'the suspension is accepted']],
      energy: 'Willing suspension. Stopping the usual motion in order to see from the other side.' },
    { n: 13, name: 'Death', short: 'Death', sign: 'Scorpio', kw: 'endings, transformation, release, transition',
      scene: 'A skeleton in black armour rides a white horse and carries a black flag with a white rose. A fallen king lies under the hooves; a bishop, a maiden and a child face the rider. Between two towers in the distance the sun rises over water.',
      sym: [['the white rose on black', 'new life carried on the banner of the end'], ['the fallen king and the facing bishop', 'rank gives no exemption'], ['the child, who looks at the rider', 'the one who meets the change openly'], ['the sun between two towers', 'what is waiting on the far side']],
      energy: 'An ending that clears the ground. Transformation that comes by removal, not addition.' },
    { n: 14, name: 'Temperance', short: 'Temperance', sign: 'Sagittarius', kw: 'balance, blending, patience, integration',
      scene: 'A winged figure stands with one foot in a pool and one on stony ground, pouring liquid between two cups. Irises grow nearby. A path leads up to a glowing crown on the horizon.',
      sym: [['the two cups', 'one substance carried between two vessels without spilling'], ['one foot in water, one on land', 'standing in two realms at once'], ['the irises', 'the rainbow goddess Iris, messenger between levels'], ['the path to the crown', 'the work leads somewhere']],
      energy: 'Blending without loss. Patience that works as a method rather than a mood.' },
    { n: 15, name: 'The Devil', short: 'Devil', sign: 'Capricorn', kw: 'attachment, compulsion, materialism, shadow',
      scene: 'A horned, winged figure with bat-like wings crouches on a black block, an inverted pentagram above and a torch in one hand. A naked man and woman stand chained to the block by loose collars.',
      sym: [['the loose chains', 'the binding can be lifted off; it holds by agreement'], ['the inverted pentagram', 'matter ruling over spirit'], ['the horns and goat form', 'Capricorn’s goat, the appetite in its raw shape'], ['the tails with fire and fruit', 'desire in the pair that stands bound to the block']],
      energy: 'Binding by attachment. What is held onto by the one who is also held.' },
    { n: 16, name: 'The Tower', short: 'Tower', planet: 'Mars', kw: 'upheaval, collapse, revelation, release',
      scene: 'A tall tower on a crag is struck by lightning from a black sky, its crown knocked off. Flames pour from its windows and two figures fall headlong. Yod-shaped sparks drop through the air.',
      sym: [['the lightning', 'truth arriving all at once'], ['the knocked-off crown', 'a claim to the heavens broken'], ['the falling pair', 'the people who built and lived in it'], ['the yod sparks', 'tongues of fire, the same flame given and withheld']],
      energy: 'The sudden collapse of a structure that was not sound. Mars acts, and the ground is cleared.' },
    { n: 17, name: 'The Star', short: 'Star', sign: 'Aquarius', kw: 'hope, renewal, calm, openness',
      scene: 'A naked woman kneels by a pool, pouring water from two jugs, one onto the land and one back into the pool. A large eight-pointed star shines above with seven smaller ones. A bird sits in a tree beyond.',
      sym: [['two jugs', 'giving to the land and returning to the source'], ['the large star and seven small ones', 'one fixed light and the seven classical wanderers'], ['the ibis in the tree', 'Thoth’s bird, record and wisdom'], ['the nakedness', 'nothing held back after the Tower']],
      energy: 'Replenishment. A steady outpouring that follows a collapse and asks for nothing back.' },
    { n: 18, name: 'The Moon', short: 'Moon', sign: 'Pisces', kw: 'illusion, dreams, uncertainty, the subconscious',
      scene: 'A full moon with a human face hangs between two towers. A dog and a wolf howl on a winding path; a crayfish climbs from a pool in the foreground. Drops of light fall from the moon.',
      sym: [['the dog and the wolf', 'the tame and the wild, on the same road'], ['the crayfish from the pool', 'something old rising from the deep'], ['the two towers', 'a gate on the path, between known pillars'], ['the winding path', 'the way goes on, but not in a straight line']],
      energy: 'Uncertain light. Perception filtered through feeling, with the path not yet fully seen.' },
    { n: 19, name: 'The Sun', short: 'Sun', planet: 'Sun', kw: 'vitality, joy, clarity, success',
      scene: 'A bright sun with a face shines over a walled garden of sunflowers. A naked child rides a white horse, holding a red banner, arms spread.',
      sym: [['the child', 'life without defence, in full light'], ['the white horse', 'strength made tame and clear'], ['the sunflowers', 'everything in the garden turned toward the light'], ['the red banner', 'the will, carried lightly']],
      energy: 'Clear vitality. Everything visible and nothing to defend.' },
    { n: 20, name: 'Judgement', short: 'Judgement', elem: 'Fire', kw: 'reckoning, calling, renewal, absolution',
      scene: 'An angel in the clouds blows a trumpet hung with a cross banner. Below, naked figures rise from open coffins, arms raised, over a grey sea with mountains beyond.',
      sym: [['the trumpet', 'a summons that cannot be unheard'], ['the rising figures', 'what was laid down getting up again'], ['the open coffins on the water', 'the past released from its containers'], ['the cross banner', 'the call is made in a known sign']],
      energy: 'A summons and a reckoning. Being called to account and answering.' },
    { n: 21, name: 'The World', short: 'World', planet: 'Saturn', elem: 'Earth', kw: 'completion, wholeness, integration, arrival',
      scene: 'A dancing figure draped in a scarf holds a wand in each hand inside a large laurel wreath bound with red ribbon. At the four corners are an angel, an eagle, a lion and a bull.',
      sym: [['the laurel wreath', 'a closed circuit, victory and boundary together'], ['the two wands', 'the poles held in balance'], ['the four creatures', 'the four fixed signs, the whole zodiac at the corners'], ['the dance', 'completion that is still moving']],
      energy: 'Completion of a round. Saturn’s limit taken as a frame, with Earth as the ground.' }
  ];

  /* ---------- Minor Arcana ---------- */
  var DECAN = { /* Golden Dawn decans: planet and sign for pips 2 to 10 */
    wands: [null, null, ['Mars', 'Aries'], ['Sun', 'Aries'], ['Venus', 'Aries'], ['Saturn', 'Leo'], ['Jupiter', 'Leo'], ['Mars', 'Leo'], ['Mercury', 'Sagittarius'], ['Moon', 'Sagittarius'], ['Saturn', 'Sagittarius']],
    cups: [null, null, ['Venus', 'Cancer'], ['Mercury', 'Cancer'], ['Moon', 'Cancer'], ['Mars', 'Scorpio'], ['Sun', 'Scorpio'], ['Venus', 'Scorpio'], ['Saturn', 'Pisces'], ['Jupiter', 'Pisces'], ['Mars', 'Pisces']],
    swords: [null, null, ['Moon', 'Libra'], ['Saturn', 'Libra'], ['Jupiter', 'Libra'], ['Venus', 'Aquarius'], ['Mercury', 'Aquarius'], ['Moon', 'Aquarius'], ['Jupiter', 'Gemini'], ['Mars', 'Gemini'], ['Sun', 'Gemini']],
    pentacles: [null, null, ['Jupiter', 'Capricorn'], ['Mars', 'Capricorn'], ['Sun', 'Capricorn'], ['Mercury', 'Taurus'], ['Moon', 'Taurus'], ['Saturn', 'Taurus'], ['Sun', 'Virgo'], ['Venus', 'Virgo'], ['Mercury', 'Virgo']]
  };

  var PIPS = {
    wands: [null,
      ['A hand from a cloud grips a budding wand over green hills, with a castle far off.', 'spark, drive, a new venture'],
      ['A robed figure on a battlement holds a small globe in one hand and a wand in the other; a second wand stands fixed beside. The sea lies beyond.', 'planning, choosing a direction, holding the world'],
      ['A figure seen from behind stands on a cliff with three planted wands, looking at ships on a calm sea.', 'foresight, expansion, waiting for returns'],
      ['A garland is slung across four wands; a couple raises flowers and a castle waits beyond.', 'homecoming, celebration, stable ground'],
      ['Five young people swing staves at each other in disarray.', 'friction, competition, contested ground'],
      ['A rider on a horse carries a laurel-wreathed wand through a crowd bearing staves.', 'acclaim, victory, public recognition'],
      ['A figure on high ground fends off six wands rising from below with one.', 'defence, holding position, being contested'],
      ['Eight wands fly through open sky over a river and green land.', 'speed, messages, momentum'],
      ['A bandaged figure leans on a wand before a row of eight upright wands, watching warily.', 'resilience, wariness, the last stand'],
      ['A figure bows under a bundle of ten wands, walking toward a village.', 'burden, overextension, duty carried']],
    cups: [null,
      ['A hand from a cloud holds a cup running over with five streams into a pond of lotus flowers; a dove drops a wafer into the cup.', 'emotional opening, gift, overflow'],
      ['A man and woman exchange cups; above them a winged lion head sits on a caduceus.', 'mutual regard, partnership, exchange'],
      ['Three women in a garden raise their cups among fruit and flowers.', 'friendship, shared celebration'],
      ['A figure sits under a tree with arms folded, three cups before him, while a hand from a cloud offers a fourth.', 'apathy, contemplation, an offer unseen'],
      ['A cloaked figure turns from three spilled cups to look at the ground, while two upright cups stand behind and a bridge crosses a river to a house.', 'loss, regret, what remains'],
      ['In a village square, one child offers another a cup of flowers; six cups stand around them.', 'nostalgia, childhood, gifts'],
      ['A silhouette faces seven cups in clouds, each holding a different thing: a face, a veiled figure, a tower, jewels, a wreath, a serpent, a dragon.', 'imagining, many options, illusion'],
      ['A cloaked figure walks away from a neat stack of eight cups toward the hills under a moon.', 'leaving, searching, withdrawal'],
      ['A well-fed man sits before an arc of nine cups with arms crossed.', 'contentment, wish granted'],
      ['A couple with raised arms stand under a rainbow of ten cups, with two children dancing and a house beyond.', 'harmony, family, fulfilment']],
    swords: [null,
      ['A hand from a cloud grips an upright sword crowned with a wreath, mountains below.', 'clarity, decision, truth'],
      ['A blindfolded woman sits with two crossed swords before a calm sea and a crescent moon.', 'stalemate, avoidance, held balance'],
      ['A heart pierced by three swords under rain clouds.', 'grief, heartbreak, plain pain'],
      ['A knight lies in effigy on a tomb with three swords hung above and one below; a stained-glass window shows a figure.', 'rest, retreat, recovery'],
      ['A figure smiles holding swords, two more lie on the ground, and two walk away under a stormy sky.', 'hollow victory, conflict, loss for gain'],
      ['A boat is poled across water carrying huddled figures and six upright swords toward a calmer shore.', 'passage, transition, leaving trouble'],
      ['A figure tiptoes from a camp carrying five swords, two left standing behind.', 'stealth, evasion, partial gain'],
      ['A bound, blindfolded woman stands among eight swords on marshy ground, a castle in the distance.', 'restriction, felt entrapment'],
      ['A figure sits up in bed with face in hands, nine swords on the wall, under a quilt of roses and astrological signs.', 'anxiety, sleeplessness, dread'],
      ['A figure lies face down with ten swords in the back, under a black sky with a bright dawn on the horizon.', 'finality, rock bottom, an ending reached']],
    pentacles: [null,
      ['A hand from a cloud holds a pentacle over a garden with an arched hedge and lilies, mountains beyond.', 'opportunity, prosperity, a seed of substance'],
      ['A figure dances while juggling two pentacles in an infinity loop, as ships ride high waves behind.', 'juggling, adaptation, balance in motion'],
      ['A craftsman works on a church arch while two figures consult plans.', 'craft, collaboration, skill recognised'],
      ['A crowned figure clutches one pentacle, balances one on the head and holds two under the feet, a city behind.', 'holding on, control, security'],
      ['Two destitute figures struggle through snow past a lit stained-glass window.', 'hardship, exclusion, help overlooked'],
      ['A merchant weighs coins in scales and gives alms to two beggars.', 'giving and receiving, exchange'],
      ['A farmer rests on a hoe, regarding a bush that bears seven pentacles.', 'patience, assessment, slow growth'],
      ['A craftsman carves pentacles at a bench with finished pieces displayed.', 'apprenticeship, diligence, repetition'],
      ['A richly dressed woman stands in a vineyard with a falcon on her gloved hand and a snail at her feet.', 'self-sufficiency, refinement, earned comfort'],
      ['An old man sits under an arch with dogs, a family, and ten pentacles set in a tree-of-life pattern.', 'legacy, inheritance, lineage']]
  };

  var COURTS = {
    wands: [['Page', 'A young figure in a tunic patterned with salamanders holds a sprouting wand in a desert with pyramids.', 'curiosity, a message, a spark of ambition'], ['Knight', 'A rider on a rearing horse in salamander-patterned armour, wand raised.', 'pursuit, energy, haste'], ['Queen', 'A queen on a throne with lions and sunflowers, a black cat at her feet, holding a wand and a sunflower.', 'warmth, confidence, drawing others in'], ['King', 'A king on a throne carved with lions and salamanders, holding a sprouting wand.', 'vision, leadership, command']],
    cups: [['Page', 'A young figure in a flowered tunic stands by the sea, holding a cup from which a fish rises.', 'sensitivity, a gentle message, an intuition surfacing'], ['Knight', 'A rider on a calm white horse, winged helmet, holding a cup outstretched, a river beside.', 'offer, romance, following the feeling'], ['Queen', 'A queen on an ornate throne at the water’s edge, holding a closed, ornate cup.', 'empathy, depth, inner life held'], ['King', 'A king on a throne amid choppy water, a ship and a leaping fish behind, a cup and sceptre in hand.', 'emotional steadiness, counsel, composure']],
    swords: [['Page', 'A young figure on a windy hill holds a sword upright, clouds racing.', 'inquiry, vigilance, a sharp question'], ['Knight', 'A rider charges on a galloping horse through bent trees, sword raised.', 'speed, argument, decisive action'], ['Queen', 'A queen in profile on a throne under clouds, one hand raised, a sword upright in the other.', 'clear sight, honesty, experience of loss'], ['King', 'A king on a throne with butterflies carved on it, a sword upright in his hand, clouds behind.', 'judgement, authority of mind, the law']],
    pentacles: [['Page', 'A young figure stands in a ploughed field, gazing at a pentacle held in both hands.', 'study, patience, a practical start'], ['Knight', 'A rider on a heavy horse that stands still in a ploughed field, holding a pentacle.', 'method, reliability, slow steady work'], ['Queen', 'A queen on a throne carved with fruit and goats, in a blooming garden with a rabbit, cradling a pentacle.', 'nurture, practicality, provision'], ['King', 'A king on a throne carved with bulls, robed in grapes, a castle behind, holding a pentacle and sceptre.', 'security, abundance, steady wealth']]
  };
  var COURT_ELEM = { Page: 'Earth', Knight: 'Air', Queen: 'Water', King: 'Fire' }; /* court rank as an element, Golden Dawn pattern */
  var COURT_N = { Page: 11, Knight: 12, Queen: 13, King: 14 }; /* a convention: courts counted 11 to 14, so their roots are 2, 3, 4, 5 */

  function root(n) { while (n > 9) { n = String(n).split('').reduce(function (a, b) { return a + Number(b); }, 0); } return n; }

  var cards = [], byId = {};
  function add(c) { c.root = root(c.n); cards.push(c); byId[c.id] = c; }

  M.forEach(function (m) {
    var sg = m.sign ? SIGNS[m.sign] : null;
    add({
      id: 'M' + m.n, arcana: 'major', suit: null, n: m.n, numeral: ROMAN[m.n], name: m.name, short: m.short,
      elem: m.elem || null, signElem: sg ? sg.e : null, planet: m.planet || null, sign: m.sign || null,
      kw: m.kw, scene: m.scene, sym: m.sym, energy: m.energy
    });
  });

  Object.keys(SUITS).forEach(function (sk) {
    var s = SUITS[sk];
    for (var i = 1; i <= 10; i++) {
      var d = DECAN[sk][i], p = PIPS[sk][i];
      var nm = NUMWORD[i] + ' of ' + s.name;
      add({
        id: s.letter + i, arcana: 'minor', suit: sk, n: i, numeral: String(i), name: nm, short: i === 1 ? 'Ace' : NUMWORD[i],
        elem: i === 1 ? s.e : null, signElem: i === 1 ? null : s.e, planet: d ? d[0] : null, sign: d ? d[1] : null,
        kw: p[1], scene: p[0], sym: null,
        energy: (i === 1 ? 'The seed of ' : 'The number ' + i + ' as ') + (i === 1 ? s.name + ': ' + NUMTHEME[1] + ' in the field of ' + s.field + '.' : NUMTHEME[i] + ' in the field of ' + s.field + ' (' + s.name + ', ' + s.e + ').')
      });
    }
    COURTS[sk].forEach(function (c) {
      add({
        id: s.letter + c[0][0] + (c[0] === 'Knight' ? 'n' : ''), arcana: 'court', suit: sk, n: COURT_N[c[0]], numeral: c[0], name: c[0] + ' of ' + s.name, short: c[0],
        elem: null, signElem: null, planet: null, sign: null, courtElem: COURT_ELEM[c[0]],
        kw: c[2], scene: c[1], sym: null,
        energy: c[0] + ' of ' + s.name + ': ' + COURT_ELEM[c[0]] + ' of ' + s.e + '.'
      });
    });
  });

  function major(n) { return byId['M' + n]; }
  function pip(suit, n) { return n >= 1 && n <= 10 ? byId[SUITS[suit].letter + n] : null; }

  /* ---------- links ---------- */
  var EL_FRIEND = { 'Fire|Air': 1, 'Air|Fire': 1, 'Water|Earth': 1, 'Earth|Water': 1 };
  var EL_OPPOSE = { 'Fire|Water': 1, 'Water|Fire': 1, 'Air|Earth': 1, 'Earth|Air': 1 };
  function elementRelation(a, b) {
    if (a === b) return 'same';
    if (EL_FRIEND[a + '|' + b]) return 'reinforce';
    if (EL_OPPOSE[a + '|' + b]) return 'oppose';
    return 'cross';
  }
  function cardElement(c) { return c.elem || c.signElem || null; }

  /* ---------- symbolism first ----------
     What a card shows and means comes first: the imagery on it, the themes in its keywords and picture, its number,
     its own element. The zodiac (planet, sign, ruler) is a second, clearly labelled layer, kept for those who want it. */
  var IMAGERY = [
    ['a lion', /\blions?\b/], ['an infinity loop', /infinity/], ['a horse and rider', /\b(horse|rider)\b/], ['pillars', /pillars?|towers?/],
    ['mountains or high ground', /mountain|summit|high ground|cliff|hill/], ['a crown or wreath', /crown|laurel|wreath|garland/],
    ['a crowd of staves', /staves/], ['water, sea or a river', /\b(sea|river|stream|pool|water|ships?|ocean)\b/],
    ['flowers, roses or wheat', /flower|rose|lil(y|ies)|wheat|garden|sunflower/], ['a sun or star', /\bsun\b|stars?\b|sunrise/],
    ['a castle or home', /castle|house|home|city/], ['a pair or couple', /couple|pair|two (figures|people|cups|wands)|man and woman/],
    ['a lantern or flame', /lantern|flame/], ['a throne, armour or shield', /armour|shield|throne|sceptre/]
  ];
  var THEMES = [
    ['courage and endurance', /courage|fortitude|resilien|patience|last stand|persever|endur/],
    ['contest and defence', /friction|competition|contest|defen[cs]e|argument|conflict|holding position|wariness|fend/],
    ['victory and recognition', /victory|acclaim|recogni|celebrat|homecoming|triumph/],
    ['speed and movement', /speed|momentum|haste|pursuit|message|passage|travel|rush/],
    ['order and authority', /structure|authority|stability|protection|control|tradition|institution|order\b|rule\b/],
    ['foresight and inner guidance', /foresight|insight|guidance|search|introspect|solitude|vision|intuition/],
    ['will and initiative', /\bwill\b|initiative|skill|ambition|resources|spark/],
    ['union and choice', /union|choice|alignment|partnership/],
    ['abundance and nurture', /abundan|fertil|nurtur|sensual|prosper|growth|expansion/],
    ['force held gently', /gentl|compassion|tame|mastery|temper/]
  ];
  var motifCache = {};
  function motifs(c) {
    if (motifCache[c.id]) return motifCache[c.id];
    var txt = (c.scene + ' ' + c.kw + ' ' + (c.arcana === 'major' ? c.energy : '') + ' ' + (c.sym ? c.sym.map(function (x) { return x[0] + ' ' + x[1]; }).join(' ') : '')).toLowerCase();
    var pick = function (list) { return list.filter(function (m) { return m[1].test(txt); }).map(function (m) { return m[0]; }); };
    return (motifCache[c.id] = { imagery: pick(IMAGERY), themes: pick(THEMES) });
  }
  function shared(x, y) { return x.filter(function (v) { return y.indexOf(v) > -1; }); }
  function joinWords(l) { return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1]; }

  /* Symbolic reason (number, picture, theme, element, sequence) or null. Strongest first. */
  function symbolicBetween(a, b) {
    if (a.id === b.id) return null;
    var ra = a.root, rb = b.root;
    if (a.arcana !== 'court' && b.arcana !== 'court' && ra === rb && (a.arcana === 'major' || b.arcana === 'major' || a.suit === b.suit)) return { type: 'number', text: a.n === b.n ? 'both are the number ' + a.n : 'both reduce to ' + ra };
    if (a.arcana === 'court' && b.arcana !== 'court' && ra === rb && (b.arcana === 'major' || b.suit === a.suit)) return { type: 'number', text: 'the court counted ' + a.n + ' reduces to ' + ra };
    if (b.arcana === 'court' && a.arcana !== 'court' && ra === rb && (a.arcana === 'major' || a.suit === b.suit)) return { type: 'number', text: 'the court counted ' + b.n + ' reduces to ' + rb };
    var ma = motifs(a), mb = motifs(b), si = shared(ma.imagery, mb.imagery), st = shared(ma.themes, mb.themes);
    if (si.length && st.length) return { type: 'imagery', text: 'both show ' + joinWords(si.slice(0, 2)) + ' and carry ' + joinWords(st.slice(0, 1)), score: si.length + st.length };
    if (st.length) return { type: 'theme', text: 'both carry ' + joinWords(st.slice(0, 2)), score: st.length };
    if (si.length) return { type: 'imagery', text: 'both show ' + joinWords(si.slice(0, 2)), score: si.length };
    if (a.arcana === 'major' && b.arcana === 'major' && Math.abs(a.n - b.n) === 1) return { type: 'sequence', text: 'neighbouring steps on the road of the Major Arcana' };
    if (a.elem && b.elem && a.elem === b.elem) return { type: 'element', text: 'both are ' + a.elem };
    return null;
  }
  /* Astrological reason (planet, sign, ruler, opposition) or null. A separate, optional layer. */
  function astroBetween(a, b) {
    if (a.id === b.id) return null;
    if (a.planet && b.planet && a.planet === b.planet) return { type: 'planet', text: 'both carry ' + a.planet };
    if (a.sign && b.sign && a.sign === b.sign) return { type: 'sign', text: 'both sit in ' + a.sign };
    if (a.planet && b.sign && SIGNS[b.sign].rul === a.planet) return { type: 'rule', text: a.planet + ' rules ' + b.sign };
    if (b.planet && a.sign && SIGNS[a.sign].rul === b.planet) return { type: 'rule', text: b.planet + ' rules ' + a.sign };
    if (a.sign && b.sign && SIGNS[a.sign].opp === b.sign) return { type: 'opposition', text: a.sign + ' and ' + b.sign + ' face each other across the zodiac' };
    return null;
  }
  var ASTRO_TYPES = { planet: 1, sign: 1, rule: 1, opposition: 1 };
  /* One reason two cards belong together, or null: symbolism if there is any, the zodiac only when nothing else joins them. */
  function reasonBetween(a, b) { return symbolicBetween(a, b) || astroBetween(a, b); }
  var PRIORITY = { number: 0, imagery: 1, theme: 2, element: 3, sequence: 4, planet: 5, sign: 5, rule: 5, opposition: 6 };

  /* The cards that share a number, a picture, a theme, an element or (last) a planet or sign with this one.
     Majors, plus the cards of the chosen suit. */
  function related(c, suit, max) {
    var out = [];
    cards.forEach(function (o) {
      if (o.arcana !== 'major' && o.suit !== suit) return;
      var r = reasonBetween(c, o);
      if (r) out.push({ card: o, type: r.type, text: r.text, score: r.score || 0 });
    });
    out.sort(function (a, b) { return PRIORITY[a.type] - PRIORITY[b.type] || b.score - a.score || a.card.n - b.card.n; });
    return max ? out.slice(0, max) : out;
  }

  /* How the card’s own element sits with the suit the reading was made in. */
  function suitLens(c, suit) {
    var s = SUITS[suit], e = cardElement(c);
    if (!e) return null;
    var rel = elementRelation(e, s.e), via = c.elem ? '' : ' (' + c.sign + ')';
    var words = {
      same: 'The card stands in ' + e + via + ', the same element as ' + s.name + '. The two reinforce each other directly.',
      reinforce: 'The card stands in ' + e + via + '; ' + s.name + ' is ' + s.e + '. The two elements feed one another.',
      oppose: 'The card stands in ' + e + via + '; ' + s.name + ' is ' + s.e + '. The two elements oppose, so this card pulls against the suit it is read in.',
      cross: 'The card stands in ' + e + via + '; ' + s.name + ' is ' + s.e + '. The two elements are neither allied nor opposed, and meet at an angle.'
    };
    return { relation: rel, text: words[rel] };
  }

  window.WILD_TAROT = {
    cards: cards, byId: byId, suits: SUITS, signs: SIGNS, numberKey: NUMBER_KEY, roman: ROMAN,
    major: major, pip: pip, root: root, related: related, reasonBetween: reasonBetween, symbolicBetween: symbolicBetween, astroBetween: astroBetween, astroTypes: ASTRO_TYPES, motifs: motifs, suitLens: suitLens,
    cardElement: cardElement, courtN: COURT_N
  };
})();
