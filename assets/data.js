/* ==========================================================================
   data.js — the single source of numbers for the page.
   ---------------------------------------------------------------------------
   Everything the page renders comes from SNAP. Values that are `null` render
   as an orange "still to fill in" chip and are collected automatically in the
   register at the bottom of the page, so nothing silently ships as a guess.

   `verified: true`  -> read off the live run / repo config (shown as "measured")
   `verified: false` -> schematic or illustrative; the figure says so on itself.

   To go live later: have the Pi write a live.json with the same shape next to
   index.html. app.js fetches it on load and deep-merges it over SNAP; if the
   file is absent or malformed, the values below are used unchanged.
   ========================================================================== */

const SNAP = {
  /* ---------------------------------------------------------------- meta */
  meta: {
    // ISO timestamp of the snapshot below. Shown as "measured at ...".
    takenAt: "2026-09-19T14:57:00+02:00",
    source: "JUPITER training log (read-only)",
    live: false,           // flipped to true by live.json
  },

  /* ------------------------------------------------------ the model family */
  family: {
    // The larger model on the project roadmap. The year is all that is
    // stated publicly; null would render as "still to fill in".
    nextModelYear: 2027,
  },

  /* -------------------------------------------------------- the 32B run */
  m32: {
    name: "32B",
    params: 31.6e9,           // 64 x 452M per layer + 2 x 1.34B untied embeddings
    cluster: "JUPITER",
    clusterWhere: "Jülich, Duitsland",
    state: "training",        // training | annealing | sft | queued | down
    step: 82775,
    totalSteps: 894000,
    tokensSeen: 82775 * 16777216,
    totalTokens: 14998831104000,   // 894,000 x 4,096 x 4,096
    tokensPerStep: 16777216,
    secPerStep: 5.8,
    loss: 1.40,
    lr: 1.76e-4,
    gradNorm: 0.14,
    tokPerSecPerGpu: 1417,
    tflopsPerGpu: 295,
    gpus: 2048,
    nodes: 512,
    gpusPerNode: 4,
    gpuType: "NVIDIA GH200",
    parallel: { tp: 4, pp: 4, dp: 128 },
    arch: {
      layers: 64, hidden: 5120, ffn: 25600, heads: 64, kvGroups: 8,
      vocab: 262144, seqLen: 4096, posEmb: "RoPE", norm: "RMSNorm",
      act: "SwiGLU", lrSchedule: "WSD",
    },
    saveInterval: 2000,
    lastCheckpointStep: 82750,
    checkpointGb: { weights: 63, withOptimizer: 440 },
    startedAt: "2026-08-23",
  },

  /* --------------------------------------------------------- the 9B run */
  m9: {
    name: "9B",
    params: 9e9,
    cluster: "Leonardo",
    clusterWhere: "Bologna, Italië",
    state: "pending_annealing",
    step: null,               // TODO: tracker glob points at the wrong run dir
    totalSteps: null,
    tokensSeen: null,
    totalTokens: 10e12,
    annealTokens: 300e9,      // final annealing phase
    annealProgress: null,     // 0..1
    secPerStep: null,
    loss: null,
    gpus: 1024,
    gpuType: "NVIDIA A100",
    startedAt: "2026-06-12",
    weightsUrl: "https://huggingface.co/openeurollm/prelude",
  },

  /* ------------------------------------------------------ 1. collecting */
  collect: {
    rawBytes: null,           // total raw crawl + corpora before any filtering
    docsRaw: null,
    languages: null,          // number of languages in the mix
    sources: [
      { id: "web",      bytes: null, note: "Common Crawl / MixtureVitae" },
      { id: "code",     bytes: null, note: "permissief gelicentieerde repositories" },
      { id: "science",  bytes: null, note: "open access papers, abstracts" },
      { id: "books",    bytes: null, note: "publiek domein" },
      { id: "wiki",     bytes: null, note: "Wikipedia + wikibooks" },
      { id: "official", bytes: null, note: "EU/overheidspublicaties, parlementaire verslagen" },
      { id: "synth",    bytes: null, note: "MT-Nemotron-CC, synthetisch meertalig" },
    ],
  },

  /* ------------------------------------------------------- 2. filtering */
  // SCHEMATIC. `keep` is the fraction of the previous stage that survives.
  // Replace with the real funnel numbers from the data pipeline.
  filter: {
    verified: false,
    stages: [
      { id: "raw",     keep: 1.00 },
      { id: "lang",    keep: 0.62 },
      { id: "rules",   keep: 0.71 },
      { id: "dedup",   keep: 0.55 },
      { id: "quality", keep: 0.48 },
      { id: "safety",  keep: 0.94 },
      { id: "license", keep: 0.86 },
    ],
    realKeepRatio: null,      // real end-to-end survival rate, once known
  },

  /* ------------------------------------------------------ 3. tokenising */
  tokenizer: {
    verified: true,
    name: "oellm_tokenizer_256k",
    kind: "SentencePiece",
    vocab: 262144,
    // Real output of the production tokenizer. "▁" marks a word boundary.
    examples: [
      {
        text: "De Afsluitdijk is 32 kilometer lang.",
        lang: "nl",
        pieces: ["De", "▁A", "fs", "luit", "d", "ijk", "▁is", "▁", "3", "2", "▁kilometer", "▁lang", "."],
      },
      {
        text: "Het weer in Nederland is vandaag wisselvallig.",
        lang: "nl",
        pieces: ["Het", "▁weer", "▁in", "▁Nederland", "▁is", "▁vandaag", "▁w", "issel", "vall", "ig", "."],
      },
    ],
  },

  /* --------------------------------------------------------- 4. the mix */
  // SCHEMATIC proportions. Replace with the real data-mix weights.
  mix: {
    verified: false,
    domains: [
      { id: "web", share: 0.46 },
      { id: "code", share: 0.17 },
      { id: "science", share: 0.12 },
      { id: "official", share: 0.10 },
      { id: "books", share: 0.08 },
      { id: "wiki", share: 0.04 },
      { id: "synth", share: 0.03 },
    ],
    // Per-language token share. SCHEMATIC.
    languages: [
      { id: "en", share: 0.34 }, { id: "de", share: 0.09 }, { id: "fr", share: 0.08 },
      { id: "es", share: 0.07 }, { id: "it", share: 0.06 }, { id: "nl", share: 0.04 },
      { id: "pl", share: 0.04 }, { id: "other", share: 0.28 },
    ],
    epochs: null,             // how often the highest-weighted sources repeat
  },

  /* ------------------------------------------------ 6. the training step */
  // ILLUSTRATIVE next-token distribution — not read from a checkpoint.
  predict: {
    verified: false,
    prompt: "De Afsluitdijk is 32",
    candidates: [
      { t: "▁kilometer", p: 0.71 },
      { t: "▁km",        p: 0.12 },
      { t: "▁meter",     p: 0.06 },
      { t: "▁jaar",      p: 0.04 },
      { t: "▁graden",    p: 0.02 },
    ],
    otherP: 0.05,
  },
  // SCHEMATIC loss curve shape, anchored on the one measured point (step/loss
  // of the 32B above). x = fraction of the run, y = loss.
  lossCurve: {
    verified: false,
    points: [
      [0.000, 11.2], [0.002, 7.4], [0.006, 5.1], [0.012, 3.9], [0.02, 3.2],
      [0.035, 2.66], [0.05, 2.38], [0.075, 2.05], [0.0926, 1.40],
    ],
    projected: [
      [0.0926, 1.40], [0.15, 1.31], [0.25, 1.23], [0.4, 1.16],
      [0.6, 1.10], [0.8, 1.06], [0.93, 1.03], [1.0, 0.97],
    ],
  },

  /* ----------------------------------------------- 7. cluster & failures */
  cluster: {
    // Failure counts for THIS run. All still to be wired to the queue monitor.
    failuresTotal: null,
    restartsTotal: null,
    lastFailureAt: null,
    nodesDownNow: null,
    // SCHEMATIC breakdown of what actually goes wrong, by share of incidents.
    causesVerified: false,
    causes: [
      { id: "gpu",      share: 0.31 },
      { id: "network",  share: 0.24 },
      { id: "storage",  share: 0.18 },
      { id: "hang",     share: 0.13 },
      { id: "oom",      share: 0.08 },
      { id: "other",    share: 0.06 },
    ],
    // Single-GPU mean time between failures, in years — the slider's default.
    // Vendor-quoted figures for datacentre accelerators sit in this range.
    mtbfYearsDefault: 5,
  },

  /* --------------------------------------------------- 9. LR / annealing */
  // The WSD schedule actually in use: warmup, long constant plateau, then decay.
  wsd: {
    verified: true,
    warmupFrac: 0.01,
    decayFrac: 0.10,
    peakLr: 1.76e-4,
    minLrFrac: 0.0,
  },

  /* ----------------------------------------------------------- 10. SFT */
  sft: {
    state: null,              // "queued" | "running" | "done"
    datasets: ["Dolci-Instruct-SFT-translated", "EU-Instruct-Synthetic", "Dolci-Think-SFT-translated"],
  },

  /* ----------------------------------------------------- 11. evaluation */
  evals: {
    verified: false,
    rows: [
      { id: "mmlu_nl",   base: null, sft: null },
      { id: "arc_nl",    base: null, sft: null },
      { id: "hellaswag", base: null, sft: null },
      { id: "gsm8k",     base: null, sft: null },
      { id: "eu_multi",  base: null, sft: null },
    ],
  },
};
