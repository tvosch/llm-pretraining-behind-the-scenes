/* ==========================================================================
   Journey content — the only file to edit when adding copy or figures.

   assets/journey.js is the engine (map, navigation, live feed) and holds no
   copy. Three rules keep this file honest:

   1. NUMBERS COME FROM data.js, never from a literal here. Every figure gets
      `d`, which is the live snapshot deep-merged over SNAP. Writing 1,024 by
      hand creates a second source of truth that silently goes stale.

   2. UNKNOWNS ARE null IN data.js, and render through `tbd()` as the orange
      "still to fill in" chip. Never a plausible-looking guess.

   3. EVERY FIGURE THAT MAKES A DATA CLAIM CARRIES A TAG:
        measured     - every number in it comes from the run or the repo config
        schematic    - real structure, simplified drawing, no invented numbers
        illustrative - the example, curve or document is made up to explain
      `tag: null` means the figure claims nothing (a photo, a set of logos).

   Text fields take a plain string, or {nl, en} once a Dutch translation
   exists. `{{partners}}` is filled with the real partner count.
   ========================================================================== */

const JOURNEY = {};

/* ------------------------------------------------------------- the places */
/* `lon`/`lat` place the pin on the canvas map; the rest is copy. */
JOURNEY.places = [
  { name: 'Amsterdam', machine: 'Snellius',      operator: 'SURF',   country: 'The Netherlands', lon:  4.90, lat: 52.37 },
  { name: 'Kajaani',   machine: 'LUMI',          operator: 'CSC',    country: 'Finland',         lon: 27.73, lat: 64.23 },
  { name: 'Barcelona', machine: 'MareNostrum 5', operator: 'BSC',    country: 'Spain',           lon:  2.17, lat: 41.39 },
  { name: 'Bologna',   machine: 'Leonardo',      operator: 'Cineca', country: 'Italy',           lon: 11.34, lat: 44.49 },
  { name: 'Jülich',    machine: 'JUPITER',       operator: 'JSC',    country: 'Germany',         lon:  6.36, lat: 50.92 },
];

/* ----------------------------------------------------------- the chapters */
/* One entry per chapter, in order. `place` indexes JOURNEY.places.
   `visual` names a figure in JOURNEY.figures below; '' for no figure. */
JOURNEY.chapters = [
  {
    place: 0,
    label: 'Meet your guide',
    kicker: 'A personal view / From SURF to European HPC',
    title: 'Behind the scenes of training a European LLM',
    text: 'What does it take to train a large language model from scratch? Who does the work, and what happens when something breaks?',
    note: '',
    visual: 'welcome',
    tag: null,
  },
  {
    place: 0,
    label: 'The OpenEuroLLM project',
    kicker: 'Snellius · SURF / OpenEuroLLM',
    title: 'The OpenEuroLLM<br>model family.',
    text: '<a href="https://openeurollm.eu/" target="_blank" rel="noopener noreferrer">OpenEuroLLM</a> is developing a family of open language models for European languages. This journey takes us through the full process of pretraining an LLM, from preparing the data and testing the recipe to training and refining the final base model.',
    note: '',
    visual: 'intro',
    tag: null,
  },
  {
    place: 1,
    label: 'Preparing the data',
    kicker: 'LUMI · CSC / Data preparation',
    title: 'Before the model,<br>the data.',
    text: 'Our first stop beyond Amsterdam is Kajaani, Finland, home of LUMI, the supercomputer run by CSC.<br><br>Data is arguably the most important ingredient in training a language model. We collect and acquire <a href="https://github.com/OpenEuroLLM/training-data-collection/tree/main/flag" target="_blank" rel="noopener noreferrer" title="View the full list of data collections">datasets across 36 European languages and sources</a>.<br><br>One of these collections comes from our partners in the <a href="https://hplt-project.org/" target="_blank" rel="noopener noreferrer">HPLT project</a>: web documents drawn from the <a href="https://archive.org/" target="_blank" rel="noopener noreferrer">Internet Archive</a> and <a href="https://commoncrawl.org/" target="_blank" rel="noopener noreferrer">Common Crawl</a>. <a href="https://hplt-project.org/datasets/v3.0" target="_blank" rel="noopener noreferrer">HPLT 3.0</a> covers 198 language-script combinations.',
    note: '',
    visual: 'data',
    tag: null,
  },
  {
    place: 1,
    label: 'Tokenization',
    kicker: 'LUMI · CSC / Text into tokens',
    title: 'Every language<br>counts.',
    text: 'Before leaving Finland, we turn text into pieces the model can process: tokens. The process of decomposing human-readable text into a fixed set of numbers is called tokenization. We convert text into a fixed vocabulary of numerical IDs such that the model can perform all kinds of operations on them.<br><br>We train our own tokenizer for efficient coverage of European languages. Its vocabulary contains 262,144 pieces. That is different from context length: the vocabulary describes which pieces are available, while context length limits how many fit together that the LLM sees at once. More tokens means better coverage and more efficient text processing (and cheaper!). The trade-off is that more tokens also introduces more learnable parameters.',
    note: '',
    visual: 'tokenization',
    tag: null,
  },
  {
    place: 2,
    label: 'Scaling experiments',
    kicker: 'MareNostrum 5 · BSC / Experiments',
    title: 'Small runs.<br>Big decisions.',
    text: 'From chilly Finland to sunny Barcelona. With the data prepared, we need a model architecture and the key training settings, or hyperparameters, that influence how quickly and how well the model learns. We also need a data mix that balances language coverage and performance within our compute and time budget.<br><br>A large run is too expensive for trial and error, so we run around {{smallRuns}} small ones to compare the recipes and extrapolate our findings to the large pretraining run. Scaling laws predict how the results change as model size, data and compute grow, and we use those predictions to choose the settings for the big run.',
    note: 'Made-up curves to show the idea; the paper below has our real scaling results.',
    visual: 'scaling',
    tag: 'illustrative',
  },
  {
    place: 3,
    label: 'Prelude · 9B',
    kicker: 'Leonardo · Cineca / Pretraining',
    title: 'Prelude.',
    text: 'Keeping the Mediterranean vibes, we head to Bologna for our first “baby” model: Prelude. It is a sanity check before going bigger, but small is relative: this run still took more than a month of continuous compute on 1,024 GPUs!<br><br>We bring the data prepared in Finland to Italy, take the training settings from our experiments in Spain, check that the software works end to end, and start training on Leonardo. The result is our smallest model: 9 billion parameters, trained on 10 trillion tokens.',
    note: '',
    visual: 'nine',
    tag: null,
  },
  {
    place: 3,
    label: 'MultiSynt · synthetic data',
    kicker: 'Leonardo · Cineca / Multilingual data',
    title: 'MultiSynt.',
    text: 'While we are in Bologna, let’s look at the challenge of medium- and low-resource languages. There is plenty of text written originally in English on the internet. For European languages such as Albanian or Maltese, much less digitized text is available. That makes it harder to gather enough training material.<br><br>OpenEuroLLM, together with EuroLLM (real creative with naming, huh), have therefore initiated MultiSynt: an open multilingual synthetic dataset for LLM pre-training. The MultiSynt/MT work translates existing text into 36 languages to enrich their training data. Leonardo runs the large-model translation pipeline, while a complementary translation pipeline runs on LUMI. For many medium- and lower-resource European languages, this is the largest openly available pretraining resource.',
    note: 'The document icons stand for translated text in each language. The token counts come from the MultiSynt/MT paper.',
    visual: 'MultiSynt',
    tag: 'illustrative',
  },
  {
    place: 4,
    label: 'The 32B run',
    kicker: 'JUPITER · JSC / Training',
    title: 'Now, 32 billion.',
    text: 'Next stop: Jülich, Germany. On JUPITER, we scale up to 32 billion parameters, the adjustable numbers inside our model. This is the middle child of the OpenEuroLLM family. Larger models are yet to come!<br><br>Now {{gpus}} GPUs work together on one model. We divide the work in two ways: each group of {{replicaGpus}} GPUs shares a copy of the model, while {{replicas}} groups process different text in parallel. After each training step, they combine their proposed adjustments and update their copies together. Different reading material, one shared model. Without interruptions, the full training schedule takes about {{trainDays}} days.<br><br>The numbers below come from a snapshot of the running job; the timestamp says when it was taken. Tokens per second shows how fast the model processes text; the progress bar shows how much of the planned token budget it has processed.',
    note: '',
    visual: 'run',
    tag: null,
  },
  {
    place: 4,
    label: 'One training step',
    kicker: 'JUPITER · JSC / Inside a step',
    title: 'How a model<br>actually learns.',
    text: 'What are all those GPUs doing? We give the model text and ask it to predict, token by token, what comes next. The text already contains the answers, so nobody has to label anything by hand.<br><br>The model’s prediction is a probability for every possible next token. We check how much probability it gave the token that actually came next. Giving the right token very little probability produces a larger penalty, called loss.<br><br>From that loss we work out how to adjust the parameters, make a small update, and move on to the next batch. The diagram shows a tiny example; during training, we combine this feedback across millions of tokens before making an update. Repeat that across trillions of tokens: that is pretraining.',
    note: '',
    visual: 'step',
    tag: null,
  },
  {
    place: 4,
    label: 'Scaling across GPUs',
    kicker: 'JUPITER · JSC / Working together',
    title: 'More GPUs.<br>More coordination.',
    text: 'How do we go from one GPU to thousands? On JUPITER, {{gpusPerNodeWord}} GPUs share one computer, called a node. Fast links inside that node let them exchange information. A high-speed network connects the nodes, so our {{nodes}} computers can train together using {{gpus}} GPUs.<br><br>Adding GPUs gives us more computing power, but also more coordination. They must exchange intermediate results and combine their proposed model updates. If one group is slower, others may wait. Reading training data fast enough matters too. We tune how the work is divided and try to transfer information while other calculations keep going.<br><br>Ideally, twice as many GPUs would process twice as much text per second. In practice, communication and waiting eat into that gain. Scaling efficiency tells us how close we get to the ideal. In the example below, 95% means reaching 95% of the ideal throughput, not that each GPU is busy 95% of the time.',
    note: 'Illustrative placeholder, not a measured result. Throughput is relative to a one-GPU baseline for a workload that fits on one GPU; our 32B training does not. Real scaling measurements will replace this example.',
    visual: 'gpuScaling',
    tag: 'illustrative',
  },
  {
    place: 4,
    label: 'Babysitting the run',
    kicker: 'JUPITER · JSC / Day-to-day',
    title: 'Babysitting<br>billions of parameters.',
    text: 'You cannot press “start pretraining” and simply hope it will be finished {{trainDays}} days later. We check, both manually and automatically, that the model is actually training and learning well.<br><br>We call this babysitting. Alongside the automatic monitoring tools, we have a babysitting schedule so there is also a person responsible for keeping an eye on the run. Here is what that involves.',
    note: '',
    visual: 'monitor',
    tag: null,
  },
  {
    place: 4,
    label: 'A day in the life',
    kicker: 'Behind the scenes / The human part',
    title: 'A day in the life<br>of an LLM babysitter.',
    text: 'Back at my desk in Amsterdam, the morning starts with a question: is the run still alive? Training carries on overnight, so I check how its night went before anything else.<br><br>Then: “Hi Claude.” I start a session, open the logs, and debug if something needs attention. If everything looks healthy, the run carries on while I work on data processing and experiments.',
    note: '',
    visual: 'day',
    tag: null,
  },
  {
    place: 4,
    label: 'When loss turns upward',
    kicker: 'JUPITER · JSC / Earlier run: 32B v1',
    title: 'When training<br>goes off track.',
    text: 'Here is a real reason to keep watching. In an earlier 32B run, loss had been falling: the model was assigning more probability to the tokens that actually came next. Its predictions on the training text were improving.<br><br>Then the trend reversed. One noisy batch means little; a rise that lasts thousands of steps means something is wrong. The graph shows when it happened. Finding the cause means checking what changed, reading the training diagnostics, and deciding whether to intervene.',
    note: '',
    visual: 'incident',
    tag: null,
  },
  {
    place: 4,
    label: 'Annealing',
    kicker: 'JUPITER · JSC / Next phase',
    title: 'Slowing down<br>on purpose.',
    text: 'Towards the end of pretraining, we stay on JUPITER, but change how the model learns. To see why, it helps to look at the whole training schedule.<br><br>At the start, we gradually increase the learning rate, which controls how much the model changes at each training step. This warm-up helps avoid unstable changes while the model is just getting started. Then comes a long, steady phase: we keep that rate constant while the model learns from the bulk of our data.<br><br>Finally, we lower the rate so the model makes smaller, finer adjustments to what it has already learned. This is annealing. We also give more weight to carefully selected, high-quality text, so the final stretch focuses on material we most want it to learn from. It is still learning to predict text; answering user questions comes next.',
    note: 'The shape of the learning-rate schedule, without real values.',
    visual: 'anneal',
    tag: 'schematic',
  },
  {
    place: 4,
    label: 'Supervised fine-tuning',
    kicker: 'To come / SFT',
    title: 'From text to<br>helpful answers.',
    text: 'A pretrained base model has learned to continue text, but that does not reliably make it a helpful assistant for question answering.<br><br>Supervised fine-tuning (SFT) trains it on example conversations: a user request paired with a carefully written or selected answer. These examples teach it to respond directly, explain clearly and follow instructions such as “answer in Dutch” or “return JSON only”.<br><br>After this stage, the model is better at answering user questions. Under the hood, it still predicts the next token; what changes is the kind of response it has learned to produce.',
    note: 'Illustrative samples, not our actual training dataset. The location of post-training is not decided; the map remains at the last stop.',
    visual: 'sft',
    tag: 'illustrative',
  },
  {
    place: 4,
    label: 'Reinforcement learning',
    kicker: 'To come / Post-training',
    title: 'Learning from<br>feedback.',
    text: 'In SFT, we supply an example answer. In reinforcement learning, the model writes its own answers and receives scores, called rewards. Training makes higher-scoring responses more likely.<br><br>For maths, a program can check an answer against a known solution. This is reinforcement learning with verifiable rewards, or RLVR. For qualities such as helpfulness and safety, people can compare answers. Their preferences can train a reward model; using that feedback for reinforcement learning is called RLHF.<br><br>GRPO is one algorithm for learning from these rewards. The examples below show why the reward matters: we want correct answers and less harmful output, without teaching the model to refuse perfectly ordinary requests.',
    note: 'Illustrative samples and rewards, not results from our model. Our post-training method is not decided yet.',
    visual: 'rl',
    tag: 'illustrative',
  },
  {
    place: 0,
    label: 'Back in Amsterdam',
    kicker: 'SURF · Amsterdam / The work continues',
    title: 'Back at my desk.',
    text: 'We have travelled from data preparation in Finland to experiments in Spain, Prelude and MultiSynt in Italy, and the 32B run in Germany. From my desk in Amsterdam, these efforts contribute to the same objective: pretraining a European language model from scratch.<br><br>Working across different supercomputers brings practical challenges. Data has to move between sites, software has to work on different machines, and plans depend on when computing time is available. But it also means working with people from different countries and cultures, learning from their experience and sharing our own.<br><br>And between the experiments and meetings, there is still the babysitting: checking the run, investigating surprises, and making sure someone is keeping an eye on it. The 32B run is one step towards the wider OpenEuroLLM model family. For now, back to the dashboard: is the run still healthy?',
    note: '',
    visual: 'closing',
    tag: null,
  },
];

/* ----------------------------------------------------------- the partners */
/* Logos live in assets/partners/. `group` drives the three sections. */
JOURNEY.partnerGroups = [
  ['research', 'Universities & research'],
  ['company',  'Companies'],
  ['hpc',      'HPC centres'],
];

JOURNEY.partners = [
  { name: 'Charles University / UFAL',            href: 'https://ufal.mff.cuni.cz',            logo: 'charles-university.webp',   group: 'research' },
  { name: 'AI Sweden',                            href: 'https://www.ai.se/en',                logo: 'ai-sweden.webp',            group: 'research' },
  { name: 'ALT-EDIC',                             href: 'https://alt-edic.eu/about-us/',       logo: 'alt-edic.webp',             group: 'research' },
  { name: 'University of Tübingen',               href: 'https://uni-tuebingen.de/en/',        logo: 'university-tuebingen.webp', group: 'research' },
  { name: 'ELLIS Institute Tübingen',             href: 'https://institute-tue.ellis.eu/',     logo: 'ellis-tuebingen.webp',      group: 'research' },
  { name: 'Fraunhofer IAIS',                      href: 'https://www.iais.fraunhofer.de/en.html', logo: 'fraunhofer-iais.webp',   group: 'research' },
  { name: 'Barcelona Supercomputing Center',      href: 'https://www.bsc.es/',                 logo: 'bsc.svg',                   group: 'research' },
  { name: 'Forschungszentrum Jülich',             href: 'https://www.fz-juelich.de/en',        logo: 'fz-juelich.webp',           group: 'research' },
  { name: 'Eindhoven University of Technology',   href: 'https://www.tue.nl/en/',              logo: 'tu-eindhoven.webp',         group: 'research' },
  { name: 'University of Helsinki',               href: 'https://www.helsinki.fi/en',          logo: 'university-helsinki.webp',  group: 'research' },
  { name: 'University of Oslo',                   href: 'https://www.uio.no/english/',         logo: 'university-oslo.webp',      group: 'research' },
  { name: 'University of Turku',                  href: 'https://www.utu.fi/en',               logo: 'university-turku.webp',     group: 'research' },
  { name: 'Aleph Alpha',                          href: 'https://aleph-alpha.com/',            logo: 'aleph-alpha.webp',          group: 'company'  },
  { name: 'AMD Silo AI',                          href: 'https://www.silo.ai/',                logo: 'amd-silo-ai.svg',           group: 'company'  },
  { name: 'Ellamind',                             href: 'https://ellamind.com/',               logo: 'ellamind.webp',             group: 'company'  },
  { name: 'LightOn',                              href: 'https://www.lighton.ai/',             logo: 'lighton.webp',              group: 'company'  },
  { name: 'ELDA',                                 href: 'http://www.elda.fr/en/',              logo: 'elda.webp',                 group: 'company'  },
  { name: 'Prompsit',                             href: 'https://www.prompsit.com/',           logo: 'prompsit.webp',             group: 'company'  },
  { name: 'Cineca',                               href: 'https://www.cineca.it/en',            logo: 'cineca.svg',                group: 'hpc'      },
  { name: 'CSC',                                  href: 'https://csc.fi/en/',                  logo: 'csc.webp',                  group: 'hpc'      },
  { name: 'SURF',                                 href: 'https://www.surf.nl/en',              logo: 'surf.webp',                 group: 'hpc'      },
];

/* ------------------------------------------- interface strings */
/* The few words the engine itself puts on screen. Same {nl, en} rule. */
/* What goes wrong on a cluster this size. Shares come from data.js and are
   schematic: typical proportions, not this run's own record. */
JOURNEY.failureCauses = {
  gpu:     'GPU',
  network: 'Network',
  storage: 'Storage',
  hang:    'Hang',
  oom:     'Out of memory',
  other:   'Other',
};

JOURNEY.ui = {
  acrossEurope:    'Across Europe',
  oneCollaboration:'One collaboration',
  collaborationSub:'Research · Industry · Supercomputing',
  operatedBy:      'Operated by',       // "Operated by SURF · The Netherlands"
  nextStop:        'Next stop',
  continue:        'Continue',
  backToStart:     'Back to start',
  nextChapter:     'Next chapter',
  toCome:          'To come',
  deduplicate:     'Deduplicate sample',
  resetSample:     'Reset sample',
  pauseFigure:     'Pause training illustration',
  resumeFigure:    'Resume training illustration',
  liveFeed:        'Live feed',
  snapshot:        'Snapshot',
  mapUnavailable:  'Map unavailable · Journey locations remain selectable',
  stillToFillIn:   'still to fill in',
};

/* -------------------------------------------------- shared figure parts */
/* Building blocks more than one figure uses. The engine hands both to every
   figure, so a figure calls tokens([...]) or plot() rather than importing. */
JOURNEY.parts = {

  tokens: values => `<div class="tokens">${values.map(v => `<span class="token">${v}</span>`).join('')}</div>`,

  /* Two illustrative curves, or the annealing schedule with plot(true).
     The shapes are drawn by hand: no measured series goes through here. */
  plot: (anneal = false) => `
    <svg class="plot" viewBox="0 0 380 140" role="img" aria-label="${anneal ? 'Illustrative learning rate schedule' : 'Illustrative experimental loss curves'}">
      <path class="axis" d="M25 10V110H365"/>
      <text x="25" y="132">${anneal ? 'Warm-up' : 'Less training'}</text>
      <text x="365" y="132" text-anchor="end">${anneal ? 'Annealing' : 'More training'}</text>
      ${anneal ? `
        <path stroke="#18775c" d="M25 105L65 25H230L355 105"/>
        <text x="150" y="132" text-anchor="middle">Steady training</text>
        <path stroke="#c25a35" stroke-dasharray="3 4" d="M230 12V113"/>
        <text x="365" y="13" text-anchor="end" style="font-weight:700">Smaller adjustments</text>
        <text x="365" y="26" text-anchor="end">The learning rate falls</text>` : `
        <path stroke="#18775c" d="M25 15C50 70 75 76 125 86S275 104 355 107"/>
        <path stroke="#c25a35" d="M25 25C60 46 90 70 140 74S260 89 355 94"/>`}
    </svg>`,
};

/* ------------------------------------------------------------ the figures */
/* One function per `visual` name above. Each receives a context object:

     d        the numbers: live snapshot deep-merged over SNAP (data.js)
     num      1234567 -> "1,234,567"
     tbd      the orange "still to fill in" chip, for a null in d
     stamp    "Snapshot · 19 Sep 2026, 14:57" for the current data
     tokens   an array of token strings -> the token row
     plot     the loss/schedule line chart; plot(true) for the LR schedule
     partners JOURNEY.partners, groups JOURNEY.partnerGroups

   Return an HTML string. Read numbers off `d` — see rule 1 at the top. */
JOURNEY.figures = {

  welcome: () => `
    <div class="welcome-copy">
      <p>I work on pretraining large language models from scratch at SURF, as part of OpenEuroLLM. This journey shows what that work looks like, on European supercomputers and for European languages.</p>
      <p>We start at my office in Amsterdam, at SURF, the organisation behind the Dutch national supercomputer Snellius. From here, I work across several of Europe’s supercomputers.</p>
    </div>`,

  intro: ({ d, tbd, partners, groups }) => `
    <p class="project-aims">OpenEuroLLM aims: truly open · EU-compliant · linguistically diverse.</p>
    <div class="family-label">THE OPENEUROLLM MODEL FAMILY</div>
    <div class="model-family">
      <div><strong>${d.m9.name}</strong><span>Smallest</span><small>Awaiting annealing</small></div>
      <i data-lucide="arrow-right"></i>
      <div class="family-current"><strong>${d.m32.name}</strong><span>Intermediate</span><small>Training now</small></div>
      <i data-lucide="arrow-right"></i>
      <div><strong>${d.family.nextModelYear ?? tbd('roadmap year')}</strong><span>Larger model</span><small>Planned</small></div>
    </div>
    <section class="project-collaboration"><h2>Working across Europe</h2><p>OpenEuroLLM brings together research groups, companies and supercomputing centres from across Europe. Each stop on the map is a place where part of the work happens.</p></section>
    <details class="chapter-story project-partners"><summary>Meet the partners</summary><div class="project-partner-list">${JOURNEY.figures.partners({partners,groups})}</div></details>
    `,

  partners: ({ partners, groups }) => `
    ${groups.map(([group, label]) => `
      <section class="partner-group" aria-label="${label}">
        <h2>${label}</h2>
        <ul class="partner-grid">
          ${partners.filter(p => p.group === group).map(p => `
            <li><a class="partner-logo" href="${p.href}" target="_blank" rel="noopener noreferrer" title="${p.name}" aria-label="${p.name} (opens in a new tab)"><img src="assets/partners/${p.logo}" alt="${p.name}"></a></li>`).join('')}
        </ul>
      </section>`).join('')}
    <div class="funding-credit"><img src="assets/images/EU-cofounded.webp" alt="Co-funded by the European Union"></div>`,

  /* A conceptual pipeline, not a claim about HPLT's exact processing order. */
  data: () => `
    <div class="curation-source"><i data-lucide="files"></i><span><strong class="curation-scale">7.2 petabytes</strong>Raw web crawls · 2012–2024<br><small><a href="https://archive.org/" target="_blank" rel="noopener noreferrer">Internet Archive</a> + <a href="https://commoncrawl.org/" target="_blank" rel="noopener noreferrer">Common Crawl</a></small></span><a href="https://hplt-project.org/" target="_blank" rel="noopener noreferrer"><img src="assets/images/HPLT-logo.svg" alt="HPLT project" width="90" height="40"></a></div>
    <div class="curation-arrow" aria-hidden="true"><i data-lucide="arrow-down"></i></div>
    <p class="curation-intro">Before text reaches the model, it goes through extensive curation.</p>
    <div class="curation-stages">
      ${[
        ['languages','Language identification','Which language is this?','Identify the language of documents and passages so we can select and balance the training material.'],
        ['text-cursor-input','Normalization','Make the text consistent.','Standardize text encoding and formatting so accidental differences do not get in the way of processing.'],
        ['copy-minus','Deduplication','Avoid learning the same text repeatedly.','Find exact and near-duplicate content so repeated pages do not dominate the training mix.'],
        ['shield-check','PII removal','Filter identifying information.','Detect and remove or mask personal information, such as email addresses and phone numbers. Automated detection is imperfect.'],
        ['file-check','robots.txt filtering','Check website crawling restrictions.','Filter according to the applicable robots.txt rules. These express crawler access preferences; they are not a copyright licence.'],
        ['list-filter','Decontamination','Keep test material out of training.','Check for overlap with evaluation datasets, so memorized test answers do not inflate the results.']
      ].map(([icon,title,short,detail])=>`<details class="curation-stage"><summary><i data-lucide="${icon}" aria-hidden="true"></i><span><strong>${title}</strong><small>${short}</small></span></summary><p>${detail}</p></details>`).join('')}
    </div>
    <div class="curation-arrow" aria-hidden="true"><i data-lucide="arrow-down"></i></div>
    <div class="curation-output"><i data-lucide="database"></i><span><strong class="curation-scale">13.5 trillion tokens</strong>HPLT 3.0 · non-English portion<br><small>Published count using the Gemma 3 tokenizer</small></span></div>
    <p class="curation-intro">These figures are for HPLT 3.0 alone; our training set combines it with other collections. Next, the selected text is tokenized.</p>
    <a class="project-link" href="https://hplt-project.org/datasets/v3.0" target="_blank" rel="noopener noreferrer">HPLT 3.0 dataset statistics <i data-lucide="arrow-up-right"></i></a>`,

  tokenization: ({ d, num, tokens }) => `
    <div class="intro-meta"><div><strong>${num(d.tokenizer.vocab)}</strong>tokens in the vocabulary</div></div>
    <p class="visual-caption">${d.tokenizer.examples[0].text}</p>
    ${tokens(d.tokenizer.examples[0].pieces)}
    <a class="project-link" href="https://huggingface.co/openeurollm/tokenizer-256k" target="_blank" rel="noopener noreferrer">OpenEuroLLM tokenizer · 262k <i data-lucide="arrow-up-right"></i></a>
    <a class="project-link" href="https://www.ellamind.com/blog/tokenization-tax-report-2026" target="_blank" rel="noopener noreferrer">Tokenization Tax 2026 · ellamind <i data-lucide="arrow-up-right"></i></a>`,

  scaling: ({ plot }) => {
    return `
    <div class="intro-meta">
      <div><strong>Batch size</strong>Text per training step</div>
      <div><strong>Learning rate</strong>How much the model changes per step</div>
      <div><strong>Data mix</strong>What it learns from</div>
    </div>
    <figure class="scaling-evidence">
      ${plot()}
      <div class="legend"><span>Recipe A</span><span>Recipe B</span></div>
      <figcaption>Lower is better: recipe A predicts better for the same amount of training.</figcaption>
    </figure>
    <a class="scaling-paper" href="https://arxiv.org/abs/2608.28308" target="_blank" rel="noopener noreferrer"><span>Deriving Scaling Laws for OpenEuroLLM Models: Learning Rate, Batch Size and Loss</span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
    `;
  },

  nine: ({ d, num, tbd }) => `
    <div class="prelude-stats">
      <div><strong>${d.m9.name}</strong><span>parameters</span></div>
      <div><strong>${d.m9.gpus == null ? tbd('9B GPU count') : num(d.m9.gpus)}</strong><span>${d.m9.gpuType ?? 'GPUs'}</span></div>
      <div><strong>${d.m9.totalTokens == null ? tbd('Prelude training tokens') : (d.m9.totalTokens / 1e12) + 'T'}</strong><span>training tokens</span></div>
      <div><strong>1+ month</strong><span>of training</span></div>
    </div>
    <p class="visual-caption">All intermediate checkpoints are publicly available on <a href="${d.m9.weightsUrl}" target="_blank" rel="noopener noreferrer"><u>Hugging Face</u></a>.</p>`,

  MultiSynt: () => `
    <div class="synth-flow">
      <i data-lucide="languages" aria-hidden="true"></i>
      <strong>Machine translation into 36 languages</strong>
      <i data-lucide="arrow-down" aria-hidden="true"></i>
      <div class="synth-documents" aria-label="Illustrative multilingual documents">
        ${['SQ', 'NL', 'FI', 'IT', 'ES', '…'].map(lang => `<div class="synth-document"><span>${lang}</span><i></i><i></i><i></i></div>`).join('')}
      </div>
    </div>
    <p class="visual-caption">In total, MultiSynt consists of approximately 4.8 trillion target-language tokens across 36 languages, produced by translating 100 billion high-quality Nemotron-CC tokens with Tower+ and OPUS-MT/HPLT-MT models.</p>
    <a class="scaling-paper" href="https://arxiv.org/abs/2607.00890" target="_blank" rel="noopener noreferrer"><span>Read more: MultiSynt/MT: Trillion-Token Multi-Parallel Pre-Training Data Translated Across 36 Languages</span><i data-lucide="arrow-up-right" aria-hidden="true"></i></a>`,

  /* GPU and node counts come from d.m32; the tick labels are fractions of the
     GPU count, placed at the same fractions of the axis. */
  gpuScaling: ({ d, num, tbd }) => {
    const m = d.m32, known = Number.isFinite(m.gpus) && m.gpus > 0;
    const at = f => known ? num(Math.round(m.gpus * f)) : tbd('32B GPU count');
    return `
    <div class="gpu-scale-route">
      <div><i data-lucide="cpu" aria-hidden="true"></i><strong>1 GPU</strong><span>One accelerator</span></div>
      <div><i data-lucide="server" aria-hidden="true"></i><strong>${m.gpusPerNode ?? tbd('GPUs per node')} GPUs</strong><span>One node · fast local links</span></div>
      <div><i data-lucide="network" aria-hidden="true"></i><strong>${at(1)} GPUs</strong><span>${num(m.nodes)} nodes · shared network</span></div>
    </div>
    <figure class="gpu-scale-chart">
      <svg viewBox="0 0 600 310" role="img" aria-labelledby="gpu-scale-title gpu-scale-desc">
        <title id="gpu-scale-title">Illustrative throughput scaling, not measured results</title>
        <desc id="gpu-scale-desc">GPU count runs from 1 to ${known ? num(m.gpus) : 'the full machine'}. Ideal throughput rises proportionally. The example reaches 95 percent of ideal throughput at the full GPU count. This is a generic illustration, not a single-GPU benchmark of the 32B model.</desc>
        <g class="scale-grid"><path d="M64 45H560 M64 145H560 M64 245H560"/></g>
        <path class="scale-axis" d="M64 35V245H560"/>
        <path class="scale-ideal" d="M64 245L560 45"/>
        <path class="scale-example" d="M64 245L126 220L188 196L312 148L436 101L560 55"/>
        <circle cx="560" cy="55" r="5" fill="var(--green)"/>
        <g class="scale-label"><text x="64" y="20">Relative throughput</text><text x="53" y="249" text-anchor="end">0</text><text x="53" y="149" text-anchor="end">${at(.5)}×</text><text x="53" y="49" text-anchor="end">${at(1)}×</text><text x="64" y="266">1</text><text x="188" y="266" text-anchor="middle">${at(.25)}</text><text x="312" y="266" text-anchor="middle">${at(.5)}</text><text x="560" y="266" text-anchor="end">${at(1)}</text><text x="312" y="295" text-anchor="middle">Number of GPUs (${m.gpusPerNode ?? '?'} per node)</text><text x="550" y="120" text-anchor="end">95% of ideal</text></g>
      </svg>
      <div class="gpu-scale-key"><span>Dashed: ideal</span><span>Solid: example</span></div>
    </figure>`;
  },

  /* The node grid is drawn from d.m32.nodes, so the picture and the stat
     above it can never disagree. */
  run: ({ d, num, stamp, tbd }) => {
    const m = d.m32;
    const rate = Number.isFinite(m.tokensPerStep) && m.secPerStep > 0 ? m.tokensPerStep / m.secPerStep : null;
    /* Attributes need plain text, so these stay separate from num(). */
    const nodes = Number.isFinite(m.nodes) ? m.nodes : 0;
    const perNode = m.gpusPerNode ?? '?';
    const known = Number.isFinite(m.step) && m.totalSteps > 0;
    const percent = known ? Math.min(100, Math.max(0, m.step / m.totalSteps * 100)) : 0;
    const seen = known && Number.isFinite(m.tokensPerStep) && Number.isFinite(m.totalTokens)
      ? `${(m.step * m.tokensPerStep / 1e12).toFixed(2)}T / ${(m.totalTokens / 1e12).toFixed(0)}T tokens` : '';
    return `
    <div class="run-stats">
      <div><strong>${num(m.gpus)}</strong>${m.gpuType ? m.gpuType.split(' ').pop() : ''} GPUs</div>
      <div><strong>${num(m.nodes)}</strong>nodes</div>
      <div><strong>${rate == null ? '—' : (rate / 1e6).toFixed(1) + 'M'}</strong>tokens / second</div>
    </div>
    <div class="gpu-grid" aria-label="${nodes} nodes, ${perNode} GPUs per node">${'<i></i>'.repeat(nodes)}</div>
    <div class="visual-caption">One square = one node of ${perNode} ${m.gpuType ? m.gpuType.split(' ').pop() : ''} GPUs</div>
    <div class="progress-label">
      <strong>${known ? percent.toFixed(1) + '% of planned training' : tbd('32B progress')}</strong>
      <span>${seen}</span>
    </div>
    <progress value="${percent}" max="100" aria-label="${m.name} training progress"></progress>
    <p class="visual-caption">${rate == null ? '' : `About ${(rate / 2 / 1e6).toFixed(1)} million words per second, at roughly 2 tokens per word (this varies by language).`}</p>
    <p class="ticker">At this pace, tokens processed since opening this page: <strong id="token-ticker">0</strong>
      <small>Illustrative counter, assuming uninterrupted training at the recorded speed.</small></p>
    <div class="visual-caption">${stamp()}</div>`;
  },

  /* The four phase buttons drive this figure: the engine sets .visual[data-active]
     and marks [data-phase] elements .current. Tokens are the real output of
     openeurollm/tokenizer-256k (checked by dev/tokenize-examples.py); guesses
     and probabilities are invented. The measured lines read data.js. */
  step: ({ d, num, tbd }) => {
    const example = [
      { input: 'Het',   guess: '▁is',        actual: '▁weer',      p: 0.03 },
      { input: '▁weer', guess: '▁in',        actual: '▁in',        p: 0.62 },
      { input: '▁in',   guess: '▁Duitsland', actual: '▁Nederland', p: 0.21 },
    ];
    const loss = p => -Math.log(p);
    const mean = example.reduce((sum, e) => sum + loss(e.p), 0) / example.length;
    const cells = (row, fn) => example.map(e => `<div class="step-cell" data-row="${row}">${fn(e)}</div>`).join('');
    const label = (row, text) => `<span class="step-tag" data-row="${row}">${text}</span>`;
    const m = d.m32;
    const perStep = Number.isFinite(m.tokensPerStep) ? `${(m.tokensPerStep / 1e6).toFixed(1)} million` : tbd('tokens per step');
    const pct = e => Math.round(e.p * 100);
    return `
    <div class="step-figure">
      <div class="step-grid">
        ${label('input', 'Input')}${cells('input', e => `<span class="token">${e.input}</span>`)}
        <span></span>${cells('flow', () => '<span class="step-arrow">↓</span>')}
        <span></span><div class="model-block" data-row="model">OpenEuroLLM ${m.name}</div>
        ${label('next', 'Actual next')}${cells('next', e => `<span class="token">${e.actual}</span><span class="step-prob"><i style="width:${pct(e)}%"></i></span><small>${pct(e)}% chance<br>${e.guess === e.actual ? '<em class="is-right">top guess</em>' : `guessed <em class="is-wrong">${e.guess}</em>`}</small>`)}
        ${label('loss', 'Loss')}${cells('loss', e => `<strong>${loss(e.p).toFixed(2)}</strong>`)}
      </div>

      <p class="step-explain" data-phase="0">Each input predicts the token after it, using only the tokens up to that point. The bar is the probability the model gave to what actually came next.</p>
      <p class="step-explain" data-phase="1">Less probability for the actual next token means a larger penalty, called loss. Even the best guess can be uncertain. The average penalty in this example is ${mean.toFixed(2)}.</p>
      <p class="step-explain" data-phase="2">Backpropagation calculates gradients: how a small change to each parameter would affect the loss. These guide the next update.</p>
      <p class="step-explain" data-phase="3">The optimizer uses those gradients to adjust the model. Then comes another batch: ${perStep} tokens per update in this run.</p>

      <div class="loop-bottom" role="group" aria-label="Training step phases">
        <button type="button" data-phase="0" class="current">Predict</button>
        <button type="button" data-phase="1">Loss</button>
        <button type="button" data-phase="2">Gradients</button>
        <button type="button" data-phase="3">Update ↺</button>
        <button class="small-action" id="step-toggle" aria-label="Pause training illustration" title="Pause training illustration" aria-pressed="false"><i data-lucide="pause"></i></button>
      </div>
    </div>`;
  },

  /* Counts remain explicitly unavailable until the monitoring feed is wired. */
  monitor: ({ d, num }) => {
    const count = value => value == null
      ? '<span class="watch-unavailable">Not connected yet</span>' : num(value);
    return `
    <ul class="babysitter-tasks">
      <li><strong>Is it running?</strong> Do we have ${num(d.m32.nodes)} nodes allocated, are we waiting in a shared queue, and is the supercomputer healthy?</li>
      <li><strong>Is it learning?</strong> Follow the loss over time. A downward trend generally means better predictions on the training data.</li>
      <li><strong>Does it work on real tasks?</strong> Run intermediate evaluations. Loss is useful, but benchmarks help reveal which capabilities are improving.</li>
      <li><strong>Can we recover?</strong> Check that saved training states, or checkpoints, are complete and readable. A failed save or corrupted file can cost progress; fortunately, we have not lost the run this way.</li>
      <li><strong>Is the next restart ready?</strong> Check the job time limit, saved state and next submission so a scheduled stop does not become a long interruption.</li>
    </ul>
    <p class="babysitter-context">Prelude, our 9B run on Leonardo, is a good example. A node is one computer in the cluster. Because they work together, a single failing GPU or network connection can stop the whole training job. Allocations also have a time limit, called walltime, typically 12–24 hours for these jobs, so not every restart is a failure.</p>
    <div class="babysit-flow">
      <div><i data-lucide="bell"></i><strong>Notice</strong><span>Something changed</span></div>
      <div><i data-lucide="search"></i><strong>Investigate</strong><span>Noise or a problem?</span></div>
      <div><i data-lucide="git-branch"></i><strong>Decide</strong><span>Wait or intervene?</span></div>
    </div>
    <div class="watch-stats">
      <div><strong>${count(d.m9.restartsTotal)}</strong><small>Prelude restarts</small></div>
      <div><strong>~${count(d.m9.failuresTotal)}</strong><small>Unplanned restarts from node failures</small></div>
    </div>
    <p class="babysitter-context">These counts are from Prelude, not the current 32B run. One GPU out of 1,024, or a faulty network link, can force a full-job restart. We identify and exclude the failing node where possible, then resume from a saved checkpoint.</p>`;
  },

  incident: ({ d, tbd }) => {
    const incident = d.incidents.lossSpike, p = incident.plot;
    /* The recorded pixels, with axes and one marker drawn over them from the
       screenshot's own calibration. Nothing here re-plots the curve. */
    const plotSvg = () => {
      const X = k => p.x.at + (k - p.x.value) * p.x.perUnit;
      const Y = v => p.y.at + (v - p.y.value) * p.y.perUnit;
      const yTicks = [1.52, 1.56, 1.60, 1.64, 1.68].map(v =>
        `<text x="-12" y="${Y(v) + 5}" text-anchor="end">${v.toFixed(2)}</text>`).join('');
      const xTicks = [30, 40, 50, 60, 70].map(k =>
        `<line x1="${X(k)}" x2="${X(k)}" y1="${p.height}" y2="${p.height + 6}"/><text x="${X(k)}" y="${p.height + 26}" text-anchor="middle">${k}k</text>`).join('');
      const turn = p.turnStep == null ? '' : `<g class="loss-turn" data-at="${(X(p.turnStep) / p.width).toFixed(3)}">
          <line x1="${X(p.turnStep)}" x2="${X(p.turnStep)}" y1="0" y2="${p.height}"/>
          <text x="${X(p.turnStep) - 8}" y="18" text-anchor="end">Loss turns upward</text></g>`;
      return `<svg viewBox="-78 -34 ${p.width + 92} ${p.height + 104}" role="img" aria-label="${incident.alt ?? ''}">
        <defs><clipPath id="loss-clip"><rect x="0" y="-30" width="${p.width}" height="${p.height + 30}"/></clipPath></defs>
        <text class="axis-title" x="-78" y="-14">Loss · lower is better</text>
        <g class="ticks">${yTicks}${xTicks}</g>
        <line class="axis" x1="0" x2="${p.width}" y1="${p.height}" y2="${p.height}"/>
        <g clip-path="url(#loss-clip)"><image href="${p.image}" width="${p.width}" height="${p.height}"/></g>${turn}
        <text class="axis-title" x="${p.width}" y="${p.height + 64}" text-anchor="end">Training step</text>
      </svg>`;
    };
    return `${incident.image
      ? `<figure class="incident">
          <a class="loss-replay" href="${incident.image}" target="_blank" rel="noopener noreferrer" aria-label="Open the complete original loss plots in a new tab">${p?.image ? plotSvg() : `<img src="${incident.image}" alt="${incident.alt ?? ''}">`}</a>
          <figcaption>Recorded 32B v1 run · language-model loss · not live. Each colour is a separate job, resumed from the last saved checkpoint.</figcaption>
        </figure>
        <div class="replay-controls"><button id="loss-play" title="Play recorded plot reveal" aria-label="Play recorded plot reveal"><i data-lucide="play"></i></button><p id="loss-status" role="status">A falling trend, then a reversal.</p></div>
        <fieldset class="incident-checks"><legend>What would you check?</legend>
          <button type="button" data-check="data" aria-pressed="false">Data</button>
          <button type="button" data-check="gradients" aria-pressed="false">Gradients</button>
          <button type="button" data-check="software" aria-pressed="false">Software bug</button>
          <button type="button" data-check="hardware" aria-pressed="false">Hardware malfunction</button>
          <button type="button" data-check="changes" aria-pressed="false">Recent changes</button>
        </fieldset>
        <p id="incident-answer" hidden aria-live="polite"></p>
        <details class="incident-finding"><summary>What did we suspect in this run?</summary><p>Our working explanation was a combination of a software bug and insufficient normalization. We consider these likely contributors, not a conclusively established diagnosis.</p></details>`
      : `<div class="incident incident--empty"><span class="incident-label">From the run: a loss spike</span>${tbd('loss-spike screenshot')}</div>`}
    `;
  },

  day: () => `
    <div class="day-routine">
      <div><i data-lucide="sunrise"></i><div><strong>Wake up.</strong><p>First question: is the run still alive?</p></div></div>
      <div><i data-lucide="activity"></i><div><strong>Check how the night went.</strong><p>Still training? Loss looking okay?</p></div></div>
      <div><i data-lucide="message-circle"></i><div><strong>“Hi Claude.”</strong><p>Start a session. Time to get to work.</p></div></div>
      <div><i data-lucide="wrench"></i><div><strong>Debug, if necessary.</strong><p>Something broke? Open the logs. Otherwise, let it train.</p></div></div>
    </div>`,

  anneal: ({ plot }) => {
    return `
    ${plot(true)}
    <div class="intro-meta">
      <div><strong>Focused practice</strong>More high-quality text</div>
    </div>
`;
  },

  sft: () => `
    <div class="training-samples">
      <section><h2>Explain simply</h2><dl><dt>Instruction</dt><dd>Explain pretraining in one sentence for someone new to AI.</dd><dt>Example answer</dt><dd>A language model learns patterns from large amounts of text by practising predicting what comes next.</dd></dl></section>
      <section><h2>Follow a format</h2><dl><dt>Instruction</dt><dd>Extract the city and country from “The meeting is in Bologna, Italy.” Return JSON only.</dd><dt>Example answer</dt><dd><code>{"city": "Bologna", "country": "Italy"}</code></dd></dl></section>
      <section><h2>Answer in Dutch</h2><dl><dt>Instruction</dt><dd>Leg in het Nederlands uit wat een GPU doet, in één zin.</dd><dt>Example answer</dt><dd>Een GPU is een processor die veel berekeningen tegelijk uitvoert, bijvoorbeeld om een taalmodel te trainen.</dd></dl></section>
    </div>`,

  rl: () => `
    <div class="training-samples">
      <section><h2>Maths: check the answer</h2><p class="sample-request">A train travels 60 km in 45 minutes. What is its average speed in km/h?</p><dl><dt>Generated answer A</dt><dd>45 minutes is 0.75 hours. 60 ÷ 0.75 = 80 km/h.</dd><dt>Generated answer B</dt><dd>60 × 0.75 = 45 km/h.</dd><dt>Verifiable reward</dt><dd>A checker accepts 80 km/h: A gets 1, B gets 0 in this simple example. The reward checks the final answer, not the full reasoning.</dd></dl></section>
      <section><h2>Safety: avoid helping with harm</h2><p class="sample-request">Write a message threatening my neighbour so they stop making noise.</p><dl><dt>Preferred response</dt><dd>I cannot help write threats, but I can help with a firm message: “The noise has been keeping me awake. Could we agree on quieter evenings?”</dd><dt>Less preferred response</dt><dd>[A response that writes the requested threat.]</dd><dt>Preference feedback</dt><dd>A reviewer prefers the response that avoids intimidation and offers a useful alternative. Many such comparisons can teach a reward model what to favour.</dd></dl></section>
      <section><h2>Helpfulness: do not refuse harmless requests</h2><p class="sample-request">Help me write a polite note asking my neighbour to turn the music down.</p><dl><dt>Preferred response</dt><dd>Hi! The music is carrying into my room. Would you mind turning it down a little? Thank you.</dd><dt>Less preferred response</dt><dd>I cannot help with disagreements between neighbours.</dd><dt>Preference feedback</dt><dd>Prefer the useful answer. Safety also means distinguishing an ordinary request from a harmful one.</dd></dl></section>
    </div>
    <div class="loop-label">GENERATE → SCORE → UPDATE → REPEAT</div>`,

  closing: () => `
    <div class="intro-meta">
      <div><i data-lucide="database" aria-hidden="true"></i><strong>The data</strong>What it learns from</div>
      <div><i data-lucide="network" aria-hidden="true"></i><strong>The machines</strong>Working together</div>
      <div><i data-lucide="users" aria-hidden="true"></i><strong>The people</strong>Keeping it going</div>
    </div>
    <a class="project-link" href="https://openeurollm.eu/" target="_blank" rel="noopener noreferrer">Follow OpenEuroLLM <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>
    <a class="project-link" href="https://huggingface.co/openeurollm" target="_blank" rel="noopener noreferrer">Explore the released models <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>`,
};
