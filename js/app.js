/* PhysicsLab: works without anime.js too (animations are just skipped) */
window.anime = window.anime || (() => ({}));
const $ = s => document.querySelector(s), g = 9.8, D = Math.PI / 180;
const f2 = n => (+n).toFixed(2).replace(/\.?0+$/, "");
const fmt = v => typeof v === "number" ? (isFinite(v) ? f2(v) : "–") : v;
/* progress is saved in this browser (localStorage) */
const load = () => { try { return JSON.parse(localStorage.getItem("pl-stats")) || {}; } catch (e) { return {}; } };
const record = (topic, ok) => {
  const s = load(); s[topic] = s[topic] || {right: 0, wrong: 0}; s[topic][ok ? "right" : "wrong"]++;
  try { localStorage.setItem("pl-stats", JSON.stringify(s)); } catch (e) {}
};

/* ---------- canvas helpers ---------- */
const K = {blue: "#1F5FBF", yellow: "#F2B705", red: "#D2452D", slope: "#8FB0DC"};
const line = (c, x1, y1, x2, y2, col, w = 2) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
const dot = (c, x, y, r, col) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
const txt = (c, s, x, y, col) => { c.fillStyle = col; c.font = "14px system-ui"; c.fillText(s, x, y); };

/* ---------- the labs ----------
   params: [key, label, unit, min, max, start, step]
   calc(p) returns the numbers; "ans" is the answer to the prediction question */
const SIMS = {
  incline: {
    params: [["th", "Slope angle", "°", 5, 60, 30, 1], ["m", "Mass", "kg", 1, 10, 3, 1], ["mu", "Friction μ", "", 0, 1, 0.2, 0.05]],
    ask: "Predict the acceleration (m/s²)",
    calc: p => { const a = Math.max(0, g * (Math.sin(p.th * D) - p.mu * Math.cos(p.th * D))); return {a, ans: a, state: a ? "Sliding" : "Stuck: friction wins"}; },
    out: [["Acceleration", "a", "m/s²"], ["Status", "state", ""]],
    draw(c, p, t, r, ink) {
      const L = 330, x0 = 90, y0 = 235, th = p.th * D, ca = Math.cos(th), sa = Math.sin(th);
      c.fillStyle = K.slope; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y0 - L * sa); c.lineTo(x0 + L * ca, y0); c.fill();
      const s = Math.min(L - 40, 20 + 0.5 * r.a * 30 * Math.pow(t % 4, 2));
      c.save(); c.translate(x0 + s * ca, y0 - L * sa + s * sa); c.rotate(th);
      c.fillStyle = K.blue; c.fillRect(-18, -26, 36, 26); c.restore();
      txt(c, "θ = " + p.th + "°", x0 + L * ca - 70, y0 - 8, ink);
    }
  },
  projectile: {
    params: [["v", "Launch speed", "m/s", 5, 40, 20, 1], ["th", "Angle", "°", 5, 85, 40, 1], ["g", "Gravity", "m/s²", 1.6, 25, 9.8, 0.1]],
    ask: "Predict the range (m)",
    calc: p => { const s = Math.sin(p.th * D), R = p.v * p.v * Math.sin(2 * p.th * D) / p.g;
      return {R, ans: R, H: p.v * p.v * s * s / (2 * p.g), T: 2 * p.v * s / p.g}; },
    out: [["Range", "R", "m"], ["Max height", "H", "m"], ["Flight time", "T", "s"]],
    draw(c, p, t, r, ink) {
      const sc = Math.min(560 / Math.max(r.R, 1), 190 / Math.max(r.H, 1)), vx = p.v * Math.cos(p.th * D), vy = p.v * Math.sin(p.th * D);
      const at = u => [30 + vx * u * sc, 240 - (vy * u - 0.5 * p.g * u * u) * sc];
      line(c, 20, 240, 630, 240, ink, 3);
      for (let i = 0; i <= 30; i++) { const [x, y] = at(r.T * i / 30); dot(c, x, y, 2, ink); }
      const [bx, by] = at(Math.min(t % (r.T + 1), r.T)); dot(c, bx, by, 9, K.red);
    }
  },
  energy: {
    params: [["L", "Length", "m", 0.5, 3, 1.5, 0.1], ["th0", "Release angle", "°", 5, 80, 45, 1], ["m", "Mass", "kg", 1, 5, 2, 0.5]],
    ask: "Predict the speed at the bottom (m/s)",
    calc: p => { const h = p.L * (1 - Math.cos(p.th0 * D)), v = Math.sqrt(2 * g * h);
      return {h, E: p.m * g * h, v, ans: v, T: 2 * Math.PI * Math.sqrt(p.L / g)}; },
    out: [["Release height", "h", "m"], ["Total energy", "E", "J"], ["Speed at bottom", "v", "m/s"], ["Period (small swings)", "T", "s"]],
    draw(c, p, t, r, ink) {
      const s = this.st || (this.st = {th: p.th0 * D, w: 0, last: t}), dt = Math.min(0.03, t - s.last); s.last = t;
      for (let i = 0; i < 5; i++) { s.w -= g / p.L * Math.sin(s.th) * dt / 5; s.th += s.w * dt / 5; }
      const len = 55 * p.L, bx = 200 + len * Math.sin(s.th), by = 30 + len * Math.cos(s.th);
      line(c, 200, 30, bx, by, ink, 3); dot(c, bx, by, 12 + p.m * 2, K.blue);
      const pe = p.m * g * p.L * (1 - Math.cos(s.th)), ke = 0.5 * p.m * Math.pow(p.L * s.w, 2), E = Math.max(r.E, 0.001);
      [[450, ke, K.blue, "KE"], [540, pe, K.yellow, "PE"]].forEach(([x, v, col, n]) => {
        const h = Math.max(0, Math.min(190, 190 * v / E)); c.fillStyle = col; c.fillRect(x, 235 - h, 50, h); txt(c, n, x + 14, 252, ink); });
    }
  },
  waves: {
    params: [["f1", "Wave 1 frequency", "Hz", 2, 12, 5, 1], ["f2", "Wave 2 frequency", "Hz", 2, 12, 6, 1], ["a2", "Wave 2 strength", "", 0, 1, 1, 0.1]],
    ask: "Predict the beat frequency (Hz)",
    calc: p => ({beat: Math.abs(p.f1 - p.f2), ans: Math.abs(p.f1 - p.f2), max: 1 + p.a2, min: Math.abs(1 - p.a2)}),
    out: [["Beat frequency", "beat", "Hz"], ["Loudest (max amplitude)", "max", ""], ["Quietest (min amplitude)", "min", ""]],
    draw(c, p, t, r, ink) {
      [[45, 0, K.blue, "Wave 1"], [125, 1, K.yellow, "Wave 2"], [210, 2, K.red, "Sum"]].forEach(([y0, i, col, name]) => {
        c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath();
        for (let x = 0; x <= 600; x += 3) {
          const u = x / 600, a = Math.sin(2 * Math.PI * p.f1 * u - 4 * t), b = p.a2 * Math.sin(2 * Math.PI * p.f2 * u - 4 * t), v = [a, b, (a + b) / 2][i];
          x ? c.lineTo(20 + x, y0 + v * 32) : c.moveTo(20 + x, y0 + v * 32);
        }
        c.stroke(); txt(c, name, 24, y0 - 34, ink);
      });
    }
  },
  refraction: {
    params: [["n1", "Top material n₁", "", 1, 2, 1, 0.05], ["n2", "Bottom material n₂", "", 1, 2.5, 1.5, 0.05], ["th", "Angle of incidence", "°", 0, 89, 30, 1]],
    ask: "Predict the refraction angle (°)",
    calc: p => { const s = p.n1 * Math.sin(p.th * D) / p.n2, tir = s > 1, th2 = tir ? NaN : Math.asin(s) / D;
      return {tir, ans: th2, th2s: tir ? "Total internal reflection" : th2, crit: p.n1 > p.n2 ? Math.asin(p.n2 / p.n1) / D : "None (n₁ ≤ n₂)"}; },
    out: [["Refraction angle", "th2s", "°"], ["Critical angle", "crit", "°"]],
    draw(c, p, t, r, ink) {
      const cx = 320, cy = 130, L = 115, a = p.th * D;
      c.fillStyle = "rgba(31,95,191," + 0.06 * p.n1 + ")"; c.fillRect(0, 0, 640, cy);
      c.fillStyle = "rgba(31,95,191," + 0.12 * p.n2 + ")"; c.fillRect(0, cy, 640, 130);
      line(c, 0, cy, 640, cy, ink, 2); line(c, cx, 10, cx, 250, ink, 1);
      line(c, cx - L * Math.sin(a), cy - L * Math.cos(a), cx, cy, K.yellow, 4);
      line(c, cx, cy, cx + L * Math.sin(a), cy - L * Math.cos(a), K.yellow, r.tir ? 4 : 1);
      if (!r.tir) { const b = Math.asin(p.n1 * Math.sin(a) / p.n2); line(c, cx, cy, cx + L * Math.sin(b), cy + L * Math.cos(b), K.red, 4); }
      txt(c, "n₁ = " + p.n1, 12, 24, ink); txt(c, "n₂ = " + p.n2, 12, 250, ink);
    }
  },
  collision: {
    params: [["m1", "Mass of block 1", "kg", 1, 10, 3, 1], ["m2", "Mass of block 2", "kg", 1, 10, 2, 1], ["v1", "Speed of block 1", "m/s", 1, 10, 4, 1], ["e", "Bounciness e (0 = stick)", "", 0, 1, 0.5, 0.1]],
    ask: "Predict block 2’s speed after the hit (m/s)",
    calc: p => { const M = p.m1 + p.m2, u1 = (p.m1 - p.e * p.m2) * p.v1 / M, u2 = (1 + p.e) * p.m1 * p.v1 / M;
      return {u1, u2, ans: u2, p0: p.m1 * p.v1, lost: 0.5 * p.m1 * p.v1 * p.v1 - 0.5 * (p.m1 * u1 * u1 + p.m2 * u2 * u2)}; },
    out: [["Block 1 after", "u1", "m/s"], ["Block 2 after", "u2", "m/s"], ["Momentum (before = after)", "p0", "kg m/s"], ["Kinetic energy lost", "lost", "J"]],
    draw(c, p, t, r, ink) {
      const S = 40, w1 = 24 + 4 * p.m1, w2 = 24 + 4 * p.m2, x2s = 380, x1c = x2s - w1, tc = (x1c - 30) / (p.v1 * S), tt = t % (tc + 2.5);
      let x1, x2;
      if (tt < tc) { x1 = 30 + p.v1 * S * tt; x2 = x2s; } else { const d = tt - tc; x1 = x1c + r.u1 * S * d; x2 = x2s + r.u2 * S * d; }
      line(c, 0, 200, 640, 200, ink, 3);
      c.fillStyle = K.blue; c.fillRect(x1, 200 - w1, w1, w1); c.fillStyle = K.yellow; c.fillRect(x2, 200 - w2, w2, w2);
      txt(c, p.m1 + " kg", x1 + 4, 194 - w1, ink); txt(c, p.m2 + " kg", x2 + 4, 194 - w2, ink);
    }
  },
  circuit: {
    params: [["V", "Battery", "V", 1, 24, 12, 1], ["R1", "Bulb 1 resistance", "Ω", 1, 20, 4, 1], ["R2", "Bulb 2 resistance", "Ω", 1, 20, 8, 1], ["par", "Wiring (0 = series, 1 = parallel)", "", 0, 1, 0, 1]],
    ask: "Predict the total current (A)",
    calc: p => { const s = !p.par, R = s ? p.R1 + p.R2 : 1 / (1 / p.R1 + 1 / p.R2), I = p.V / R;
      return {R, I, ans: I, P1: s ? I * I * p.R1 : p.V * p.V / p.R1, P2: s ? I * I * p.R2 : p.V * p.V / p.R2}; },
    out: [["Total resistance", "R", "Ω"], ["Total current", "I", "A"], ["Bulb 1 power", "P1", "W"], ["Bulb 2 power", "P2", "W"]],
    draw(c, p, t, r, ink) {
      const s = !p.par, glow = P => Math.min(1, 0.12 + Math.sqrt(P / 50));
      const bulbs = s ? [[240, 110, r.P1, p.R1], [400, 110, r.P2, p.R2]] : [[320, 60, r.P1, p.R1], [320, 160, r.P2, p.R2]];
      const top = s ? 110 : 60, bot = s ? 215 : 160;
      c.strokeStyle = ink; c.lineWidth = 3; c.beginPath(); c.rect(100, top, 440, bot - top); c.stroke();
      c.fillStyle = K.yellow; c.fillRect(86, (top + bot) / 2 - 14, 28, 28); txt(c, p.V + " V", 120, (top + bot) / 2 + 5, ink);
      bulbs.forEach(([x, y, P, R], i) => {
        c.globalAlpha = glow(P); dot(c, x, y, 24, K.yellow); c.globalAlpha = 1;
        c.strokeStyle = ink; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 24, 0, 7); c.stroke();
        txt(c, "R" + (i + 1) + " = " + R + " Ω", x - 34, y + 46, ink);
      });
    }
  }
};

/* ---------- app ---------- */
let topics = [], quiz = [], id = null, sim = null, p = {}, r = {};

function boot() {
  topics = DATA.topics; quiz = DATA.quiz;
  $("#tabs").innerHTML = topics.map(t => `<button role="tab" data-id="${t.id}">${t.title}</button>`).join("") +
    '<button role="tab" data-id="quiz">Quiz</button><button role="tab" data-id="progress">Progress</button>';
  $("#tabs").onclick = e => e.target.dataset.id && show(e.target.dataset.id);
  show(topics[0].id);
  requestAnimationFrame(loop);
}

function show(x) {
  id = x; sim = SIMS[x] || null;
  document.querySelectorAll("#tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.id === x));
  if (sim) simView(topics.find(t => t.id === x)); else if (x === "quiz") quizView(); else progressView();
  anime({targets: "#view", opacity: [0, 1], translateY: [14, 0], duration: 350, easing: "easeOutCubic"});
}

function simView(t) {
  sim.st = null; p = {}; sim.params.forEach(q => p[q[0]] = q[5]);
  $("#view").innerHTML = `<div class="card"><h2>${t.title}</h2><p>${t.text}</p><div class="eq">${t.formula}</div>
    <canvas id="cv" width="640" height="260" aria-label="${t.title} simulation"></canvas>` +
    sim.params.map(q => `<label>${q[1]}: <b id="v-${q[0]}"></b> ${q[2]}<input type="range" data-k="${q[0]}" min="${q[3]}" max="${q[4]}" step="${q[6]}" value="${q[5]}"></label>`).join("") +
    `<div class="grid" id="out"></div>
    <label for="guess">${sim.ask}</label><input type="number" id="guess" step="any" inputmode="decimal">
    <div class="row"><button class="btn primary" id="test">Test it</button></div>
    <div class="msg" id="fb" aria-live="polite"></div></div>`;
  document.querySelectorAll("input[type=range]").forEach(i => i.oninput = () => { p[i.dataset.k] = +i.value; sim.st = null; update(); });
  $("#test").onclick = test; update();
}

function update() {
  r = sim.calc(p);
  sim.params.forEach(q => $("#v-" + q[0]).textContent = p[q[0]]);
  $("#out").innerHTML = sim.out.map(([l, k, u]) => `<div><small>${l}</small><b>${fmt(r[k])}${typeof r[k] === "number" && u ? " " + u : ""}</b></div>`).join("");
}

function test() {
  const guess = parseFloat($("#guess").value), fb = $("#fb");
  if (isNaN(guess)) { fb.textContent = "Type your prediction first."; return; }
  if (isNaN(r.ans)) { fb.textContent = "Nothing refracts here: the light reflects completely."; return; }
  const ok = Math.abs(guess - r.ans) <= Math.max(0.05, 0.05 * Math.abs(r.ans));
  fb.innerHTML = ok ? `<span class="ok">Spot on!</span> The answer is ${f2(r.ans)}.`
    : `<span class="no">Not quite.</span> You guessed ${f2(guess)}; the answer is ${f2(r.ans)}. Compare it with the readouts and the formula.`;
  anime({targets: "#fb", scale: [0.92, 1], duration: 400, easing: "easeOutBack"});
  record(id, ok);
}

function loop(ts) {
  const cv = $("#cv");
  if (sim && cv) { const c = cv.getContext("2d"); c.clearRect(0, 0, 640, 260); sim.draw(c, p, ts / 1000, r, getComputedStyle(document.body).color); }
  requestAnimationFrame(loop);
}

/* ---------- quiz ---------- */
let qs = [], qi = 0, score = 0;
function quizView() { qs = [...quiz].sort(() => Math.random() - 0.5).slice(0, 10); qi = 0; score = 0; question(); }
function question() {
  const v = $("#view");
  if (qi >= qs.length) {
    v.innerHTML = `<div class="card"><h2>Finished</h2><p>You scored <b id="sc">${score}</b> / ${qs.length}</p><button class="btn primary" id="again">Play again</button></div>`;
    const o = {n: 0}; anime({targets: o, n: score, round: 1, duration: 800, easing: "easeOutCubic", update: () => $("#sc").textContent = o.n});
    $("#again").onclick = quizView; return;
  }
  const Q = qs[qi], name = topics.find(t => t.id === Q.t).title;
  v.innerHTML = `<div class="card"><span class="tag">${name}</span> Question ${qi + 1} of ${qs.length}<h2 style="margin-top:8px">${Q.q}</h2>` +
    Q.o.map((o, i) => `<button class="btn opt" data-i="${i}">${o}</button>`).join("") + '<div class="msg" id="qm" aria-live="polite"></div></div>';
  document.querySelectorAll(".opt").forEach(b => b.onclick = () => pick(b, Q));
}
function pick(b, Q) {
  const ok = +b.dataset.i === Q.a; if (ok) score++;
  document.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (+x.dataset.i === Q.a) x.classList.add("right"); });
  if (!ok) b.classList.add("wrong");
  anime(ok ? {targets: b, scale: [1, 1.04, 1], duration: 350} : {targets: b, translateX: [0, -8, 8, -4, 0], duration: 350});
  $("#qm").innerHTML = `<span class="${ok ? "ok" : "no"}">${ok ? "Correct!" : "Not quite."}</span> ${Q.e}<div class="row"><button class="btn primary" id="nx">Next</button></div>`;
  $("#nx").focus(); $("#nx").onclick = () => { qi++; question(); };
  record(Q.t, ok);
}

/* ---------- progress ---------- */
function progressView() {
  const s = load();
  const rows = topics.map(t => { const x = s[t.id] || {right: 0, wrong: 0}, n = x.right + x.wrong; return {t, x, n, acc: n ? x.right / n : 0}; });
  const weak = rows.filter(w => w.n).sort((a, b) => a.acc - b.acc)[0];
  $("#view").innerHTML = '<div class="card"><h2>Your progress</h2>' +
    rows.map(w => `<div class="bar"><span>${w.t.title}</span><div class="track"><i style="width:${Math.round(w.acc * 100)}%"></i></div><small>${w.n ? w.x.right + " / " + w.n : "not tried"}</small></div>`).join("") +
    (weak && weak.acc < 1 ? `<p class="msg">Needs practice: <button class="btn" id="wk">${weak.t.title}</button></p>` : "") +
    '<div class="row"><button class="btn" id="rs">Reset progress</button></div></div>';
  anime({targets: ".track i", scaleX: [0, 1], duration: 700, easing: "easeOutCubic"});
  if (weak && weak.acc < 1) $("#wk").onclick = () => show(weak.t.id);
  $("#rs").onclick = () => { try { localStorage.removeItem("pl-stats"); } catch (e) {} progressView(); };
}

boot();
