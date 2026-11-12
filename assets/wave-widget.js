/* ============ 可复用编码波形绘制组件 ============
 * 用法：页面引入本文件后，放入
 * <div class="wave-pg" data-default="10110010"></div>
 * 功能：输入比特串，绘制 NRZ（不归零）、曼彻斯特、差分曼彻斯特三种编码波形
 * 约定（考试常用约定，注意不同文献可能相反，以教材为准）：
 *   - 曼彻斯特：码元「1」= 前半高后半低（中间向下跳变）；「0」= 前半低后半高
 *   - 差分曼彻斯特：看码元「开始处」——有跳变 = 0，无跳变 = 1（谢希仁教材约定）
 */
(function () {
  const STYLE = `
    .wave-pg { border: 1px solid var(--line); border-radius: var(--radius); margin: 1.6em 0; overflow: hidden; background:#fff; }
    .wave-pg-head { background: var(--code-bg); padding: 10px 16px; font-family: "PingFang SC","Microsoft YaHei",sans-serif; font-size: .95rem; font-weight: 600; }
    .wave-pg-bar { padding: 12px 16px 0; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .wave-pg input {
      font-family: "JetBrains Mono", Consolas, monospace; font-size: 1rem;
      border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; width: 220px; letter-spacing: 3px;
    }
    .wave-pg input:focus { outline: 2px solid var(--accent-soft); border-color: var(--accent); }
    .wave-pg-btn { background: var(--accent); color:#fff; border:none; border-radius:8px; padding:8px 18px; cursor:pointer; font-family:inherit; font-size:.92rem; }
    .wave-pg-btn.ghost { background:transparent; color:var(--accent); border:1px solid var(--accent); }
    .wave-pg-err { color:#c0392b; font-size:.85rem; }
    .wave-pg svg { width: 100%; height: auto; display: block; }
    .wave-pg-body { padding: 8px 16px 16px; }`;

  if (!document.getElementById("wave-style")) {
    const s = document.createElement("style");
    s.id = "wave-style";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  // 生成每种编码的「半码元电平序列」：数组元素为每个半码元的电平 (0/1)
  function levels(bits, kind) {
    const halves = []; // {v: 0|1, bit: '0'|'1', half: 0|1}
    let prevSecond = 1; // 差分曼彻斯特：初始参考电平（第一个码元开始前假定为高）
    for (const b of bits) {
      if (kind === "nrz") {
        halves.push({ v: b === "1" ? 1 : 0, bit: b, half: 0 });
        halves.push({ v: b === "1" ? 1 : 0, bit: b, half: 1 });
      } else if (kind === "man") {
        // 1: 前高后低；0: 前低后高
        halves.push({ v: b === "1" ? 1 : 0, bit: b, half: 0 });
        halves.push({ v: b === "1" ? 0 : 1, bit: b, half: 1 });
      } else {
        // 差分：开始处有跳变 = 0，无跳变 = 1
        const first = b === "0" ? 1 - prevSecond : prevSecond;
        halves.push({ v: first, bit: b, half: 0 });
        halves.push({ v: 1 - first, bit: b, half: 1 });
        prevSecond = 1 - first; // 本码元结束电平
      }
    }
    return halves;
  }

  function render(halves, opts) {
    const W = 640, padL = 78, padR = 16, padT = 26, rowH = 74;
    const H = padT + opts.rows.length * rowH + 10;
    const unitW = (W - padL - padR) / halves.length;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const mk = (tag, attrs) => { const e = document.createElementNS(svgNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

    // 顶部比特标签
    halves.forEach((h, i) => {
      if (h.half === 0) {
        const t = mk("text", { x: padL + (i + 1) * unitW, y: 16, "font-size": 13, fill: "#5c5850", "text-anchor": "middle" });
        t.textContent = h.bit; svg.appendChild(t);
        if (i > 0) svg.appendChild(mk("line", { x1: padL + i * unitW, y1: 22, x2: padL + i * unitW, y2: padT + opts.rows.length * rowH, stroke: "#e2ded4", "stroke-width": 1 }));
      }
    });

    opts.rows.forEach((row, r) => {
      const yHigh = padT + r * rowH + 14, yLow = yHigh + 34;
      const label = mk("text", { x: 8, y: (yHigh + yLow) / 2 + 5, "font-size": 12.5, fill: row.color, "font-weight": 600 });
      label.textContent = row.label; svg.appendChild(label);
      // 高低电平参考虚线
      svg.appendChild(mk("line", { x1: padL, y1: yHigh, x2: W - padR, y2: yHigh, stroke: "#f0ede5", "stroke-width": 1 }));
      svg.appendChild(mk("line", { x1: padL, y1: yLow, x2: W - padR, y2: yLow, stroke: "#f0ede5", "stroke-width": 1 }));

      const hs = levels(halves.map(h => h.bit).join(""), row.kind);
      let d = `M ${padL} ${hs[0].v === 1 ? yHigh : yLow}`;
      hs.forEach((h, i) => {
        const x = padL + (i + 1) * unitW;
        const y = h.v === 1 ? yHigh : yLow;
        if (i > 0 && hs[i - 1].v !== h.v) d += ` L ${padL + i * unitW} ${y}`; // 竖直跳变
        d += ` L ${x} ${y}`;
      });
      svg.appendChild(mk("path", { d, fill: "none", stroke: row.color, "stroke-width": 2.2, "stroke-linejoin": "round" }));
    });

    return svg;
  }

  document.querySelectorAll(".wave-pg").forEach(function (el) {
    el.innerHTML =
      '<div class="wave-pg-head">📡 编码波形绘制器</div>' +
      '<div class="wave-pg-bar"><input maxlength="24" value="' + (el.dataset.default || "10110010") + '">' +
      '<button type="button" class="wave-pg-btn draw">绘制波形</button>' +
      '<button type="button" class="wave-pg-btn ghost rand">随机一组</button>' +
      '<span class="wave-pg-err"></span></div>' +
      '<div class="wave-pg-body"></div>';
    const input = el.querySelector("input");
    const body = el.querySelector(".wave-pg-body");
    const err = el.querySelector(".wave-pg-err");

    function draw() {
      const bits = input.value.trim();
      if (!/^[01]{2,24}$/.test(bits)) {
        err.textContent = "请输入 2~24 位 0/1 比特串";
        return;
      }
      err.textContent = "";
      body.innerHTML = "";
      body.appendChild(render(bits, {
        rows: [
          { label: "不归零制 NRZ", kind: "nrz", color: "#5c5850" },
          { label: "曼彻斯特编码", kind: "man", color: "#0f6b5c" },
          { label: "差分曼彻斯特", kind: "diff", color: "#a8500f" }
        ]
      }));
    }

    el.querySelector(".draw").addEventListener("click", draw);
    el.querySelector(".rand").addEventListener("click", function () {
      let s = ""; for (let i = 0; i < 8; i++) s += Math.random() < 0.5 ? "0" : "1";
      input.value = s; draw();
    });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") draw(); });
    draw();
  });
})();
