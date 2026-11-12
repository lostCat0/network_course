/* ============ 可复用信道极限容量计算器 ============
 * 用法：页面引入本文件后，放入
 * <div class="channel-calc" data-w="3000" data-snr="30"></div>
 * 功能：输入带宽与条件（噪声信噪比 / 调制级数），计算奈氏准则极限与香农极限
 */
(function () {
  const STYLE = `
    .ccalc { border: 1px solid var(--line); border-radius: var(--radius); margin: 1.6em 0; overflow: hidden; background:#fff; }
    .ccalc-head { background: var(--code-bg); padding: 10px 16px; font-family: "PingFang SC","Microsoft YaHei",sans-serif; font-size: .95rem; font-weight: 600; }
    .ccalc-grid { display: flex; gap: 14px; flex-wrap: wrap; padding: 14px 16px 6px; }
    .ccalc label { font-size: .85rem; color: var(--ink-soft); display: block; font-family: "PingFang SC","Microsoft YaHei",sans-serif; margin-bottom: 4px; }
    .ccalc input { border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; width: 130px; font-size: .95rem; font-family: "JetBrains Mono", Consolas, monospace; }
    .ccalc input:focus { outline: 2px solid var(--accent-soft); border-color: var(--accent); }
    .ccalc-out { padding: 6px 16px 16px; font-family: "PingFang SC","Microsoft YaHei",sans-serif; font-size: .95rem; line-height: 2; }
    .ccalc-out b { color: var(--accent); font-family: "JetBrains Mono", Consolas, monospace; }
    .ccalc-out .err { color: #c0392b; font-size: .88rem; }`;

  if (!document.getElementById("ccalc-style")) {
    const s = document.createElement("style");
    s.id = "ccalc-style";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function log2(x) { return Math.log(x) / Math.LN2; }

  document.querySelectorAll(".channel-calc").forEach(function (el) {
    el.innerHTML =
      '<div class="ccalc-head">🧮 信道极限容量计算器（奈氏准则 × 香农公式）</div>' +
      '<div class="ccalc-grid">' +
      '<div><label>信道带宽 W（Hz）</label><input class="w" type="number" value="' + (el.dataset.w || 3000) + '"></div>' +
      '<div><label>信噪比 S/N（dB，噪声信道用）</label><input class="snr" type="number" value="' + (el.dataset.snr || 30) + '"></div>' +
      '<div><label>码元离散状态数 n（理想信道用）</label><input class="n" type="number" value="16" min="2"></div>' +
      '</div><div class="ccalc-out"></div>';
    const wEl = el.querySelector(".w"), snrEl = el.querySelector(".snr"), nEl = el.querySelector(".n"), out = el.querySelector(".ccalc-out");

    function fmt(v) {
      if (v >= 1e9) return (v / 1e9).toFixed(2) + " Gbit/s";
      if (v >= 1e6) return (v / 1e6).toFixed(2) + " Mbit/s";
      if (v >= 1e3) return (v / 1e3).toFixed(2) + " kbit/s";
      return v.toFixed(0) + " bit/s";
    }

    function calc() {
      const W = parseFloat(wEl.value), snrDb = parseFloat(snrEl.value), n = parseInt(nEl.value, 10);
      if (!(W > 0)) { out.innerHTML = '<span class="err">带宽必须为正数</span>'; return; }
      let html = "";
      if (n >= 2) {
        // 奈氏准则：极限波特率 = 2W Baud；每码元 log2(n) 比特
        const baud = 2 * W;
        const cNyquist = baud * log2(n);
        html += "① <b>奈氏准则</b>（理想无噪声信道）：极限波特率 = 2W = <b>" + (2 * W / 1000).toFixed(1) + " kBaud</b>" +
          "，每码元携带 log₂" + n + " = " + log2(n).toFixed(2) + " 比特 → 极限速率 <b>" + fmt(cNyquist) + "</b><br>";
      }
      if (snrDb > 0) {
        const ratio = Math.pow(10, snrDb / 10);
        const cShannon = W * log2(1 + ratio);
        html += "② <b>香农公式</b>（有噪声信道）：信噪比 " + snrDb + " dB → S/N = 10^(" + snrDb + "/10) = <b>" + ratio.toExponential(2) + "</b>" +
          "，C = W·log₂(1+S/N) = <b>" + fmt(cShannon) + "</b><br>";
        if (n >= 2) {
          const cNyquist = 2 * W * log2(n);
          html += "③ <b>联合分析</b>：实际可达上限取两者较小值 → <b>" + fmt(Math.min(cNyquist, cShannon)) + "</b>" +
            (cShannon < cNyquist
              ? "（香农极限更紧：即使提高调制级数 n，也无法突破噪声决定的上限，只能提升信噪比或带宽）"
              : "（奈氏极限更紧：噪声不是瓶颈，可通过提高调制级数 n 继续提速，直到撞上香农极限）");
        }
      }
      out.innerHTML = html;
    }

    [wEl, snrEl, nEl].forEach(i => i.addEventListener("input", calc));
    calc();
  });
})();
