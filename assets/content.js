/* ==========================================================================
   content.js — every string on the page, in Dutch and English.
   L(nl, en) pairs the two. Edit the copy here; app.js only renders it.
   Inside body text, {{key}} is substituted by app.js:
     {{tbd:label}}  -> orange "still to fill in" chip, also listed in the register
     {{n:path}}     -> a formatted number from SNAP (e.g. {{n:m32.gpus}})
     {{a:id}}       -> a link from LINKS below
   ========================================================================== */

const L = (nl, en) => ({ nl, en });

const LINKS = {
  oellm:      { href: "https://openeurollm.eu/", label: L("OpenEuroLLM", "OpenEuroLLM") },
  catalogue:  { href: "https://github.com/OpenEuroLLM/training-data-catalogue", label: L("de open datacatalogus", "the open training-data catalogue") },
  hf:         { href: "https://huggingface.co/openeurollm", label: L("Hugging Face", "Hugging Face") },
  prelude:    { href: "https://huggingface.co/openeurollm/prelude", label: L("openeurollm/prelude", "openeurollm/prelude") },
  autoexp:    { href: "https://github.com/OpenEuroLLM/oellm-autoexp", label: L("de pretraining-code", "the pretraining code") },
  evalrepo:   { href: "https://github.com/OpenEuroLLM/oellm-eval", label: L("oellm-eval", "oellm-eval") },
  posttrain:  { href: "https://github.com/OpenEuroLLM/post-training", label: L("post-training", "post-training") },
  blog:       { href: "https://openeurollm.eu/blog/first-year-progress-and-next-steps", label: L("het jaarverslag", "the first-year report") },
  jupiter:    { href: "https://www.fz-juelich.de/en/ias/jsc/jupiter", label: L("JUPITER", "JUPITER") },
  leonardo:   { href: "https://leonardo-supercomputer.cineca.eu/", label: L("Leonardo", "Leonardo") },
  eurohpc:    { href: "https://www.eurohpc-ju.europa.eu/", label: L("EuroHPC", "EuroHPC") },
  surf:       { href: "https://www.surf.nl/", label: L("SURF", "SURF") },
  megatron:   { href: "https://github.com/NVIDIA/Megatron-LM", label: L("Megatron-LM", "Megatron-LM") },
  tokrepo:    { href: "https://huggingface.co/openeurollm/tokenizer-256k-v2", label: L("tokenizer-256k-v2", "tokenizer-256k-v2") },
};

const C = {
project: {
  title: L("Training OpenEuroLLM", "Training OpenEuroLLM"),
  subtitle: L("Een kijkje achter de schermen bij het trainen van taalmodellen op Europese supercomputers.", "Inside the training of language models on European supercomputers."),
  context: L("In dit project", "In this project"),
  role: L("Werk in het project", "Work in the project"),
  explain: L("Hoe dit werkt", "How this works"),
  evidence: L("Uit de run", "From the run"),
  observations: L("Vanuit het project", "From the project"),
  // Add actual author observations here; only explicitly approved entries render.
  notes: [],
  entries: {
    1: L("De bronvolumes van onze trainingsdata zijn hier nog niet beschikbaar. De datakeuzes horen bij het project, ook wanneer de grote trainingsrun al draait.", "Source volumes for our training data are not available here yet. Data decisions are part of the project even while the large training run is underway."),
    2: L("De filterverhoudingen hieronder zijn voorbeelden. Ze zijn nog geen meting van onze datapipeline.", "The filtering proportions below are examples. They are not yet measurements from our data pipeline."),
    3: L("De voorbeeldzinnen hieronder zijn verwerkt met de echte OpenEuroLLM-tokenizer: SentencePiece met 262.144 tokens in de woordenlijst.", "The example sentences below were processed with the actual OpenEuroLLM tokenizer: SentencePiece with a vocabulary of 262,144 tokens."),
    4: L("De 32B-run heeft een trainingsbudget van ongeveer 15 biljoen tokens. De precieze verhoudingen tussen talen en bronnen zijn hier nog niet beschikbaar.", "The 32B run has a training budget of approximately 15 trillion tokens. Exact proportions of languages and sources are not available here yet."),
    5: L("Ons model heeft 32B parameters en 64 lagen. De architectuur bepaalt hoe het model tekst verwerkt; het trainingsrecept bepaalt hoe we de parameters bijstellen.", "Our model has 32B parameters and 64 layers. The architecture determines how it processes text; the training recipe determines how we update its parameters."),
    6: L("De 32B wordt getraind op JUPITER. De cijfers hieronder komen uit een gemeten momentopname; de illustraties leggen uit wat er tijdens een stap gebeurt.", "The 32B is training on JUPITER. The figures below come from a measured snapshot; the illustrations explain what happens during a step."),
    7: L("Deze run gebruikt 512 knooppunten met elk vier NVIDIA GH200-GPU's. Het model en de batches worden over die hardware verdeeld.", "This run uses 512 nodes with four NVIDIA GH200 GPUs each. The model and batches are distributed across that hardware."),
    8: L("De gemeten run bewaart zijn toestand in checkpoints. Het ingestelde interval is 2.000 stappen; de opslaggroottes hieronder zijn ramingen.", "The measured run saves its state in checkpoints. The configured interval is 2,000 steps; the storage sizes below are estimates."),
    9: L("Ons 9B-model op Leonardo wacht op annealing. Het geplande budget voor die fase is 300 miljard tokens. Er is nog geen voortgangsmeting van die fase op deze pagina.", "Our 9B model on Leonardo is awaiting annealing. The planned budget for that phase is 300 billion tokens. No progress measurement for that phase is available on this page yet."),
    10: L("Voor beide modellen is na pretraining instructietraining voorzien. Een actuele status van die fase is hier nog niet beschikbaar.", "Instruction tuning is planned after pretraining for both models. A current status for that phase is not available here yet."),
    11: L("Evaluatie ondersteunt het project tijdens en na training. Gemeten scores van deze modellen zijn hier nog niet beschikbaar; lege velden zijn geen nulscore.", "Evaluation supports the project during and after training. Measured scores for these models are not available here yet; empty fields are not zero scores."),
  },
  roles: {
    data: L("Dit onderdeel omvat de dataverwerking voor onze modellen.", "This part covers the data processing for our models."),
    design: L("Dit onderdeel omvat scaling laws en de experimenten rond het opschalen van training.", "This part covers scaling laws and the experiments around scaling up training."),
    run: L("Dit onderdeel omvat het draaien en bewaken van deze training op Europese HPC-systemen.", "This part covers running and monitoring this training on European HPC systems."),
  },
},
opening: {
  byline: L("Binnen OpenEuroLLM worden taalmodellen getraind op Europese supercomputers: van data verwerken en schaalexperimenten tot het bewaken van de training.", "Within OpenEuroLLM, language models are trained on European supercomputers: from processing data and scaling experiments to monitoring training."),
  loop: L("Wat gebeurt er in een trainingsstap?", "What happens in a training step?"),
  loopIntro: L("Het model voorspelt het volgende stukje tekst. De oorspronkelijke tekst levert het antwoord waarmee we die voorspelling vergelijken.", "The model predicts the next piece of text. The original text provides the answer to compare that prediction with."),
  realTokens: L("Uit de echte tokenizer", "From the actual tokenizer"),
  update: L("Voorspellen → fout berekenen → parameters aanpassen → volgende batch", "Predict → calculate error → update parameters → next batch"),
  scale: L("De 32B-run verwerkt 16,8 miljoen tokens per stap op 2.048 GPU's. Een gemeten stap duurde ongeveer 5,8 seconden.", "The 32B run processes 16.8 million tokens per step on 2,048 GPUs. A measured step took about 5.8 seconds."),
  deeper: L("De trainingsstap van dichtbij", "Inside the training step"),
  overview: L("Alles rondom die ene stap", "Everything around that one step"),
  workContext: L("Werk achter de training", "The work behind training"),
  measuredNow: L("recent gemeten", "recently measured"),
  stages: [
    { title: L("Tekst", "Text"), body: L("De tokenizer verdeelt deze zin in 13 tokens: woorden, woorddelen, cijfers en leestekens. Deze verdeling komt uit onze tokenizer.", "The tokenizer splits this sentence into 13 tokens: words, word fragments, digits and punctuation. This split comes from our tokenizer.") },
    { title: L("Voorspelling", "Prediction"), body: L("Na 'De Afsluitdijk is 32' krijgt elk mogelijk volgend token een kans. Dit zijn voorbeeldkansen, geen meting uit een checkpoint.", "After 'De Afsluitdijk is 32', each possible next token gets a probability. These are example probabilities, not measurements from a checkpoint.") },
    { title: L("Fout", "Error"), body: L("In de tekst volgt 'kilometer'. Hoe minder kans het model daaraan gaf, hoe groter de fout. Fouten over de batch vormen samen de loss. Die meet voorspelfouten, geen feitelijke juistheid.", "The text continues with 'kilometer'. The less probability the model gave it, the greater the error. Errors across the batch form the loss. This measures prediction error, not factual correctness.") },
    { title: L("Aanpassing", "Update"), body: L("We berekenen hoe de parameters bijdragen aan de fout en passen ze een beetje aan. Daarna volgt nieuwe tekst. Dit herhalen we honderdduizenden keren; niet iedere stap heeft een lagere loss.", "We calculate how parameters contribute to the error and adjust them slightly. Then comes new text. We repeat this hundreds of thousands of times; loss does not decrease at every step.") },
  ],
  work: {
    data: L("Bronnen moeten worden gecontroleerd, opgeschoond, ontdubbeld en gemengd. Filters kunnen ook bruikbare tekst verwijderen. Daarom onderzoeken we wat die keuzes betekenen voor verschillende talen en taken.", "Sources need checking, cleaning, deduplication and mixing. Filters can also remove useful text. We investigate what those choices mean for different languages and tasks."),
    beslissen: L("Kleine trainingsruns helpen om de relatie tussen modelgrootte, data en rekenbudget te onderzoeken. Scaling laws helpen die resultaten te extrapoleren. De voorspelling blijft onzeker; de keuze moet ook passen op de beschikbare hardware.", "Small training runs help explore the relationship between model size, data and compute. Scaling laws help extrapolate those results. Predictions remain uncertain; the choice also needs to fit the available hardware."),
    bewaken: L("Draait de job nog? Verandert de staptijd? Hoe ontwikkelt de loss zich? Is er genoeg opslag? Monitoring helpt om afwijkingen te onderzoeken en te besluiten wanneer ingrijpen nodig is.", "Is the job running? Has step time changed? How is loss developing? Is there enough storage? Monitoring helps investigate changes and decide when to intervene."),
    ingrijpen: L("Bij een storing onderzoeken we hoe de training kan hervatten. Een checkpoint bewaart de trainingstoestand. Werk na dat checkpoint moet mogelijk opnieuw. De simulaties hieronder zijn voorbeelden, geen incidentlog van deze run.", "When a fault occurs, we investigate how training can resume. A checkpoint saves the training state. Work since that checkpoint may need repeating. The simulations below are examples, not an incident log from this run."),
  },
},

/* ------------------------------------------------------------------- ui -- */
ui: {
  title:    L("Achter de schermen van LLM-pretraining", "Behind the scenes of LLM pretraining"),
  nav: {
    top:    L("Boven", "Top"),
    map:    L("Overzicht", "Overview"),
    data:   L("Data", "Data"),
    train:  L("Pretraining", "Pretraining"),
    finish: L("Afronding", "Finishing"),
    fail:   L("Wat misgaat", "What breaks"),
    day:    L("Een dag", "A day"),
    more:   L("Verder lezen", "Further reading"),
    failSub:L("storingen, ingrijpen, de simulatie", "faults, intervening, the simulation"),
    daySub: L("03:12 tot 22:47", "03:12 to 22:47"),
    openSub:L("wat nog ontbreekt + bronnen", "what is missing + sources"),
  },
  close:    L("Dichtvouwen", "Fold up"),
  openStep: L("Open stap", "Open step"),
  theWork:  L("Het werk", "The work"),
  ofWeek:   L("van een gemiddelde week", "of an average week"),
  seeSteps: L("Speelt bij stap", "Involves step"),
  prev:     L("Vorige", "Previous"),
  next:     L("Volgende", "Next"),
  reset:    L("Terug naar de echte waarden", "Back to the real values"),
  youChanged: L("aangepast", "changed"),
  theme:    L("Thema", "Theme"),
  lang:     L("Taal", "Language"),
  skip:     L("Naar de inhoud", "Skip to content"),
  measured: L("gemeten", "measured"),
  schematic:L("schematisch", "schematic"),
  illustr:  L("illustratief", "illustrative"),
  tbdShort: L("in te vullen", "to fill in"),
  tbdHint:  L("Dit cijfer is nog niet ingevuld.", "This figure has not been filled in yet."),
  tableView:L("Bekijk als tabel", "View as table"),
  techMore: L("Technische details", "Technical detail"),
  of:       L("van", "of"),
  step:     L("stap", "step"),
  tokens:   L("tokens", "tokens"),
},

/* ----------------------------------------------------------------- hero -- */
hero: {
  eyebrow: L("OpenEuroLLM \u00b7 pretraining", "OpenEuroLLM \u00b7 pretraining"),
  h1:      L("Training OpenEuroLLM", "Training OpenEuroLLM"),
  lede:    L("Van de eerste tekst tot maanden rekenen. Een kijkje in de training van onze 9B- en 32B-modellen.",
             "From the first text to months of computation. Inside the training of our 9B and 32B models."),
  meta:    L("Gemaakt door iemand die deze runs draait. Cijfers komen uit de echte logbestanden of zijn gemarkeerd als schatting.",
             "Made by someone who runs these jobs. Figures come from the real log files or are marked as estimates."),
  tickerNow:  L("stap", "step"),
  tickerEst:  L("geschat vanaf de laatste momentopname", "extrapolated from the last snapshot"),
  tickerStale:L("laatste momentopname", "last snapshot"),
  ago:        L("geleden", "ago"),
},

/* ------------------------------------------------------------- the steps -- */
steps: [
/* 1 */ {
  id: 1, phase: "data", at: [],
  title: L("Tekst verzamelen", "Gathering text"),
  lede:  L("Een model van deze omvang ziet ongeveer vijftien biljoen tokens. Dat is meer tekst dan een mens in duizend levens zou kunnen lezen.",
           "A model this size sees roughly fifteen trillion tokens. That is more text than a person could read in a thousand lifetimes."),
  body: L(
    "<p>Die tekst komt uit webcrawls, codebestanden, wetenschappelijke publicaties, boeken uit het publieke domein, encyclopedieën en officiële publicaties van overheden en de EU. Niets daarvan is kant-en-klaar: elke bron heeft een eigen formaat, een eigen licentie en een eigen soort rommel.</p>" +
    "<p>Voor {{a:oellm}} komen daar twee eisen bij die het werk fundamenteel veranderen. Ten eerste moet alles openbaar te documenteren zijn — welke tekst erin zit, staat in {{a:catalogue}}. Ten tweede moet het model álle officiële EU-talen bedienen. En daar begint het probleem: voor Engels is er te veel tekst, voor Nederlands net genoeg, en voor Maltees, Iers of Ests bestaat er domweg niet genoeg openbare tekst om een model mee te trainen. Een deel van de oplossing is synthetische data: tekst die door een ander model is vertaald of gegenereerd, met alle risico's van dien.</p>",
    "<p>That text comes from web crawls, code repositories, scientific publications, public-domain books, encyclopedias and official government and EU publications. None of it is ready to use: every source has its own format, its own licence and its own kind of mess.</p>" +
    "<p>For {{a:oellm}} two extra requirements change the work fundamentally. First, everything has to be publicly documentable — what text went in is recorded in {{a:catalogue}}. Second, the model has to serve every official EU language. And that is where the problem starts: for English there is too much text, for Dutch just about enough, and for Maltese, Irish or Estonian there simply is not enough public text in existence to train on. Part of the answer is synthetic data: text translated or generated by another model, with all the risks that carries.</p>"),
  tech: L(
    "<p>De datasets staan read-only gemount op de EuroHPC-systemen zelf (LUMI, Leonardo, MareNostrum), zodat ze niet per project gekopieerd hoeven te worden. Voor het webdeel wordt <code>MixtureVitae</code> gebruikt, een permissief gelicentieerde dataset die in benchmarks gelijk opgaat met of beter presteert dan niet-permissieve datasets zoals FineWeb-Edu en DCLM. Voor ondervertegenwoordigde talen wordt synthetische data bijgemengd (MT-Nemotron-CC).</p>",
    "<p>The datasets sit read-only, mounted on the EuroHPC systems themselves (LUMI, Leonardo, MareNostrum), so they do not have to be copied per project. For the web portion <code>MixtureVitae</code> is used, a permissively licensed dataset that matches or beats non-permissive datasets such as FineWeb-Edu and DCLM on benchmarks. For under-represented languages, synthetic data is mixed in (MT-Nemotron-CC).</p>"),
},
/* 2 */ {
  id: 2, phase: "data", at: [],
  title: L("Filteren en ontdubbelen", "Filtering and deduplicating"),
  lede:  L("Het grootste deel van wat je verzamelt gooi je weer weg. Dat weggooien is geen bijzaak — het is een van de belangrijkste keuzes in het hele traject.",
           "Most of what you gather, you throw away again. That discarding is not a side task — it is one of the most consequential choices in the whole process."),
  body: L(
    "<p>De tekst gaat door een reeks filters. Taalherkenning: is dit Nederlands of is het machinevertaald Engels? Regelfilters: te kort, te veel symbolen, menubalken en cookiemeldingen. Ontdubbeling: dezelfde alinea komt duizenden keren voor op het web, en een model dat hetzelfde fragment duizend keer ziet, leert het uit het hoofd in plaats van er iets algemeens uit af te leiden. Kwaliteitsclassificatie, veiligheidsfilters, licentiecontrole.</p>" +
    "<p>Elk filter is een afweging met gevolgen die je pas weken later ziet. Streng filteren geeft schonere tekst maar gooit ook hele domeinen weg — filter te hard op \"leesbaarheid\" en je verliest wetenschappelijke notatie, tabellen en code. Te zacht filteren en het model leert de stijl van SEO-spam. Er bestaat geen objectief juiste instelling; er bestaan alleen keuzes die je moet kunnen verantwoorden.</p>" +
    "<p>Het filteren zelf is trouwens ook een rekenklus van formaat. Ontdubbelen over honderden terabytes is een taak die dagen tot weken draait op een cluster, voordat er ook maar iets getraind is.</p>",
    "<p>The text passes through a chain of filters. Language identification: is this actually Dutch, or machine-translated English? Rule filters: too short, too many symbols, navigation bars and cookie notices. Deduplication: the same paragraph appears thousands of times across the web, and a model that sees one fragment a thousand times memorises it instead of generalising from it. Quality classifiers, safety filters, licence checks.</p>" +
    "<p>Every filter is a judgement call whose consequences only show up weeks later. Filter hard and you get cleaner text, but you also throw away entire domains — over-filter for \"readability\" and you lose scientific notation, tables and code. Filter too softly and the model learns the register of SEO spam. There is no objectively correct setting; there are only choices you have to be able to justify.</p>" +
    "<p>The filtering itself is a serious compute job too. Deduplicating across hundreds of terabytes runs for days or weeks on a cluster, before anything has been trained at all.</p>"),
  tech: L(
    "<p>Ontdubbeling gebeurt meestal met MinHash/LSH op n-gram-shingles: exacte duplicaten eruit, en daarna near-duplicates boven een Jaccard-drempel. Kwaliteitsfilters zijn vaak een kleine classifier die is getraind om onderscheid te maken tussen een referentiecorpus en willekeurige webtekst. De volgorde van de filters doet ertoe: ontdubbelen vóór het kwaliteitsfilter is goedkoper, maar verandert de verdeling die het filter ziet.</p>",
    "<p>Deduplication is usually MinHash/LSH over n-gram shingles: exact duplicates first, then near-duplicates above a Jaccard threshold. Quality filters are often a small classifier trained to separate a reference corpus from random web text. Filter order matters: deduplicating before the quality filter is cheaper, but changes the distribution the filter sees.</p>"),
},
/* 3 */ {
  id: 3, phase: "data", at: [],
  title: L("Tokeniseren", "Tokenising"),
  lede:  L("Een model leest geen letters en geen woorden, maar stukjes uit een vaste woordenlijst van 262.144 mogelijkheden.",
           "A model reads neither letters nor words, but pieces drawn from a fixed vocabulary of 262,144 possibilities."),
  body: L(
    "<p>Voordat tekst het model in kan, wordt hij opgeknipt. Veelvoorkomende woorden zijn één stukje; zeldzamere woorden vallen uiteen. <em>Afsluitdijk</em> staat niet in de woordenlijst en wordt in zes stukjes gehakt. Getallen worden per cijfer gesplitst.</p>" +
    "<p>Dat klinkt als een technisch detail, maar het heeft directe gevolgen voor welke talen het model goed bedient. Een taal waarvan de woorden in veel stukjes uiteenvallen, kost meer rekenkracht per zin en krijgt per token minder inhoud mee. Bij een vaste contextlengte van 4.096 tokens past er dan simpelweg minder van die taal in één blok. Daarom is de woordenlijst hier ruim (262.144 in plaats van de gebruikelijke 32.000 of 128.000): er moet plaats zijn voor tientallen talen tegelijk.</p>" +
    "<p>Het is ook een van de meest onomkeerbare beslissingen van het hele project. De woordenlijst ligt vast vanaf de eerste stap. Wil je hem veranderen, dan begin je opnieuw.</p>",
    "<p>Before text can enter the model, it gets cut up. Common words are a single piece; rarer words break apart. <em>Afsluitdijk</em> is not in the vocabulary and gets chopped into six pieces. Numbers are split digit by digit.</p>" +
    "<p>That sounds like a technical detail, but it directly determines which languages the model serves well. A language whose words shatter into many pieces costs more compute per sentence and carries less meaning per token. With a fixed context length of 4,096 tokens, simply less of that language fits into one block. This is why the vocabulary here is large (262,144 instead of the usual 32,000 or 128,000): it has to make room for dozens of languages at once.</p>" +
    "<p>It is also one of the most irreversible decisions in the project. The vocabulary is fixed from the first step onwards. Change it, and you start over.</p>"),
  tech: L(
    "<p>SentencePiece-model, 262.144 stukjes, unigram. <code>▁</code> markeert een woordgrens, zodat de oorspronkelijke tekst exact te reconstrueren is (inclusief spaties). De gepadde vocab-grootte in de modelconfiguratie is precies 262.144 = 2<sup>18</sup>, wat de embeddingmatrix netjes over de tensor-parallelle GPU's laat verdelen. De embedding-lagen in en uit zijn niet gedeeld (untied): samen zijn ze ongeveer 2,7 miljard parameters, bijna 9% van het hele model.</p>",
    "<p>SentencePiece model, 262,144 pieces, unigram. <code>▁</code> marks a word boundary, so the original text is exactly reconstructable (spaces included). The padded vocabulary size in the model config is exactly 262,144 = 2<sup>18</sup>, which divides the embedding matrix cleanly across the tensor-parallel GPUs. The input and output embeddings are untied: together they are about 2.7 billion parameters, nearly 9% of the whole model.</p>"),
},
/* 4 */ {
  id: 4, phase: "data", at: [],
  title: L("De mix samenstellen", "Composing the mix"),
  lede:  L("Niet wát je hebt bepaalt het model, maar hoeveel van elk soort je erin stopt.",
           "What shapes the model is not what you have, but how much of each kind you put in."),
  body: L(
    "<p>Je traint niet op de stapel zoals hij is. Je bepaalt verhoudingen: zoveel procent web, zoveel procent code, zoveel procent wetenschap, en per taal een eigen aandeel. Die verhoudingen hebben effecten die verrassend indirect zijn. Meer programmeercode verbetert aantoonbaar het redeneervermogen, ook in gewone taal. Meer Engels verbetert bijna elke benchmark, maar verdringt de kleinere talen. Nederlands vaker herhalen om het aandeel op te krikken klinkt logisch, maar boven een paar herhalingen gaat het model de tekst onthouden in plaats van de taal leren.</p>" +
    "<p>Deze verhoudingen worden niet op gevoel gekozen. Je traint kleine modellen — enkele honderden miljoenen tot een paar miljard parameters — op tientallen kandidaat-mixen en meet wat eruit komt. Pas daarna zet je er maanden GPU-tijd op in. Zodra de mix vastligt, wordt hij bevroren in een vaste volgorde van batches, zodat de run exact reproduceerbaar en na een crash exact hervatbaar is.</p>",
    "<p>You do not train on the pile as it is. You set proportions: this much web, this much code, this much science, and a share per language. Those proportions have effects that are surprisingly indirect. More programming code measurably improves reasoning, including in ordinary prose. More English improves almost every benchmark, but crowds out the smaller languages. Repeating Dutch more often to raise its share sounds sensible, but past a few repetitions the model starts memorising the text instead of learning the language.</p>" +
    "<p>These proportions are not chosen by taste. You train small models — a few hundred million to a couple of billion parameters — on dozens of candidate mixes and measure what comes out. Only then do you commit months of GPU time. Once the mix is fixed it is frozen into a fixed sequence of batches, so the run is exactly reproducible and exactly resumable after a crash.</p>"),
  tech: L(
    "<p>De mix wordt uitgedrukt als samplinggewichten per dataset-shard; Megatron bouwt daar een deterministische index van, zodat batch <em>n</em> altijd dezelfde documenten bevat. Daardoor is een herstart vanaf een checkpoint bitgelijk aan een run die nooit gecrasht is — mits het aantal data-parallelle replica's gelijk blijft. Verander je dat aantal, dan verschuift de volgorde en is de run strikt genomen niet meer dezelfde.</p>",
    "<p>The mix is expressed as sampling weights per dataset shard; Megatron builds a deterministic index from them, so batch <em>n</em> always contains the same documents. That makes a restart from a checkpoint bit-identical to a run that never crashed — provided the number of data-parallel replicas stays the same. Change that number and the ordering shifts, and the run is strictly speaking no longer the same one.</p>"),
},
/* 5 */ {
  id: 5, phase: "train", at: [],
  title: L("De architectuur", "The architecture"),
  lede:  L("De vorm van het model ligt vast voordat de eerste stap gezet is, en verandert daarna niet meer.",
           "The shape of the model is fixed before the first step is taken, and does not change afterwards."),
  body: L(
    "<p>Een taalmodel is een stapel identieke lagen. Bij het 32B-model zijn dat er 64. Elke laag doet twee dingen: eerst kijkt hij met <em>attention</em> naar alle eerdere tokens in het blok om te bepalen welke ervan er nu toe doen, daarna haalt hij het resultaat door een groot tussenliggend netwerk dat de informatie omzet. Tussendoor wordt genormaliseerd zodat de getallen niet ontsporen.</p>" +
    "<p>De maten zijn geen ronde getallen bij toeval: ze zijn gekozen zodat ze precies opdelen over de GPU's waarop ze moeten draaien. Verbreden geeft meer capaciteit per laag, verdiepen geeft meer stappen van bewerking, en de verhouding tussen die twee bepaalt hoe efficiënt de training verloopt. Je kunt dit op deze schaal niet uitproberen — één verkeerde keuze kost maanden. Dus extrapoleer je uit scaling-law-runs met kleine modellen, en dan zet je door.</p>",
    "<p>A language model is a stack of identical layers. In the 32B model there are 64. Each layer does two things: first it uses <em>attention</em> to look back at every earlier token in the block and decide which ones matter right now, then it pushes the result through a large intermediate network that transforms the information. Normalisation in between keeps the numbers from running away.</p>" +
    "<p>The sizes are not round numbers by accident: they are chosen to divide exactly across the GPUs they have to run on. Making the model wider gives more capacity per layer, making it deeper gives more stages of processing, and the ratio between the two determines how efficiently training goes. You cannot experiment at this scale — one wrong choice costs months. So you extrapolate from scaling-law runs with small models, and then you commit.</p>"),
  tech: null, // rendered as a spec table instead
},
/* 6 */ {
  id: 6, phase: "train", at: ["m32"],
  title: L("De trainingsstap", "The training step"),
  lede:  L("Alles wat \"trainen\" betekent gebeurt hier, 894.000 keer achter elkaar. Eén keer duurt bijna zes seconden.",
           "Everything the word \"training\" refers to happens here, 894,000 times in a row. One pass takes almost six seconds."),
  body: L(
    "<p>Eén stap gaat zo. Neem 4.096 stukken tekst van elk 4.096 tokens — samen bijna zeventien miljoen tokens. Laat het model op elke positie tegelijk voorspellen welk token er waarschijnlijk volgt. Vergelijk die voorspellingen met wat er werkelijk stond. Hoe zekerder het model was over het juiste antwoord, hoe lager het verlies (de <em>loss</em>).</p>" +
    "<p>Vervolgens gaat die fout achterwaarts terug door alle 64 lagen. Dat levert voor elk van de 31,6 miljard parameters een richting op: welke kant moest deze op om de voorspelling een fractie beter te maken. Alle parameters worden een heel klein stukje die kant op geduwd. Dat is de hele training. Er zit geen begrip in, geen regel, geen kennisbank — alleen dit, zeventien miljoen tokens tegelijk, bijna negenhonderdduizend keer.</p>" +
    "<p>De loss is het enige getal dat je continu in de gaten houdt. Hij daalt snel in het begin, dan steeds trager, en na een tijdje verandert hij zo langzaam dat je pas na uren ziet of er iets mis is. Een plotselinge piek betekent bijna altijd een probleem: een slechte batch, een rekenfout op één GPU, of instabiliteit die je moet opvangen voordat hij de rest meesleurt.</p>",
    "<p>One step works like this. Take 4,096 chunks of text of 4,096 tokens each — nearly seventeen million tokens together. Have the model predict, at every position at once, which token probably comes next. Compare those predictions with what actually followed. The more confident the model was about the right answer, the lower the loss.</p>" +
    "<p>Then that error travels backwards through all 64 layers. For each of the 31.6 billion parameters this yields a direction: which way this one should have moved to make the prediction a fraction better. Every parameter is nudged a tiny amount that way. That is the whole of training. There is no understanding in it, no rule, no knowledge base — only this, seventeen million tokens at a time, almost nine hundred thousand times.</p>" +
    "<p>The loss is the one number you watch continuously. It drops fast at first, then ever more slowly, and after a while it changes so gradually that it takes hours to see whether something is wrong. A sudden spike almost always means trouble: a bad batch, an arithmetic fault on one GPU, or instability you have to catch before it drags the rest down with it.</p>"),
  tech: L(
    "<p>Loss is de gemiddelde cross-entropy in nats over alle voorspelde posities. Een loss van 1,40 komt neer op een perplexity van ongeveer 4,1: het model is gemiddeld zo onzeker als iemand die uit ruim vier gelijkwaardige opties moet kiezen — over een woordenlijst van 262.144. Verder worden per stap bijgehouden: de gradientnorm (een maat voor hoe groot de correctie is; plotselinge uitschieters gaan aan een spike vooraf), de doorvoer per GPU en de bereikte TFLOP/s. Een z-loss-term houdt de output-logits numeriek in toom.</p>",
    "<p>Loss is the mean cross-entropy in nats over all predicted positions. A loss of 1.40 corresponds to a perplexity of about 4.1: on average the model is as uncertain as someone choosing among just over four equally likely options — out of a vocabulary of 262,144. Also tracked per step: the gradient norm (a measure of how large the correction is; sudden outliers precede a spike), throughput per GPU and achieved TFLOP/s. A z-loss term keeps the output logits numerically in check.</p>"),
},
/* 7 */ {
  id: 7, phase: "train", at: ["m32"],
  title: L("Het rekencluster", "The compute cluster"),
  lede:  L("Het model past niet op één GPU. Niet eens in de buurt. Het moet in drie richtingen tegelijk worden opgeknipt.",
           "The model does not fit on one GPU. Not remotely. It has to be cut up in three directions at once."),
  body: L(
    "<p>De 31,6 miljard parameters zijn zelf ongeveer 63 gigabyte. Maar om te kunnen trainen heb je daarnaast de gradiënten nodig, de toestand van de optimizer, en de tussenresultaten van elke laag — bij elkaar rond de 440 gigabyte, terwijl één GPU 96 gigabyte heeft. Dus wordt er opgesplitst:</p>" +
    "<ul><li><strong>Tensor-parallel (4):</strong> de matrices bínnen één laag worden over vier GPU's verdeeld. Die vier moeten bij elke laag met elkaar praten en zitten daarom altijd in hetzelfde fysieke knooppunt.</li>" +
    "<li><strong>Pipeline-parallel (4):</strong> de 64 lagen worden in vier blokken van 16 verdeeld. Een batch gaat er als een lopende band doorheen.</li>" +
    "<li><strong>Data-parallel (128):</strong> van dat hele bouwwerk staan 128 identieke kopieën, elk op andere tekst. Na elke stap middelen ze hun correcties met elkaar.</li></ul>" +
    "<p>4 × 4 × 128 is 2.048 GPU's, verdeeld over 512 knooppunten. En daar zit de kern van het operationele probleem: ze moeten allemaal in de pas lopen. Eén GPU die traag is, houdt 2.047 andere op. Eén GPU die uitvalt, legt de hele run stil.</p>",
    "<p>The 31.6 billion parameters are themselves about 63 gigabytes. But to train you also need the gradients, the optimiser state, and the intermediate results of every layer — around 440 gigabytes together, while a single GPU has 96. So it gets split up:</p>" +
    "<ul><li><strong>Tensor parallel (4):</strong> the matrices <em>within</em> one layer are spread over four GPUs. Those four have to talk to each other at every layer, so they always sit inside the same physical node.</li>" +
    "<li><strong>Pipeline parallel (4):</strong> the 64 layers are divided into four blocks of 16. A batch moves through them like an assembly line.</li>" +
    "<li><strong>Data parallel (128):</strong> 128 identical copies of that whole arrangement exist, each on different text. After every step they average their corrections together.</li></ul>" +
    "<p>4 × 4 × 128 is 2,048 GPUs across 512 nodes. And that is the core of the operational problem: they all have to stay in lockstep. One slow GPU holds up 2,047 others. One failed GPU stops the entire run.</p>"),
  tech: L(
    "<p>Communicatie loopt via NCCL. Tensor-parallelle groepen blijven binnen een knooppunt (NVLink); pipeline-stadia en de data-parallelle all-reduce lopen over het netwerk tussen knooppunten. De doorvoer ligt rond 1.400 tokens per seconde per GPU en ongeveer 295 TFLOP/s per GPU — samen ruim een halve exaFLOP/s aan nuttige rekenkracht. Een NCCL-timeout is het meest voorkomende symptoom van een hardwarestoring: de ene rang wacht op een collectieve operatie die nooit afkomt, en na de timeout valt de hele job om.</p>",
    "<p>Communication runs over NCCL. Tensor-parallel groups stay inside one node (NVLink); pipeline stages and the data-parallel all-reduce cross the inter-node network. Throughput is around 1,400 tokens per second per GPU and roughly 295 TFLOP/s per GPU — over half an exaFLOP/s of useful compute in total. A NCCL timeout is the most common symptom of a hardware fault: one rank waits on a collective operation that never completes, and once it times out the entire job falls over.</p>"),
},
/* 8 */ {
  id: 8, phase: "train", at: ["m32"],
  title: L("Checkpoints", "Checkpoints"),
  lede:  L("Elke 2.000 stappen wordt de volledige toestand naar schijf geschreven. Dat is het enige wat een storing van een ramp scheidt.",
           "Every 2,000 steps the complete state is written to disk. That is the only thing standing between a fault and a disaster."),
  body: L(
    "<p>Een checkpoint is niet alleen het model. Het is het model plús de optimizer-toestand plús de positie in de datastroom — samen ongeveer 440 gigabyte, dat in één keer door 2.048 processen naar het parallelle bestandssysteem wordt geschreven. Bij bijna zes seconden per stap komt er ongeveer elke drie uur een nieuwe.</p>" +
    "<p>Die frequentie is een rekensom, geen gewoonte. Vaker opslaan betekent meer opslag en meer stilstand tijdens het schrijven. Minder vaak opslaan betekent dat je bij een crash meer werk kwijt bent. Met drie uur ertussen verlies je gemiddeld anderhalf uur van 2.048 GPU's per storing — en storingen zijn er meerdere per week.</p>" +
    "<p>Hervatten is niet zomaar het bestand terugladen. Je controleert daarna of de loss precies oppakt waar hij gebleven was. Doet hij dat niet, dan is er iets mis met het checkpoint zelf, en dan valt je vangnet weg op het moment dat je het nodig hebt.</p>",
    "<p>A checkpoint is not just the model. It is the model <em>plus</em> the optimiser state <em>plus</em> the position in the data stream — around 440 gigabytes, written to the parallel file system by 2,048 processes at once. At almost six seconds per step, a new one lands roughly every three hours.</p>" +
    "<p>That frequency is an arithmetic result, not a habit. Saving more often means more storage and more idle time while writing. Saving less often means losing more work when you crash. With three hours between saves you lose, on average, an hour and a half of 2,048 GPUs per fault — and there are several faults a week.</p>" +
    "<p>Resuming is not simply loading the file back. Afterwards you check that the loss picks up exactly where it left off. If it does not, something is wrong with the checkpoint itself, and your safety net has failed at the moment you needed it.</p>"),
  tech: L(
    "<p>Megatron schrijft gedistribueerd: elke rang schrijft zijn eigen shard, gevolgd door een barrier. Het optimizer-deel domineert de omvang — Adam houdt twee momenten per parameter bij, en bij fp32-masterweights is dat nog eens vier bytes per parameter extra. Oude checkpoints worden opgeruimd op een bewaarschema, want 440 GB per drie uur is ruim 3 TB per dag. Bij het hervatten wordt <code>lr_warmup_iters</code> op 0 gezet: de opwarmfase is al geweest en overnieuw opwarmen zou de training verstoren.</p>",
    "<p>Megatron writes in distributed form: every rank writes its own shard, followed by a barrier. The optimiser portion dominates the size — Adam keeps two moments per parameter, and with fp32 master weights that is another four bytes per parameter on top. Old checkpoints are pruned on a retention schedule, because 440 GB every three hours is over 3 TB a day. On resume, <code>lr_warmup_iters</code> is set to 0: the warmup already happened, and warming up again would disturb training.</p>"),
},
/* 9 */ {
  id: 9, phase: "finish", at: ["m9"],
  title: L("Annealing", "Annealing"),
  lede:  L("In de laatste tien procent wordt de leersnelheid naar nul gebracht en de data schoner gemaakt. Dit deel telt onevenredig zwaar.",
           "In the final ten percent the learning rate is brought down to zero and the data is made cleaner. This part counts disproportionately."),
  body: L(
    "<p>De leersnelheid bepaalt hoe grote stappen de parameters bij elke update zetten. Het schema heet WSD: <em>warmup, stable, decay</em>. Een korte opwarmfase aan het begin, daarna een lange vlakke periode waarin de waarde constant blijft, en pas aan het eind een geleidelijke daling naar nul.</p>" +
    "<p>Die laatste fase heet annealing, en er gebeuren twee dingen tegelijk. De stappen worden steeds kleiner, waardoor het model ophoudt met rondzoeken en zich vastzet in een goede toestand. En tegelijk verschuift de datamix naar het beste materiaal dat je hebt: minder ruwe webtekst, meer geredigeerde en betrouwbare bronnen. Wat het model in deze fase ziet, weegt merkbaar zwaarder door in het eindresultaat dan wat het er halverwege doorheen zag.</p>" +
    "<p>Het 9B-model wacht op deze fase. Het geplande annealingbudget is 300 miljard tokens.</p>",
    "<p>The learning rate sets how large a step each parameter takes on every update. The schedule is called WSD: <em>warmup, stable, decay</em>. A short warmup at the start, then a long flat period where the value stays constant, and only at the end a gradual decline to zero.</p>" +
    "<p>That last phase is called annealing, and two things happen at once. The steps get steadily smaller, so the model stops casting about and settles into a good state. At the same time the data mix shifts towards the best material you have: less raw web text, more edited and reliable sources. What the model sees in this phase weighs noticeably more heavily in the final result than what it saw halfway through.</p>" +
    "<p>The 9B model is awaiting this phase. The planned annealing budget is 300 billion tokens.</p>"),
  tech: L(
    "<p>Het voordeel van WSD boven een cosineschema is dat de vlakke periode geen vooraf vastgelegde eindstap nodig heeft. Je kunt langer doortrainen dan gepland, of juist eerder afbouwen, zonder het schema opnieuw te hoeven uitrekenen — en je kunt vanuit hetzelfde constante punt meerdere annealings met verschillende datamixen doen en die met elkaar vergelijken.</p>",
    "<p>The advantage of WSD over a cosine schedule is that the flat period needs no pre-committed end step. You can train longer than planned, or decay earlier, without recomputing the schedule — and from the same constant point you can run several annealings with different data mixes and compare them against each other.</p>"),
},
/* 10 */ {
  id: 10, phase: "finish", at: [],
  title: L("Instructietraining", "Instruction tuning"),
  lede:  L("Een basismodel beantwoordt geen vragen. Het maakt tekst af. Dat verschil overbruggen is een aparte, veel kortere fase.",
           "A base model does not answer questions. It completes text. Bridging that gap is a separate and much shorter phase."),
  body: L(
    "<p>Na de pretraining kun je het model een vraag stellen en krijg je geen antwoord, maar een voortzetting — vaak nog een vraag, of een lijst met vergelijkbare vragen, want zo zien webpagina's er nu eenmaal uit. Het model heeft taal geleerd, niet het gesprek.</p>" +
    "<p>Daarvoor volgt <em>supervised fine-tuning</em>: verder trainen op voorbeelden van een instructie met een goed antwoord erbij. Dat zijn er honderdduizenden tot een paar miljoen — vergeleken met de biljoenen tokens uit de pretraining een verwaarloosbare hoeveelheid, en het kost uren in plaats van maanden. Maar het is precies het deel dat de gebruiker te zien krijgt, en de kwaliteit van die voorbeelden bepaalt vrijwel alles aan het gedrag van het eindproduct.</p>",
    "<p>After pretraining you can ask the model a question and get, instead of an answer, a continuation — often another question, or a list of similar questions, because that is what web pages look like. The model has learned language, not conversation.</p>" +
    "<p>What follows is <em>supervised fine-tuning</em>: training further on examples of an instruction paired with a good answer. There are hundreds of thousands to a few million of them — a negligible quantity next to the trillions of pretraining tokens, and it costs hours rather than months. But it is exactly the part the user encounters, and the quality of those examples determines nearly everything about how the finished product behaves.</p>"),
  tech: L(
    "<p>De SFT-sets voor dit project zijn deels vertaald en deels synthetisch gegenereerd, en staan open op {{a:hf}} (<code>Dolci-Instruct-SFT-translated</code>, <code>EU-Instruct-Synthetic</code>). De code staat in {{a:posttrain}}. Na SFT volgt meestal nog een voorkeursoptimalisatie (DPO of vergelijkbaar) op paren van een beter en een slechter antwoord.</p>",
    "<p>The SFT sets for this project are partly translated and partly synthetically generated, and are published openly on {{a:hf}} (<code>Dolci-Instruct-SFT-translated</code>, <code>EU-Instruct-Synthetic</code>). The code lives in {{a:posttrain}}. SFT is usually followed by a preference-optimisation stage (DPO or similar) on pairs of a better and a worse answer.</p>"),
},
/* 11 */ {
  id: 11, phase: "finish", at: [],
  title: L("Evaluatie", "Evaluation"),
  lede:  L("Hoe weet je of het gewerkt heeft? Eerlijk antwoord: onvolledig, en pas achteraf.",
           "How do you know whether it worked? The honest answer: incompletely, and only afterwards."),
  body: L(
    "<p>Tijdens de run heb je één continu signaal — de loss — en dat zegt alleen of het model beter wordt in voorspellen, niet of het nuttig is. Daarnaast draaien er periodiek benchmarks op tussentijdse checkpoints: meerkeuzevragen over kennis en redeneren, begrijpend lezen, rekenen, programmeren. Voor een meertalig model moet dat per taal, en daar wringt het meteen: de meeste benchmarks bestaan alleen in het Engels, en een vertaalde benchmark meet niet helemaal hetzelfde.</p>" +
    "<p>Bovendien lekken benchmarks. Ze staan op het web, het web zit in de trainingsdata, en dus meet je deels of het model ze uit het hoofd kent. Daar wordt op gefilterd, maar nooit perfect. Het gevolg is dat het oordeel over een model uiteindelijk óók berust op mensen die ermee werken en beoordelen wat eruit komt — trager, subjectiever en moeilijker te publiceren dan een getal, maar zonder dat weet je het niet.</p>",
    "<p>During the run you have one continuous signal — the loss — and it only tells you whether the model is getting better at predicting, not whether it is useful. Alongside that, benchmarks run periodically on intermediate checkpoints: multiple-choice questions on knowledge and reasoning, reading comprehension, arithmetic, programming. For a multilingual model that has to happen per language, and the problem shows up immediately: most benchmarks exist only in English, and a translated benchmark does not measure quite the same thing.</p>" +
    "<p>Benchmarks also leak. They are on the web, the web is in the training data, so in part you are measuring whether the model has memorised them. That gets filtered for, but never perfectly. The consequence is that judging a model ultimately rests on people working with it and assessing what comes out — slower, more subjective and harder to publish than a number, but without it you do not know.</p>"),
  tech: L(
    "<p>De evaluatie draait als losse jobs op tussentijdse checkpoints, gepland via {{a:evalrepo}}, zodat de trainingsrun zelf niet onderbroken hoeft te worden. Zo krijg je een curve van benchmarkscores tegen trainingstokens, en niet alleen een eindcijfer.</p>",
    "<p>Evaluation runs as separate jobs against intermediate checkpoints, scheduled through {{a:evalrepo}}, so the training run itself never has to be interrupted. That gives you a curve of benchmark scores against training tokens, not just a final number.</p>"),
},
],

/* ------------------------------------------------------- figure labels --- */
fig: {
  sources: {
    t: L("Waar de tekst vandaan komt", "Where the text comes from"),
    s: L("Ruwe omvang per bron, vóór filtering", "Raw volume per source, before filtering"),
    c: L("De volumes zijn nog niet ingevuld. De inhoudelijke samenstelling staat wel openbaar in {{a:catalogue}}.",
         "The volumes have not been filled in yet. The substantive composition is published in {{a:catalogue}}."),
  },
  funnel: {
    t: L("Wat elke filterstap weggooit", "What each filter stage discards"),
    s: L("Aandeel van de oorspronkelijke tekst dat overblijft", "Share of the original text that survives"),
    c: L("Schematische verhoudingen — de vorm klopt, de exacte percentages moeten nog uit de datapijplijn komen. Onder aan de trechter blijft ongeveer een tiende van de oorspronkelijke tekst over.",
         "Schematic proportions — the shape is right, the exact percentages still have to come out of the data pipeline. At the bottom of the funnel roughly a tenth of the original text remains."),
    stages: {
      raw:     L("Ruwe tekst", "Raw text"),
      lang:    L("Taalherkenning", "Language ID"),
      rules:   L("Regelfilters", "Rule filters"),
      dedup:   L("Ontdubbeling", "Deduplication"),
      quality: L("Kwaliteitsfilter", "Quality filter"),
      safety:  L("Veiligheidsfilter", "Safety filter"),
      license: L("Licentiecontrole", "Licence check"),
    },
    stageWhy: {
      raw:     L("Alles wat binnenkomt uit crawls, archieven en corpora.", "Everything that comes in from crawls, archives and corpora."),
      lang:    L("Weg: tekst waarvan de taal niet betrouwbaar is vast te stellen, of die niet in de doeltalen valt.", "Out: text whose language cannot be reliably identified, or that is not in the target languages."),
      rules:   L("Weg: te kort, te veel symbolen, navigatiebalken, cookiemeldingen, automatisch gegenereerde opsommingen.", "Out: too short, too many symbols, navigation bars, cookie notices, auto-generated listings."),
      dedup:   L("Weg: exacte en bijna-exacte kopieën. Dit is de grootste enkele afname.", "Out: exact and near-exact copies. This is the single largest drop."),
      quality: L("Weg: tekst die een classifier als laagwaardig beoordeelt. De meest omstreden stap.", "Out: text a classifier scores as low value. The most contested step."),
      safety:  L("Weg: materiaal dat om inhoudelijke redenen niet in de training hoort.", "Out: material that does not belong in training for content reasons."),
      license: L("Weg: alles waarvan het gebruiksrecht niet aantoonbaar in orde is.", "Out: anything whose usage rights cannot be demonstrated."),
    },
  },
  tok: {
    t: L("Dezelfde zin, zoals het model hem ziet", "The same sentence, as the model sees it"),
    s: L("Echte uitvoer van de tokenizer die in productie gebruikt wordt", "Real output of the tokenizer used in production"),
    c: L("Elk blokje is één token met zijn plaats in de woordenlijst. <code>▁</code> betekent: hier begon een nieuw woord. Merk op dat <em>Afsluitdijk</em> in zes stukjes uiteenvalt en dat <em>32</em> per cijfer wordt gesplitst.",
         "Each block is one token with its position in the vocabulary. <code>▁</code> means: a new word started here. Note that <em>Afsluitdijk</em> breaks into six pieces and that <em>32</em> is split digit by digit."),
    count: L("tokens voor {n} tekens", "tokens for {n} characters"),
    ratio: L("tekens per token", "characters per token"),
  },
  mix: {
    t: L("De mix", "The mix"),
    s: L("Aandeel van alle trainingstokens", "Share of all training tokens"),
    c: L("Schematische verhoudingen. De echte gewichten worden gekozen op basis van metingen met kleine modellen en moeten hier nog ingevuld worden.",
         "Schematic proportions. The real weights are chosen by measuring small models and still have to be filled in here."),
    byDomain: L("Per soort tekst", "By kind of text"),
    byLang:   L("Per taal", "By language"),
    domains: {
      web: L("Web", "Web"), code: L("Code", "Code"), science: L("Wetenschap", "Science"),
      official: L("Officiële stukken", "Official documents"), books: L("Boeken", "Books"),
      wiki: L("Encyclopedie", "Encyclopedia"), synth: L("Synthetisch", "Synthetic"),
    },
    langs: {
      en: L("Engels", "English"), de: L("Duits", "German"), fr: L("Frans", "French"),
      es: L("Spaans", "Spanish"), it: L("Italiaans", "Italian"), nl: L("Nederlands", "Dutch"),
      pl: L("Pools", "Polish"), other: L("Overige EU-talen", "Other EU languages"),
    },
  },
  arch: {
    t: L("De opbouw van het 32B-model", "The build of the 32B model"),
    s: L("Uit de argumentendump van de draaiende job", "From the argument dump of the running job"),
    c: L("Alle waarden hier zijn afgelezen uit het logbestand van de lopende run.",
         "Every value here is read from the log file of the running job."),
    keys: {
      layers: L("Lagen", "Layers"), hidden: L("Breedte", "Width"), ffn: L("Tussenlaag", "Intermediate"),
      heads: L("Attention-heads", "Attention heads"), kvGroups: L("Key/value-groepen", "Key/value groups"),
      vocab: L("Woordenlijst", "Vocabulary"), seqLen: L("Contextlengte", "Context length"),
      params: L("Parameters", "Parameters"), norm: L("Normalisatie", "Normalisation"),
      posEmb: L("Positiecodering", "Positional encoding"), act: L("Activatie", "Activation"),
      lrSchedule: L("Leersnelheidsschema", "LR schedule"),
    },
    layerNote: L("64 identieke lagen · elke laag ≈ 452 miljoen parameters", "64 identical layers · each layer ≈ 452 million parameters"),
    partsT: L("Waar de parameters zitten", "Where the parameters sit"),
  },
  predict: {
    t: L("Wat het model doet bij één token", "What the model does at one token"),
    s: L("Voorspelde kans op het volgende token", "Predicted probability of the next token"),
    c: L("Illustratieve getallen, niet afgelezen uit een checkpoint. Het model kent de zin niet — het schat op basis van alles wat het eerder heeft gezien welk token nu het waarschijnlijkst is.",
         "Illustrative numbers, not read from a checkpoint. The model does not know the sentence — it estimates, from everything it has seen before, which token is most likely now."),
    given: L("Gegeven", "Given"),
    other: L("alle overige 262.139 tokens samen", "all 262,139 remaining tokens combined"),
  },
  loss: {
    t: L("Het verloop van de loss", "How the loss develops"),
    s: L("Gemiddelde cross-entropy, tegen voortgang van de run", "Mean cross-entropy, against progress through the run"),
    c: L("Eén gemeten punt (de huidige stand van de 32B-run); de rest van de curve is schematisch en toont de vorm die zo'n run altijd heeft: een steile val in de eerste procenten, daarna een zeer trage daling waarin elke tiende steeds duurder wordt.",
         "One measured point (the current state of the 32B run); the rest of the curve is schematic and shows the shape such a run always has: a steep drop in the first few percent, then a very slow decline in which every tenth costs progressively more."),
    now: L("nu", "now"),
    measured: L("Gemeten", "Measured"),
    expected: L("Verwacht verloop", "Expected path"),
    xlab: L("voortgang van de run", "progress through the run"),
    ylab: L("loss", "loss"),
  },
  grid: {
    t: L("2.048 GPU's, in de pas", "2,048 GPUs, in lockstep"),
    s: L("Elk vierkantje is één knooppunt met vier GPU's", "Each square is one node with four GPUs"),
    c: L("Kies een indeling om te zien hoe het model over de machine verdeeld is. Klik op een knooppunt om te zien wat er misgaat als juist die uitvalt.",
         "Pick a split to see how the model is spread over the machine. Click a node to see what happens if that one fails."),
    modes: {
      pp: L("Pipeline-stadium", "Pipeline stage"),
      dp: L("Data-parallelle kopie", "Data-parallel replica"),
      none: L("Alles", "All"),
    },
    node: L("Knooppunt", "Node"),
    stage: L("Lagen", "Layers"),
    replica: L("Kopie", "Replica"),
    ifdown: L("Valt dit knooppunt uit, dan staan alle 2.048 GPU's stil totdat de job opnieuw is gestart vanaf het laatste checkpoint.",
              "If this node fails, all 2,048 GPUs stand idle until the job is restarted from the last checkpoint."),
    clickme: L("Klik op een knooppunt", "Click a node"),
  },
  ckpt: {
    t: L("Wat een storing kost", "What a fault costs"),
    s: L("Checkpoints, een crash, en het werk dat verloren gaat", "Checkpoints, a crash, and the work that is lost"),
    c: L("Schematisch. Met een checkpoint elke 2.000 stappen (ruim drie uur) is het gemiddelde verlies per storing ongeveer anderhalf uur rekentijd van 2.048 GPU's — plus de tijd die het kost voordat iemand merkt dat de job stilstaat.",
         "Schematic. With a checkpoint every 2,000 steps (just over three hours), the average loss per fault is about an hour and a half of compute on 2,048 GPUs — plus however long it takes before someone notices the job has stopped."),
    saved: L("checkpoint", "checkpoint"),
    crash: L("storing", "fault"),
    lost: L("verloren werk", "work lost"),
    notice: L("opgemerkt, herstart", "noticed, restarted"),
  },
  wsd: {
    t: L("Het leersnelheidsschema", "The learning-rate schedule"),
    s: L("Warmup, stable, decay", "Warmup, stable, decay"),
    c: L("De vorm van het schema is echt; de posities van beide modellen op de lijn komen uit de voortgangscijfers hierboven.",
         "The shape of the schedule is real; the positions of both models along the line come from the progress figures above."),
    phases: { warmup: L("opwarmen", "warmup"), stable: L("constant", "stable"), decay: L("annealing", "annealing") },
  },
  sft: {
    t: L("Voor en na instructietraining", "Before and after instruction tuning"),
    s: L("Dezelfde vraag, twee modellen", "The same question, two models"),
    c: L("Illustratieve antwoorden om het verschil in gedrag te laten zien, niet gegenereerd door deze modellen.",
         "Illustrative answers showing the difference in behaviour, not generated by these models."),
    q: L("Vraag", "Question"),
    question: L("Hoe lang is de Afsluitdijk?", "How long is the Afsluitdijk?"),
    base: L("Basismodel", "Base model"),
    tuned: L("Na instructietraining", "After instruction tuning"),
    baseA: L("Hoe diep is het IJsselmeer? Wanneer is de Afsluitdijk gebouwd? Waar begint de Afsluitdijk? Gerelateerde vragen:",
             "How deep is the IJsselmeer? When was the Afsluitdijk built? Where does the Afsluitdijk start? Related questions:"),
    tunedA: L("De Afsluitdijk is ongeveer 32 kilometer lang en verbindt Den Oever in Noord-Holland met Zurich in Friesland.",
              "The Afsluitdijk is about 32 kilometres long and connects Den Oever in North Holland with Zurich in Friesland."),
    baseWhy: L("Het basismodel maakt de tekst af zoals een webpagina zou doorgaan.", "The base model completes the text the way a web page would continue."),
    tunedWhy: L("Na SFT herkent het model de vorm van een vraag en geeft het antwoord.", "After SFT the model recognises the shape of a question and answers it."),
  },
  evals: {
    t: L("Evaluatie", "Evaluation"),
    s: L("Scores per benchmark, basismodel tegenover instructiemodel", "Scores per benchmark, base model against tuned model"),
    c: L("Deze tabel wordt gevuld zodra de evaluatiejobs op de definitieve checkpoints gedraaid zijn.",
         "This table gets filled once the evaluation jobs have run on the final checkpoints."),
    rows: {
      mmlu_nl:   L("Kennis en redeneren (NL)", "Knowledge and reasoning (NL)"),
      arc_nl:    L("Wetenschapsvragen (NL)", "Science questions (NL)"),
      hellaswag: L("Gezond verstand", "Commonsense"),
      gsm8k:     L("Rekenopgaven", "Arithmetic word problems"),
      eu_multi:  L("Meertalig gemiddelde (EU)", "Multilingual average (EU)"),
    },
    base: L("Basismodel", "Base"),
    sft:  L("Na SFT", "After SFT"),
  },
  mtbf: {
    t: L("Waarom storing geen uitzondering is", "Why failure is not an exception"),
    s: L("Verwachte tijd tot de eerste uitval, bij 2.048 GPU's", "Expected time to the first failure, across 2,048 GPUs"),
    c: L("Ook als één GPU het gemiddeld jaren volhoudt, gaat er bij tweeduizend stuks meerdere keren per week íets stuk. Dat is geen pech — dat is rekenen. De hele operationele kant van pretraining volgt hieruit.",
         "Even if a single GPU lasts for years on average, across two thousand of them something breaks several times a week. That is not bad luck — it is arithmetic. The whole operational side of pretraining follows from it."),
    slider: L("Eén GPU gaat gemiddeld stuk na", "A single GPU fails on average after"),
    years: L("jaar", "years"),
    result: L("Bij {n} GPU's verwacht je een storing ongeveer elke", "Across {n} GPUs you expect a fault roughly every"),
    perWeek: L("≈ {n} storingen per week", "≈ {n} faults per week"),
    lostPerWeek: L("≈ {n} uur werk per week kwijt door herstarts", "≈ {n} hours of work lost per week to restarts"),
    hours: L("uur", "hours"),
    days: L("dagen", "days"),
  },
  causes: {
    t: L("Wat er stuk gaat", "What actually breaks"),
    s: L("Aandeel van de storingen per soort", "Share of incidents by kind"),
    c: L("Schematische verdeling, gebaseerd op wat er in dit soort runs gebruikelijk is. De echte tellingen komen uit de wachtrijmonitor zodra die aan deze pagina gekoppeld is.",
         "Schematic distribution, based on what is typical for runs of this kind. The real counts come from the queue monitor once it is wired to this page."),
    ids: {
      gpu:     L("GPU-hardware", "GPU hardware"),
      network: L("Netwerk en NCCL", "Network and NCCL"),
      storage: L("Bestandssysteem", "File system"),
      hang:    L("Vastloper zonder foutmelding", "Hang with no error"),
      oom:     L("Geheugen vol", "Out of memory"),
      other:   L("Overig", "Other"),
    },
    why: {
      gpu:     L("Een kaart valt van de bus, geeft ECC-fouten, of raakt oververhit. Meestal duidelijk zichtbaar in het systeemlog.", "A card falls off the bus, throws ECC errors, or overheats. Usually plainly visible in the system log."),
      network: L("Een collectieve operatie komt niet af en loopt in een timeout. Het symptoom wijst zelden direct de schuldige aan.", "A collective operation never completes and times out. The symptom rarely points straight at the culprit."),
      storage: L("Het parallelle bestandssysteem hapert tijdens het schrijven van een checkpoint, of is vol.", "The parallel file system stalls while writing a checkpoint, or is full."),
      hang:    L("Alles lijkt te draaien, maar de stapteller staat stil. Het vervelendst, omdat niets een fout meldt.", "Everything looks like it is running, but the step counter has stopped. The worst kind, because nothing reports an error."),
      oom:     L("Meestal na een configuratiewijziging, soms door fragmentatie na lang draaien.", "Usually after a configuration change, sometimes from fragmentation after running a long time."),
      other:   L("Onderhoud, stroom, planner, menselijke fout.", "Maintenance, power, scheduler, human error."),
    },
  },
},

intervene: {
  t: L("Wat ingrijpen in de praktijk betekent", "What intervening actually involves"),
  body: L(
    "<p>Een melding komt binnen — via een chatkanaal, of omdat de stapteller in de voortgangsmonitor niet meer oploopt. Dan begint steeds ongeveer dezelfde reeks:</p>" +
    "<ol>" +
    "<li><strong>Vaststellen of de job werkelijk stilstaat.</strong> Een job die in de wachtrij staat als \"draaiend\" kan al een uur niets doen. De laatste regel in het logbestand is het echte signaal.</li>" +
    "<li><strong>Uitzoeken welk knooppunt de oorzaak is.</strong> Bij een NCCL-timeout meldt niet de kapotte rang de fout, maar iedereen die op hem wacht. Je moet terugredeneren naar wie als eerste stopte.</li>" +
    "<li><strong>Het knooppunt uit de reservering halen</strong> en melden bij de beheerders van het systeem, zodat het niet bij de volgende start opnieuw wordt toegewezen.</li>" +
    "<li><strong>Opnieuw indienen vanaf het laatste checkpoint</strong>, met dezelfde configuratie — want een andere verdeling verandert de volgorde van de data.</li>" +
    "<li><strong>Controleren dat de loss oppakt waar hij gebleven was.</strong> Dit is de stap die je niet mag overslaan. Een run die na een herstart op een iets hogere loss verdergaat, vertelt je dat er iets mis is met het checkpoint of met de dataindex.</li>" +
    "</ol>" +
    "<p>In het beste geval kost dat twintig minuten. In het slechtste geval blijkt het probleem intermitterend en val je drie keer op dezelfde plek uit voordat je het juiste knooppunt te pakken hebt.</p>",
    "<p>An alert comes in — through a chat channel, or because the step counter in the progress monitor has stopped advancing. Then roughly the same sequence begins every time:</p>" +
    "<ol>" +
    "<li><strong>Establish whether the job has really stopped.</strong> A job the queue reports as \"running\" may have been doing nothing for an hour. The last line in the log file is the real signal.</li>" +
    "<li><strong>Work out which node caused it.</strong> On a NCCL timeout it is not the broken rank that reports the error, but everyone waiting on it. You have to reason backwards to whoever stopped first.</li>" +
    "<li><strong>Take the node out of the reservation</strong> and report it to the system's administrators, so it does not get assigned again on the next start.</li>" +
    "<li><strong>Resubmit from the last checkpoint</strong>, with the same configuration — because a different split changes the ordering of the data.</li>" +
    "<li><strong>Check that the loss picks up where it left off.</strong> This is the step you must not skip. A run that continues at a slightly higher loss after a restart is telling you something is wrong with the checkpoint or the data index.</li>" +
    "</ol>" +
    "<p>At best that costs twenty minutes. At worst the problem turns out to be intermittent and you fall over in the same place three times before you have identified the right node.</p>"),
},

silent: {
  t: L("De storingen waar je wakker van ligt", "The failures that keep you up"),
  body: L(
    "<p>Een crash is vervelend maar eerlijk: hij meldt zichzelf. De gevaarlijke categorie is de storing die dóórdraait.</p>",
    "<p>A crash is annoying but honest: it announces itself. The dangerous category is the failure that keeps running.</p>"),
  items: [
    { t: L("De trage GPU", "The slow GPU"),
      d: L("Eén kaart klokt terug vanwege temperatuur en levert nog steeds correcte resultaten, alleen 20% langzamer. Omdat alle 2.048 GPU's op elkaar wachten, draait de hele run 20% langzamer. Er is geen foutmelding; je ziet het alleen aan de staptijd.",
           "One card throttles on temperature and still returns correct results, just 20% slower. Because all 2,048 GPUs wait on each other, the entire run is 20% slower. There is no error; you only see it in the step time.") },
    { t: L("De losspiek", "The loss spike"),
      d: L("De loss schiet omhoog en zakt daarna soms wel, soms niet terug. Dan moet je beslissen: doorgaan en hopen, of terug naar een eerder checkpoint en een stuk data overslaan. Beide kosten uren, en je weet pas achteraf welke keuze goed was.",
           "The loss jumps and then sometimes recovers and sometimes does not. You have to decide: carry on and hope, or roll back to an earlier checkpoint and skip a stretch of data. Both cost hours, and you only learn afterwards which choice was right.") },
    { t: L("De stille rekenfout", "The silent arithmetic fault"),
      d: L("Beschadigd geheugen dat verkeerde getallen teruggeeft zonder dat er een fout wordt gemeld. Het lekt in de gradiënten en verspreidt zich via de data-parallelle middeling over alle kopieën. Dit is de reden dat je periodiek de gradientnorm in de gaten houdt.",
           "Corrupted memory returning wrong numbers without raising an error. It leaks into the gradients and spreads to every replica through the data-parallel averaging. This is why you watch the gradient norm.") },
    { t: L("Het onbruikbare checkpoint", "The unusable checkpoint"),
      d: L("Het bestandssysteem hapert halverwege het wegschrijven en het checkpoint is onvolledig. Dat merk je pas bij de volgende herstart — en dan ben je zes uur kwijt in plaats van drie.",
           "The file system stalls halfway through writing and the checkpoint is incomplete. You only find out at the next restart — and then you have lost six hours instead of three.") },
  ],
},

feedT: L("Wat er in het logboek staat", "What the log book records"),
feedS: L("Samengestelde voorbeelden van het soort meldingen dat binnenkomt", "Composite examples of the kind of alerts that come in"),
feedC: L("Dit zijn representatieve voorbeelden, geen echte gebeurtenissen uit deze run. Zodra de exporter draait, verschijnen hier de werkelijke meldingen: automatische regels uit de wachtrijmonitor, aangevuld met handmatige aantekeningen.",
         "These are representative examples, not real events from this run. Once the exporter runs, the actual alerts will appear here: automatic entries from the queue monitor, alongside handwritten notes."),
feedAuto: L("automatisch", "automatic"),
feedHand: L("aantekening", "note"),

incidents: [
  { t: "03:12", sev: "critical", who: "auto",
    h: L("Job gestopt — NCCL-timeout", "Job stopped — NCCL timeout"),
    d: L("Rang 1.204 reageerde niet binnen 30 minuten op een all-reduce. Laatste stap: 82.108. Laatste checkpoint: 82.000. 108 stappen verloren, ongeveer tien minuten rekentijd van 2.048 GPU's.",
         "Rank 1,204 failed to respond to an all-reduce within 30 minutes. Last step: 82,108. Last checkpoint: 82,000. 108 steps lost, about ten minutes of compute on 2,048 GPUs.") },
  { t: "03:40", sev: "warning", who: "hand",
    h: L("Knooppunt uit de reservering gehaald", "Node removed from the reservation"),
    d: L("Systeemlog van het knooppunt toont herhaalde ECC-fouten op één GPU. Gemeld bij de beheerders, knooppunt uitgesloten, job opnieuw ingediend vanaf checkpoint 82.000.",
         "The node's system log shows repeated ECC errors on one GPU. Reported to the administrators, node excluded, job resubmitted from checkpoint 82,000.") },
  { t: "04:05", sev: "good", who: "auto",
    h: L("Training hervat", "Training resumed"),
    d: L("Loss pakt op bij 1,402 tegenover 1,401 voor de storing. Binnen de ruis — het checkpoint is in orde.",
         "Loss resumes at 1.402 against 1.401 before the fault. Within noise — the checkpoint is sound.") },
  { t: "09:20", sev: "serious", who: "hand",
    h: L("Staptijd opgelopen van 5,8 naar 6,9 seconden", "Step time up from 5.8 to 6.9 seconds"),
    d: L("Geen foutmelding. Per-rang-tijden vergeleken: één knooppunt klokt terug op temperatuur. Vervangen bij het volgende geplande onderhoudsvenster, want een herstart nú kost meer dan het verlies aan snelheid tot dan.",
         "No error. Compared per-rank timings: one node is throttling on temperature. Scheduled for replacement at the next maintenance window, because restarting now costs more than the speed loss until then.") },
  { t: "14:30", sev: "warning", who: "auto",
    h: L("Checkpointschijf voor 91% vol", "Checkpoint storage 91% full"),
    d: L("440 GB per checkpoint, elke drie uur. Bewaarschema aangepast: alleen elke vijfde checkpoint blijft staan, plus de laatste drie.",
         "440 GB per checkpoint, every three hours. Retention adjusted: only every fifth checkpoint is kept, plus the most recent three.") },
  { t: "22:47", sev: "serious", who: "auto",
    h: L("Losspiek gedetecteerd", "Loss spike detected"),
    d: L("Loss van 1,40 naar 1,71 in twaalf stappen, gradientnorm van 0,14 naar 2,3. Twintig stappen later terug op 1,41. Doorgaan; de batch is genoteerd voor later onderzoek.",
         "Loss from 1.40 to 1.71 over twelve steps, gradient norm from 0.14 to 2.3. Back to 1.41 twenty steps later. Carrying on; the batch is noted for later investigation.") },
],

/* --------------------------------------------------- the work itself ----- */
/* Not a day in the life: the kinds of work this job actually consists of.
   `share` is a schematic slice of a typical week; `steps` links each activity
   back into the diagram. */

activities: [
{
  id: "data", share: 0.28, steps: [1, 2, 3, 4],
  title: L("Tekst klaarmaken", "Preparing text"),
  lede:  L("Verzamelen, opschonen, ontdubbelen, samenstellen. Het grootste blok, en het minst zichtbare.",
           "Gathering, cleaning, deduplicating, composing. The largest block, and the least visible."),
  body: L(
    "<p>Dit is het werk dat maanden vóór een run begint en tijdens de run gewoon doorloopt, omdat er alweer een volgend model aan komt. Het bestaat uit uitzoeken onder welke licentie een archief valt, een filterstap opnieuw draaien over een deel van het corpus, en de uitkomst daarvan vergelijken met de vorige versie.</p>" +
    "<p>Een concreet voorbeeld: de taalherkenning zette een deel van het Vlaams weg als Afrikaans. Dat is twee dagen rekentijd op een ander systeem om te herstellen, plus de tijd om te achterhalen dat het überhaupt gebeurde — want zo'n fout laat zich niet in de loss zien. Hij komt weken later boven water, in een evaluatiescore die net tegenvalt.</p>" +
    "<p>Het is ook het deel met de meeste onomkeerbare beslissingen. De woordenlijst ligt vast vanaf stap één, en de datamix wordt bevroren in een vaste volgorde van batches voordat er ook maar één GPU aangaat.</p>",
    "<p>This is the work that starts months before a run and simply continues during it, because there is always a next model coming. It consists of establishing what licence an archive falls under, rerunning a filter stage over part of the corpus, and comparing the result against the previous version.</p>" +
    "<p>A concrete example: language identification was filing part of Flemish as Afrikaans. That is two days of compute on another system to fix, plus the time to discover it was happening at all — because a mistake like that does not show up in the loss. It surfaces weeks later, in an evaluation score that is slightly disappointing.</p>" +
    "<p>It is also the part with the most irreversible decisions. The vocabulary is fixed from step one, and the data mix is frozen into a fixed sequence of batches before a single GPU is switched on.</p>"),
},
{
  id: "beslissen", share: 0.12, steps: [3, 4, 5],
  title: L("Keuzes onderbouwen", "Grounding the choices"),
  lede:  L("Hoe breed, hoe diep, hoeveel code, hoeveel Nederlands. Beslissingen die je op deze schaal niet kunt uitproberen.",
           "How wide, how deep, how much code, how much Dutch. Decisions you cannot test at this scale."),
  body: L(
    "<p>Een experiment op ware grootte kost twee maanden en tweeduizend GPU's, dus er is er precies één. Wat je in plaats daarvan doet is kleine modellen trainen — enkele honderden miljoenen tot een paar miljard parameters — op tientallen varianten, en daaruit extrapoleren.</p>" +
    "<p>Dat werkt beter dan meningen, maar het geeft zelden een eenduidig antwoord. De meetresultaten wijzen een richting aan; de uiteindelijke keuze wordt in een overleg gemaakt waarin iedereen ongeveer even onzeker is. Daarna ligt het getal vast voor de rest van het jaar.</p>" +
    "<p>Achter de datamix zit bovendien een verdeelvraagstuk dat niemand zo noemt. Elk procent dat naar het Engels gaat, gaat niet naar een kleinere taal — en het is een Europees project.</p>",
    "<p>A full-scale experiment costs two months and two thousand GPUs, so there is exactly one. What you do instead is train small models — a few hundred million to a couple of billion parameters — on dozens of variants, and extrapolate from those.</p>" +
    "<p>That works better than opinions, but it rarely gives an unambiguous answer. The measurements point in a direction; the final choice gets made in a meeting where everyone is about equally uncertain. After that the number is fixed for the rest of the year.</p>" +
    "<p>Behind the data mix there is also a distribution question that nobody calls one. Every percent that goes to English does not go to a smaller language — and this is a European project.</p>"),
},
{
  id: "bewaken", share: 0.14, steps: [6, 8],
  title: L("De run bewaken", "Watching the run"),
  lede:  L("Vier vragen, een paar keer per dag. Meestal is er niets te zien, en dat is precies het punt.",
           "Four questions, a few times a day. Usually there is nothing to see, and that is exactly the point."),
  body: L(
    "<p>Draait de job nog? Klopt de staptijd? Is de loss glad? Hoeveel opslag is er nog vrij? Dat kost twee minuten en levert meestal niets op. De waarde zit in de herhaling: je leert de normale vorm van die lijn zo goed kennen dat je een afwijking ziet voordat je hem kunt uitleggen.</p>" +
    "<p>Want het gevaarlijke geval is niet de crash — die meldt zichzelf. Het gevaarlijke geval is de run die dóórdraait terwijl er iets mis is: één kaart die terugklokt op temperatuur en de hele run 20% vertraagt zonder een enkele foutmelding, of een losspiek die soms wel en soms niet terugzakt.</p>" +
    "<p>Hier hoort ook het opruimen bij. Elke drie uur komt er 440 gigabyte bij. Beslissen welke checkpoints weg mogen klinkt als administratie, maar het is gokken: je gooit een toestand weg waarvan je over twee maanden misschien had gewild dat je hem nog had.</p>",
    "<p>Is the job still running? Is the step time right? Is the loss smooth? How much storage is left? That takes two minutes and usually turns up nothing. The value is in the repetition: you get to know the normal shape of that line well enough to spot a deviation before you can explain it.</p>" +
    "<p>Because the dangerous case is not the crash — that announces itself. The dangerous case is the run that keeps going while something is wrong: one card throttling on temperature and slowing the whole run by 20% without a single error, or a loss spike that sometimes recovers and sometimes does not.</p>" +
    "<p>Clearing up belongs here too. Every three hours another 440 gigabytes arrive. Deciding which checkpoints can go sounds like administration, but it is gambling: you throw away a state you might wish you still had in two months.</p>"),
},
{
  id: "ingrijpen", share: 0.22, steps: [7, 8],
  title: L("Ingrijpen bij storingen", "Intervening when it breaks"),
  lede:  L("Bij tweeduizend GPU's is storing geen uitzondering maar een planbare gebeurtenis.",
           "At two thousand GPUs, failure is not an exception but a schedulable event."),
  body: L(
    "<p>Om 03:12 gaat de telefoon. Een knooppunt is uitgevallen — niet netjes defect gemeld, niet overgenomen door een reserve, gewoon gestopt met antwoorden. De andere 2.044 GPU's hebben er een half uur op staan wachten, en toen viel de hele job om.</p>" +
    "<p>De schade is precies uit te rekenen. De laatste keer dat alles naar schijf was geschreven, was 108 stappen eerder; die stappen zijn weg. Daar komt bij: de tijd tot iemand wakker is, het uitzoeken wélk knooppunt het was, opnieuw indienen, en 440 gigabyte terugladen. Bij elkaar ruim een uur waarin tweeduizend GPU's niets deden. Dat is geen ramp. Het is de prijs die je een paar keer per week betaalt.</p>" +
    "<p>Hieronder staat de rekensom waar dat uit volgt, wat er in de praktijk stukgaat, en een simulatie van een week waarin je het zelf kunt proberen.</p>",
    "<p>At 03:12 the phone goes off. A node has failed — not reported as faulty, not taken over by a spare, it simply stopped answering. The other 2,044 GPUs waited half an hour on it, and then the whole job fell over.</p>" +
    "<p>The damage can be worked out exactly. The last time everything was written to disk was 108 steps earlier; those steps are gone. On top of that: the time until someone is awake, working out <em>which</em> node it was, resubmitting, and loading 440 gigabytes back in. Together, a little over an hour in which two thousand GPUs did nothing. That is not a disaster. It is the price you pay a few times a week.</p>" +
    "<p>Below is the arithmetic that follows from, what actually breaks in practice, and a simulation of a week you can try yourself.</p>"),
},
{
  id: "meten", share: 0.14, steps: [10, 11],
  title: L("Meten en beoordelen", "Measuring and judging"),
  lede:  L("De loss zegt of het model beter voorspelt, niet of het iets waard is. Dat moet apart gemeten worden.",
           "The loss says whether the model predicts better, not whether it is worth anything. That has to be measured separately."),
  body: L(
    "<p>Evaluatiejobs draaien los van de trainingsrun, op tussentijdse checkpoints, zodat de run zelf niet onderbroken hoeft te worden. Dat geeft een curve van benchmarkscores tegen trainingstokens in plaats van alleen een eindcijfer.</p>" +
    "<p>Voor een meertalig model wringt het meteen: de meeste benchmarks bestaan alleen in het Engels, een vertaalde benchmark meet niet helemaal hetzelfde, en benchmarks lekken — ze staan op het web, en het web zit in de trainingsdata. Er wordt op gefilterd, nooit perfect.</p>" +
    "<p>Als de scores op het Nederlands netjes oplopen en die op een kleinere taal niet, kan dat aan de benchmark liggen, aan de datamix of aan de tokenizer. Het uitzoeken daarvan is werk voor een week, en ondertussen draait de run door.</p>",
    "<p>Evaluation jobs run separately from the training run, against intermediate checkpoints, so the run itself never has to be interrupted. That gives a curve of benchmark scores against training tokens rather than just a final number.</p>" +
    "<p>For a multilingual model the problem shows up immediately: most benchmarks exist only in English, a translated benchmark does not measure quite the same thing, and benchmarks leak — they are on the web, and the web is in the training data. That gets filtered for, never perfectly.</p>" +
    "<p>If the Dutch scores climb steadily and those for a smaller language do not, it could be the benchmark, the data mix or the tokenizer. Working that out is a week of work, and meanwhile the run carries on.</p>"),
},
{
  id: "delen", share: 0.10, steps: [],
  title: L("Openbaar maken", "Making it public"),
  lede:  L("De datacatalogus, de code, de tussentijdse checkpoints en de evaluaties gaan naar buiten. Dat is werk, geen bijproduct.",
           "The data catalogue, the code, the intermediate checkpoints and the evaluations all go out. That is work, not a by-product."),
  body: L(
    "<p>Bij de meeste modellen van deze omvang kun je niet nagaan waarom ze doen wat ze doen. Hier wel, en dat is een expliciete eis: {{a:catalogue}} beschrijft welke tekst erin zit, {{a:autoexp}} is de trainingscode, en de checkpoints staan op {{a:hf}}.</p>" +
    "<p>Dat kost tijd die niet in het model gaat zitten. Documenteren welke filterversie welke run heeft gevoed, licenties per bron vastleggen, uitzoeken wat je wél en niet kunt publiceren. Het is het deel van het werk dat je later niet meer kunt inhalen — een run die niet gedocumenteerd is terwijl hij draaide, is achteraf niet meer te reconstrueren.</p>",
    "<p>For most models of this size you cannot check why they do what they do. Here you can, and that is an explicit requirement: {{a:catalogue}} describes what text went in, {{a:autoexp}} is the training code, and the checkpoints are on {{a:hf}}.</p>" +
    "<p>That costs time that does not go into the model. Documenting which filter version fed which run, recording licences per source, working out what can and cannot be published. It is the part of the work you cannot catch up on later — a run that was not documented while it ran cannot be reconstructed afterwards.</p>"),
},
],

/* -------------------------------------------------------------- closing -- */
closing: {
  t: L("Wat dit werk eigenlijk is", "What this work actually is"),
  body: L(
    "<p>Het beeld van AI-onderzoek is dat van iemand die een slimmer idee bedenkt. Het grootste deel van een pretrainingsproject bestaat uit iets anders: beslissingen nemen over tekst die je nooit allemaal zult lezen, hardware in de gaten houden die je niet kunt aanraken, en maanden volhouden aan een proces dat in één enkele stap niets zichtbaars oplevert.</p>" +
    "<p>Wat het de moeite waard maakt is dat de uitkomst openbaar is. De datacatalogus, de trainingscode, de tussentijdse checkpoints en de evaluaties staan open, zodat iemand anders kan nagaan waarom het model doet wat het doet — en het kan overdoen. Dat is bij de meeste modellen van deze omvang niet zo.</p>",
    "<p>The image of AI research is someone having a cleverer idea. Most of a pretraining project consists of something else: making decisions about text you will never read in full, watching hardware you cannot touch, and sustaining a process for months that produces nothing visible in any single step.</p>" +
    "<p>What makes it worth doing is that the outcome is public. The data catalogue, the training code, the intermediate checkpoints and the evaluations are all open, so that someone else can check why the model does what it does — and can redo it. For most models of this size, that is not the case.</p>"),
},

register: {
  t: L("Nog in te vullen", "Still to fill in"),
  lede: L("Deze pagina markeert expliciet wat nog niet is ingevuld, in plaats van er een schatting neer te zetten. Onderstaande lijst wordt automatisch opgebouwd uit de markeringen in de tekst.",
          "This page marks explicitly what has not been filled in, rather than putting an estimate there. The list below is built automatically from the markers in the text."),
  none: L("Alles is ingevuld.", "Everything has been filled in."),
},

foot: {
  about: L("Over deze pagina", "About this page"),
  aboutBody: L(
    "Gemaakt door iemand die aan deze runs werkt, bij {{a:surf}}, als onderdeel van {{a:oellm}}. De cijfers over het 32B-model zijn afgelezen uit het logbestand van de draaiende job op {{a:jupiter}}; het 9B-model draait op {{a:leonardo}}. Alles wat niet gemeten is, is als zodanig gemarkeerd.",
    "Made by someone working on these runs, at {{a:surf}}, as part of {{a:oellm}}. The figures for the 32B model are read from the log file of the running job on {{a:jupiter}}; the 9B model runs on {{a:leonardo}}. Everything that is not measured is marked as such."),
  links: L("Openbaar materiaal", "Public material"),
  method: L("Verantwoording", "Method"),
  methodBody: L(
    "Gemeten waarden komen uit het logbestand van de lopende run en uit de projectconfiguratie. Schematische figuren tonen de juiste vorm met benaderde waarden en zijn als zodanig gelabeld. Illustratieve voorbeelden zijn verzonnen om een mechanisme te laten zien en zijn nooit afgelezen uit een model.",
    "Measured values come from the log file of the running job and from the project configuration. Schematic figures show the correct shape with approximate values and are labelled as such. Illustrative examples are invented to demonstrate a mechanism and are never read off a model."),
},

/* phase names, and the marker for where a model currently is */
map: {
  phases: {
    data:   L("De tekst", "The text"),
    train:  L("De training", "The training"),
    finish: L("Afronden", "Finishing"),
  },
  hereNow: L("hier nu", "here now"),
},

/* short labels for the rows in the diagram */
short: {
  1:  L("Verzamelen", "Gather"),
  2:  L("Filteren", "Filter"),
  3:  L("Tokeniseren", "Tokenise"),
  4:  L("Mix", "Mix"),
  5:  L("Architectuur", "Architecture"),
  6:  L("Trainingsstap", "Training step"),
  7:  L("Cluster", "Cluster"),
  8:  L("Checkpoints", "Checkpoints"),
  9:  L("Annealing", "Annealing"),
  10: L("Instructie", "Instruction"),
  11: L("Evaluatie", "Evaluation"),
},

/* ------------------------------------------------------------- the voice -- */
/* One first-person note per step. These are written in the developer's own
   voice and are the part of the page that makes it a life rather than a manual.
   `date` is null until a real date is filled in; it renders when set. */
noteLabel: L("In de praktijk", "In practice"),
notes: {
  1: { date: null, d: L(
    "Het romantische deel van dit werk duurt ongeveer een week. Daarna ben je maandenlang bezig met de vraag of een archief uit 2019 nog online staat, of de licentie van een corpus wel dekt wat wij ermee doen, en waarom precies één bron zijn bestanden in een encoding aanlevert die niemand meer gebruikt. Ik heb meer tijd besteed aan e-mails over gebruiksrechten dan aan modellen.",
    "The romantic part of this job lasts about a week. After that you spend months on whether an archive from 2019 is still online, whether a corpus licence actually covers what we do with it, and why exactly one source ships its files in an encoding nobody uses any more. I have spent more time on emails about usage rights than on models.") },
  2: { date: null, d: L(
    "Het duurde drie dagen voordat we doorhadden dat onze taalherkenning een deel van het Vlaams als Afrikaans wegzette. Niemand merkte het, tot de Nederlandse evaluatiescores terugkwamen en lager waren dan we hadden verwacht. Zo'n fout zie je niet in de loss. Je ziet hem weken later, in een getal dat net iets tegenvalt, en dan mag je terugzoeken waar hij vandaan komt.",
    "It took three days before we realised our language identification was filing part of Flemish as Afrikaans. Nobody noticed until the Dutch evaluation scores came back lower than we expected. You do not see a mistake like that in the loss. You see it weeks later, in a number that is slightly disappointing, and then you get to work out where it came from.") },
  3: { date: null, d: L(
    "Dit is de beslissing waar ik het langst wakker van heb gelegen, en hij was in een middag genomen. De woordenlijst ligt vast vanaf stap één. Als over vier maanden blijkt dat we het Fins tekort hebben gedaan, is er geen knop om dat te herstellen — dan is er alleen de volgende run.",
    "This is the decision I have lost the most sleep over, and it was taken in an afternoon. The vocabulary is fixed from step one. If it turns out in four months that we short-changed Finnish, there is no button to fix it — there is only the next run.") },
  4: { date: null, d: L(
    "Hier komt de politiek binnen die niemand politiek noemt. Elk procent dat naar het Engels gaat, gaat niet naar een kleinere taal. Dat is een verdeelvraagstuk met een Europees project eromheen, en het wordt beslecht met een tabel meetresultaten van modellen die honderd keer kleiner zijn dan het model waar de uitkomst op wordt losgelaten.",
    "This is where the politics arrives that nobody calls politics. Every percent that goes to English does not go to a smaller language. That is a distribution question wrapped in a European project, and it gets settled with a table of measurements from models a hundred times smaller than the one the outcome is applied to.") },
  5: { date: null, d: L(
    "Je kunt op deze schaal niets uitproberen. Een experiment kost twee maanden en tweeduizend GPU's, dus er is er precies één. Wat je doet is extrapoleren uit kleine runs, met iedereen in de kamer eens per maand net zo onzeker als jij, en dan een getal opschrijven waar je de rest van het jaar aan vastzit.",
    "You cannot try anything at this scale. One experiment costs two months and two thousand GPUs, so there is exactly one. What you do is extrapolate from small runs, with everyone in the room about as uncertain as you once a month, and then write down a number you are stuck with for the rest of the year.") },
  6: { date: null, d: L(
    "Ik kijk elke ochtend naar dezelfde grafiek, en de eerlijke samenvatting is dat er meestal niets te zien is. De loss daalt met twee cijfers achter de komma per dag. Precies daarom is het routine: je leert de normale vorm van die lijn zo goed kennen dat je een afwijking ziet voordat je hem kunt uitleggen.",
    "I look at the same chart every morning, and the honest summary is that there is usually nothing to see. The loss falls by two decimal places a day. That is exactly why it is a routine: you get to know the normal shape of that line so well that you spot a deviation before you can explain it.") },
  7: { date: null, d: L(
    "Dit is het deel dat mensen het meest verbaast als ik het uitleg. Er is geen slimme foutafhandeling. Er is geen reserveonderdeel dat het overneemt. Tweeduizend GPU's lopen in de pas, en \u00e9\u00e9n kaart die van de bus valt legt het geheel plat. De rekening is tweeduizend GPU-uren per uur stilstand, en die loopt door terwijl ik nog aan het uitzoeken ben w\u00e9lke kaart het was.",
    "This is the part that surprises people most when I explain it. There is no clever error handling. There is no spare component that takes over. Two thousand GPUs run in lockstep, and one card falling off the bus takes down the whole thing. The bill is two thousand GPU-hours per hour of standing still, and it keeps running while I am still working out which card it was.") },
  8: { date: null, d: L(
    "Om de drie uur staat er 440 gigabyte op schijf, en om de paar dagen moet ik beslissen welke daarvan weg mogen. Dat klinkt als opruimen. Het is gokken: je gooit een toestand weg waarvan je over twee maanden misschien had gewild dat je hem nog had, om plaats te maken voor een toestand die je waarschijnlijk ook weggooit.",
    "Every three hours 440 gigabytes land on disk, and every few days I have to decide which of them can go. That sounds like tidying up. It is gambling: you throw away a state you might wish you still had in two months, to make room for a state you will probably also throw away.") },
  9: { date: null, d: L(
    "De laatste tien procent is het spannendste deel en tegelijk het deel waar je het minst kunt doen. Alles ligt al vast; je kijkt toe of het goed afloopt. Bij het 9B-model zitten we daar nu in. Het voelt als de laatste kilometers van iets wat je twee maanden geleden in gang hebt gezet.",
    "The final ten percent is the most nerve-racking part and at the same time the part where you can do the least. Everything is already fixed; you watch whether it ends well. We are in that phase now with the 9B. It feels like the last stretch of something you set in motion two months ago.") },
  10: { date: null, d: L(
    "Maanden rekentijd, en dan bepaalt een fase van een paar uur wat vrijwel iedereen van het model te zien krijgt. Dat is een ongemakkelijke verhouding. Het is ook de fase waarin het voor het eerst antwoord geeft, en dat blijft een merkwaardig moment: het ding waar je een half jaar naar hebt zitten kijken als een dalende lijn, zegt iets terug.",
    "Months of compute, and then a phase of a few hours determines what nearly everyone will ever see of the model. That is an uncomfortable ratio. It is also the phase where it answers for the first time, and that remains an odd moment: the thing you have watched for half a year as a descending line says something back.") },
  11: { date: null, d: L(
    "En dan blijkt het niet af te zijn. Evaluatie geeft je een cijfer per taak per taal, en daaronder ligt altijd de vraag of het cijfer meet wat je dacht. Het eerlijkste oordeel komt nog steeds van mensen die er een paar dagen mee werken — en dat is precies het soort resultaat dat je niet in een grafiek kwijt kunt.",
    "And then it turns out not to be finished. Evaluation gives you a number per task per language, and underneath it there is always the question of whether the number measures what you thought. The most honest judgement still comes from people working with it for a few days — and that is exactly the kind of result you cannot put in a chart.") },
},


/* ------------------------------------------------- interactive controls -- */
iact: {
  playWith:  L("Zelf proberen", "Try it yourself"),
  reset:     L("Terug naar de echte waarden", "Back to the real values"),
  changed:   L("aangepast", "changed"),
  real:      L("echte waarde", "real value"),

  /* 2 — filtering */
  filterT:   L("Draai zelf aan de filters", "Turn the filters yourself"),
  filterS:   L("Elke schuif is de strengheid van één filterstap", "Each slider is the strictness of one filter stage"),
  filterC:   L("Strenger filteren geeft schonere tekst maar minder tekst. Onder een bepaalde grens houd je te weinig over om een model van deze omvang één keer volledig te trainen, en moet je bronnen gaan herhalen — wat het model aanzet tot onthouden in plaats van generaliseren.",
                "Filtering harder gives cleaner text but less text. Below a certain point you no longer have enough to train a model this size once through, and you have to start repeating sources — which pushes the model towards memorising instead of generalising."),
  loose:     L("soepel", "loose"),
  strict:    L("streng", "strict"),
  remaining: L("Bruikbare tekst over", "Usable text remaining"),
  enough:    L("genoeg voor één volledige trainingsronde", "enough for one full pass of training"),
  notEnough: L("te weinig — bronnen moeten herhaald worden", "not enough — sources have to be repeated"),
  epochsNeeded: L("keer herhalen nodig", "repeats needed"),

  /* 3 — tokenising */
  typeHere:  L("Typ hier een zin", "Type a sentence here"),
  approx:    L("benadering", "approximation"),
  approxNote:L("Wat je zelf typt wordt hier gesplitst door een vereenvoudigde tokenizer die in de browser draait. De echte tokenizer draait op het cluster; de twee voorbeeldzinnen hieronder zijn wel echte uitvoer daarvan.",
                "What you type is split here by a simplified tokenizer running in the browser. The real tokenizer runs on the cluster; the two example sentences below are genuine output from it."),
  yourText:  L("Jouw zin", "Your sentence"),
  realEx:    L("Echte voorbeelden", "Real examples"),

  /* 4 — the mix */
  mixT:      L("Stel de mix zelf samen", "Compose the mix yourself"),
  mixS:      L("De aandelen worden automatisch weer op 100% genormaliseerd", "The shares are renormalised to 100% automatically"),
  mixC:      L("De gevolgen hieronder zijn een vereenvoudigde weergave van effecten die in de praktijk met kleine modellen gemeten worden. Ze laten de richting zien, niet de precieze uitkomst.",
                "The consequences below are a simplified rendering of effects that are measured in practice with small models. They show the direction, not the exact outcome."),
  effects:   L("Wat dat waarschijnlijk doet", "What that is likely to do"),
  effCode:   L("Redeneren en programmeren", "Reasoning and code"),
  effNl:     L("Nederlands", "Dutch"),
  effSmall:  L("Kleine EU-talen", "Smaller EU languages"),
  effFacts:  L("Feitenkennis", "Factual knowledge"),
  effMemo:   L("Risico op napraten", "Risk of memorisation"),

  /* 5 — architecture */
  archT:     L("Bouw een ander model", "Build a different model"),
  archS:     L("De maten bepalen het aantal parameters, het geheugen en hoe lang de run duurt", "The dimensions determine the parameter count, the memory and how long the run takes"),
  archC:     L("Deze rekensom is echt: het parameteraantal volgt direct uit de maten, en het geheugen uit de gebruikelijke boekhouding van gewichten, gradiënten en optimizer-toestand. De staptijd is geschaald vanaf de gemeten 5,8 seconden van de echte run.",
                "This arithmetic is real: the parameter count follows directly from the dimensions, and the memory from the usual accounting of weights, gradients and optimiser state. The step time is scaled from the measured 5.8 seconds of the actual run."),
  perGpu:    L("Geheugen per GPU", "Memory per GPU"),
  fits:      L("past op een GH200 (96 GB)", "fits on a GH200 (96 GB)"),
  fitsNot:   L("past niet — meer opdelen nodig", "does not fit — needs more splitting"),
  stepTime:  L("Tijd per stap", "Time per step"),
  runLength: L("Duur van de hele run", "Length of the whole run"),
  vsReal:    L("het echte 32B-model", "the real 32B model"),

  /* 6 — one step */
  stepT:     L("Voer één trainingsstap uit", "Run one training step"),
  stepS:     L("Dezelfde vier handelingen, 894.000 keer", "The same four operations, 894,000 times"),
  stepC:     L("Dit is de volledige lus. De getallen rechts zijn die van de echte run: 16,8 miljoen tokens per stap, bijna zes seconden, over 2.048 GPU's.",
                "This is the entire loop. The numbers on the right are from the real run: 16.8 million tokens per step, nearly six seconds, across 2,048 GPUs."),
  run1:      L("Voer één stap uit", "Run one step"),
  running:   L("bezig", "running"),
  ph1:       L("Vooruit", "Forward"),
  ph1d:      L("16,8 miljoen tokens gaan door 64 lagen. Op elke positie komt er een voorspelling uit.", "16.8 million tokens pass through 64 layers. At every position a prediction comes out."),
  ph2:       L("Vergelijken", "Compare"),
  ph2d:      L("Elke voorspelling wordt vergeleken met het token dat er werkelijk stond. Het verschil is de loss.", "Every prediction is compared with the token that actually followed. The difference is the loss."),
  ph3:       L("Terug", "Backward"),
  ph3d:      L("De fout gaat terug door alle 64 lagen. Dat geeft per parameter een richting.", "The error travels back through all 64 layers. That yields a direction per parameter."),
  ph4:       L("Bijstellen", "Update"),
  ph4d:      L("Alle 31,6 miljard parameters schuiven een klein stukje op. Daarna begint het opnieuw.", "All 31.6 billion parameters shift a tiny amount. Then it starts again."),
  stepsDone: L("stappen uitgevoerd", "steps run"),
  atThisRate:L("In dit tempo duurt de hele run", "At this rate the whole run takes"),

  /* 8 — checkpoints */
  ckT:       L("Hoe vaak sla je op?", "How often do you save?"),
  ckS:       L("De afweging tussen opslag en verloren werk", "The trade-off between storage and lost work"),
  ckC:       L("Er is geen goed antwoord, alleen een afweging. Vaker opslaan kost schijfruimte en stilstand tijdens het schrijven; minder vaak opslaan kost werk bij elke storing. De echte run slaat elke 2.000 stappen op.",
                "There is no right answer, only a trade-off. Saving more often costs disk space and idle time while writing; saving less often costs work at every fault. The real run saves every 2,000 steps."),
  every:     L("Opslaan elke", "Save every"),
  stepsW:    L("stappen", "steps"),
  ckStorage: L("Schijfruimte per dag", "Storage per day"),
  ckLost:    L("Gemiddeld verlies per storing", "Average loss per fault"),
  ckOver:    L("Stilstand door het schrijven zelf", "Idle time from writing itself"),
  ckWeek:    L("Totaal verlies per week", "Total loss per week"),
  ckBest:    L("laagste totaal", "lowest total"),

  /* 9 — annealing */
  wsdT:      L("Sleep langs het schema", "Drag along the schedule"),
  scrub:     L("Positie in de run", "Position in the run"),
  lrNow:     L("Leersnelheid hier", "Learning rate here"),
  phaseNow:  L("Fase", "Phase"),

  /* 7 + fail — the simulation */
  simT:      L("Een week meedraaien", "Ride along for a week"),
  simS:      L("Versnelde simulatie op basis van de echte staptijd en storingsfrequentie", "Accelerated simulation using the real step time and fault rate"),
  simC:      L("Eén seconde hier is ongeveer twee uur op het cluster. Storingen komen op willekeurige momenten, met de frequentie die uit de rekensom hierboven volgt. Zolang een storing niet is afgehandeld, staan alle 2.048 GPU's stil — de teller loopt dan niet. Dit is een model van de situatie, geen opname van de echte run.",
                "One second here is about two hours on the cluster. Faults arrive at random moments, at the frequency that follows from the arithmetic above. While a fault is unhandled, all 2,048 GPUs stand idle — the counter stops. This is a model of the situation, not a recording of the real run."),
  simStart:  L("Start de week", "Start the week"),
  simPause:  L("Pauzeer", "Pause"),
  simReset:  L("Opnieuw", "Reset"),
  simDay:    L("Dag", "Day"),
  simProgress:L("Voortgang deze week", "Progress this week"),
  simIdle:   L("Stilstand", "Idle"),
  simFaults: L("Storingen", "Faults"),
  simRestart:L("Herstart vanaf checkpoint", "Restart from checkpoint"),
  simDown:   L("De run staat stil", "The run has stopped"),
  simOk:     L("De run draait", "The run is running"),
  simWaiting:L("wachtend op iemand", "waiting for someone"),
  simEnd:    L("Week afgelopen", "Week over"),
  simSummary:L("In deze week is {a} van de {b} mogelijke tokens getraind. De rest van de tijd stond de machine stil te wachten.",
                "This week trained {a} of the {b} tokens that were possible. The rest of the time the machine stood waiting."),
  simAuto:   L("Automatisch herstarten", "Restart automatically"),
  simAutoNote:L("Met automatisch herstarten reageert een script binnen een minuut. Zonder duurt het tot iemand het merkt — 's nachts is dat gemiddeld een uur.",
                "With automatic restarts a script responds within a minute. Without, it takes until someone notices — at night that is an hour on average."),
},

/* --------------------------------------------------- key facts per step -- */
readOn: L("Lees verder", "Read on"),

/* ------------------------------------------------ labels on the diagram -- */

};

LINKS.aiact = { href: "https://digital-strategy.ec.europa.eu/en/faqs/general-purpose-ai-models-ai-act-questions-answers", label: L("de uitleg van de Europese Commissie", "the European Commission's guidance") };
C.project.entries[1] = L("Herkomst, gebruiksrechten en documentatie horen bij de selectie van trainingsdata. De bronvolumes en controles van deze run zijn hier nog niet volledig gedocumenteerd.", "Provenance, usage rights and documentation belong in training-data selection. Source volumes and checks for this run are not yet fully documented here.");
C.steps.find(function (s) { return s.id === 1; }).title = L("Bronnen & rechten", "Sources & rights");
C.steps.find(function (s) { return s.id === 1; }).body = L(
  "<p>Waar komt de tekst vandaan, onder welke voorwaarden mag die worden gebruikt, en hoe leggen we dat vast? Herkomstregistratie, licentiecontrole en documentatie maken die keuzes inzichtelijk.</p><p>Dit is geen verklaring van EU AI Act-conformiteit. Verplichtingen voor aanbieders omvatten onder meer een auteursrechtenbeleid en een openbare samenvatting van trainingsinhoud. Zie {{a:aiact}}.</p>",
  "<p>Where did the text come from, on what terms can it be used, and how is that recorded? Provenance records, licence checks and documentation make those choices inspectable.</p><p>This is not a declaration of EU AI Act compliance. Provider obligations include a copyright policy and a public summary of training content. See {{a:aiact}}.</p>");
C.steps.find(function (s) { return s.id === 2; }).title = L("Opschonen & selecteren", "Clean & select");
C.steps.find(function (s) { return s.id === 2; }).body = L(
  "<p>Tekst extraheren, taal herkennen, kwaliteit beoordelen en exacte of bijna gelijke kopieën verwijderen. Persoonsgegevens en overlap met evaluatiedata vragen aparte controles.</p><p>Dit zijn onderdelen om in een datapipeline te controleren, geen bevestiging dat onze run al deze controles toepast. De geïmplementeerde controles en meetresultaten moeten hier nog worden toegevoegd. Taal- en bronverhoudingen worden vervolgens in de datamix bepaald.</p>",
  "<p>Extract text, identify language, assess quality and remove exact or near duplicates. Personal data and overlap with evaluation data need separate checks.</p><p>These are checks to consider in a pipeline, not confirmation that our run implements them all. Implemented checks and measurements still need documenting here. Language and source proportions are then set in the data mix.</p>");
C.steps.find(function (s) { return s.id === 9; }).body = L(
  "<p>Annealing verlaagt de learning rate: parameters worden met kleinere stappen bijgesteld. Deze laatste pretraining kan samengaan met een verschuiving naar hoogwaardige data.</p><p>Contextverlenging traint op langere invoer. Dat is een afzonderlijke keuze en kan hier of in een aparte fase plaatsvinden. Het contextdoel en de precieze volgorde van onze run zijn hier nog niet bevestigd.</p><p>Het resultaat is een basismodel. SFT en eventuele voorkeur- of beloningstraining behoren tot post-training.</p>",
  "<p>Annealing reduces the learning rate, making parameter updates smaller. This final pretraining can coincide with a shift towards high-quality data.</p><p>Context extension trains on longer inputs. It is a separate choice that can happen here or in its own stage. The context target and exact ordering for our run are not yet confirmed here.</p><p>The result is a base model. SFT and any preference or reward training belong to post-training.</p>");
C.project.entries[12] = L("De methode voor voorkeur- of beloningstraining is voor deze modellen nog niet bevestigd op deze pagina. RLHF, DPO en RL met verifieerbare beloningen zijn verschillende mogelijke routes.", "The preference or reward-training method for these models has not been confirmed on this page. RLHF, DPO and RL with verifiable rewards are different possible routes.");
C.project.entries[13] = L("Kleine experimenten helpen het trainingsrecept te kiezen, met name global batch size en learning rate. De ingestelde waarden van de 32B-run zijn bekend; de onderliggende experimentresultaten staan hier nog niet.", "Small experiments help choose the training recipe, particularly global batch size and learning rate. The configured values for the 32B run are known; the underlying experimental results are not available here yet.");
C.steps.splice(10, 0, {
  id: 12, phase: "finish", at: [], title: L("Voorkeuren & beloningen", "Preferences & rewards"),
  lede: L("Na voorbeelden kan een model verder worden getraind met voorkeuren of beloningen.", "After demonstrations, a model can be further trained using preferences or rewards."),
  body: L("<p>SFT leert van voorbeelden van gewenste antwoorden. RLHF gebruikt menselijke feedback, vaak via een aangeleerd beloningsmodel. DPO optimaliseert rechtstreeks op voorkeursparen; RLVR gebruikt controleerbare beloningen, bijvoorbeeld of code tests doorstaat. Niet elke run gebruikt al deze methoden.</p>", "<p>SFT learns from demonstrations of desired answers. RLHF uses human feedback, often through a learned reward model. DPO optimizes directly on preference pairs; RLVR uses verifiable rewards, such as whether code passes tests. Not every run uses all of these methods.</p>")
});
C.steps.splice(4, 0, {
  id: 13, phase: "train", at: [], title: L("Trainingsrecept", "Training recipe"),
  lede: L("Welke batchgrootte en learning rate maken training efficiënt en stabiel?", "Which batch size and learning rate make training efficient and stable?"),
  body: L("<p>Global batch size bepaalt hoeveel sequenties samen één parameterupdate vormen, over alle GPU's. Learning rate bepaalt de grootte van die update. Kleine runs helpen instellingen te vergelijken.</p><p>Scaling laws beschrijven daarnaast bredere relaties tussen data, modelgrootte, rekenbudget en prestaties. Trainingsrecept-experimenten zijn een gerichte toepassing.</p>", "<p>Global batch size determines how many sequences contribute to one parameter update across all GPUs. Learning rate controls the size of the update. Small runs help compare settings.</p><p>Scaling laws also describe broader relationships between data, model size, compute and performance. Training-recipe experiments are a specific application.</p>")
});
C.short[12] = L("Beloningstraining", "Reinforcement learning");
C.steps.find(function (s) { return s.id === 12; }).body.nl += "<p>GRPO is een optimalisatie-algoritme voor reinforcement learning. RLHF en RLVR beschrijven de bron van de feedback: mensen of controleerbare uitkomsten. GRPO kan met verschillende beloningsbronnen worden gebruikt.</p>";
C.steps.find(function (s) { return s.id === 12; }).body.en += "<p>GRPO is an optimization algorithm for reinforcement learning. RLHF and RLVR describe where the feedback comes from: humans or verifiable outcomes. GRPO can be used with different reward sources.</p>";
C.steps.find(function (s) { return s.id === 6; }).body.nl += "<p>Het schema toont drie posities uit één tekst. Elke positie ziet alleen zichzelf en eerdere tokens, nooit toekomstige tokens. We berekenen voorspellingen parallel en middelen de negatieve logkans van de echte volgende tokens over de geldige trainingsposities. De balkjes zijn illustratief; het model voorspelt een verdeling over de hele woordenschat. Backpropagation berekent gradiënten; pas de optimizer verandert de parameters. De volgende batch start een nieuwe stap.</p>";
C.steps.find(function (s) { return s.id === 6; }).body.en += "<p>The diagram shows three positions from one text. Each position can see only itself and earlier tokens, never future tokens. Predictions are computed in parallel; the negative log-probability of the actual next tokens is averaged over valid training positions. The bars are illustrative; the model predicts a distribution over the entire vocabulary. Backpropagation computes gradients; only the optimizer changes parameters. The next batch starts a new step.</p>";
C.short[13] = L("Trainingsrecept", "Training recipe");
