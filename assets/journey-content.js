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
    label: 'Behind the scenes',
    kicker: 'Snellius · SURF / OpenEuroLLM',
    title: 'Behind the scenes<br>of LLM pretraining.',
    text: 'From SURF in Amsterdam to Europe’s supercomputers: the data, experiments and training behind the OpenEuroLLM model family.',
    note: 'OpenEuroLLM aims: truly open · EU-compliant · linguistically diverse.',
    visual: 'intro',
    tag: 'schematic',
  },
  {
    place: 0,
    label: 'The project partners',
    kicker: 'OpenEuroLLM / The collaboration',
    title: 'Built across Europe.',
    text: '{{partners}} partners. A series of foundation models for transparent AI in Europe.',
    note: '',
    visual: 'partners',
    tag: 'measured',
  },
  {
    place: 1,
    label: 'Preparing the data',
    kicker: 'LUMI · CSC / Data preparation',
    title: 'Before the model,<br>the data.',
    text: 'Curate, clean, deduplicate. Then turn text into tokens and mix the languages and sources the model will learn from.',
    note: 'Source rights, quality, personal data and evaluation overlap all need attention.',
    visual: 'data',
    tag: 'illustrative',
  },
  {
    place: 2,
    label: 'Scaling experiments',
    kicker: 'MareNostrum 5 · BSC / Experiments',
    title: 'Small runs.<br>Big decisions.',
    text: 'Experiments help us choose the global batch size and learning rate. Scaling laws connect model size, data and compute to the bigger training budget.',
    note: 'Curves are not measured experiment results.',
    visual: 'scaling',
    tag: 'illustrative',
  },
  {
    place: 3,
    label: 'Prelude · 9B',
    kicker: 'Leonardo · Cineca / Pretraining',
    title: 'Prelude.',
    text: 'The smallest model in the OpenEuroLLM family, pretrained on Leonardo in Bologna.',
    note: 'Pretrained · awaiting annealing.',
    visual: 'nine',
    tag: 'measured',
  },
  {
    place: 3,
    label: 'MultiSynth · synthetic data',
    kicker: 'Leonardo · Cineca / Multilingual data',
    title: 'MultiSynth.',
    text: 'On Leonardo, we also worked on MultiSynth: synthesizing multilingual pretraining data.',
    note: 'More project details to follow.',
    visual: 'multisynth',
    tag: 'illustrative',
  },
  {
    place: 4,
    label: 'The 32B run',
    kicker: 'JUPITER · JSC / Training',
    title: 'Now, 32 billion.',
    text: 'Our intermediate model is training now. Thousands of GPUs work together as we build towards a larger model planned for {{nextYear}}.',
    note: 'OpenEuroLLM model family · 9B → 32B now → larger model planned for {{nextYear}}.',
    visual: 'run',
    tag: 'measured',
  },
  {
    place: 4,
    label: 'One training step',
    kicker: 'JUPITER · JSC / Inside a step',
    title: 'How a model<br>actually learns.',
    text: 'Predict the next tokens. Measure the loss. Compute gradients. Only then does the optimizer change the parameters.',
    note: 'Positions train in parallel. Each sees only the tokens up to its position.',
    visual: 'step',
    tag: 'illustrative',
  },
  {
    place: 4,
    label: 'Watching the run',
    kicker: 'JUPITER · JSC / Day-to-day',
    title: 'The run needs<br>looking after.',
    text: 'Watch the loss, gradients and throughput. Check the data. Save checkpoints. Investigate when the run stops behaving as expected.',
    note: 'Monitoring is about patterns over time, not just a single number.',
    visual: 'monitor',
    tag: 'measured',
  },
  {
    place: 4,
    label: 'Annealing',
    kicker: 'JUPITER · JSC / Next phase',
    title: 'A gentler finish.',
    text: 'Lower the learning rate and shift the data mix towards quality. Longer-context training is another part of the plan to explore, not an automatic consequence of annealing.',
    note: 'The result is still a base model. The exact schedule and context target are not published here.',
    visual: 'anneal',
    tag: 'schematic',
  },
  {
    place: 4,
    label: 'Supervised fine-tuning',
    kicker: 'To come / SFT',
    title: 'From text to<br>helpful answers.',
    text: 'Train on examples of prompts and good responses. The base model learns the format and behaviour of an assistant.',
    note: 'Future chapter. Post-training hardware and schedule are not confirmed; the map stays at the last known stop.',
    visual: 'sft',
    tag: 'illustrative',
  },
  {
    place: 4,
    label: 'Reinforcement learning',
    kicker: 'To come / Post-training',
    title: 'Learning from<br>feedback.',
    text: 'Reward better responses. Feedback can come from people or from outcomes we can verify, such as passing a code test.',
    note: 'GRPO is an optimization algorithm; RLHF and RLVR describe feedback sources. The project’s method is not yet confirmed.',
    visual: 'rl',
    tag: 'schematic',
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
      <text x="25" y="132">${anneal ? 'Pretraining' : 'Training tokens'}</text>
      <text x="365" y="132" text-anchor="end">${anneal ? 'Annealing' : 'More compute'}</text>
      ${anneal ? `
        <path stroke="#18775c" d="M25 25H230 Q265 25 280 51L355 105"/>
        <path stroke="#c25a35" stroke-dasharray="3 4" d="M230 12V113"/>` : `
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

  intro: ({ d, tbd }) => `
    <div class="family-label">THE OPENEUROLLM MODEL FAMILY</div>
    <div class="model-family">
      <div><strong>${d.m9.name}</strong><span>Smallest</span><small>Awaiting annealing</small></div>
      <i data-lucide="arrow-right"></i>
      <div class="family-current"><strong>${d.m32.name}</strong><span>Intermediate</span><small>Training now</small></div>
      <i data-lucide="arrow-right"></i>
      <div><strong>${d.family.nextModelYear ?? tbd('roadmap year')}</strong><span>Larger model</span><small>Planned</small></div>
    </div>
    <a class="project-link" href="https://openeurollm.eu/" target="_blank" rel="noopener noreferrer">openeurollm.eu <i data-lucide="arrow-up-right"></i></a>`,

  partners: ({ partners, groups }) => `
    ${groups.map(([group, label]) => `
      <section class="partner-group" aria-label="${label}">
        <h2>${label}</h2>
        <ul class="partner-grid">
          ${partners.filter(p => p.group === group).map(p => `
            <li><a class="partner-logo" href="${p.href}" target="_blank" rel="noopener noreferrer" title="${p.name}" aria-label="${p.name} (opens in a new tab)"><img src="assets/partners/${p.logo}" alt="${p.name}"></a></li>`).join('')}
        </ul>
      </section>`).join('')}
    <a class="project-link" href="https://openeurollm.eu/" target="_blank" rel="noopener noreferrer">Meet the consortium <i data-lucide="arrow-up-right"></i></a>
    <div class="funding-credit"><img src="assets/images/EU-cofounded.webp" alt="Co-funded by the European Union"></div>`,

  /* The six documents are decoration. The tokens are real output of the
     production SentencePiece tokenizer for "De Afsluitdijk ...". */
  data: ({ tokens }) => `
    <div class="data-docs">${'<div class="doc"><i></i><i></i><i></i></div>'.repeat(6)}</div>
    ${tokens(['De', '▁A', 'fs', 'luit', 'd', 'ijk'])}
    <div class="data-stages"><span>Curate</span><span>Clean &amp; deduplicate</span><span>Tokenize &amp; mix</span></div>
    <button class="small-action" id="clean" aria-pressed="false"><i data-lucide="filter"></i><span>Deduplicate sample</span></button>`,

  /* Global batch is derived, so it cannot drift from the run's own numbers. */
  scaling: ({ d, num, plot, tbd }) => {
    const batch = d.m32.tokensPerStep && d.m32.arch?.seqLen
      ? num(d.m32.tokensPerStep / d.m32.arch.seqLen) : tbd('global batch');
    return `
    ${plot()}
    <div class="legend"><span>Recipe A</span><span>Recipe B</span></div>
    <div class="intro-rule"></div>
    <div class="intro-meta">
      <div><strong>${batch}</strong>${d.m32.name} global batch / sequences</div>
      <div><strong>${d.m32.lr == null ? tbd('learning rate') : d.m32.lr.toExponential(2)}</strong>${d.m32.name} learning rate</div>
    </div>`;
  },

  nine: ({ d, num, tbd }) => `
    <div class="prelude-stats">
      <div><strong>${d.m9.name}</strong><span>parameters</span></div>
      <div><strong>${d.m9.gpus == null ? tbd('9B GPU count') : num(d.m9.gpus)}</strong><span>${d.m9.gpuType ?? 'GPUs'}</span></div>
    </div>
    <a class="project-link" href="${d.m9.weightsUrl}" target="_blank" rel="noopener noreferrer">Prelude on Hugging Face <i data-lucide="arrow-up-right"></i></a>`,

  multisynth: () => `
    <div class="synth-flow">
      <i data-lucide="languages" aria-hidden="true"></i>
      <strong>Multilingual synthesis</strong>
      <i data-lucide="arrow-down" aria-hidden="true"></i>
      <div class="synth-documents" aria-label="Illustrative multilingual documents">
        ${['EN', 'NL', 'FI', 'IT', 'ES', '…'].map(lang => `<div class="synth-document"><span>${lang}</span><i></i><i></i><i></i></div>`).join('')}
      </div>
      <span class="visual-caption">Synthetic text for pretraining</span>
    </div>`,

  /* The node grid is drawn from d.m32.nodes, so the picture and the stat
     above it can never disagree. */
  run: ({ d, num, stamp, tbd }) => {
    const m = d.m32;
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
      <div><strong>${num(m.step)}</strong>steps</div>
    </div>
    <div class="gpu-grid" aria-label="${nodes} nodes, ${perNode} GPUs per node">${'<i></i>'.repeat(nodes)}</div>
    <div class="visual-caption">One square = one node · ${perNode} GPUs</div>
    <div class="progress-label">
      <strong>${known ? percent.toFixed(1) + '% of planned steps' : tbd('32B progress')}</strong>
      <span>${seen}</span>
    </div>
    <progress value="${percent}" max="100" aria-label="${m.name} training progress"></progress>
    <div class="visual-caption">${stamp()}</div>`;
  },

  step: ({ d, tokens }) => `
    ${tokens(['Het', '▁weer', '▁in'])}
    <div class="loop-arrows"><span>↓</span><span>↓</span><span>↓</span></div>
    <div class="model-block">OpenEuroLLM · ${d.m32.name} parameters</div>
    <div class="loop-label">NEXT-TOKEN TARGETS</div>
    ${tokens(['▁weer', '▁in', '▁Nederland'])}
    <div class="loop-bottom">
      <span data-phase="0" class="current">Predict</span>
      <span data-phase="1">Loss</span>
      <span data-phase="2">Gradients</span>
      <span data-phase="3">Update ↺</span>
    </div>
    <button class="small-action" id="step-toggle" aria-label="Pause training illustration" title="Pause training illustration" aria-pressed="false"><i data-lucide="pause"></i></button>`,

  monitor: ({ d, num, stamp, tbd }) => `
    <div class="monitor-readout">
      <div><strong>${d.m32.loss == null ? tbd('loss') : d.m32.loss.toFixed(2)}</strong><small>Loss</small></div>
      <div><strong>${d.m32.gradNorm ?? '—'}</strong><small>Gradient norm</small></div><!-- em dash, not a chip: the log line may simply not report it -->
      <div><strong>${Number.isFinite(d.m32.secPerStep) ? d.m32.secPerStep + 's' : tbd('step time')}</strong><small>Per step</small></div>
    </div>
    <div class="model-block">Checkpoint · step ${num(d.m32.lastCheckpointStep)}</div>
    <div class="status-list"><span>Loss &amp; stability</span><span>Performance</span><span>Recovery</span></div>
    <div class="visual-caption">${stamp()}</div>`,

  anneal: ({ plot }) => `
    ${plot(true)}
    <div class="intro-meta">
      <div><strong>Lower LR</strong>smaller parameter updates</div>
      <div><strong>Quality mix</strong>final pretraining data</div>
    </div>
    <div class="intro-rule"></div>
    <span class="pill" style="align-self:center">Base model → post-training</span>`,

  sft: () => `
    <div class="conversation">
      <div><small>PROMPT</small>Explain pretraining in one sentence.</div>
      <div><small>DEMONSTRATION</small>A model learns patterns in text by repeatedly predicting what comes next.</div>
    </div>`,

  rl: () => `
    <div class="reward-options">
      <div><strong>RLHF</strong>Human feedback</div>
      <div><strong>RLVR</strong>Verifiable rewards</div>
    </div>
    <div class="loop-label" style="margin-top:23px">GENERATE → SCORE → UPDATE</div>`,
};
