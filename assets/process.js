/* ==========================================================================
   process.js — the opening diagram.

   Three areas: preparing text, a parallel next-token training step, finishing.
   Forward predictions, backward gradients and optimizer updates are distinct;
   GPUs and measured run progress support the schematic from below.

   Contract with app.js:  drawPretrainingProcess(host, ui) -> { refresh }
   Hooks other code relies on: .process-desktop / .process-mobile,
   [data-step] with keyboard activation, .process-progress-value, .process-pause
   ========================================================================== */

window.drawPretrainingProcess = function (host, ui) {
  var svgEl = ui.svgEl, el = ui.el, snap = ui.snap;
  var nl = ui.lang === "nl";
  function word(a, b) { return nl ? a : b; }

  var pendingNodes = [], progressNodes = [], weights = [];

  function add(p, tag, a) { var n = svgEl(tag, a); p.appendChild(n); return n; }
  function txt(p, x, y, s, cls, anchor) {
    var n = add(p, "text", { x: x, y: y, class: cls || "process-small", "text-anchor": anchor || "start" });
    n.textContent = s; return n;
  }
  /* a clickable region of the drawing */
  function zone(p, step, title, activity) {
    var g = add(p, "g", { class: "process-zone", "data-step": activity ? null : step, "data-act": activity || null, role: "button",
                          tabindex: "0", "aria-label": word("Open: ", "Open: ") + title });
    function open() { ui.select(activity ? "act" : "step", activity || step); }
    g.addEventListener("click", open);
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { open(); e.preventDefault(); }
    });
    return g;
  }

  /* ------------------------------------------------------- 01 · the text -- */
  function drawDocs(p, x, y) {
    var g = zone(p, 1, word("Tekst verzamelen", "Gathering text"));
    [[0, 6, 44, 56], [36, 0, 44, 62], [72, 10, 44, 56]].forEach(function (d) {
      add(g, "rect", { class: "process-doc", x: x + d[0], y: y + d[1], width: d[2], height: d[3], rx: 4 });
      for (var i = 0; i < 4; i++) {
        add(g, "rect", { class: "process-docline", x: x + d[0] + 8, y: y + d[1] + 11 + i * 10,
                         width: d[2] - 16 - (i === 3 ? 10 : 0), height: 2.4, rx: 1.2 });
      }
    });
    [word("Web", "Web"), word("Code", "Code"), word("Boeken", "Books")].forEach(function (s, i) {
      txt(g, x + 132, y + 20 + i * 20, s, "process-small");
    });
    txt(g, x + 90, y + 91, word("Bronnen & rechten", "Sources & rights"), "process-label", "middle");
    return g;
  }
  function drawFilter(p, x, y) {
    var g = zone(p, 2, word("Filteren", "Filtering"));
    [1, 0, 1, 0, 1, 0].forEach(function (on, i) {
      add(g, "rect", { class: on ? "process-keep" : "process-drop",
                       x: x + i * 20, y: y, width: 13, height: 13, rx: 2 });
    });
    for (var i = 0; i < 20; i++) {
      add(g, "circle", { class: "process-dots", cx: x + 2 + i * 6.4, cy: y + 24, r: 1.7 });
    }
    [0, 1, 2].forEach(function (i) {
      add(g, "rect", { class: "process-keep", x: x + 20 + i * 20, y: y + 34, width: 13, height: 13, rx: 2 });
    });
    txt(g, x + 136, y + 10, word("Opschonen", "Clean & select"), "process-label");
    txt(g, x + 136, y + 28, word("Ontdubbelen", "Deduplicate"), "process-small");
    return g;
  }
  function drawTokens(p, x, y) {
    var g = zone(p, 3, word("Tokeniseren", "Tokenising"));
    var toks = ["De", "▁A", "fs", "luit", "d", "ijk"];
    var tx = x;
    toks.forEach(function (tk) {
      var w = 16 + tk.length * 6;
      add(g, "rect", { class: "process-token", x: tx, y: y, width: w, height: 22, rx: 4 });
      txt(g, tx + w / 2, y + 15, tk, "process-tokentext", "middle");
      tx += w + 7;
    });
    txt(g, x + 112, y + 46, word("Tokens", "Tokens"), "process-label", "middle");
    txt(g, x + 112, y + 64, "OpenEuroLLM · 262k", "process-small", "middle");
    return g;
  }
  function drawMerge(p, x, y) {
    var g = zone(p, 4, word("De mix samenstellen", "Composing the mix"));
    ["process-mix1", "process-mix2", "process-mix3", "process-mix4", "process-mix5"].forEach(function (c, i) {
      var sy = y + i * 13;
      add(g, "path", { class: "process-mixline " + c,
        d: "M" + x + " " + sy + " H" + (x + 74) + " Q" + (x + 116) + " " + sy + " " +
           (x + 130) + " " + (y + 26) });
    });
    add(g, "path", { class: "process-mixline process-mix4",
      d: "M" + (x + 130) + " " + (y + 26) + " H" + (x + 232) });
    txt(g, x + 112, y + 68, word("Talen & bronnen mengen", "Mixing languages & sources"), "process-label", "middle");
    return g;
  }
  function drawScaling(p, x, y) {
    var g = zone(p, 13, word("Trainingsrecept", "Training recipe"));
    add(g, "path", { class: "process-axis", d: "M" + x + " " + y + " V" + (y + 38) + " H" + (x + 56) });
    [[6, 32], [16, 27], [26, 20], [36, 14], [46, 7]].forEach(function (d) {
      add(g, "circle", { class: "process-scatter", cx: x + d[0], cy: y + d[1], r: 2.4 });
    });
    add(g, "path", { class: "process-trend", d: "M" + (x + 6) + " " + (y + 33) + " L" + (x + 50) + " " + (y + 5) });
    txt(g, x + 74, y + 14, word("Trainingsrecept", "Training recipe"), "process-label");
    txt(g, x + 74, y + 32, "Batch size · learning rate", "process-small");
    return g;
  }

  /* --------------------------------------------------- 02 · the training -- */
  function drawTraining(p, x, y, scale) {
    var g = add(p, "g", { transform: "translate(" + x + " " + y + ") scale(" + scale + ")" });
    function arrow(parent, path, cls) { add(parent, "path", { class: "training-arrow " + (cls || ""), d: path }); }
    var inputs = ["Het", "▁weer", "▁in"], targets = ["▁weer", "▁in", "▁Nederland"];
    txt(g, 175, 12, word("Eén tekst, meerdere voorspellingen", "One text, several predictions"), "process-small", "middle");
    var forward = zone(g, 6, word("Volgende tokens voorspellen", "Predicting the next tokens"));
    forward.setAttribute("data-training-stage", "predict");
    inputs.forEach(function (token, i) {
      var cx = 55 + i * 100;
      add(forward, "rect", { class: "process-token", x: cx - 43, y: 28, width: 86, height: 27, rx: 4 });
      txt(forward, cx, 46, token, "process-tokentext", "middle");
      arrow(g, "M" + cx + " 59 V78 m-4 -4 4 4 4 -4");
      arrow(g, "M" + cx + " 132 V154 m-4 -4 4 4 4 -4");
    });
    var model = zone(g, 5, word("Het 32B-model", "The 32B model"));
    add(model, "rect", { class: "training-model", x: 12, y: 85, width: 286, height: 40, rx: 5 });
    txt(model, 155, 110, "OpenEuroLLM · 32B", "process-label", "middle");
    txt(g, 155, 174, word("Kansen op het volgende token", "Next-token probabilities"), "process-small", "middle");
    var comparison = zone(g, 6, word("Loss uit de echte volgende tokens", "Loss from the actual next tokens"));
    comparison.setAttribute("data-training-stage", "compare");
    targets.forEach(function (token, i) {
      var cx = 55 + i * 100;
      [0.25, 0.6, 0.15].forEach(function (v, j) {
        add(comparison, "rect", { class: "process-bar" + (i === j ? " process-bar--on" : ""), x: cx - 34 + j * 24, y: 213 - v * 44, width: 16, height: v * 44, rx: 2 });
      });
      add(comparison, "rect", { class: "training-target", x: cx - 43, y: 226, width: 86, height: 27, rx: 4 });
      txt(comparison, cx, 244, token, "process-tokentext", "middle");
      arrow(g, "M" + cx + " 276 V287 H155 V297");
    });
    txt(comparison, 155, 269, word("Doelen: dezelfde tekst, één token verder", "Targets: same text, shifted one token"), "process-small", "middle");
    txt(comparison, 155, 314, "Loss", "process-label", "middle");
    var backward = zone(g, 6, word("Gradiënten berekenen, nog geen update", "Compute gradients, no update yet"));
    backward.setAttribute("data-training-stage", "backward");
    arrow(backward, "M190 308 H323 V105 H305 m4 -4 -4 4 4 4", "training-gradient");
    txt(backward, 340, 209, word("Gradiënten", "Gradients"), "process-small", "middle").setAttribute("transform", "rotate(-90 340 209)");
    var update = zone(g, 6, word("Optimizer past parameters aan", "Optimizer updates parameters"));
    update.setAttribute("data-training-stage", "update");
    arrow(backward, "M323 308 V332 H155 V342 m-4 -4 4 4 4 -4", "training-gradient");
    txt(update, 155, 361, word("Optimizer → parameters bijstellen", "Optimizer → update parameters"), "process-label", "middle");
    arrow(update, "M20 357 H-7 V105 H5 m-4 -4 4 4 -4 4", "training-update");
    txt(g, 155, 389, word("Herhalen met de volgende batch", "Repeat with the next batch"), "process-small", "middle");
    return g;
  }
  function drawModel(p, x, y) {
    var g = zone(p, 5, word("De architectuur", "The architecture"));
    [3, 2, 1, 0].forEach(function (d) {
      add(g, "rect", { class: d ? "process-card process-card--back" : "process-card",
                       style: "--layer-delay:" + (d * .18) + "s",
                       x: x + d * 6, y: y - d * 6, width: 110, height: 110, rx: 7 });
    });
    for (var r = 0; r < 7; r++) {
      for (var c = 0; c < 7; c++) {
        var weight = add(g, "rect", { class: "process-weight", x: x + 16 + c * 11, y: y + 16 + r * 11,
                         width: 7, height: 7, rx: 1.2,
                         opacity: (0.3 + ((r * 5 + c * 3) % 5) * 0.16).toFixed(2) });
        if ((r + c) % 3 === 0) weights.push(weight);
      }
    }
    txt(g, x + 55, y + 138, word("Het model", "The model"), "process-label", "middle");
    txt(g, x + 55, y + 156, word("32B parameters", "32B parameters"), "process-small", "middle");
    return g;
  }
  function drawLoop(p, L, T, R, B) {
    var g = add(p, "g", { class: "process-loopg" });
    var r = 20;
    var route = add(g, "path", { class: "process-loop",
      d: "M" + (L + 74) + " " + T + " H" + (R - r) + " Q" + R + " " + T + " " + R + " " + (T + r) +
         " V" + (B - r) + " Q" + R + " " + B + " " + (R - r) + " " + B +
         " H" + (L + r) + " Q" + L + " " + B + " " + L + " " + (B - r) +
         " V" + (T + r) + " Q" + L + " " + T + " " + (L + r) + " " + T + " H" + (L + 50) });
    add(g, "path", { class: "process-backprop", d: "M" + R + " " + B + " H" + (L + r) + " Q" + L + " " + B + " " + L + " " + (B - r) + " V" + (T + r) + " Q" + L + " " + T + " " + (L + r) + " " + T + " H" + (L + 65) });
    function headMark(hx, hy, dir) {
      var d = { r: "M-5 -5 L0 0 L-5 5", d: "M-5 -5 L0 0 L5 -5",
                l: "M5 -5 L0 0 L5 5", u: "M-5 5 L0 0 L5 5" }[dir];
      add(g, "path", { class: "process-loophead", d: d, transform: "translate(" + hx + " " + hy + ")" });
    }
    headMark(L + 190, T, "r"); headMark(R, T + 96, "d");
    headMark(L + 160, B, "l"); headMark(L, T + 96, "u");
    return g;
  }
  function drawPredict(p, x, y, barX, scale) {
    barX = barX || 88; scale = scale || 1;
    var g = zone(p, 6, word("De trainingsstap", "The training step"));
    g.setAttribute("data-training-stage", "predict");
    txt(g, x, y, word("Voorspellen", "Predict"), "process-label");
    [["kilometer", 80, "process-bar--on"], ["km", 16, ""], ["meter", 9, ""]]
      .forEach(function (d, i) {
        txt(g, x, y + 22 + i * 24, d[0], "process-small");
        add(g, "rect", { class: "process-bar " + d[2], x: x + barX, y: y + 14 + i * 24,
                         width: d[1] * scale, height: 10, rx: 2.5 });
      });
    return g;
  }
  function drawCompare(p, x, y, dx, dy, labelDx) {
    dx = dx == null ? 100 : dx; dy = dy == null ? 42 : dy;
    labelDx = labelDx == null ? dx : labelDx;
    var g = zone(p, 6, word("Vergelijken", "Compare"));
    g.setAttribute("data-training-stage", "compare");
    txt(g, x, y, word("Vergelijken", "Compare"), "process-label", "middle");
    add(g, "circle", { class: "process-diff", cx: x + dx, cy: y + dy, r: 13 });
    add(g, "path", { class: "process-diffmark", d: "M" + (x + dx - 6) + " " + (y + dy) + " h12" });
    txt(g, x + labelDx, y + dy + 34, word("Tekst: kilometer", "Text: kilometer"), "process-small", "middle");
    return g;
  }
  function drawAdjust(p, x, y) {
    var g = zone(p, 6, word("Bijstellen", "Adjust"));
    g.setAttribute("data-training-stage", "update");
    txt(g, x + 50, y, word("Bijstellen", "Adjust"), "process-label", "middle");
    for (var i = 0; i < 7; i++) {
      add(g, "rect", { class: "process-delta", x: x + 16 + i * 15, y: y + 28, width: 10, height: 10, rx: 2 });
    }
    txt(g, x + 50, y + 62, word("Parameters aanpassen", "Adjusting parameters"), "process-small", "middle");
    return g;
  }
  function drawProgress(p, x, y, w, compact) {
    var g = add(p, "g", { class: "process-progress" });
    var val = txt(g, x, y, "", "process-progress-value");
    var cnt = txt(g, x + w, compact ? y + 45 : y, "", "process-small", "end");
    add(g, "rect", { class: "process-progress-track", x: x, y: y + 14, width: w, height: 8, rx: 4 });
    var fill = add(g, "rect", { class: "process-progress-fill", x: x, y: y + 14, width: 0, height: 8, rx: 4 });
    progressNodes.push({ value: val, count: cnt, fill: fill, span: w });
    return g;
  }
  function drawGpus(p, x, y) {
    var g = zone(p, 7, word("Het rekencluster", "The compute cluster"));
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 64; c++) {
        add(g, "rect", { class: "process-gpu", x: x + c * 3.6, y: y + r * 3.6, width: 2.3, height: 2.3, rx: .5 });
      }
    }
    txt(g, x + 115, y + 52, word("2.048 GPU’s", "2,048 GPUs"), "process-label", "middle");
    txt(g, x + 115, y + 70, word("512 knooppunten", "512 nodes"), "process-small", "middle");
    return g;
  }
  function drawCheckpoints(p, x, y) {
    var g = zone(p, 8, word("Checkpoints", "Checkpoints"));
    for (var i = 0; i < 4; i++) {
      var cx = x + i * 30;
      add(g, "rect", { class: "process-ckpt", x: cx, y: y, width: 22, height: 27, rx: 4 });
      add(g, "path", { class: "process-ckptmark",
        d: "M" + (cx + 6) + " " + (y + 11) + " h10 M" + (cx + 6) + " " + (y + 17) + " h10" });
    }
    txt(g, x + 56, y + 52, word("Checkpoints", "Checkpoints"), "process-label", "middle");
    txt(g, x + 56, y + 70, word("Bewaren & hervatten", "Save & resume"), "process-small", "middle");
    return g;
  }

  function drawMonitoring(p, x, y) {
    var g = zone(p, 6, word("De run bewaken", "Monitoring the run"), "bewaken");
    add(g, "circle", { cx: x, cy: y, r: 17, class: "process-monitor-ring" });
    add(g, "path", { d: "M" + (x - 8) + " " + y + " h16 M" + x + " " + (y - 8) + " v16", class: "process-stem" });
    add(g, "circle", { cx: x, cy: y, r: 3, class: "process-scatter" });
    txt(g, x, y + 38, "Monitoring", "process-label", "middle");
    return g;
  }

  /* ------------------------------------------------------ 03 · finishing -- */
  function drawAnneal(p, x, y) {
    var g = zone(p, 9, word("Annealing", "Annealing"));
    add(g, "path", { class: "process-anneal",
      d: "M" + x + " " + y + " H" + (x + 56) + " Q" + (x + 82) + " " + y + " " + (x + 96) + " " + (y + 30) +
         " L" + (x + 160) + " " + (y + 58) });
    txt(g, x + 80, y + 94, word("Annealing", "Annealing"), "process-label", "middle");
    var st = txt(g, x + 80, y + 120, "", "process-pending", "middle");
    st.textContent = word("Laatste fase van pretraining", "Final phase of pretraining");
    return g;
  }
  function drawInstruct(p, x, y) {
    var g = zone(p, 10, word("Instructietraining", "Instruction tuning"));
    add(g, "path", { class: "process-quiet", d: "M" + x + " " + y + " h78" });
    add(g, "path", { class: "process-tuned", d: "M" + (x + 36) + " " + (y + 26) + " h132" });
    add(g, "path", { class: "process-tuned", d: "M" + (x + 36) + " " + (y + 38) + " h96" });
    txt(g, x + 80, y + 74, word("SFT · voorbeelden", "SFT · demonstrations"), "process-label", "middle");
    return g;
  }
  function drawEval(p, x, y) {
    var g = zone(p, 11, word("Evalueren", "Evaluating"));
    [32, 50, 36, 62, 44].forEach(function (h, i) {
      add(g, "rect", { class: "process-evalbar", x: x + i * 26, y: y + 62 - h, width: 16, height: h, rx: 2.5 });
    });
    txt(g, x + 60, y + 94, word("Evalueren", "Evaluating"), "process-label", "middle");
    txt(g, x + 60, y + 114, word("Ook tijdens de training", "Also during training"), "process-small", "middle");
    return g;
  }

  function drawFinishing(p, x) {
    drawAnneal(p, x + 30, 48);
    var anneal = zone(p, 9, word("Laatste pretraining", "Final pretraining"));
    txt(anneal, x + 110, 192, word("Leersnelheid omlaag · kwaliteit", "Lower learning rate · quality"), "process-small", "middle");
    txt(anneal, x + 110, 212, word("Context uitbreiden waar gepland", "Context extension where planned"), "process-small", "middle");
    add(p, "path", { class: "process-stem", d: "M" + (x + 110) + " 220 V231" });
    var base = zone(p, 9, word("Basismodel", "Base model"));
    txt(base, x + 110, 253, word("BASISMODEL", "BASE MODEL"), "process-base", "middle");
    add(p, "path", { class: "process-boundary", d: "M" + x + " 268 H" + (x + 235) });
    txt(p, x + 110, 290, "POST-TRAINING", "process-colnum", "middle");
    drawInstruct(p, x + 30, 312);
    add(p, "path", { class: "process-stem", d: "M" + (x + 110) + " 402 V433" });
    var reward = zone(p, 12, word("Voorkeuren & beloningen", "Preferences & rewards"));
    [0, 1].forEach(function (i) {
      add(reward, "path", { class: "process-tuned", d: "M" + (x + 50 + i * 76) + " 448 h44 m-44 10 h30" });
    });
    txt(reward, x + 110, 488, "Reinforcement learning", "process-label", "middle");
    txt(reward, x + 110, 511, word("Methode nog niet bevestigd", "Method not yet confirmed"), "process-small", "middle");
  }

  /* ----------------------------------------------------------- desktop ---- */
  function buildDesktop() {
    var W = 1160, H = 680;
    var svg = svgEl("svg", { class: "process-desktop", viewBox: "0 0 " + W + " " + H,
                             preserveAspectRatio: "xMidYMid meet", role: "group", "aria-label": "OpenEuroLLM" });

    txt(svg, 4, 14, "01", "process-colnum");
    txt(svg, 28, 14, word("Tekst voorbereiden", "Prepare text"), "process-heading");
    txt(svg, 306, 14, "02", "process-colnum");
    txt(svg, 330, 14, word("Pretraining", "Pretraining"), "process-heading");
    txt(svg, 762, 16, "JUPITER", "process-colnum");
    txt(svg, 900, 14, "03", "process-colnum");
    txt(svg, 924, 14, word("Van basis naar assistent", "From base to assistant"), "process-heading");

    /* 01 */
    drawDocs(svg, 20, 50);
    add(svg, "path", { class: "process-stem", d: "M80 148 V158" });
    drawFilter(svg, 20, 168);
    add(svg, "path", { class: "process-stem", d: "M80 222 V262" });
    drawTokens(svg, 14, 272);
    add(svg, "path", { class: "process-stem", d: "M126 344 V384" });
    drawMerge(svg, 14, 394);
    drawScaling(svg, 24, 500);
    add(svg, "path", { class: "process-design-link", d: "M254 518 H304 Q316 518 316 506 V403 Q316 391 328 391 H364 m-5 -5 5 5 -5 5" });

    /* 02 */
    add(svg, "path", { class: "process-feed",
      d: "M246 420 H276 Q290 420 290 406 V83 Q290 72 304 72 H344" });

    drawTraining(svg, 350, 34, 1);

    drawProgress(svg, 330, 436, 430);
    add(svg, "path", { class: "process-stem", d: "M400 462 V492" });
    add(svg, "path", { class: "process-stem", d: "M620 462 V492" });
    drawGpus(svg, 330, 498);
    drawCheckpoints(svg, 592, 498);
    drawMonitoring(svg, 802, 502);
    add(svg, "path", { class: "process-stem", d: "M760 451 H786 Q802 451 802 467 V479" });

    add(svg, "path", { class: "process-bridge",
      d: "M708 139 H816 Q836 139 836 128 V108 H895 m-5 -5 5 5 -5 5" });

    /* 03 */
    drawFinishing(svg, 880);
    var evaluation = zone(svg, 11, word("Evaluatie tijdens alle fasen", "Evaluation across all phases"));
    add(evaluation, "path", { class: "process-feedback", d: "M40 625 H1120 M140 617 V633 M545 617 V633 M1000 617 V633" });
    txt(evaluation, 580, 657, word("Evaluatie tijdens alle fasen", "Evaluation across all phases"), "process-label", "middle");
    return svg;
  }

  /* ------------------------------------------------------------ mobile ---- */
  function section(w, h, draw) {
    var s = svgEl("svg", { class: "process-mobile-section", viewBox: "0 0 " + w + " " + h,
                           preserveAspectRatio: "xMidYMin meet", role: "group", "aria-label": "OpenEuroLLM" });
    draw(s); return s;
  }
  function buildMobile() {
    var box = el("div", { class: "process-mobile" });

    box.appendChild(section(360, 680, function (s) {
      txt(s, 4, 14, "02", "process-colnum");
      txt(s, 28, 14, word("Pretraining", "Pretraining"), "process-heading");
      drawTraining(s, 14, 35, .97);
      drawProgress(s, 10, 440, 340, true);
      drawGpus(s, 10, 514);
      drawMonitoring(s, 300, 532);
      drawCheckpoints(s, 124, 600);
    }));

    box.appendChild(section(360, 525, function (s) {
      txt(s, 4, 14, "01", "process-colnum");
      txt(s, 28, 14, word("Tekst voorbereiden", "Prepare text"), "process-heading");
      drawDocs(s, 16, 36);
      add(s, "path", { class: "process-stem", d: "M76 134 V140" });
      drawFilter(s, 16, 142);
      add(s, "path", { class: "process-stem", d: "M76 196 V222" });
      drawTokens(s, 10, 232);
      add(s, "path", { class: "process-stem", d: "M126 303 V331" });
      drawMerge(s, 10, 344);
      drawScaling(s, 24, 464);
    }));

    box.appendChild(section(360, 690, function (s) {
      txt(s, 4, 14, "03", "process-colnum");
      txt(s, 28, 14, word("Van basis naar assistent", "From base to assistant"), "process-heading");
      drawFinishing(s, 50);
      drawEval(s, 110, 558);
    }));
    return box;
  }

  /* ------------------------------------------------------------- mount ---- */
  var wrap = el("div", { class: "process" }, [buildDesktop(), buildMobile()]);
  host.appendChild(wrap);
  Array.prototype.forEach.call(wrap.querySelectorAll(".process-zone"), function (g) {
    if (!g.getBBox) return;
    var stage = g.getAttribute("data-training-stage");
    var hitTarget = stage === "update" || stage === "backward" ? g.querySelector("text") : g;
    var b = hitTarget.getBBox();
    if (stage === "backward") b = { x: 325, y: 170, width: 20, height: 90 };
    var hit = svgEl("rect", { x: b.x - 6, y: b.y - 6, width: Math.max(44, b.width + 12), height: Math.max(44, b.height + 12),
      rx: 5, class: "process-zone-hit" });
    g.insertBefore(hit, g.firstChild);
  });

  var paused = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var phases = ["predict", "compare", "backward", "update"], phase = 0, timer = null, single = false;
  var phaseNames = [word("Voorspellen", "Predict"), word("Loss berekenen", "Calculate loss"), word("Gradiënten berekenen", "Compute gradients"), word("Parameters bijstellen", "Update parameters")];
  var stageLabel = el("span", { class: "process-stage-label", "aria-live": "off" });
  function showPhase() {
    wrap.setAttribute("data-phase", phases[phase]);
    stageLabel.textContent = phaseNames[phase];
    if (phases[phase] === "update") weights.forEach(function (weight, i) {
      weight.setAttribute("opacity", (0.35 + ((i + Date.now() % 7) % 6) * .1).toFixed(2));
    });
  }
  function advance() {
    if (single && phase === 3) { single = false; paused = true; setPaused(); return; }
    phase = (phase + 1) % phases.length; showPhase();
    timer = setTimeout(advance, 1500);
  }
  var pause = el("button", { type: "button", class: "btn process-pause",
                             "aria-label": word("Animatie pauzeren", "Pause animation") });
  function setPaused() {
    if (timer) clearTimeout(timer);
    timer = null;
    pause.setAttribute("aria-pressed", paused ? "true" : "false");
    pause.textContent = paused ? "▶" : "❙❙";
    pause.title = paused ? word("Animatie hervatten", "Resume animation") : word("Animatie pauzeren", "Pause animation");
    pause.setAttribute("aria-label", pause.title);
    wrap.setAttribute("data-paused", paused ? "1" : "0");
    if (!paused) timer = setTimeout(advance, 1500);
  }
  pause.addEventListener("click", function () { single = false; paused = !paused; setPaused(); });
  var oneStep = el("button", { type: "button", class: "btn process-one-step", text: word("Eén trainingsstap", "One training step"), onclick: function () {
    single = true; paused = false; phase = 0; showPhase(); setPaused();
  } });
  showPhase();
  setPaused();
  host.appendChild(el("div", { class: "process-caption" }, [
    el("span", { text: word("Schema · voorspellingen illustratief", "Schematic · illustrative predictions") }),
    stageLabel, oneStep, pause,
  ]));

  function refresh() {
    pendingNodes.forEach(function (n) {
      n.textContent = "9B · " + (snap.m9.state === "pending_annealing"
        ? word("wacht op annealing", "awaiting annealing") : snap.m9.state);
    });
    var f = Math.max(0, Math.min(1, snap.m32.step / snap.m32.totalSteps));
    progressNodes.forEach(function (n) {
      n.value.textContent = "32B · " + ui.pct(f, 1);
      n.count.textContent = ui.big(snap.m32.step * snap.m32.tokensPerStep, 2) + " / " +
                            ui.big(snap.m32.totalTokens, 0) + " tokens";
      n.fill.setAttribute("width", (f * n.span).toFixed(1));
    });
  }
  refresh();
  return { refresh: refresh, dispose: function () { if (timer) clearTimeout(timer); } };
};
