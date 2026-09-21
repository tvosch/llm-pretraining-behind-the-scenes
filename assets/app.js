/* ==========================================================================
   app.js — renders content.js against data.js.
   No framework, no build step. Everything is plain DOM.
   ========================================================================== */
(function () {
"use strict";

/* ----------------------------------------------------------------- state */

var stored = localStorage.getItem("oellm.lang");
var S = {
  lang: stored === "nl" || stored === "en" ? stored
        : ((navigator.language || "").slice(0, 2) === "nl" ? "nl" : "en"),
  theme: localStorage.getItem("oellm.theme") || "dark",   // dark is the default
};

var REGISTER = [];   // every {{tbd:...}} encountered, for the register view
var REGISTER_VIEW = [];

/* --------------------------------------------------------------- helpers */

function el(tag, attrs, kids) {
  var n = document.createElement(tag);
  if (attrs) Object.keys(attrs).forEach(function (k) {
    if (k === "html") n.innerHTML = attrs[k];
    else if (k === "text") n.textContent = attrs[k];
    else if (k === "class") n.className = attrs[k];
    else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  });
  (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
  return n;
}
function svgEl(tag, attrs) {
  var n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (attrs) Object.keys(attrs).forEach(function (k) {
    if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  });
  return n;
}
function $(sel) { return document.querySelector(sel); }

/** Pick the current language out of an L(nl, en) pair. */
function t(pair) {
  if (pair == null) return "";
  if (typeof pair === "string") return pair;
  return pair[S.lang] != null ? pair[S.lang] : (pair.en || pair.nl || "");
}

var LOC = function () { return S.lang === "nl" ? "nl-NL" : "en-GB"; };

function num(v, digits) {
  if (v == null) return null;
  return v.toLocaleString(LOC(), {
    minimumFractionDigits: digits || 0, maximumFractionDigits: digits == null ? 0 : digits,
  });
}
/** 1.4e12 -> "1,4 biljoen" / "1.4 trillion" — scale words, not raw digits. */
function big(v, digits) {
  if (v == null) return null;
  var d = digits == null ? 1 : digits;
  var units = S.lang === "nl"
    ? [[1e12, "biljoen"], [1e9, "miljard"], [1e6, "miljoen"], [1e3, "duizend"]]
    : [[1e12, "trillion"], [1e9, "billion"], [1e6, "million"], [1e3, "thousand"]];
  for (var i = 0; i < units.length; i++) {
    if (Math.abs(v) >= units[i][0]) {
      return num(v / units[i][0], d) + " " + units[i][1];
    }
  }
  return num(v, 0);
}
function bytesish(v) { return v == null ? null : big(v, 1) + " B"; }
function pct(v, d) { return v == null ? null : num(v * 100, d == null ? 0 : d) + "%"; }

function durationText(hours) {
  if (hours == null) return "—";
  if (hours < 1) return num(hours * 60, 0) + " min";
  if (hours < 48) return num(hours, 1) + " " + t(C.fig.mtbf.hours);
  return num(hours / 24, 1) + " " + t(C.fig.mtbf.days);
}

function dig(path) {
  return path.split(".").reduce(function (o, k) { return o == null ? null : o[k]; }, SNAP);
}

/** Orange "still to fill in" chip; also recorded in the register. */
function tbdHTML(label, where) {
  REGISTER.push({ label: label, where: where || "" });
  return '<span class="tbd" title="' + t(C.ui.tbdHint) + '">' + (label || t(C.ui.tbdShort)) + "</span>";
}
function tbdNode(label, where) {
  var span = el("span", { class: "tbd", title: t(C.ui.tbdHint), text: label || t(C.ui.tbdShort) });
  REGISTER.push({ label: label || t(C.ui.tbdShort), where: where || "" });
  return span;
}

/** Substitute {{a:id}}, {{n:path}}, {{tbd:label}} inside a copy string. */
function fill(str, where) {
  return String(str).replace(/\{\{(\w+):([^}]+)\}\}/g, function (_, kind, arg) {
    if (kind === "a") {
      var l = LINKS[arg];
      if (!l) return arg;
      return '<a href="' + l.href + '" target="_blank" rel="noopener">' + t(l.label) + "</a>";
    }
    if (kind === "n") { var v = dig(arg); return v == null ? tbdHTML(null, arg) : num(v); }
    if (kind === "b") { var bv = dig(arg); return bv == null ? tbdHTML(null, arg) : big(bv, 1); }
    if (kind === "tbd") return tbdHTML(arg, where);
    return arg;
  });
}
function prose(pairOrStr, where) {
  return fill(typeof pairOrStr === "string" ? pairOrStr : t(pairOrStr), where);
}
/** Value or a tbd chip, as a DOM node. */
function val(v, where, fmt) {
  if (v == null || (typeof v === "number" && !isFinite(v))) return tbdNode(null, where);
  return document.createTextNode(fmt ? fmt(v) : String(v));
}

/* --------------------------------------------------------------- tooltip */

var TIP = null;
function tipInit() {
  TIP = el("div", { class: "tooltip", role: "status" });
  document.body.appendChild(TIP);
}
function tipShow(html, ev) {
  TIP.innerHTML = html;
  TIP.setAttribute("data-show", "1");
  tipMove(ev);
}
function tipMove(ev) {
  if (!ev) return;
  var pad = 14, r = TIP.getBoundingClientRect();
  var x = ev.clientX + pad, y = ev.clientY + pad;
  if (x + r.width > window.innerWidth - 8) x = ev.clientX - r.width - pad;
  if (y + r.height > window.innerHeight - 8) y = ev.clientY - r.height - pad;
  TIP.style.left = Math.max(8, x) + "px";
  TIP.style.top = Math.max(8, y) + "px";
}
function tipHide() { TIP.setAttribute("data-show", "0"); }

/** Attach hover/focus tooltip behaviour to any element. */
function hoverable(node, htmlFn) {
  node.addEventListener("mouseenter", function (e) { tipShow(htmlFn(), e); });
  node.addEventListener("mousemove", tipMove);
  node.addEventListener("mouseleave", tipHide);
  node.setAttribute("tabindex", "0");
  node.addEventListener("focus", function () {
    var r = node.getBoundingClientRect();
    tipShow(htmlFn(), { clientX: r.left + r.width / 2, clientY: r.bottom });
  });
  node.addEventListener("blur", tipHide);
  return node;
}

/* ---------------------------------------------------------- figure shell */

var FIG_N = 0, FIG_COLLAPSE = false;

function figure(opts) {
  // opts: {title, sub, tags:[{cls,label}], tools:[node], body:node, caption, where}
  var head = el("div", { class: "fig__head" }, [
    el("div", {}, [
      el("div", { class: "fig__title", text: t(opts.title) }),
      opts.sub ? el("div", { class: "fig__sub", text: t(opts.sub) }) : null,
    ]),
  ]);
  var tools = el("div", { class: "fig__tools" });
  (opts.tags || []).forEach(function (tg) {
    tools.appendChild(el("span", { class: "tag " + (tg.cls || ""), text: tg.label }));
  });
  (opts.tools || []).forEach(function (n) { tools.appendChild(n); });
  head.appendChild(tools);

  var collapsed = FIG_COLLAPSE && FIG_N++ > 0;
  var body = el("div", { class: "fig__body" }, [opts.body]);
  var tail = [];
  if (opts.caption) tail.push(el("figcaption", { html: prose(opts.caption, opts.where) }));
  if (opts.table) tail.push(opts.table);

  if (collapsed) {
    var d = el("details", { class: "fig fig--fold" });
    var sm = el("summary", { class: "fig__head" });
    while (head.firstChild) sm.appendChild(head.firstChild);
    d.appendChild(sm);
    d.appendChild(body);
    tail.forEach(function (n) { d.appendChild(n); });
    return d;
  }
  var fig = el("figure", { class: "fig" }, [head, body]);
  tail.forEach(function (n) { fig.appendChild(n); });
  return fig;
}
function tagSchematic() { return { cls: "tag--sch", label: t(C.ui.schematic) }; }
function tagIllustrative() { return { cls: "tag--ill", label: t(C.ui.illustr) }; }
function tagMeasured() { return { cls: "tag--real", label: t(C.ui.measured) }; }

/** The accessible table that accompanies every chart. */
function dataTable(cols, rows) {
  var thead = el("tr", {}, cols.map(function (c) {
    return el("th", { class: c.num ? "num" : "", text: c.label });
  }));
  var body = rows.map(function (r) {
    return el("tr", {}, r.map(function (cell, i) {
      var td = el("td", { class: cols[i].num ? "num" : "" });
      if (cell && cell.nodeType) td.appendChild(cell); else td.innerHTML = cell == null ? "—" : cell;
      return td;
    }));
  });
  var table = el("table", { class: "data" }, [el("thead", {}, [thead]), el("tbody", {}, body)]);
  var d = el("details", { class: "tablewrap-d" }, [
    el("summary", { text: t(C.ui.tableView) }),
    el("div", { class: "tablewrap" }, [table]),
  ]);
  return d;
}

function legend(items) {
  return el("div", { class: "legend" }, items.map(function (it) {
    return el("span", { class: "legend__i" }, [
      el("span", { class: "legend__sw" + (it.line ? " legend__sw--line" : ""),
                   style: "background:" + it.color + (it.dash ? ";opacity:.5" : "") }),
      el("span", { text: it.label }),
    ]);
  }));
}

/* ------------------------------------------------------------ svg scales */

function linear(d0, d1, r0, r1) {
  return function (v) { return r0 + (v - d0) / (d1 - d0) * (r1 - r0); };
}

/* ==========================================================================
   Charts
   ========================================================================== */

/* --- 5. architecture --------------------------------------------------- */
function chartArch() {
  var a = SNAP.m32.arch;
  var spec = [
    ["layers", num(a.layers)], ["hidden", num(a.hidden)], ["ffn", num(a.ffn)],
    ["heads", num(a.heads) + " (" + a.kvGroups + " kv)"],
    ["vocab", num(a.vocab)], ["seqLen", num(a.seqLen) + " " + t(C.ui.tokens)],
    ["params", big(SNAP.m32.params, 1)],
    ["act", a.act], ["norm", a.norm], ["posEmb", a.posEmb], ["lrSchedule", a.lrSchedule],
  ];
  var grid = el("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));gap:.9rem 1rem" },
    spec.map(function (s) {
      return el("div", {}, [
        el("div", { class: "kv__k", text: t(C.fig.arch.keys[s[0]]) }),
        el("div", { style: "font-size:.98rem;font-weight:600;font-variant-numeric:tabular-nums", text: s[1] }),
      ]);
    }));

  // where the parameters sit — one ordered series, ordinal ramp
  var parts = [
    { id: S.lang === "nl" ? "Attention (64 lagen)" : "Attention (64 layers)", v: 64 * (4 * 5120 * 5120 * (1 + 8 / 64 * 2) / 4) },
    { id: S.lang === "nl" ? "Feed-forward (64 lagen)" : "Feed-forward (64 layers)", v: 64 * 3 * 5120 * 25600 },
    { id: S.lang === "nl" ? "Woordenlijst in + uit" : "Vocabulary in + out", v: 2 * 262144 * 5120 },
  ];
  // recompute attention properly: q(h*h) + k,v(h * h*kv/heads each) + o(h*h)
  parts[0].v = 64 * (5120 * 5120 * 2 + 2 * 5120 * (5120 * 8 / 64));
  var tot = parts.reduce(function (s, p) { return s + p.v; }, 0);
  var pbar = el("div", { style: "display:flex;height:28px;border-radius:6px;overflow:hidden;gap:2px;background:var(--surface-2)" });
  parts.forEach(function (p, i) {
    var seg = el("div", { style: "flex:" + p.v + " 1 0;background:var(--series-" + (i + 1) + ")" });
    hoverable(seg, function () {
      return "<b>" + p.id + "</b><br>" + big(p.v, 1) + " " + (S.lang === "nl" ? "parameters" : "parameters") +
        "<br><span class='tooltip__k'>" + pct(p.v / tot, 0) + (S.lang === "nl" ? " van het model" : " of the model") + "</span>";
    });
    pbar.appendChild(seg);
  });

  var body = el("div", {}, [
    grid,
    el("div", { style: "margin-top:1.6rem" }, [
      el("div", { style: "font-size:.8rem;color:var(--ink-3);margin-bottom:.45rem", text: t(C.fig.arch.partsT) }),
      pbar,
      legend(parts.map(function (p, i) {
        return { color: "var(--series-" + (i + 1) + ")", label: p.id + " · " + pct(p.v / tot, 0) };
      })),
    ]),
  ]);
  return figure({ title: C.fig.arch.t, sub: C.fig.arch.s, tags: [tagMeasured()], body: body, caption: C.fig.arch.c });
}

/* --- 6a. next-token distribution -------------------------------------- */
function chartPredict() {
  var p = SNAP.predict;
  var rows = p.candidates.concat([{ t: null, p: p.otherP }]);
  var max = rows[0].p;
  var body = el("div", {}, [
    el("div", { style: "font-size:.8rem;color:var(--ink-3);margin-bottom:.3rem", text: t(C.fig.predict.given) }),
    el("div", { style: "font-family:var(--mono);font-size:1.02rem;margin-bottom:1.1rem" },
      [el("span", { text: "“" + p.prompt + " " }),
       el("span", { style: "color:var(--ink-3)", text: "█”" })]),
  ]);
  var grid = el("div", { style: "display:grid;gap:5px" });
  rows.forEach(function (r) {
    var isOther = r.t == null;
    var bar = el("div", {
      style: "height:22px;width:" + (r.p / max * 100) + "%;min-width:2px;border-radius:0 4px 4px 0;background:" +
             (isOther ? "var(--surface-3)" : "var(--series-1)"),
    });
    grid.appendChild(el("div", { style: "display:grid;grid-template-columns:9.5rem 1fr 3.2rem;gap:.6rem;align-items:center" }, [
      el("div", { style: "font-family:var(--mono);font-size:.84rem;color:" + (isOther ? "var(--ink-3)" : "var(--ink)"),
                  text: isOther ? t(C.fig.predict.other) : r.t.replace("▁", "·") }),
      el("div", {}, [bar]),
      el("div", { style: "font-size:.84rem;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink-2)", text: pct(r.p, 0) }),
    ]));
  });
  body.appendChild(grid);
  return figure({ title: C.fig.predict.t, sub: C.fig.predict.s, tags: [tagIllustrative()], body: body, caption: C.fig.predict.c });
}

/* --- 6b. loss curve ---------------------------------------------------- */
function chartLoss() {
  var W = 720, H = 300, m = { t: 14, r: 56, b: 34, l: 42 };
  var meas = SNAP.lossCurve.points, proj = SNAP.lossCurve.projected;
  var x = linear(0, 1, m.l, W - m.r);
  var y = linear(0, 4.0, H - m.b, m.t);          // clipped: the first points are off-scale
  var svg = svgEl("svg", { class: "chart", viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "xMidYMid meet",
                           role: "img", "aria-label": t(C.fig.loss.t) });

  [0, 1, 2, 3, 4].forEach(function (v) {
    svg.appendChild(svgEl("line", { class: "grid", x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
    var tx = svgEl("text", { class: "tick", x: m.l - 8, y: y(v) + 4, "text-anchor": "end" });
    tx.textContent = num(v, 0); svg.appendChild(tx);
  });
  [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
    var tx = svgEl("text", { class: "tick", x: x(v), y: H - m.b + 18, "text-anchor": "middle" });
    tx.textContent = pct(v, 0); svg.appendChild(tx);
  });
  svg.appendChild(svgEl("line", { class: "axis", x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }));

  function path(pts) {
    return pts.map(function (p, i) {
      return (i ? "L" : "M") + x(p[0]).toFixed(1) + " " + y(Math.min(p[1], 4.0)).toFixed(1);
    }).join(" ");
  }
  svg.appendChild(svgEl("path", { d: path(proj), fill: "none", stroke: "var(--series-1)",
    "stroke-width": 2, "stroke-dasharray": "5 4", opacity: ".45", "stroke-linecap": "round" }));
  svg.appendChild(svgEl("path", { d: path(meas), fill: "none", stroke: "var(--series-1)",
    "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));

  // the one measured point, direct-labelled
  var last = meas[meas.length - 1];
  var cx = x(last[0]), cy = y(last[1]);
  svg.appendChild(svgEl("circle", { cx: cx, cy: cy, r: 5.5, fill: "var(--series-1)",
                                    stroke: "var(--surface)", "stroke-width": 2 }));
  var lab = svgEl("text", { class: "lbl", x: cx + 11, y: cy - 8 });
  lab.textContent = t(C.fig.loss.now) + " · " + num(last[1], 2);
  svg.appendChild(lab);
  var lab2 = svgEl("text", { class: "tick", x: cx + 11, y: cy + 7 });
  lab2.textContent = pct(last[0], 1) + " " + t(C.ui.of) + " " + big(SNAP.m32.totalTokens, 0);
  svg.appendChild(lab2);

  var ylab = svgEl("text", { class: "axlabel", x: m.l - 8, y: m.t + 2, "text-anchor": "end" });
  ylab.textContent = t(C.fig.loss.ylab); svg.appendChild(ylab);
  var xlab = svgEl("text", { class: "axlabel", x: W - m.r, y: H - m.b + 18, "text-anchor": "end" });
  xlab.textContent = t(C.fig.loss.xlab); svg.appendChild(xlab);

  // crosshair
  var hit = svgEl("rect", { x: m.l, y: m.t, width: W - m.r - m.l, height: H - m.b - m.t, fill: "transparent" });
  var cross = svgEl("line", { class: "axis", y1: m.t, y2: H - m.b, opacity: 0, stroke: "var(--ink-3)" });
  svg.appendChild(cross); svg.appendChild(hit);
  var all = meas.concat(proj.slice(1));
  hit.addEventListener("mousemove", function (e) {
    var r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * W;
    var frac = (vx - m.l) / (W - m.r - m.l);
    var near = all.reduce(function (a, b) { return Math.abs(b[0] - frac) < Math.abs(a[0] - frac) ? b : a; });
    cross.setAttribute("x1", x(near[0])); cross.setAttribute("x2", x(near[0])); cross.setAttribute("opacity", ".45");
    var isMeas = near[0] <= last[0];
    tipShow("<b>" + pct(near[0], 1) + "</b> " + t(C.fig.loss.xlab) + "<br>" +
      (S.lang === "nl" ? "loss " : "loss ") + "<b>" + num(near[1], 2) + "</b><br>" +
      "<span class='tooltip__k'>" + (isMeas ? t(C.fig.loss.measured) : t(C.fig.loss.expected)) + " · " +
      big(near[0] * SNAP.m32.totalTokens, 1) + " " + t(C.ui.tokens) + "</span>", e);
  });
  hit.addEventListener("mouseleave", function () { cross.setAttribute("opacity", 0); tipHide(); });

  var body = el("div", {}, [svg, legend([
    { color: "var(--series-1)", line: true, label: t(C.fig.loss.measured) },
    { color: "var(--series-1)", line: true, dash: true, label: t(C.fig.loss.expected) },
  ])]);

  return figure({
    title: C.fig.loss.t, sub: C.fig.loss.s, tags: [tagMeasured(), tagSchematic()],
    body: body, caption: C.fig.loss.c,
    table: dataTable(
      [{ label: t(C.fig.loss.xlab) }, { label: t(C.fig.loss.ylab), num: true }, { label: "" }],
      all.map(function (p) { return [pct(p[0], 1), num(p[1], 2), p[0] <= last[0] ? t(C.fig.loss.measured) : t(C.fig.loss.expected)]; })
    ),
  });
}

/* --- 7. the node grid -------------------------------------------------- */
function chartGrid() {
  var m = SNAP.m32, P = m.parallel;
  var nodes = m.nodes;                       // 512
  var gpusPerNode = m.gpusPerNode;           // 4 == TP group
  var perReplica = P.tp * P.pp / gpusPerNode; // 4 nodes hold one full model copy
  var mode = "pp";
  var selected = null;

  var grid = el("div", { class: "nodegrid", role: "img", "aria-label": t(C.fig.grid.t) });
  var readout = el("div", {
    style: "margin-top:.9rem;font-size:.86rem;color:var(--ink-2);min-height:3.1rem",
    text: t(C.fig.grid.clickme),
  });

  function info(i) {
    var replica = Math.floor(i / perReplica);
    var stage = i % perReplica;
    return { replica: replica, stage: stage, layers: (stage * 16 + 1) + "–" + ((stage + 1) * 16) };
  }
  function paint() {
    Array.prototype.forEach.call(grid.children, function (n, i) {
      var d = info(i);
      n.classList.remove("dim");
      if (mode === "pp") {
        n.style.background = "var(" + ["--seq-250", "--seq-400", "--seq-550", "--seq-700"][d.stage] + ")";
      } else if (mode === "dp") {
        n.style.background = "var(--series-1)";
        if (selected != null && info(selected).replica !== d.replica) n.classList.add("dim");
      } else {
        n.style.background = "var(--series-1)";
      }
    });
  }

  for (var i = 0; i < nodes; i++) {
    (function (i) {
      var n = el("div", { class: "n", "data-i": i });
      hoverable(n, function () {
        var d = info(i);
        return "<b>" + t(C.fig.grid.node) + " " + (i + 1) + "</b> <span class='tooltip__k'>/ " + nodes + "</span><br>" +
          gpusPerNode + " × " + m.gpuType + "<br>" +
          t(C.fig.grid.stage) + " <b>" + d.layers + "</b> " + t(C.ui.of) + " " + m.arch.layers + "<br>" +
          t(C.fig.grid.replica) + " <b>" + (d.replica + 1) + "</b> " + t(C.ui.of) + " " + P.dp;
      });
      n.addEventListener("click", function () {
        selected = i; paint();
        var d = info(i);
        n.classList.add("down");
        readout.innerHTML = "<b>" + t(C.fig.grid.node) + " " + (i + 1) + "</b> — " +
          t(C.fig.grid.stage).toLowerCase() + " " + d.layers + ", " + t(C.fig.grid.replica).toLowerCase() +
          " " + (d.replica + 1) + ".<br>" + t(C.fig.grid.ifdown);
        setTimeout(function () { n.classList.remove("down"); }, 2200);
      });
      n.addEventListener("mouseenter", function () { if (mode === "dp") { selected = i; paint(); } });
      grid.appendChild(n);
    })(i);
  }
  paint();

  var seg = el("div", { class: "seg" });
  [["pp", C.fig.grid.modes.pp], ["dp", C.fig.grid.modes.dp], ["none", C.fig.grid.modes.none]].forEach(function (o) {
    seg.appendChild(el("button", {
      type: "button", text: t(o[1]), "aria-pressed": o[0] === mode ? "true" : "false",
      onclick: function () {
        mode = o[0];
        Array.prototype.forEach.call(seg.children, function (b) { b.setAttribute("aria-pressed", "false"); });
        this.setAttribute("aria-pressed", "true");
        paint();
        legendBox.innerHTML = "";
        if (mode === "pp") legendBox.appendChild(legend([0, 1, 2, 3].map(function (s) {
          return { color: "var(" + ["--seq-250", "--seq-400", "--seq-550", "--seq-700"][s] + ")",
                   label: t(C.fig.grid.stage) + " " + (s * 16 + 1) + "–" + ((s + 1) * 16) };
        })));
        else if (mode === "dp") legendBox.appendChild(el("div", { class: "legend" }, [
          el("span", { text: S.lang === "nl"
            ? "Beweeg over een knooppunt: de vier knooppunten die samen één volledige kopie van het model bevatten lichten op."
            : "Hover a node: the four nodes that together hold one full copy of the model light up." })]));
      },
    }));
  });
  var legendBox = el("div");
  legendBox.appendChild(legend([0, 1, 2, 3].map(function (s) {
    return { color: "var(" + ["--seq-250", "--seq-400", "--seq-550", "--seq-700"][s] + ")",
             label: t(C.fig.grid.stage) + " " + (s * 16 + 1) + "–" + ((s + 1) * 16) };
  })));

  return figure({
    title: C.fig.grid.t, sub: C.fig.grid.s, tags: [tagMeasured()], tools: [seg],
    body: el("div", {}, [grid, legendBox, readout]), caption: C.fig.grid.c,
  });
}

/* --- 8. checkpoint / crash timeline ------------------------------------ */
function chartCheckpoints() {
  var W = 720, H = 160, m = { t: 30, r: 16, b: 42, l: 16 };
  var hoursTotal = 24, save = 3.2, crash = 14.1, noticed = 14.9;
  var lastSave = Math.floor(crash / save) * save;
  var x = linear(0, hoursTotal, m.l, W - m.r);
  var yLine = H - m.b;
  var svg = svgEl("svg", { class: "chart", viewBox: "0 0 " + W + " " + H,
                           role: "img", "aria-label": t(C.fig.ckpt.t) });

  // the band of work that a crash destroys: last checkpoint -> restart
  svg.appendChild(svgEl("rect", {
    x: x(lastSave), y: yLine - 26, width: x(noticed) - x(lastSave), height: 26,
    fill: "var(--critical)", opacity: ".14", rx: 3,
  }));
  svg.appendChild(svgEl("line", { class: "axis", x1: m.l, x2: W - m.r, y1: yLine, y2: yLine }));

  // checkpoint ticks, skipping the window in which nothing was running
  for (var h = 0; h <= hoursTotal + 0.01; h += save) {
    if (h > crash && h < noticed) continue;
    svg.appendChild(svgEl("line", { x1: x(h), x2: x(h), y1: yLine - 16, y2: yLine,
                                    stroke: "var(--series-1)", "stroke-width": 2 }));
    svg.appendChild(svgEl("circle", { cx: x(h), cy: yLine - 18, r: 3.5, fill: "var(--series-1)" }));
  }

  svg.appendChild(svgEl("line", { x1: x(crash), x2: x(crash), y1: yLine - 44, y2: yLine + 6,
                                  stroke: "var(--critical)", "stroke-width": 2 }));
  var ct = svgEl("text", { class: "lbl", x: x(crash), y: yLine - 50, "text-anchor": "middle", fill: "var(--critical)" });
  ct.textContent = t(C.fig.ckpt.crash);
  svg.appendChild(ct);

  svg.appendChild(svgEl("line", { x1: x(noticed), x2: x(noticed), y1: yLine - 30, y2: yLine + 6,
                                  stroke: "var(--ink-3)", "stroke-width": 2 }));
  var nt = svgEl("text", { class: "tick", x: x(noticed) + 6, y: yLine - 22 });
  nt.textContent = t(C.fig.ckpt.notice);
  svg.appendChild(nt);

  var lt = svgEl("text", { class: "lbl", x: (x(lastSave) + x(noticed)) / 2, y: yLine + 20,
                           "text-anchor": "middle", fill: "var(--critical)" });
  lt.textContent = t(C.fig.ckpt.lost) + " \u00B7 " + num(noticed - lastSave, 1) + " " + t(C.fig.mtbf.hours);
  svg.appendChild(lt);

  var hd = svgEl("text", { class: "tick", x: m.l, y: 16 });
  hd.textContent = "\u25CF " + t(C.fig.ckpt.saved) + " \u2014 " +
    (S.lang === "nl" ? "elke 2.000 stappen, ongeveer elke 3 uur" : "every 2,000 steps, roughly every 3 hours");
  svg.appendChild(hd);

  return figure({ title: C.fig.ckpt.t, sub: C.fig.ckpt.s, tags: [tagSchematic()],
                  body: svg, caption: C.fig.ckpt.c });
}

/* --- 10. before / after SFT -------------------------------------------- */
function chartSFT() {
  function panel(who, answer, why, accent) {
    return el("div", { style: "background:var(--surface-2);border:1px solid var(--rule);border-radius:10px;padding:.85rem .95rem" }, [
      el("div", { style: "font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;color:" + accent + ";font-weight:600;margin-bottom:.45rem", text: who }),
      el("div", { style: "font-size:.95rem", text: answer }),
      el("div", { style: "font-size:.8rem;color:var(--ink-3);margin-top:.6rem", text: why }),
    ]);
  }
  var body = el("div", {}, [
    el("div", { style: "font-size:.8rem;color:var(--ink-3)", text: t(C.fig.sft.q) }),
    el("div", { style: "font-size:1.05rem;margin:.2rem 0 1.1rem", text: "“" + t(C.fig.sft.question) + "”" }),
    el("div", { style: "display:grid;gap:.8rem;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))" }, [
      panel(t(C.fig.sft.base), t(C.fig.sft.baseA), t(C.fig.sft.baseWhy), "var(--ink-3)"),
      panel(t(C.fig.sft.tuned), t(C.fig.sft.tunedA), t(C.fig.sft.tunedWhy), "var(--series-1)"),
    ]),
  ]);
  return figure({ title: C.fig.sft.t, sub: C.fig.sft.s, tags: [tagIllustrative()], body: body, caption: C.fig.sft.c });
}

/* --- 11. evaluation table ---------------------------------------------- */
function chartEvals() {
  var rows = SNAP.evals.rows.map(function (r) {
    return [t(C.fig.evals.rows[r.id]),
            r.base == null ? tbdNode(null, "evals." + r.id) : num(r.base, 1),
            r.sft == null ? tbdNode(null, "evals." + r.id) : num(r.sft, 1)];
  });
  var cols = [{ label: S.lang === "nl" ? "Benchmark" : "Benchmark" },
              { label: t(C.fig.evals.base), num: true }, { label: t(C.fig.evals.sft), num: true }];
  var thead = el("tr", {}, cols.map(function (c) { return el("th", { class: c.num ? "num" : "", text: c.label }); }));
  var tb = el("tbody", {}, rows.map(function (r) {
    return el("tr", {}, r.map(function (cell, i) {
      var td = el("td", { class: cols[i].num ? "num" : "" });
      if (cell && cell.nodeType) td.appendChild(cell); else td.textContent = cell;
      return td;
    }));
  }));
  var body = el("div", { class: "tablewrap" }, [el("table", { class: "data" }, [el("thead", {}, [thead]), tb])]);
  return figure({ title: C.fig.evals.t, sub: C.fig.evals.s, body: body, caption: C.fig.evals.c });
}

/* --- ch4. failure arithmetic ------------------------------------------- */
function chartMTBF() {
  var gpus = SNAP.m32.gpus;
  var years = SNAP.cluster.mtbfYearsDefault;
  var out = el("div", { style: "display:grid;gap:1.1rem" });

  var hero = el("div", { style: "font-size:clamp(1.8rem,5vw,2.8rem);font-weight:600;letter-spacing:-.02em;line-height:1.1" });
  var sub = el("div", { style: "font-size:.88rem;color:var(--ink-2);margin-top:.35rem" });
  var sub2 = el("div", { style: "font-size:.88rem;color:var(--ink-2)" });

  var input = el("input", {
    type: "range", min: "1", max: "20", step: "0.5", value: String(years),
    style: "width:100%;accent-color:var(--series-1)",
    "aria-label": t(C.fig.mtbf.slider),
  });
  var label = el("div", { style: "font-size:.82rem;color:var(--ink-3);display:flex;justify-content:space-between" });

  function recalc() {
    var yv = parseFloat(input.value);
    if (!isFinite(yv)) yv = years;
    var hoursBetween = yv * 365 * 24 / gpus;
    var perWeek = 168 / hoursBetween;
    var lostPerWeek = perWeek * (3.2 / 2 + 0.6);   // half a checkpoint interval + time to notice & restart
    hero.textContent = durationText(hoursBetween);
    sub.innerHTML = t(C.fig.mtbf.result).replace("{n}", num(gpus)) + " — " +
      "<b>" + t(C.fig.mtbf.perWeek).replace("{n}", num(perWeek, 1)) + "</b>";
    sub2.textContent = t(C.fig.mtbf.lostPerWeek).replace("{n}", num(lostPerWeek, 1));
    label.innerHTML = "<span>" + t(C.fig.mtbf.slider) + " <b>" + num(yv, 1) + " " + t(C.fig.mtbf.years) + "</b></span>" +
      "<span>" + num(gpus) + " GPU’s</span>";
  }
  input.addEventListener("input", recalc);
  recalc();

  out.appendChild(el("div", {}, [hero, sub, sub2]));
  out.appendChild(el("div", {}, [input, label]));
  return figure({ title: C.fig.mtbf.t, sub: C.fig.mtbf.s, body: out, caption: C.fig.mtbf.c });
}

function chartCauses() {
  var cs = SNAP.cluster.causes.slice().sort(function (a, b) { return b.share - a.share; });
  var max = cs[0].share;
  var grid = el("div", { style: "display:grid;gap:6px" });
  cs.forEach(function (c) {
    var bar = el("div", { style: "height:24px;width:" + (c.share / max * 100) + "%;min-width:3px;background:var(--series-1);border-radius:0 4px 4px 0" });
    var row = el("div", { style: "display:grid;grid-template-columns:12rem 1fr 3rem;gap:.6rem;align-items:center" }, [
      el("div", { style: "font-size:.85rem;color:var(--ink-2)", text: t(C.fig.causes.ids[c.id]) }),
      el("div", {}, [bar]),
      el("div", { style: "font-size:.84rem;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink-2)", text: pct(c.share, 0) }),
    ]);
    hoverable(row, function () {
      return "<b>" + t(C.fig.causes.ids[c.id]) + "</b> · " + pct(c.share, 0) + "<br><span class='tooltip__k'>" +
        t(C.fig.causes.why[c.id]) + "</span>";
    });
    grid.appendChild(row);
  });
  return figure({
    title: C.fig.causes.t, sub: C.fig.causes.s, tags: [tagSchematic()], body: grid, caption: C.fig.causes.c,
    table: dataTable([{ label: S.lang === "nl" ? "Soort storing" : "Kind of fault" }, { label: "%", num: true }],
      cs.map(function (c) { return [t(C.fig.causes.ids[c.id]), pct(c.share, 0)]; })),
  });
}


/* ==========================================================================
   Interactive widgets — the things you can actually turn, drag and run.
   Each one does real arithmetic; anything estimated says so on itself.
   ========================================================================== */

/* A labelled slider that reports its value and flags when it is off the real one. */
function slider(opts) {
  // opts: {min,max,step,value,real,label,format,onInput}
  var input = el("input", {
    type: "range", min: opts.min, max: opts.max, step: opts.step, value: opts.value,
    "aria-label": opts.label, style: "width:100%;accent-color:var(--series-1)",
  });
  var out = el("span", { class: "sl__v" });
  var flag = el("span", { class: "sl__flag", hidden: true, text: t(C.iact.changed) });
  function paint() {
    var v = parseFloat(input.value);
    out.textContent = opts.format ? opts.format(v) : num(v);
    var off = opts.real != null && Math.abs(v - opts.real) > 1e-9;
    flag.hidden = !off;
    return v;
  }
  input.addEventListener("input", function () { opts.onInput(paint()); });
  var row = el("div", { class: "sl" }, [
    el("div", { class: "sl__top" }, [
      el("span", { class: "sl__k", text: opts.label }), flag,
      el("span", { style: "margin-left:auto" }, [out]),
    ]),
    input,
    opts.ends ? el("div", { class: "sl__ends" }, [
      el("span", { text: opts.ends[0] }), el("span", { text: opts.ends[1] }),
    ]) : null,
  ]);
  row.setValue = function (v) { input.value = v; paint(); };
  paint();
  return row;
}

function readout(k, v, note, tone) {
  return el("div", { class: "ro" + (tone ? " ro--" + tone : "") }, [
    el("div", { class: "ro__k", text: k }),
    el("div", { class: "ro__v", text: v }),
    note ? el("div", { class: "ro__n", text: note }) : null,
  ]);
}
function resetBtn(fn) {
  return el("button", { type: "button", class: "btn", text: t(C.iact.reset), onclick: fn });
}

/* Ordered stages get an ordinal ramp, never a categorical set. The lightest
   step is the documented floor for the light surface; the darkest for dark. */
var ORDINAL = ["--seq-250", "--seq-300", "--seq-350", "--seq-400", "--seq-500", "--seq-600", "--seq-700"];

/* --- 2. filtering, with the strictness of every stage in your hands ------ */
function chartFunnelLive() {
  var stages = SNAP.filter.stages;
  var vals = stages.map(function (s) { return s.keep; });
  var bars = el("div", { style: "display:grid;gap:6px" });
  var sliders = el("div", { class: "slgrid" });
  var out = el("div", { class: "rogrid" });
  var need = SNAP.m32.totalTokens;
  // Schematic starting pool: what a raw crawl of this kind yields, in tokens.
  var RAW_TOKENS = 1.4e14;

  var tableHost = el("div");
  function redraw() {
    var cum = 1;
    bars.innerHTML = "";
    stages.forEach(function (st, i) {
      cum *= vals[i];
      var color = "var(" + ORDINAL[Math.min(i, ORDINAL.length - 1)] + ")";
      var bar = el("div", { style: "height:24px;width:" + Math.max(0.4, cum * 100).toFixed(2) +
        "%;background:" + color + ";border-radius:0 4px 4px 0;transition:width .25s" });
      var row = el("div", { class: "fnrow" }, [
        el("div", { class: "fnrow__k", text: t(C.fig.funnel.stages[st.id]) }),
        el("div", { style: "background:var(--surface-2);border-radius:0 4px 4px 0" }, [bar]),
        el("div", { class: "fnrow__v", text: pct(cum, cum < 0.2 ? 1 : 0) }),
      ]);
      hoverable(row, function () {
        return "<b>" + t(C.fig.funnel.stages[st.id]) + "</b><br><span class='tooltip__k'>" +
          t(C.fig.funnel.stageWhy[st.id]) + "</span>";
      });
      bars.appendChild(row);
    });

    var left = RAW_TOKENS * cum;
    var epochs = need / left;
    out.innerHTML = "";
    out.appendChild(readout(t(C.iact.remaining), big(left, 1) + " " + t(C.ui.tokens), null,
      epochs <= 1 ? "good" : epochs <= 2 ? "warning" : "critical"));
    out.appendChild(readout(
      epochs <= 1 ? t(C.iact.enough) : t(C.iact.notEnough),
      epochs <= 1 ? pct(1 / epochs, 0) + " ×" : num(epochs, 1) + " ×",
      epochs <= 1 ? null : t(C.iact.epochsNeeded)));
  }

  stages.forEach(function (st, i) {
    if (st.id === "raw") return;
    sliders.appendChild(slider({
      min: 0.15, max: 1, step: 0.01, value: st.keep, real: st.keep,
      label: t(C.fig.funnel.stages[st.id]),
      ends: [t(C.iact.strict), t(C.iact.loose)],
      format: function (v) { return pct(v, 0); },
      onInput: function (v) { vals[i] = v; redraw(); },
    }));
  });
  redraw();

  var reset = resetBtn(function () {
    [].slice.call(sliders.children).forEach(function (row, j) {
      row.setValue(stages[j + 1].keep); vals[j + 1] = stages[j + 1].keep;
    });
    redraw();
  });

  return figure({
    title: C.iact.filterT, sub: C.iact.filterS, tags: [tagSchematic()], tools: [reset],
    body: el("div", {}, [bars, el("div", { class: "split" }, [sliders, out])]),
    caption: C.iact.filterC, table: tableHost,
  });
}

/* --- 3. tokenising, on your own sentence -------------------------------- */
/* A deliberately simple greedy splitter: it is NOT the production tokenizer,
   and the figure says so. It reproduces the behaviour that matters here —
   frequent words stay whole, rarer ones shatter, digits split individually. */
var COMMON = ("de het een en van in is op te dat die voor met als zijn er maar om ook aan " +
  "door over naar bij uit dan nu nog werd wordt worden was waren heeft hebben kan kunnen zal " +
  "niet wel geen veel meer zeer lang kort groot klein nieuw oud goed jaar dag tijd mens land " +
  "water weer wind kilometer meter procent model taal tekst data reken stap the of and to in is " +
  "it that for with as are was were be been has have can will not no more very long short " +
  "year day time people land water weather wind kilometre metre percent model language text step").split(" ");
var PIECES = ("ing en er de te ge be ver ont lijk heid baar loos ste sche isch atie eren ische " +
  "tion ly ed ness ment able ous ive al ic ate ise ize").split(" ");

function approxTokenize(text) {
  var out = [];
  var words = text.split(/(\s+)/).filter(function (w) { return w.length; });
  words.forEach(function (w) {
    if (/^\s+$/.test(w)) return;
    var lead = out.length ? "▁" : "";
    var m = w.match(/^([\wÀ-ÿ']+)(.*)$/);
    var core = m ? m[1] : w, tail = m ? m[2] : "";
    if (/^\d+$/.test(core)) {
      out.push(lead + "");
      core.split("").forEach(function (d) { out.push(d); });
    } else if (COMMON.indexOf(core.toLowerCase()) !== -1 || core.length <= 4) {
      out.push(lead + core);
    } else {
      // greedy: keep a plausible stem, then peel known endings, then chunks of 2-4
      var rest = core, first = true;
      var guard = 0;
      while (rest.length && guard++ < 24) {
        var cut = null;
        for (var i = 0; i < PIECES.length; i++) {
          var pc = PIECES[i];
          if (rest.length > pc.length && rest.slice(-pc.length).toLowerCase() === pc) { cut = pc.length; break; }
        }
        if (rest.length <= 5) { out.push((first ? lead : "") + rest); break; }
        if (cut && rest.length - cut >= 3) {
          out.push((first ? lead : "") + rest.slice(0, rest.length - cut));
          out.push(rest.slice(rest.length - cut));
          break;
        }
        var take = Math.min(rest.length <= 8 ? 4 : 3, rest.length);
        out.push((first ? lead : "") + rest.slice(0, take));
        rest = rest.slice(take);
        first = false;
      }
    }
    if (tail) tail.split("").forEach(function (ch) { out.push(ch); });
  });
  return out.filter(function (x) { return x !== ""; });
}

function tokenRow(pieces) {
  var row = el("div", { class: "tok" });
  pieces.forEach(function (p) {
    var isWordStart = p.charAt(0) === "▁";
    var chip = el("span", { class: "tok__t " + (isWordStart ? "w" : "p") }, [
      el("span", { html: isWordStart ? '<span class="tok__sp">·</span>' + p.slice(1) : p }),
    ]);
    hoverable(chip, function () {
      return "<b>" + p.replace("▁", "▁ ") + "</b><br><span class='tooltip__k'>" +
        (isWordStart ? (S.lang === "nl" ? "Begin van een nieuw woord" : "Start of a new word")
                     : (S.lang === "nl" ? "Vervolg binnen hetzelfde woord" : "Continuation inside the same word")) +
        "</span>";
    });
    row.appendChild(chip);
  });
  return row;
}

function chartTokenizerLive() {
  var box = el("div");
  var input = el("input", {
    type: "text", class: "txtin", value: "Onze rijksoverheid publiceert vergunningsaanvragen.",
    placeholder: t(C.iact.typeHere), "aria-label": t(C.iact.typeHere),
  });
  var out = el("div");
  var stats = el("div", { class: "rogrid", style: "margin-top:.9rem" });

  function redraw() {
    var pieces = approxTokenize(input.value || "");
    out.innerHTML = "";
    out.appendChild(tokenRow(pieces));
    stats.innerHTML = "";
    stats.appendChild(readout(t(C.ui.tokens), String(pieces.length)));
    stats.appendChild(readout(t(C.fig.tok.ratio),
      pieces.length ? num((input.value || "").length / pieces.length, 1) : "—"));
    stats.appendChild(readout(S.lang === "nl" ? "Past in één blok" : "Fits in one block",
      pct(Math.min(1, pieces.length / SNAP.m32.arch.seqLen), 2),
      num(SNAP.m32.arch.seqLen) + " " + t(C.ui.tokens)));
  }
  input.addEventListener("input", redraw);
  redraw();

  box.appendChild(el("div", { class: "sl__k", style: "margin-bottom:.4rem", text: t(C.iact.yourText) }));
  box.appendChild(input);
  box.appendChild(el("div", { style: "margin-top:.9rem" }, [out]));
  box.appendChild(stats);

  box.appendChild(el("div", { class: "sl__k", style: "margin:1.8rem 0 .5rem" }, [
    el("span", { text: t(C.iact.realEx) }),
    el("span", { class: "tag tag--real", style: "margin-left:.5rem", text: t(C.ui.measured) }),
  ]));
  SNAP.tokenizer.examples.forEach(function (ex) {
    box.appendChild(el("div", { class: "exline" }, [
      el("div", { style: "font-size:.95rem;margin-bottom:.4rem", text: "“" + ex.text + "”" }),
      tokenRow(ex.pieces),
      el("div", { style: "font-size:.8rem;color:var(--ink-3);margin-top:.35rem",
        text: ex.pieces.length + " " + t(C.ui.tokens) }),
    ]));
  });

  return figure({
    title: C.fig.tok.t, sub: C.fig.tok.s,
    tags: [{ cls: "tag--ill", label: t(C.iact.approx) }, tagMeasured()],
    body: box, caption: C.iact.approxNote,
  });
}


/* --- 4. compose the mix yourself ---------------------------------------- */
function chartMixLive() {
  var doms = SNAP.mix.domains.map(function (d) { return { id: d.id, share: d.share, real: d.share }; });
  var bar = el("div", { class: "stack" });
  var leg = el("div");
  var eff = el("div", { class: "effgrid" });
  var sliders = el("div", { class: "slgrid" });
  var tableHost = el("div");

  function norm() {
    var tot = doms.reduce(function (a, b) { return a + b.share; }, 0) || 1;
    return doms.map(function (d) { return d.share / tot; });
  }
  function meter(label, v, real) {
    var d = v - real;
    var w = Math.min(100, Math.max(0, 50 + d * 320));
    return el("div", { class: "eff" }, [
      el("div", { class: "eff__k", text: label }),
      el("div", { class: "eff__track" }, [
        el("div", { class: "eff__mid" }),
        el("div", { class: "eff__fill", style: "left:" + Math.min(50, w) + "%;width:" + Math.abs(w - 50) +
          "%;background:" + (d >= 0 ? "var(--good)" : "var(--critical)") }),
      ]),
      el("div", { class: "eff__v", text: (d >= 0 ? "+" : "−") + num(Math.abs(d) * 100, 1) }),
    ]);
  }

  function redraw() {
    var n = norm();
    bar.innerHTML = ""; leg.innerHTML = ""; eff.innerHTML = "";
    doms.forEach(function (d, i) {
      var seg = el("div", { class: "stack__s", style: "flex:" + Math.max(0.0001, n[i]) +
        " 1 0;background:var(--series-" + (i + 1) + ")" });
      hoverable(seg, function () {
        return "<b>" + t(C.fig.mix.domains[d.id]) + "</b><br>" + pct(n[i], 1) +
          "<br><span class='tooltip__k'>" + t(C.iact.real) + ": " + pct(d.real, 1) + "</span>";
      });
      bar.appendChild(seg);
    });
    leg.appendChild(legend(doms.map(function (d, i) {
      return { color: "var(--series-" + (i + 1) + ")", label: t(C.fig.mix.domains[d.id]) + " · " + pct(n[i], 0) };
    })));

    function share(id) { var i = doms.map(function (d) { return d.id; }).indexOf(id); return n[i]; }
    function realShare(id) { var d = doms.filter(function (x) { return x.id === id; })[0]; return d.real; }
    // Directional, deliberately simple: each outcome leans on a couple of sources.
    var code = share("code") - realShare("code");
    var web = share("web") - realShare("web");
    var sci = share("science") - realShare("science");
    var off = share("official") - realShare("official");
    var wiki = share("wiki") - realShare("wiki");
    var syn = share("synth") - realShare("synth");
    var bk = share("books") - realShare("books");
    eff.appendChild(meter(t(C.iact.effCode), realShare("code") + code * 1.0 + sci * 0.4, realShare("code")));
    eff.appendChild(meter(t(C.iact.effNl), realShare("official") + off * 0.8 + bk * 0.5 - web * 0.2, realShare("official")));
    eff.appendChild(meter(t(C.iact.effSmall), realShare("synth") + syn * 1.1 + off * 0.3 - web * 0.3, realShare("synth")));
    eff.appendChild(meter(t(C.iact.effFacts), realShare("wiki") + wiki * 1.0 + sci * 0.5, realShare("wiki")));
    eff.appendChild(meter(t(C.iact.effMemo), realShare("wiki") + wiki * 0.8 + syn * 0.6, realShare("wiki")));

    tableHost.innerHTML = "";
    tableHost.appendChild(dataTable(
      [{ label: S.lang === "nl" ? "Soort tekst" : "Kind of text" },
       { label: S.lang === "nl" ? "Nu" : "Now", num: true },
       { label: t(C.iact.real), num: true }],
      doms.map(function (d, i) { return [t(C.fig.mix.domains[d.id]), pct(n[i], 1), pct(d.real, 1)]; })));
  }

  doms.forEach(function (d, i) {
    sliders.appendChild(slider({
      min: 0, max: 0.8, step: 0.01, value: d.share, real: d.real,
      label: t(C.fig.mix.domains[d.id]),
      format: function (v) { return pct(v, 0); },
      onInput: function (v) { doms[i].share = v; redraw(); },
    }));
  });
  redraw();

  var reset = resetBtn(function () {
    [].slice.call(sliders.children).forEach(function (row, j) { row.setValue(doms[j].real); doms[j].share = doms[j].real; });
    redraw();
  });

  return figure({
    title: C.iact.mixT, sub: C.iact.mixS, tags: [tagSchematic()], tools: [reset],
    body: el("div", {}, [
      bar, leg,
      el("div", { class: "split" }, [
        sliders,
        el("div", {}, [el("div", { class: "sl__k", style: "margin-bottom:.5rem", text: t(C.iact.effects) }), eff]),
      ]),
    ]),
    caption: C.iact.mixC, table: tableHost,
  });
}

/* --- 5. build a different model ----------------------------------------- */
function archParams(layers, hidden, ffn, heads, kv, vocab) {
  var headDim = hidden / heads;
  var attn = hidden * hidden * 2 + 2 * hidden * (headDim * kv);   // q, o + k, v
  var mlp = 3 * hidden * ffn;                                      // SwiGLU: gate, up, down
  return layers * (attn + mlp) + 2 * vocab * hidden;               // untied embeddings
}
function chartArchBuild() {
  var a = SNAP.m32.arch, real = SNAP.m32;
  var st = { layers: a.layers, hidden: a.hidden, ffn: a.ffn };
  var out = el("div", { class: "rogrid" });
  var bar = el("div", { class: "cmp" });
  var sliders = el("div", { class: "slgrid" });

  function calc() {
    var ffnRatio = st.ffn / st.hidden;
    var p = archParams(st.layers, st.hidden, Math.round(st.hidden * ffnRatio), a.heads, a.kvGroups, a.vocab);
    var bytesTrain = p * (2 + 2 + 4 + 4 + 4);        // bf16 weights+grads, fp32 master + 2 Adam moments
    var perGpu = bytesTrain / real.gpus;
    // step time scales with parameters x tokens; the real run is the anchor
    var stepS = real.secPerStep * (p / real.params);
    var days = real.totalSteps * stepS / 86400;
    return { p: p, perGpu: perGpu, stepS: stepS, days: days };
  }
  function redraw() {
    var r = calc();
    var fits = r.perGpu < 96e9;
    out.innerHTML = "";
    out.appendChild(readout(t(C.fig.arch.keys.params), big(r.p, 1),
      t(C.iact.vsReal) + ": " + big(real.params, 1)));
    out.appendChild(readout(t(C.iact.perGpu), num(r.perGpu / 1e9, 0) + " GB",
      fits ? t(C.iact.fits) : t(C.iact.fitsNot), fits ? "good" : "critical"));
    out.appendChild(readout(t(C.iact.stepTime), num(r.stepS, 1) + " s",
      t(C.iact.vsReal) + ": " + num(real.secPerStep, 1) + " s"));
    out.appendChild(readout(t(C.iact.runLength), num(r.days, 0) + " " + t(C.fig.mtbf.days),
      t(C.iact.vsReal) + ": " + num(real.totalSteps * real.secPerStep / 86400, 0)));
    var ratio = Math.min(2.2, r.p / real.params);
    bar.innerHTML = "";
    bar.appendChild(el("div", { class: "cmp__row" }, [
      el("div", { class: "cmp__k", text: t(C.iact.vsReal) }),
      el("div", { class: "cmp__t" }, [el("div", { class: "cmp__f", style: "width:" + (100 / 2.2) + "%;background:var(--ink-3)" })]),
    ]));
    bar.appendChild(el("div", { class: "cmp__row" }, [
      el("div", { class: "cmp__k", text: S.lang === "nl" ? "jouw model" : "your model" }),
      el("div", { class: "cmp__t" }, [el("div", { class: "cmp__f", style: "width:" + (ratio / 2.2 * 100) + "%;background:var(--series-1)" })]),
    ]));
  }

  [["layers", 8, 128, 1, C.fig.arch.keys.layers],
   ["hidden", 1024, 10240, 256, C.fig.arch.keys.hidden],
   ["ffn", 2048, 40960, 512, C.fig.arch.keys.ffn]].forEach(function (cfg) {
    sliders.appendChild(slider({
      min: cfg[1], max: cfg[2], step: cfg[3], value: st[cfg[0]], real: a[cfg[0]],
      label: t(cfg[4]), format: function (v) { return num(v); },
      onInput: function (v) { st[cfg[0]] = v; redraw(); },
    }));
  });
  redraw();

  var reset = resetBtn(function () {
    [].slice.call(sliders.children).forEach(function (row, j) {
      var k = ["layers", "hidden", "ffn"][j]; row.setValue(a[k]); st[k] = a[k];
    });
    redraw();
  });

  return figure({
    title: C.iact.archT, sub: C.iact.archS, tags: [tagMeasured()], tools: [reset],
    body: el("div", {}, [el("div", { class: "split" }, [sliders, out]), bar]),
    caption: C.iact.archC,
  });
}

/* --- 6. run one training step ------------------------------------------- */
function stepRunner() {
  var phases = [
    { k: C.iact.ph1, d: C.iact.ph1d, c: "--series-1" },
    { k: C.iact.ph2, d: C.iact.ph2d, c: "--series-2" },
    { k: C.iact.ph3, d: C.iact.ph3d, c: "--series-7" },
    { k: C.iact.ph4, d: C.iact.ph4d, c: "--series-3" },
  ];
  var idx = -1, timer = null, done = 0, busy = false;
  var loss = SNAP.m32.loss;

  var track = el("div", { class: "phases" });
  var nodes = phases.map(function (ph, i) {
    var n = el("div", { class: "phase", "data-i": i }, [
      el("div", { class: "phase__bar", style: "background:var(" + ph.c + ")" }),
      el("div", { class: "phase__k", text: t(ph.k) }),
      el("div", { class: "phase__d", text: t(ph.d) }),
    ]);
    track.appendChild(n);
    return n;
  });

  var stats = el("div", { class: "rogrid" });
  function paintStats() {
    stats.innerHTML = "";
    stats.appendChild(readout(t(C.iact.stepsDone), num(done),
      t(C.ui.of) + " " + num(SNAP.m32.totalSteps)));
    stats.appendChild(readout(t(C.ui.tokens), big(done * SNAP.m32.tokensPerStep, 2)));
    stats.appendChild(readout("loss", num(loss, 4),
      done ? "−" + num(0.00004 * done, 5) : null));
    stats.appendChild(readout(t(C.iact.atThisRate),
      num(SNAP.m32.totalSteps * SNAP.m32.secPerStep / 86400, 0) + " " + t(C.fig.mtbf.days)));
  }
  paintStats();

  var btn = el("button", { type: "button", class: "btn btn--primary", text: t(C.iact.run1) });
  function advance() {
    idx++;
    nodes.forEach(function (n, i) { n.setAttribute("data-on", i === idx ? "1" : (i < idx ? "2" : "0")); });
    if (idx >= phases.length) {
      clearInterval(timer); timer = null; busy = false;
      done++; loss = Math.max(0.9, loss - 0.00004);
      btn.textContent = t(C.iact.run1); btn.disabled = false;
      paintStats();
      setTimeout(function () { nodes.forEach(function (n) { n.setAttribute("data-on", "0"); }); }, 700);
    }
  }
  btn.addEventListener("click", function () {
    if (busy) return;
    busy = true; idx = -1; btn.disabled = true; btn.textContent = t(C.iact.running) + "…";
    advance();
    timer = setInterval(advance, 620);
  });

  return figure({
    title: C.iact.stepT, sub: C.iact.stepS, tags: [tagIllustrative()], tools: [btn],
    body: el("div", {}, [track, stats]), caption: C.iact.stepC,
  });
}


/* --- 8. how often do you save? ------------------------------------------ */
function chartCheckpointTrade() {
  var m = SNAP.m32;
  var ckGb = m.checkpointGb.withOptimizer;
  var writeMin = 4;                       // minutes of stalled GPUs per save
  var faultsPerWeek = 168 / (SNAP.cluster.mtbfYearsDefault * 365 * 24 / m.gpus);
  var noticeH = 0.6;                      // time to notice + restart
  var interval = m.saveInterval;
  var out = el("div", { class: "rogrid" });
  var curve = el("div");

  function costs(iv) {
    var hoursBetween = iv * m.secPerStep / 3600;
    var savesPerDay = 24 / hoursBetween;
    var storagePerDay = savesPerDay * ckGb;
    var overheadPerWeek = savesPerDay * 7 * writeMin / 60;
    var lostPerFault = hoursBetween / 2 + noticeH;
    var lostPerWeek = faultsPerWeek * lostPerFault;
    return { hoursBetween: hoursBetween, storagePerDay: storagePerDay,
             overheadPerWeek: overheadPerWeek, lostPerFault: lostPerFault,
             totalPerWeek: overheadPerWeek + lostPerWeek };
  }

  function redraw() {
    var c = costs(interval);
    out.innerHTML = "";
    out.appendChild(readout(t(C.iact.ckStorage), num(c.storagePerDay / 1000, 1) + " TB",
      num(24 / c.hoursBetween, 1) + " × " + num(ckGb) + " GB"));
    out.appendChild(readout(t(C.iact.ckLost), durationText(c.lostPerFault),
      num(faultsPerWeek, 1) + " × " + (S.lang === "nl" ? "per week" : "per week")));
    out.appendChild(readout(t(C.iact.ckOver), durationText(c.overheadPerWeek)));
    out.appendChild(readout(t(C.iact.ckWeek), durationText(c.totalPerWeek), null,
      c.totalPerWeek < 6 ? "good" : c.totalPerWeek < 12 ? "warning" : "critical"));

    // the trade-off curve: total lost hours per week against save interval
    var W = 640, H = 190, mg = { t: 16, r: 18, b: 34, l: 44 };
    var xs = [], best = { v: 1e9, iv: 0 };
    for (var iv = 200; iv <= 10000; iv += 200) {
      var cc = costs(iv);
      xs.push([iv, cc.totalPerWeek]);
      if (cc.totalPerWeek < best.v) best = { v: cc.totalPerWeek, iv: iv };
    }
    var maxY = Math.max.apply(null, xs.map(function (d) { return d[1]; }));
    var x = linear(200, 10000, mg.l, W - mg.r), y = linear(0, maxY * 1.1, H - mg.b, mg.t);
    var svg = svgEl("svg", { class: "chart", viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": t(C.iact.ckWeek) });
    [0, maxY / 2, maxY].forEach(function (v) {
      svg.appendChild(svgEl("line", { class: "grid", x1: mg.l, x2: W - mg.r, y1: y(v), y2: y(v) }));
      var tx = svgEl("text", { class: "tick", x: mg.l - 8, y: y(v) + 4, "text-anchor": "end" });
      tx.textContent = num(v, 0) + "u"; svg.appendChild(tx);
    });
    svg.appendChild(svgEl("path", {
      d: xs.map(function (d, i) { return (i ? "L" : "M") + x(d[0]).toFixed(1) + " " + y(d[1]).toFixed(1); }).join(" "),
      fill: "none", stroke: "var(--series-1)", "stroke-width": 2, "stroke-linejoin": "round",
    }));
    svg.appendChild(svgEl("line", { class: "axis", x1: mg.l, x2: W - mg.r, y1: H - mg.b, y2: H - mg.b }));
    // best point
    svg.appendChild(svgEl("circle", { cx: x(best.iv), cy: y(best.v), r: 4, fill: "var(--good)" }));
    var bt = svgEl("text", { class: "tick", x: x(best.iv), y: y(best.v) - 10, "text-anchor": "middle", fill: "var(--good-text)" });
    bt.textContent = t(C.iact.ckBest) + " · " + num(best.iv); svg.appendChild(bt);
    // your marker
    svg.appendChild(svgEl("line", { x1: x(interval), x2: x(interval), y1: mg.t, y2: H - mg.b,
      stroke: "var(--ink)", "stroke-width": 1.5, opacity: ".5" }));
    svg.appendChild(svgEl("circle", { cx: x(interval), cy: y(c.totalPerWeek), r: 5.5,
      fill: "var(--ink)", stroke: "var(--surface)", "stroke-width": 2 }));
    [200, 2000, 5000, 10000].forEach(function (v) {
      var tx = svgEl("text", { class: "tick", x: x(v), y: H - mg.b + 18, "text-anchor": "middle" });
      tx.textContent = num(v); svg.appendChild(tx);
    });
    curve.innerHTML = ""; curve.appendChild(svg);
  }

  var sl = slider({
    min: 200, max: 10000, step: 100, value: interval, real: m.saveInterval,
    label: t(C.iact.every) + " … " + t(C.iact.stepsW),
    format: function (v) { return num(v) + " · " + durationText(v * m.secPerStep / 3600); },
    onInput: function (v) { interval = v; redraw(); },
  });
  redraw();

  return figure({
    title: C.iact.ckT, sub: C.iact.ckS, tags: [tagMeasured(), tagSchematic()],
    tools: [resetBtn(function () { sl.setValue(m.saveInterval); interval = m.saveInterval; redraw(); })],
    body: el("div", {}, [sl, out, curve]), caption: C.iact.ckC,
  });
}

/* --- 9. drag along the learning-rate schedule --------------------------- */
function chartWSDScrub() {
  var w = SNAP.wsd, peak = w.peakLr;
  var decayStart = 1 - w.decayFrac;
  var frac = SNAP.m32.step / SNAP.m32.totalSteps;
  var W = 700, H = 230, m = { t: 34, r: 20, b: 40, l: 52 };
  var x = linear(0, 1, m.l, W - m.r), y = linear(0, peak * 1.12, H - m.b, m.t);
  var host = el("div");
  var out = el("div", { class: "rogrid" });

  function lrAt(f) {
    return f < w.warmupFrac ? peak * f / w.warmupFrac
         : f < decayStart ? peak
         : peak * Math.max(0, (1 - f) / w.decayFrac);
  }
  function phaseAt(f) {
    return f < w.warmupFrac ? "warmup" : f < decayStart ? "stable" : "decay";
  }

  function redraw() {
    var svg = svgEl("svg", { class: "chart", viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": t(C.fig.wsd.t), style: "cursor:ew-resize" });
    [[0, w.warmupFrac, "warmup"], [w.warmupFrac, decayStart, "stable"], [decayStart, 1, "decay"]].forEach(function (b) {
      svg.appendChild(svgEl("rect", { x: x(b[0]), y: m.t - 22, width: Math.max(2, x(b[1]) - x(b[0])), height: 16,
        fill: b[2] === "decay" ? "var(--series-3)" : "var(--ink-3)",
        opacity: phaseAt(frac) === b[2] ? ".45" : ".12", rx: 3 }));
      if (x(b[1]) - x(b[0]) > 46) {
        var lt = svgEl("text", { class: "tick", x: (x(b[0]) + x(b[1])) / 2, y: m.t - 10, "text-anchor": "middle" });
        lt.textContent = t(C.fig.wsd.phases[b[2]]); svg.appendChild(lt);
      }
    });
    [0, peak / 2, peak].forEach(function (v) {
      svg.appendChild(svgEl("line", { class: "grid", x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }));
      var tx = svgEl("text", { class: "tick", x: m.l - 8, y: y(v) + 4, "text-anchor": "end" });
      tx.textContent = v === 0 ? "0" : num(v * 1e4, 2) + "·10⁻⁴"; svg.appendChild(tx);
    });
    svg.appendChild(svgEl("line", { class: "axis", x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }));
    svg.appendChild(svgEl("path", {
      d: [[0, 0], [w.warmupFrac, peak], [decayStart, peak], [1, 0]]
        .map(function (p, i) { return (i ? "L" : "M") + x(p[0]) + " " + y(p[1]); }).join(" "),
      fill: "none", stroke: "var(--ink-2)", "stroke-width": 2, "stroke-linejoin": "round",
    }));
    // the two real models, fixed
    [[SNAP.m32.step / SNAP.m32.totalSteps, "--series-1", "32B"],
     [decayStart + w.decayFrac * (SNAP.m9.annealProgress != null ? SNAP.m9.annealProgress : 0.4), "--series-3", "9B"]]
      .forEach(function (mk) {
        svg.appendChild(svgEl("circle", { cx: x(mk[0]), cy: y(lrAt(mk[0])), r: 5,
          fill: "var(" + mk[1] + ")", stroke: "var(--surface)", "stroke-width": 2 }));
        var tx = svgEl("text", { class: "lbl", x: x(mk[0]), y: H - m.b + 17, "text-anchor": "middle", fill: "var(" + mk[1] + ")" });
        tx.textContent = mk[2]; svg.appendChild(tx);
      });
    // the handle you drag
    svg.appendChild(svgEl("line", { x1: x(frac), x2: x(frac), y1: m.t, y2: H - m.b,
      stroke: "var(--ink)", "stroke-width": 1.5, "stroke-dasharray": "3 3" }));
    svg.appendChild(svgEl("circle", { cx: x(frac), cy: y(lrAt(frac)), r: 8,
      fill: "var(--ink)", stroke: "var(--surface)", "stroke-width": 2.5 }));

    var hit = svgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" });
    function set(ev) {
      var r = svg.getBoundingClientRect();
      var cx = (ev.touches ? ev.touches[0].clientX : ev.clientX);
      frac = Math.min(1, Math.max(0, ((cx - r.left) / r.width * W - m.l) / (W - m.r - m.l)));
      redraw();
    }
    var dragging = false;
    hit.addEventListener("mousedown", function (e) { dragging = true; set(e); e.preventDefault(); });
    hit.addEventListener("mousemove", function (e) { if (dragging) set(e); });
    hit.addEventListener("mouseup", function () { dragging = false; });
    hit.addEventListener("mouseleave", function () { dragging = false; });
    hit.addEventListener("click", set);
    hit.addEventListener("touchstart", function (e) { set(e); e.preventDefault(); }, { passive: false });
    hit.addEventListener("touchmove", function (e) { set(e); e.preventDefault(); }, { passive: false });
    svg.appendChild(hit);

    host.innerHTML = ""; host.appendChild(svg);
    out.innerHTML = "";
    out.appendChild(readout(t(C.iact.scrub), pct(frac, 1),
      big(frac * SNAP.m32.totalTokens, 1) + " " + t(C.ui.tokens)));
    out.appendChild(readout(t(C.iact.lrNow), num(lrAt(frac) * 1e4, 2) + "·10⁻⁴"));
    out.appendChild(readout(t(C.iact.phaseNow), t(C.fig.wsd.phases[phaseAt(frac)])));
    out.appendChild(readout(t(C.ui.step), num(Math.round(frac * SNAP.m32.totalSteps))));
  }
  redraw();

  return figure({
    title: C.iact.wsdT, sub: C.fig.wsd.s, tags: [tagMeasured()],
    body: el("div", {}, [host, out]), caption: C.fig.wsd.c,
  });
}


/* --- the week simulation ------------------------------------------------ */
/* Runs a week of cluster time at ~2 hours per second. Faults arrive at the rate
   the arithmetic above gives. While one is unhandled, nothing is trained — you
   restart it yourself, or let the auto-restart script do it. A model of the
   situation, not a recording; the figure says so. */
function simWeek() {
  var m = SNAP.m32;
  var WEEK_H = 168, SEC_PER_H = 0.5;          // 2 hours of cluster time per second
  var mtbfH = SNAP.cluster.mtbfYearsDefault * 365 * 24 / m.gpus;
  var stepsPerHour = 3600 / m.secPerStep;

  var st = null, timer = null, auto = false;
  function fresh() {
    return { h: 0, down: false, downSince: 0, idleH: 0, faults: 0, stepsDone: 0,
             log: [], restarts: 0, nextFault: expo(mtbfH) };
  }
  function expo(mean) { return -Math.log(1 - Math.random()) * mean; }
  function clock(h) {
    var d = Math.floor(h / 24) + 1, hh = Math.floor(h % 24), mm = Math.floor((h % 1) * 60);
    return t(C.iact.simDay) + " " + d + " · " + (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
  }

  var statusEl = el("div", { class: "sim__status" });
  var fillEl = el("div", { class: "sim__fill" });
  var barEl = el("div", { class: "sim__track" }, [fillEl]);
  var statsEl = el("div", { class: "rogrid" });
  var logEl = el("div", { class: "sim__log" });
  var actEl = el("div", { class: "sim__act" });

  var startBtn = el("button", { type: "button", class: "btn btn--primary", text: t(C.iact.simStart) });
  var resetB = el("button", { type: "button", class: "btn", text: t(C.iact.simReset) });
  var autoBtn = el("button", {
    type: "button", class: "btn", "aria-pressed": "false", text: t(C.iact.simAuto),
    onclick: function () { auto = !auto; autoBtn.setAttribute("aria-pressed", auto ? "true" : "false"); },
  });

  function log(h, sev, text) {
    st.log.unshift({ h: h, sev: sev, text: text });
    if (st.log.length > 8) st.log.pop();
  }
  function paint() {
    var maxSteps = WEEK_H * stepsPerHour;
    statusEl.className = "sim__status" + (st.down ? " sim__status--down" : "");
    statusEl.innerHTML =
      '<span class="pill__dot" style="background:var(--' + (st.down ? "critical" : "good") + ')"></span>' +
      "<b>" + (st.down ? t(C.iact.simDown) : t(C.iact.simOk)) + "</b>" +
      "<span class='ticker__note'>" + clock(st.h) + "</span>";
    fillEl.style.width = (st.h / WEEK_H * 100) + "%";
    fillEl.style.background = st.down ? "var(--critical)" : "var(--series-1)";

    statsEl.innerHTML = "";
    statsEl.appendChild(readout(t(C.iact.simProgress), pct(st.stepsDone / maxSteps, 0),
      num(Math.round(st.stepsDone)) + " " + t(C.ui.step)));
    statsEl.appendChild(readout(t(C.ui.tokens), big(st.stepsDone * m.tokensPerStep, 2)));
    statsEl.appendChild(readout(t(C.iact.simFaults), num(st.faults)));
    statsEl.appendChild(readout(t(C.iact.simIdle), durationText(st.idleH), null,
      st.idleH > 8 ? "critical" : st.idleH > 3 ? "warning" : "good"));

    actEl.innerHTML = "";
    if (st.down && !auto) {
      actEl.appendChild(el("button", {
        type: "button", class: "btn btn--primary", text: t(C.iact.simRestart),
        onclick: function () { restart(); },
      }));
      actEl.appendChild(el("span", { class: "ticker__note", style: "margin-left:.6rem",
        text: t(C.iact.simWaiting) + " · " + durationText(st.h - st.downSince) }));
    }

    logEl.innerHTML = "";
    st.log.forEach(function (e) {
      logEl.appendChild(el("div", { class: "sim__row" }, [
        el("span", { class: "sim__t", text: clock(e.h) }),
        el("span", { class: "sev__i", html: SEV_ICON[e.sev] }),
        el("span", { text: e.text }),
      ]));
    });
  }

  function restart() {
    if (!st.down) return;
    var lost = st.h - st.downSince;
    st.down = false; st.restarts++;
    log(st.h, "good", t(C.iact.simRestart) + " — " +
      durationText(lost) + " " + (S.lang === "nl" ? "stilstand" : "idle"));
    st.nextFault = st.h + expo(mtbfH);
    paint();
  }

  function tick() {
    var dh = 0.25;                                  // quarter of an hour per tick
    if (st.h >= WEEK_H) { stop(); log(st.h, "good", t(C.iact.simEnd)); paint(); return; }
    st.h += dh;

    if (st.down) {
      st.idleH += dh;
      // auto-restart reacts within the minute; a person takes about an hour at night
      var wait = auto ? 0.02 : (((st.h % 24) < 7 || (st.h % 24) > 22) ? 1.0 : 0.3);
      if (auto && st.h - st.downSince >= wait) restart();
    } else {
      st.stepsDone += stepsPerHour * dh;
      if (st.h >= st.nextFault) {
        st.down = true; st.downSince = st.h; st.faults++;
        var kinds = SNAP.cluster.causes;
        var pick = kinds[Math.floor(Math.random() * kinds.length)];
        log(st.h, "critical", t(C.fig.causes.ids[pick.id]) + " — " +
          (S.lang === "nl" ? "job gestopt" : "job stopped"));
        // work since the last checkpoint is lost
        var lostSteps = (st.stepsDone % m.saveInterval);
        st.stepsDone -= lostSteps;
      }
    }
    paint();
  }

  function start() {
    if (timer) return;
    timer = setInterval(tick, 1000 * SEC_PER_H / 4);
    startBtn.textContent = t(C.iact.simPause);
  }
  function stop() { if (timer) clearInterval(timer); timer = null; startBtn.textContent = t(C.iact.simStart); }

  startBtn.addEventListener("click", function () { if (timer) stop(); else start(); });
  resetB.addEventListener("click", function () { stop(); st = fresh(); paint(); });

  st = fresh(); paint();

  return figure({
    title: C.iact.simT, sub: C.iact.simS, tags: [tagSchematic()],
    tools: [autoBtn, resetB, startBtn],
    body: el("div", { class: "sim" }, [
      statusEl, barEl, statsEl, actEl,
      el("div", { class: "ticker__note", style: "margin-top:.9rem;font-size:.78rem", text: t(C.iact.simAutoNote) }),
      logEl,
    ]),
    caption: C.iact.simC,
  });
}


/* ==========================================================================
   Page assembly
   ========================================================================== */

var FIGURES = {
  1:  [chartSources],
  2:  [chartFunnelLive],
  3:  [chartTokenizerLive],
  4:  [chartMixLive],
  5:  [chartArch, chartArchBuild],
  6:  [], // The lesson explains the loop; no illustrative loss history beside run data.
  7:  [chartGrid],
  8:  [chartCheckpoints, chartCheckpointTrade],
  9:  [chartWSDScrub],
  10: [chartSFT],
  11: [chartEvals],
};

/* --- 1. sources list (defined here; it needs no scale) ----------------- */
function chartSources() {
  var list = el("div", { class: "srcs" });
  SNAP.collect.sources.forEach(function (s) {
    var v = s.bytes == null ? tbdNode(S.lang === "nl" ? "omvang" : "volume", "collect.sources." + s.id)
                            : document.createTextNode(bytesish(s.bytes));
    list.appendChild(el("div", { class: "src" }, [
      el("div", { style: "flex:1" }, [
        el("div", { class: "src__n", text: t(C.fig.mix.domains[s.id] || { nl: s.id, en: s.id }) }),
        el("div", { class: "src__d", text: s.note }),
      ]),
      el("div", { style: "font-variant-numeric:tabular-nums;font-size:.9rem" }, [v]),
    ]));
  });
  var head = el("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:1rem;margin-bottom:1.1rem" }, [
    statMini(S.lang === "nl" ? "Ruwe omvang" : "Raw volume", SNAP.collect.rawBytes, bytesish, "collect.rawBytes"),
    statMini(S.lang === "nl" ? "Documenten" : "Documents", SNAP.collect.docsRaw, function (v) { return big(v, 1); }, "collect.docsRaw"),
    statMini(S.lang === "nl" ? "Talen" : "Languages", SNAP.collect.languages, num, "collect.languages"),
  ]);
  return figure({ title: C.fig.sources.t, sub: C.fig.sources.s, body: el("div", {}, [head, list]),
                  caption: C.fig.sources.c, where: "collect" });
}
function statMini(k, v, fmt, where) {
  return el("div", {}, [
    el("div", { class: "kv__k", text: k }),
    el("div", { style: "font-size:1.15rem;font-weight:600;margin-top:.15rem" }, [val(v, where, fmt)]),
  ]);
}

/* --- the incident feed -------------------------------------------------- */
var SEV_ICON = {
  good:     '<svg class="sev__i" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="var(--good)" stroke-width="1.6"/><path d="M5 8.2l2 2L11 6" stroke="var(--good)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warning:  '<svg class="sev__i" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2l6 11H2L8 2z" stroke="var(--warning)" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 6.5v3.2M8 11.6v.1" stroke="var(--warning)" stroke-width="1.8" stroke-linecap="round"/></svg>',
  serious:  '<svg class="sev__i" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="var(--serious)" stroke-width="1.6"/><path d="M8 4.6v4.2M8 11.2v.1" stroke="var(--serious)" stroke-width="1.8" stroke-linecap="round"/></svg>',
  critical: '<svg class="sev__i" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="var(--critical)" stroke-width="1.6"/><path d="M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8" stroke="var(--critical)" stroke-width="1.8" stroke-linecap="round"/></svg>',
};
var SEV_LABEL = {
  good:     { nl: "opgelost", en: "resolved" },
  warning:  { nl: "let op", en: "attention" },
  serious:  { nl: "onderzoek", en: "investigating" },
  critical: { nl: "gestopt", en: "stopped" },
};
function sevBadge(sev) {
  if (!sev) return null;
  return el("span", { class: "sev", html: SEV_ICON[sev] + "<span>" + t(SEV_LABEL[sev]) + "</span>",
                      style: "color:var(--" + sev + ")" });
}

function renderFeed() {
  var feed = el("div", { class: "feed" });
  C.incidents.forEach(function (i) {
    feed.appendChild(el("div", { class: "feed__row" }, [
      el("div", { class: "feed__t", text: i.t }),
      el("div", {}, [
        el("div", { class: "feed__h" }, [
          el("span", { text: t(i.h) }),
          sevBadge(i.sev),
          el("span", { class: "feed__who", text: i.who === "auto" ? t(C.feedAuto) : t(C.feedHand) }),
        ]),
        el("div", { class: "feed__d", text: t(i.d) }),
      ]),
    ]));
  });
  return figure({ title: C.feedT, sub: C.feedS, tags: [tagIllustrative()], body: feed, caption: C.feedC });
}

/* ==========================================================================
   The canvas: one persistent diagram that folds open into a part of itself.
   Nothing is swapped out — the same cells shrink into a strip and the
   selected one unfolds, so the reader never loses the whole picture.
   ========================================================================== */

var SEL = { kind: "none", id: null };
var PIPE = null, ACTS = null;

function stepById(n) {
  for (var i = 0; i < C.steps.length; i++) if (C.steps[i].id === n) return C.steps[i];
  return null;
}
function actById(id) {
  for (var i = 0; i < C.activities.length; i++) if (C.activities[i].id === id) return C.activities[i];
  return null;
}
var PHASES = [["data", "data"], ["train", "train"], ["finish", "finish"]];

/* ---------------------------------------------------------------- intro -- */
function renderIntro() {
  var host = $("#intro");
  host.innerHTML = "";
  host.appendChild(el("div", { class: "intro" }, [
    el("div", { class: "intro__eyebrow", text: t(C.hero.eyebrow) }),
    el("h1", { class: "intro__h1", text: t(C.hero.h1) }),
    el("p", { class: "project-subtitle", text: t(C.project.subtitle) }),
  ]));
  host.appendChild(el("div", { class: "opening-runs", id: "opening-runs" }));
  refreshRunSummary();
}

function refreshRunSummary() {
  var host = $("#opening-runs");
  if (!host) return;
  host.innerHTML = "";
  host.appendChild(modelChip(SNAP.m32));
  [["GPU's", num(SNAP.m32.gpus)], ["loss", num(SNAP.m32.loss, 2)],
   [S.lang === "nl" ? "per stap" : "per step", num(SNAP.m32.secPerStep, 1) + " s"]].forEach(function (stat) {
    host.appendChild(el("span", { class: "run-stat" }, [el("strong", { text: stat[1] }), el("span", { text: stat[0] })]));
  });
  var date = new Date(SNAP.meta.takenAt);
  host.appendChild(el("span", { class: "run-measured", text:
    t(C.hero.tickerStale) + ": " + (isNaN(date.getTime()) ? "?" : date.toLocaleString(LOC())) }));
}

function trainingLesson() {
  var stage = 0;
  var scene = el("div", { class: "lesson__scene", "aria-live": "polite" });
  var tabs = el("div", { class: "lesson__tabs", role: "tablist", "aria-label": t(C.opening.loop) });
  var buttons = C.opening.stages.map(function (item, i) {
    var button = el("button", { type: "button", role: "tab", id: "lesson-tab-" + i,
      "aria-controls": "lesson-scene", onclick: function () { stage = i; draw(); },
      onkeydown: function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault(); stage = (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
        draw(); buttons[stage].focus();
      }, text: (i + 1) + ". " + t(item.title) });
    tabs.appendChild(button); return button;
  });
  function draw() {
    buttons.forEach(function (button, i) {
      button.setAttribute("aria-selected", String(i === stage));
      button.setAttribute("tabindex", i === stage ? "0" : "-1");
    });
    scene.innerHTML = "";
    scene.setAttribute("id", "lesson-scene"); scene.setAttribute("role", "tabpanel");
    scene.setAttribute("aria-labelledby", "lesson-tab-" + stage);
    scene.appendChild(el("p", { class: "lesson__sentence", text: SNAP.tokenizer.examples[0].text }));
    if (stage === 0) scene.appendChild(tokenRow(SNAP.tokenizer.examples[0].pieces));
    if (stage === 1 || stage === 2) {
      var bars = el("div", { class: "lesson__predictions" });
      SNAP.predict.candidates.slice(0, 3).forEach(function (candidate) {
        bars.appendChild(el("div", { class: "lesson__prediction" }, [
          el("span", { text: candidate.t.replace("▁", "") }),
          el("span", { class: "lesson__bar" }, [el("span", { style: "width:" + candidate.p * 100 + "%" })]),
          el("span", { text: pct(candidate.p, 0) }),
        ]));
      });
      scene.appendChild(bars);
    }
    if (stage === 3) scene.appendChild(el("div", { class: "lesson__update", text: t(C.opening.update) }));
    scene.appendChild(el("p", { class: "lesson__explanation", text: t(C.opening.stages[stage].body) }));
    scene.appendChild(el("span", { class: "tag tag--sch", text: t(stage === 0 ? C.opening.realTokens : C.ui.illustr) }));
  }
  draw();
  return el("section", { class: "lesson" }, [
    el("div", { class: "lesson__heading" }, [el("h2", { text: t(C.opening.loop) }),
      el("p", { text: t(C.opening.loopIntro) })]), tabs, scene,
    el("div", { class: "lesson__footer" }, [
      el("p", { text: t(C.opening.scale) }),
      el("button", { type: "button", class: "btn", text: t(C.opening.deeper), onclick: function () { select("step", 6); } }),
    ]),
  ]);
}


/* The two live runs, as small chips. Clicking one jumps to the step it is on. */
function modelChip(m) {
  var frac = (m.step != null && m.totalSteps) ? m.step / m.totalSteps : null;
  var stateLabel = {
    training: { nl: "traint", en: "training" }, annealing: { nl: "annealing", en: "annealing" },
    sft: { nl: "instructietraining", en: "instruction tuning" },
    queued: { nl: "in de wachtrij", en: "queued" }, down: { nl: "gestopt", en: "stopped" },
    pending_annealing: { nl: "wacht op annealing", en: "awaiting annealing" },
  }[m.state] || { nl: m.state, en: m.state };
  var chip = el("button", {
    type: "button", class: "mchip mchip--" + (m.name === "32B" ? "32" : "9"),
    onclick: function () { select("step", m.name === "32B" ? 6 : 9); },
  }, [
    el("span", { class: "mchip__dot" }),
    el("span", { class: "mchip__n", text: m.name }),
    el("span", { class: "mchip__s", text: t(stateLabel) }),
    el("span", { class: "mchip__bar" }, [
      el("span", { class: "mchip__fill", id: m.name === "32B" ? "tick-fill" : null,
                   style: "width:" + (frac != null ? frac * 100 : 90).toFixed(2) + "%" +
                          (frac == null ? ";display:none" : "") }),
    ]),
    el("span", { class: "mchip__p", id: m.name === "32B" ? "tick-pct" : null },
       frac != null ? [document.createTextNode(pct(frac, 1))] : []),
  ]);
  hoverable(chip, function () {
    return "<b>" + m.name + "</b> · " + m.cluster + " (" + m.clusterWhere + ")<br>" +
      "<span class='tooltip__k'>" + t(stateLabel) + "</span><br>" +
      (m.step != null ? t(C.ui.step) + " " + num(m.step) + " / " + num(m.totalSteps) + "<br>" : "") +
      big(m.totalTokens, 0) + " " + t(C.ui.tokens);
  });
  return chip;
}

/* ------------------------------------------------------------- pipeline -- */
var PROCESS = null;
function buildPipe() {
  if (PROCESS && PROCESS.dispose) PROCESS.dispose();
  var host = $("#pipe");
  host.innerHTML = "";
  PROCESS = window.drawPretrainingProcess(host, {
    svgEl: svgEl, el: el, t: t, snap: SNAP, lang: S.lang,
    steps: C.steps, content: C, title: C.hero.h1, select: select,
    num: num, pct: pct, big: big, fill: fill,
  });
  host.appendChild(projectEvidence());
  host.appendChild(el("p", { class: "secondary-run", text: S.lang === "nl" ? "Ook in het project: het 9B-model op Leonardo wacht op annealing." : "Also in the project: the 9B model on Leonardo is awaiting annealing." }));
  PIPE = host;
}

function projectEvidence() {
  var entries = [
    { step: 8, label: "32B · JUPITER", title: (S.lang === "nl" ? "Checkpoint op stap " : "Checkpoint at step ") + num(SNAP.m32.lastCheckpointStep),
      detail: t(C.ui.measured) + " · " + new Date(SNAP.meta.takenAt).toLocaleString(LOC()) },
    { step: 7, label: "JUPITER", title: S.lang === "nl" ? "2.048 GPU's · 512 knooppunten" : "2,048 GPUs · 512 nodes",
      detail: "NVIDIA GH200" },
    { step: 13, label: t(C.project.role), title: S.lang === "nl" ? "Data verwerken & trainingsrecept" : "Data processing & training recipe",
      detail: S.lang === "nl" ? "Mijn bijdrage aan het grotere trainingsproject" : "My contribution to the wider training project" },
  ];
  var notes = C.project.notes.filter(function (n) { return n.approved === true; });
  if (notes.length) {
    var note = notes[notes.length - 1];
    entries[2] = { step: note.step, label: t(C.project.role), title: t(note.text), detail: note.date || "" };
  }
  return el("div", { class: "project-evidence" }, entries.map(function (entry) {
    return el("button", { type: "button", class: "project-evidence__item", onclick: function () { select("step", entry.step); } }, [
      el("span", { class: "project-evidence__label", text: entry.label }),
      el("span", { class: "project-evidence__title", text: entry.title }),
      el("span", { class: "project-evidence__detail", text: entry.detail }),
    ]);
  }));
}

/* ----------------------------------------------------------- activities -- */
/* One line of labels. The share only shows on hover, or once one is opened. */
function buildActs() {
  var host = $("#acts");
  host.innerHTML = "";

  var band = el("div", { class: "acts" }, [
    el("span", { class: "acts__k", text: t(C.ui.theWork) }),
  ]);
  C.activities.forEach(function (a, i) {
    if (i) band.appendChild(el("span", { class: "acts__sep", text: "·" }));
    var item = el("button", {
      type: "button", class: "actl", "data-act": a.id,
      onclick: function () { select("act", a.id); },
    }, [
      el("span", { class: "actl__t", text: t(a.title) }),
    ]);
    hoverable(item, function () {
      return "<b>" + t(a.title) + "</b><br><span class='tooltip__k'>" + t(a.lede) + "</span><br>" +
        t(C.opening.workContext);
    });
    band.appendChild(item);
  });

  host.appendChild(band);
  ACTS = host;
}

/* --------------------------------------------------------- the detail -- */

function projectFacts(n) {
  var facts = {
    3: [{ k: L("Woordenlijst", "Vocabulary"), v: "{{n:tokenizer.vocab}}" }, { k: L("Tokenizer", "Tokenizer"), v: "SentencePiece" }],
    5: [{ k: L("Lagen", "Layers"), v: "{{n:m32.arch.layers}}" }, { k: L("Parameters", "Parameters"), v: "32B" }],
    13: [{ k: "Global batch size", v: num(SNAP.m32.tokensPerStep / SNAP.m32.arch.seqLen) }, { k: "Learning rate", v: SNAP.m32.lr.toExponential(2) }],
    6: [{ k: L("Gemeten stap", "Measured step"), v: "{{n:m32.step}}" }, { k: L("Tokens verwerkt", "Tokens processed"), v: big(SNAP.m32.step * SNAP.m32.tokensPerStep, 2) }, { k: L("Gemeten loss", "Measured loss"), v: num(SNAP.m32.loss, 2) }],
    7: [{ k: L("GPU's", "GPUs"), v: "{{n:m32.gpus}}" }, { k: L("Knooppunten", "Nodes"), v: "{{n:m32.nodes}}" }, { k: L("Verdeling TP / PP / DP", "Split TP / PP / DP"), v: "4 / 4 / 128" }],
    8: [{ k: L("Laatst gemeten checkpoint", "Last measured checkpoint"), v: "{{n:m32.lastCheckpointStep}}" }, { k: L("Bewaarinterval in stappen", "Save interval in steps"), v: "{{n:m32.saveInterval}}" }],
    9: [{ k: L("Model", "Model"), v: "9B · Leonardo" }, { k: L("Gepland tokenbudget", "Planned token budget"), v: "{{b:m9.annealTokens}}" }],
  };
  return facts[n];
}

function detailStep(n) {
  var st = stepById(n);
  var idx = C.steps.map(function (x) { return x.id; }).indexOf(n);
  var pos = modelPositions();
  var who = isAt(pos, "m32", n) ? "32" : (isAt(pos, "m9", n) ? "9" : null);

  var w = el("div", { class: "detail__in" }, [
    el("div", { class: "dhead" }, [
      el("div", { class: "dhead__k" }, [
        el("span", { class: "dhead__n", text: n < 10 ? "0" + n : String(n) }),
        el("span", { text: t(C.map.phases[st.phase]) }),
        el("span", { class: "dot", text: "·" }),
        el("span", { text: t(C.project.context) }),
        who ? el("span", { class: "srow__now srow__now--" + who, text: who + "B " + t(C.map.hereNow) }) : null,
      ]),
      el("button", { type: "button", class: "closeb", title: t(C.ui.close),
                     "aria-label": t(C.ui.close), text: "\u2715",
                     onclick: function () { select("none", null); } }),
      el("h2", { class: "dhead__t", text: t(st.title) }),
      el("p", { class: "dhead__l", text: t(C.project.entries[n]) }),
    ]),
  ]);

  // three figures, straight away — the smallest useful amount
  var facts = projectFacts(n);
  var role = n <= 4 ? C.project.roles.data : n === 5 || n === 13 ? C.project.roles.design : n <= 8 ? C.project.roles.run : null;
  if (role) w.appendChild(el("aside", { class: "project-role" }, [
    el("span", { class: "project-role__label", text: t(C.project.role) }),
    el("p", { text: t(role) }),
  ]));
  if (facts) {
    if (n >= 5 && n <= 8) w.appendChild(el("p", { class: "project-measurement", text: t(C.hero.tickerStale) + ": " + new Date(SNAP.meta.takenAt).toLocaleString(LOC()) }));
    w.appendChild(el("div", { class: "facts" }, facts.map(function (f) {
      return el("div", { class: "fact" }, [
        el("div", { class: "fact__k", text: t(f.k) }),
        el("div", { class: "fact__v", html: fill(t(f.v), "facts." + n) }),
      ]);
    })));
  }

  // the explanation, behind one click
  w.appendChild(el("details", { class: "exp" }, [
    el("summary", { class: "exp__s", text: t(C.project.explain) }),
    el("div", { class: "exp__b" }, [
      el("p", { class: "prose", text: t(st.lede) }),
      el("div", { class: "prose", html: prose(st.body, "step." + n) }),
    ]),
  ]));

  // the interactives: the first one open, the rest folded shut
  FIG_N = 0; FIG_COLLAPSE = true;
  if (n === 6) w.appendChild(trainingLesson());
  (FIGURES[n] || []).forEach(function (f) { w.appendChild(f()); });
  FIG_COLLAPSE = false;

  var note = C.notes && C.notes[n];
  if (note && note.approved === true) {
    w.appendChild(el("aside", { class: "pnote" }, [
      el("div", { class: "pnote__k" }, [
        el("span", { text: t(C.noteLabel) }),
        note.date ? el("span", { class: "pnote__date", text: note.date }) : null,
      ]),
      el("div", { class: "pnote__d", text: t(note.d) }),
    ]));
  }
  if (st.tech) {
    w.appendChild(el("details", { class: "tech" }, [
      el("summary", { text: t(C.ui.techMore) }),
      el("div", { class: "tech__body", html: prose(st.tech, "step." + n + ".tech") }),
    ]));
  }

  var prev = idx > 0 ? C.steps[idx - 1] : null, next = idx < C.steps.length - 1 ? C.steps[idx + 1] : null;
  w.appendChild(el("nav", { class: "vnav" }, [
    prev ? el("button", { type: "button", onclick: function () { select("step", prev.id); } }, [
      el("span", { class: "k", text: "← " + t(C.ui.prev) }),
      el("span", { class: "t", text: prev.id + ". " + t(prev.title) }),
    ]) : el("span", { style: "flex:1" }),
    next ? el("button", { type: "button", class: "next", onclick: function () { select("step", next.id); } }, [
      el("span", { class: "k", text: t(C.ui.next) + " →" }),
      el("span", { class: "t", text: next.id + ". " + t(next.title) }),
    ]) : el("span", { style: "flex:1" }),
  ]));
  return w;
}

function detailAct(id) {
  var a = actById(id);
  var w = el("div", { class: "detail__in" }, [
    el("div", { class: "dhead" }, [
      el("div", { class: "dhead__k" }, [
        el("span", { text: t(C.ui.theWork) }),
        el("span", { class: "dot", text: "·" }),
        el("span", { text: t(C.opening.workContext) }),
      ]),
      el("button", { type: "button", class: "closeb", title: t(C.ui.close),
                     "aria-label": t(C.ui.close), text: "\u2715",
                     onclick: function () { select("none", null); } }),
      el("h2", { class: "dhead__t", text: t(a.title) }),
      el("p", { class: "dhead__l", text: t(a.lede) }),
    ]),
  ]);
  w.appendChild(el("details", { class: "exp", open: "" }, [
    el("summary", { class: "exp__s", text: t(C.readOn) }),
    el("div", { class: "exp__b" }, [C.opening.work[id]
      ? el("p", { class: "prose", text: t(C.opening.work[id]) })
      : el("div", { class: "prose", html: prose(a.body, "act." + id) })]),
  ]));

  if ((a.steps || []).length) {
    w.appendChild(el("div", { class: "jump" }, [
      el("span", { class: "jump__k", text: t(C.ui.seeSteps) }),
      el("span", { class: "jump__b" }, a.steps.map(function (n) {
        return el("button", { type: "button", class: "btn", text: n + ". " + t(C.short[n]),
                              onclick: function () { select("step", n); } });
      })),
    ]));
  }

  // everything about failure lives inside the activity it belongs to
  if (id === "ingrijpen") {
    FIG_N = 0; FIG_COLLAPSE = true;
    w.appendChild(simWeek());
    w.appendChild(chartMTBF());
    w.appendChild(chartCauses());
    w.appendChild(el("h3", { class: "sech", text: t(C.intervene.t) }));
    w.appendChild(el("div", { class: "prose", html: prose(C.intervene.body, "fail") }));
    w.appendChild(el("h3", { class: "sech", text: t(C.silent.t) }));
    w.appendChild(el("div", { class: "prose", html: prose(C.silent.body, "fail") }));
    w.appendChild(el("div", { class: "cardgrid" }, C.silent.items.map(function (it) {
      return el("div", { class: "minicard" }, [
        el("div", { class: "minicard__t", text: t(it.t) }),
        el("div", { class: "minicard__d", text: t(it.d) }),
      ]);
    })));
    w.appendChild(renderFeed());
    FIG_COLLAPSE = false;
  }
  if (id === "delen") {
    w.appendChild(el("h3", { class: "sech", text: t(C.closing.t) }));
    w.appendChild(el("div", { class: "prose", html: prose(C.closing.body, "closing") }));
  }
  if (id === "meten") w.appendChild(chartEvals());
  return w;
}

function detailOpen() {
  var w = el("div", { class: "detail__in" }, [
    el("div", { class: "dhead" }, [
      el("div", { class: "dhead__k", text: t(C.ui.nav.openSub) }),
      el("button", { type: "button", class: "closeb", title: t(C.ui.close),
                     "aria-label": t(C.ui.close), text: "\u2715",
                     onclick: function () { select("none", null); } }),
      el("h2", { class: "dhead__t", text: t(C.register.t) }),
      el("p", { class: "dhead__l", text: t(C.register.lede) }),
    ]),
  ]);
  w.appendChild(registerList());
  w.appendChild(footer());
  return w;
}

/* ------------------------------------------------------- the fold itself -- */

function select(kind, id, skipHash) {
  SEL = { kind: kind, id: id };
  if (!skipHash) {
    var h = kind === "step" ? "#/stap/" + id : kind === "act" ? "#/werk/" + id
          : kind === "open" ? "#/open" : "#/";
    if (location.hash !== h) { location.hash = h; return; }   // hashchange re-enters
  }
  paint();
}

function paint() {
  var openAny = SEL.kind !== "none";
  var stepOpen = SEL.kind === "step";
  var actOpen = SEL.kind === "act";
  $("#canvas").setAttribute("data-exploring", stepOpen ? "1" : "0");

  $("#intro").setAttribute("data-min", openAny ? "1" : "0");
  PIPE.setAttribute("data-folded", stepOpen ? "1" : "0");
  PIPE.setAttribute("data-dim", (actOpen || SEL.kind === "open") ? "1" : "0");
  ACTS.setAttribute("data-folded", actOpen ? "1" : "0");
  ACTS.setAttribute("data-dim", (stepOpen || SEL.kind === "open") ? "1" : "0");

  [].slice.call(PIPE.querySelectorAll("[data-step]")).forEach(function (b) {
    if (!b.dataset.step) return;
    b.setAttribute("aria-current", stepOpen && +b.dataset.step === SEL.id ? "true" : "false");
  });
  [].slice.call(ACTS.querySelectorAll("button")).forEach(function (b) {
    if (!b.dataset.act) return;
    b.setAttribute("aria-current", actOpen && b.dataset.act === SEL.id ? "true" : "false");
  });

  var detail = $("#detail");
  detail.innerHTML = "";
  detail.setAttribute("data-open", openAny ? "1" : "0");

  // the panel unfolds directly beneath whichever band you opened
  var canvas = detail.parentNode;
  if (actOpen) canvas.insertBefore(detail, $("#foot"));
  else canvas.insertBefore(detail, ACTS);

  if (stepOpen) detail.appendChild(detailStep(SEL.id));
  else if (actOpen) detail.appendChild(detailAct(SEL.id));
  else if (SEL.kind === "open") detail.appendChild(detailOpen());

  document.title = (openAny
    ? (stepOpen ? SEL.id + ". " + t(stepById(SEL.id).title)
       : actOpen ? t(actById(SEL.id).title) : t(C.register.t)) + " · "
    : "") + t(C.hero.h1);

  if (openAny) {
    var y = detail.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (TICK_PAINT) TICK_PAINT();
}

function parseHash() {
  var h = (location.hash || "").replace(/^#\/?/, "");
  var m;
  if ((m = h.match(/^stap\/(\d+)$/)) || (m = h.match(/^stap-(\d+)$/))) {
    return { kind: "step", id: parseInt(m[1], 10) };
  }
  if ((m = h.match(/^werk\/([\w-]+)$/)) && actById(m[1])) return { kind: "act", id: m[1] };
  if (h === "open") return { kind: "open", id: null };
  return { kind: "none", id: null };
}

function build() {
  renderIntro();
  buildPipe();
  buildActs();
  renderFoot();
  buildTopTicker();
  var st = parseHash();
  SEL = st;
  paint();
}

function renderFoot() {
  var host = $("#foot");
  host.innerHTML = "";
  host.appendChild(el("div", { class: "footbar" }, [
    el("button", { type: "button", class: "btn", text: t(C.register.t),
                   onclick: function () { select("open", null); } }),
    el("span", { class: "footbar__x", text: "OpenEuroLLM · SURF" }),
  ]));
}

/* The register is derived from the data itself, so it is complete no matter
   which view you are on: every null in SNAP, plus every {{tbd:}} in the copy. */
function collectRegister() {
  var out = [], seen = {};
  function push(label, where) {
    var k = label + "|" + where;
    if (seen[k]) return; seen[k] = 1;
    out.push({ label: label, where: where });
  }
  (function walk(obj, path) {
    if (obj == null || typeof obj !== "object") return;
    Object.keys(obj).forEach(function (k) {
      var v = obj[k], p = path ? path + "." + k : k;
      if (v === null) push(t(C.ui.tbdShort), p);
      else if (typeof v === "object") walk(v, p);
    });
  })(SNAP, "");
  function scan(o) {
    if (typeof o === "string") {
      var m = o.match(/\{\{tbd:([^}]+)\}\}/g);
      if (m) m.forEach(function (x) { push(x.slice(6, -2), "copy"); });
    } else if (o && typeof o === "object") {
      Object.keys(o).forEach(function (k) { scan(o[k]); });
    }
  }
  scan(C);
  return out;
}

function registerList() {
  var items = collectRegister();
  if (!items.length) return el("p", { text: t(C.register.none) });
  var byTop = {};
  items.forEach(function (r) {
    var top = (r.where || "copy").split(".")[0];
    (byTop[top] = byTop[top] || []).push(r);
  });
  var wrap = el("div", { style: "margin-top:1.2rem" });
  wrap.appendChild(el("p", {
    style: "font-size:.82rem;color:var(--ink-3);margin-bottom:1rem",
    text: items.length + " " + (S.lang === "nl" ? "open plekken, gegroepeerd per onderdeel van data.js"
                                                : "open items, grouped by section of data.js"),
  }));
  Object.keys(byTop).forEach(function (top) {
    wrap.appendChild(el("div", { class: "reg__group" }, [el("b", { text: top })]));
    wrap.appendChild(el("div", { class: "reg" }, byTop[top].map(function (r) {
      return el("div", { class: "reg__i" }, [
        el("span", { class: "tbd", text: r.label }),
        el("span", { class: "reg__where", text: r.where }),
      ]);
    })));
  });
  return wrap;
}

function footer() {
  var links = [
    ["oellm", null], ["catalogue", null], ["hf", null], ["prelude", null],
    ["autoexp", null], ["posttrain", null], ["evalrepo", null], ["blog", null],
    ["jupiter", null], ["leonardo", null], ["eurohpc", null], ["megatron", null],
  ];
  return el("footer", { class: "foot" }, [
    el("div", { class: "wrap foot__grid" }, [
      el("div", {}, [
        el("h3", { text: t(C.foot.about) }),
        el("p", { html: prose(C.foot.aboutBody, "foot") }),
      ]),
      el("div", {}, [
        el("h3", { text: t(C.foot.links) }),
        el("ul", {}, links.map(function (l) {
          var d = LINKS[l[0]];
          return el("li", {}, [el("a", { href: d.href, target: "_blank", rel: "noopener", text: t(d.label) })]);
        })),
      ]),
      el("div", {}, [
        el("h3", { text: t(C.foot.method) }),
        el("p", { text: t(C.foot.methodBody) }),
        el("p", { style: "font-family:var(--mono);font-size:.74rem;color:var(--ink-3);margin-top:1rem",
                  text: SNAP.meta.source }),
      ]),
    ]),
  ]);
}


/* ==========================================================================
   The way in: live ticker, overview map, sticky step rail
   ========================================================================== */

/* Which steps each model is currently inside, derived from the steps' own `at`.
   A model can be in several at once: the 32B is taking training steps (6) on the
   cluster (7) while writing checkpoints (8), all at the same time. */
function modelPositions() {
  var pos = { m32: [], m9: [] };
  C.steps.forEach(function (st) {
    (st.at || []).forEach(function (which) {
      if (!pos[which]) pos[which] = [];
      pos[which].push(st.id);
    });
  });
  if (SNAP.m9.state === "pending_annealing") pos.m9 = [];
  return pos;
}
function isAt(pos, which, id) { return (pos[which] || []).indexOf(id) !== -1; }

/* --- live ticker -------------------------------------------------------- */
/* Counters show measurements only. Freshness never implies extra completed steps. */
var TICK_TIMER = null, TICK_PAINT = null;
var PAINT_LANG = null;   // set by wireChrome, so OELLM.lang() can resync the switch

function tickerState() {
  var m = SNAP.m32, taken = new Date(SNAP.meta.takenAt).getTime();
  var ageMs = Date.now() - taken;
  var fresh = SNAP.meta.live && ageMs >= 0 && ageMs < 120000;
  var step = m.step;
  return { fresh: fresh, step: step, ageMs: ageMs };
}

function agoText(ms) {
  var h = ms / 3600000;
  if (h < 1) return num(Math.max(1, Math.round(ms / 60000)), 0) + " min";
  if (h < 48) return num(h, 0) + " " + t(C.fig.mtbf.hours);
  return num(h / 24, 0) + " " + t(C.fig.mtbf.days);
}

function buildTicker() {
  var box = el("div", { class: "ticker", role: "status", "aria-live": "off" });
  function paint() {
    var st = tickerState();
    box.className = "ticker" + (st.fresh && SNAP.m32.state === "training" ? " ticker--live" : "");
    box.innerHTML =
      '<span class="ticker__dot' + (st.fresh && SNAP.m32.state === "training" ? "" : " ticker__dot--stale") + '"></span>' +
      "<span>32B " + t(C.hero.tickerNow) + " <b>" + num(st.step) + "</b> / " + num(SNAP.m32.totalSteps) + "</span>" +
      '<span class="ticker__note">' +
        (st.fresh ? t(C.opening.measuredNow)
                  : t(C.hero.tickerStale) + " " + agoText(st.ageMs) + " " + t(C.hero.ago)) +
      "</span>";

    // keep the model card on the same number, so the page never shows two
    var stepNode = $("#tick-step"), fill = $("#tick-fill"), pctNode = $("#tick-pct");
    if (stepNode) stepNode.textContent = num(st.step);
    var frac = st.step / SNAP.m32.totalSteps;
    if (fill) fill.style.width = (frac * 100).toFixed(3) + "%";
    if (pctNode) pctNode.textContent = pct(frac, 2) + " " + (S.lang === "nl" ? "voltooid" : "complete");
  }
  TICK_PAINT = paint;
  paint();
  if (TICK_TIMER) clearInterval(TICK_TIMER);
  TICK_TIMER = setInterval(paint, Math.max(1000, (SNAP.m32.secPerStep || 6) * 1000));
  return box;
}

/* --- the ticker in the top bar ------------------------------------------ */
function buildTopTicker() {
  var host = $("#toptick");
  host.innerHTML = "";
  host.appendChild(buildTicker());
}

/* ==========================================================================
   Chrome: language, theme, nav, progress
   ========================================================================== */

function wireKeys() {
  window.addEventListener("hashchange", function () {
    var st = parseHash(); SEL = st; paint();
  });
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.key === "Escape") { select("none", null); return; }
    if (SEL.kind === "step") {
      var i = C.steps.map(function (x) { return x.id; }).indexOf(SEL.id);
      if (e.key === "ArrowRight" && i < C.steps.length - 1) { select("step", C.steps[i + 1].id); e.preventDefault(); return; }
      if (e.key === "ArrowLeft" && i > 0) { select("step", C.steps[i - 1].id); e.preventDefault(); return; }
    }
    if (/^[1-9]$/.test(e.key)) select("step", parseInt(e.key, 10));
    else if (e.key === "0") select("none", null);
  });
  $("#brandlink").addEventListener("click", function (e) { e.preventDefault(); select("none", null); });
}

function wireChrome() {
  var langSw = $("#langsw"), themeSw = $("#themesw");
  PAINT_LANG = paintLang;
  function paintLang() {
    [].slice.call(langSw.querySelectorAll("button")).forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.v === S.lang ? "true" : "false");
    });
    document.documentElement.lang = S.lang;
    document.title = t(C.ui.title) + " · OpenEuroLLM";
    $("#skip").textContent = t(C.ui.skip);
    $("#brandname").textContent = t(C.ui.title);
    langSw.setAttribute("aria-label", t(C.ui.lang));
    themeSw.setAttribute("aria-label", t(C.ui.theme));
  }
  [].slice.call(langSw.querySelectorAll("button")).forEach(function (b) {
    b.addEventListener("click", function () {
      S.lang = b.dataset.v;
      localStorage.setItem("oellm.lang", S.lang);
      paintLang(); build();
    });
  });

  function paintTheme() {
    if (S.theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", S.theme);
    [].slice.call(themeSw.querySelectorAll("button")).forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.v === S.theme ? "true" : "false");
    });
  }
  [].slice.call(themeSw.querySelectorAll("button")).forEach(function (b) {
    b.addEventListener("click", function () {
      S.theme = b.dataset.v;
      localStorage.setItem("oellm.theme", S.theme);
      paintTheme();
    });
  });

  paintLang(); paintTheme();
}

/* --- optional live.json ------------------------------------------------ */
function deepMerge(base, patch) {
  Object.keys(patch || {}).forEach(function (k) {
    if (patch[k] && typeof patch[k] === "object" && !Array.isArray(patch[k]) && base[k] && typeof base[k] === "object") {
      deepMerge(base[k], patch[k]);
    } else if (patch[k] !== undefined) {
      base[k] = patch[k];
    }
  });
}
function tryLive() {
  if (location.protocol === "file:") return;
  fetch("live.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (!j || !j.meta || !Number.isFinite(Date.parse(j.meta.takenAt)) ||
          !j.m32 || !Number.isFinite(j.m32.step) || j.m32.step < 0) return;
      if (Date.parse(j.meta.takenAt) < Date.parse(SNAP.meta.takenAt)) return;
      deepMerge(SNAP, j);
      SNAP.meta.live = true;
      buildTopTicker();
      refreshRunSummary();
      if (PROCESS) PROCESS.refresh();
      var evidence = $(".project-evidence");
      if (evidence) evidence.replaceWith(projectEvidence());
    })
    .catch(function () { /* no exporter yet — the snapshot in data.js stands */ });
}

/* ------------------------------------------------------------------ init */
document.addEventListener("DOMContentLoaded", function () {
  tipInit();
  wireChrome();
  wireKeys();
  build();
  tryLive();
  if (location.protocol !== "file:") setInterval(tryLive, 900000);
});

/* A small deliberate hook: lets you drive the page from the browser console
   (OELLM.go("stap-7")) and lets a test harness render every view. */
window.OELLM = {
  open: select,                                  // OELLM.open("step", 7)
  close: function () { select("none", null); },
  state: function () { return SEL; },
  snap: SNAP,
  lang: function (l) {
    if (l) {
      S.lang = l;
      localStorage.setItem("oellm.lang", l);
      if (PAINT_LANG) PAINT_LANG();   // keep the NL/EN switch in step with the content
      build();
    }
    return S.lang;
  },
};

})();
