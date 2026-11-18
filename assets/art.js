/*
  Line-art illustrations, drawn as inline SVG.
  Classes (styled in style.css):
    s = outline only, p = outline filled with paper, f = solid ink,
    t = thin detail line, thick / mid = heavy strokes.
  Colour comes from `currentColor`, so each illustration takes the text colour of its container.
*/
window.ART = (function () {
  "use strict";

  const svg = (viewBox, inner, cls = "") =>
    `<svg class="art ${cls}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${inner}</svg>`;

  /* a stemmed wine glass whose rim centre is (cx, y); about 72 x 155 */
  function glass(cx, y, wine = true) {
    return `
      <ellipse class="p" cx="${cx}" cy="${y + 148}" rx="28" ry="7"/>
      <path class="s" d="M${cx} ${y + 78} V${y + 146}"/>
      <path class="p" d="M${cx - 36} ${y} C${cx - 36} ${y + 55} ${cx - 18} ${y + 80} ${cx} ${y + 80} C${cx + 18} ${y + 80} ${cx + 36} ${y + 55} ${cx + 36} ${y} Z"/>
      ${wine ? `<path class="f" d="M${cx - 33} ${y + 30} C${cx - 30} ${y + 62} ${cx - 14} ${y + 77} ${cx} ${y + 77} C${cx + 14} ${y + 77} ${cx + 30} ${y + 62} ${cx + 33} ${y + 30} Q${cx} ${y + 38} ${cx - 33} ${y + 30} Z"/>` : ""}
      <ellipse class="s" cx="${cx}" cy="${y}" rx="36" ry="7"/>
      <path class="t" d="M${cx - 26} ${y + 12} Q${cx - 27} ${y + 22} ${cx - 24} ${y + 28}"/>`;
  }

  /* a single leaf pointing along +x from (x, y) */
  const leaf = (x, y, rot, scale = 1, cls = "p") => `
    <g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">
      <path class="${cls}" d="M0 0 C12 -11 34 -13 52 0 C34 13 12 11 0 0 Z"/>
      <path class="t" d="M3 0 H46 M18 0 L26 -6 M30 0 L38 -5 M18 0 L26 6 M30 0 L38 5"/>
    </g>`;

  /* ---------- hero: a set table ---------- */
  function hero() {
    const olives = [[130, 393, 1], [150, 389, 0], [170, 391, 1], [190, 394, 0], [205, 399, 1], [140, 401, 0], [160, 402, 1], [180, 403, 0], [122, 402, 1], [198, 405, 0]]
      .map(([x, y, f]) => `<ellipse class="${f ? "f" : "p"}" cx="${x}" cy="${y}" rx="9" ry="7" transform="rotate(-20 ${x} ${y})"/>${f ? "" : `<circle class="f" cx="${x + 1}" cy="${y}" r="1.8"/>`}`)
      .join("");

    return svg("0 0 560 520", `
      <!-- chair back behind the table -->
      <path class="s thick" d="M160 300 V160 C160 70 300 70 300 160 V300"/>
      <path class="s mid" d="M192 300 V172 C192 118 268 118 268 172 V300"/>

      <!-- table top and planks -->
      <path class="bg" d="M-10 302 L570 178 L570 530 L-10 530 Z"/>
      <path class="s" d="M-10 302 L570 178"/>
      <path class="t" d="M0 300 L110 520 M80 283 L198 520 M160 266 L287 520 M240 249 L375 520 M320 231 L464 520 M400 214 L553 520 M480 197 L640 520"/>
      <path class="t" d="M40 330 q8 -3 16 1 M120 360 q10 -4 18 0 M300 300 q9 -4 17 0 M455 262 q10 -4 18 0 M500 300 q8 -3 15 1 M220 470 q9 -3 16 1"/>

      <!-- water bottle -->
      <path class="p" d="M30 180 Q30 160 45 150 L52 140 V112 H68 V140 L75 150 Q90 160 90 180 V395 Q60 402 30 395 Z"/>
      <rect class="f" x="49" y="98" width="22" height="15" rx="2"/>
      <path class="s" d="M30 230 H90 M30 350 H90"/>
      <path class="t" d="M80 175 V220 M80 360 V385"/>
      <text class="label" x="60" y="268">מ</text>
      <text class="label" x="60" y="300">י</text>
      <text class="label" x="60" y="334">ם</text>

      <!-- olive bowl -->
      <ellipse class="p" cx="165" cy="452" rx="30" ry="6"/>
      <path class="p" d="M107 400 C110 440 135 452 165 452 C195 452 220 440 223 400 Z"/>
      <path class="t" d="M120 420 q8 14 22 22 M134 414 q6 16 18 26 M200 416 q-4 12 -14 22"/>
      <ellipse class="p" cx="165" cy="400" rx="58" ry="14"/>
      ${olives}

      <!-- first glass -->
      ${glass(265, 240)}

      <!-- plate and knife -->
      <ellipse class="p" cx="255" cy="480" rx="112" ry="36"/>
      <ellipse class="t" cx="255" cy="478" rx="80" ry="23"/>
      ${leaf(232, 476, -20, 0.55)}${leaf(250, 480, 200, 0.45)}
      <path class="p" d="M372 506 L454 466 C462 462 468 468 458 475 L378 512 Z"/>
      <path class="t" d="M392 496 L446 470"/>

      <!-- second glass, being filled -->
      ${glass(395, 290)}
      <path class="s pour" d="M404 188 C401 230 397 275 395 322"/>

      <!-- pouring bottle -->
      <g transform="translate(445 135) rotate(38)">
        <path class="p" d="M-28 -150 H28 V-20 C28 0 12 6 10 18 V60 H-10 V18 C-12 6 -28 0 -28 -20 Z"/>
        <path class="f" d="M-10 22 H10 V60 H-10 Z"/>
        <rect class="p" x="-12" y="58" width="24" height="9" rx="2"/>
        <rect class="p" x="-28" y="-108" width="56" height="62"/>
        <rect class="t" x="-22" y="-102" width="44" height="50"/>
        <path class="t" d="M-12 -86 H12 M-8 -76 H8 M-14 -66 H14"/>
        <path class="t" d="M18 -140 V-118 M18 -36 V-24"/>
      </g>
      <path class="t" d="M470 205 q10 6 12 18 M486 196 q12 6 14 20"/>

      <!-- tumbler -->
      <path class="p" d="M467 370 L474 455 Q505 463 536 455 L543 370 Z"/>
      <path class="t" d="M478 448 V424 a7 7 0 0 1 14 0 V448 M498 450 V424 a7 7 0 0 1 14 0 V450 M518 448 V424 a7 7 0 0 1 14 0 V448"/>
      <ellipse class="s" cx="505" cy="370" rx="38" ry="8"/>
    `, "art-hero");
  }

  /* ---------- dish illustrations for the recipe cards (200 x 150) ---------- */
  const DISHES = {
    fish: `
      <ellipse class="p" cx="100" cy="102" rx="90" ry="35"/>
      <ellipse class="t" cx="100" cy="100" rx="68" ry="24"/>
      <path class="p" d="M42 96 C62 70 120 66 146 90 C122 112 62 116 42 96 Z"/>
      <path class="p" d="M144 90 L174 72 C168 84 168 96 176 110 Z"/>
      <path class="t" d="M150 88 L166 80 M150 92 L168 98"/>
      <path class="t" d="M64 80 C70 88 70 102 64 112"/>
      <circle class="f" cx="54" cy="92" r="2.6"/>
      <path class="t" d="M86 78 L78 108 M102 76 L94 110 M118 78 L110 108 M132 83 L126 104"/>
      <path class="s" d="M96 75 C102 64 116 64 124 72"/>
      <path class="p" d="M130 116 A17 11 0 0 0 164 116 Z"/>
      <path class="t" d="M147 116 V126 M147 116 L138 124 M147 116 L156 124"/>
      ${leaf(56, 118, 160, 0.4)}${leaf(60, 120, 200, 0.35)}`,

    pan: `
      <path class="p" d="M162 88 L196 74 L199 83 L165 99 Z"/>
      <path class="p" d="M24 88 C26 116 60 128 100 128 C140 128 174 116 176 88 Z"/>
      <ellipse class="p" cx="100" cy="88" rx="76" ry="24"/>
      <ellipse class="t" cx="100" cy="90" rx="66" ry="18"/>
      ${[[70, 84], [102, 79], [132, 86], [84, 98], [118, 99]].map(([x, y]) => `
        <ellipse class="p" cx="${x}" cy="${y}" rx="17" ry="9"/>
        <path class="t" d="M${x - 8} ${y - 2} q8 -4 16 0 M${x - 6} ${y + 3} q6 -3 12 0"/>`).join("")}
      <circle class="f" cx="76" cy="81" r="1.6"/><circle class="f" cx="108" cy="77" r="1.6"/><circle class="f" cx="124" cy="98" r="1.6"/>
      ${leaf(92, 88, -30, 0.25, "f")}${leaf(140, 92, 200, 0.22, "f")}
      <path class="t" d="M80 58 c-6 -8 6 -14 0 -22 M100 52 c-6 -8 6 -14 0 -22 M120 58 c-6 -8 6 -14 0 -22"/>`,

    pasta: `
      <path class="p" d="M30 92 C34 124 64 134 100 134 C136 134 166 124 170 92 Z"/>
      <path class="t" d="M44 108 q10 14 26 20 M58 104 q8 14 22 22 M156 106 q-6 12 -20 20"/>
      <ellipse class="p" cx="100" cy="92" rx="70" ry="18"/>
      <path class="s" d="M48 92 C58 80 70 98 82 86 C94 74 104 96 118 84 C130 74 140 94 152 90"/>
      <path class="t" d="M56 98 C68 88 80 104 94 94 C108 84 120 102 136 94 M70 86 C80 76 90 90 100 80"/>
      <circle class="f" cx="78" cy="92" r="5"/><circle class="f" cx="140" cy="88" r="4"/>
      <path class="s" d="M116 72 C116 62 142 62 142 72 C142 84 116 84 116 72 M118 80 C120 92 138 92 140 80 M122 86 C118 94 110 92 106 98"/>
      <g transform="translate(130 70) rotate(40)">
        <path class="s" d="M0 -78 V-16 M-8 -16 Q0 -10 8 -16 M-8 -16 V6 M-3 -14 V8 M3 -14 V8 M8 -16 V6"/>
      </g>
      ${leaf(96, 80, -40, 0.3, "f")}`,

    wine: `
      <path class="p" d="M58 140 V64 C58 52 68 46 70 38 V12 H82 V38 C84 46 94 52 94 64 V140 Z"/>
      <rect class="f" x="68" y="6" width="16" height="10" rx="2"/>
      <rect class="p" x="58" y="78" width="36" height="34"/>
      <path class="t" d="M66 90 H86 M70 98 H82"/>
      <path class="t" d="M64 118 V136 M70 118 V136 M76 118 V136 M82 118 V136 M88 118 V136"/>
      <g transform="translate(140 52) scale(.58)">${glass(0, 0)}</g>`
  };

  function dishFor(recipe) {
    const text = (recipe.title || "") + " " + (recipe.description || "");
    if (/דג|סלמון|לברק|דניס|טונה|בורי/.test(text)) return "fish";
    if (/קציצ|עוף|בשר|פרגית|שניצל|כבד/.test(text)) return "pan";
    return "pasta";
  }

  const dish = (name, cls = "") => svg("0 0 200 150", DISHES[name] || DISHES.pasta, "art-dish " + cls);

  return { hero, dish, dishFor };
})();
