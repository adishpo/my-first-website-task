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

  /* ---------- hero: a pot of soup with vegetables, drawn freehand ---------- */
  function hero() {
    /* a round, slightly lopsided tomato centred at (x, y) with radius r */
    const tomato = (x, y, r) => `
      <path class="p w" d="M${x - r} ${y + 2} C${x - r - 2} ${y - r * .7} ${x - r * .45} ${y - r - 2} ${x + 2} ${y - r}
        C${x + r * .7} ${y - r + 1} ${x + r + 2} ${y - r * .5} ${x + r} ${y + 3}
        C${x + r - 2} ${y + r * .75} ${x + r * .35} ${y + r + 2} ${x - 3} ${y + r}
        C${x - r * .7} ${y + r - 2} ${x - r + 1} ${y + r * .55} ${x - r} ${y + 2} Z"/>
      <path class="t" d="M${x - r * .62} ${y - r * .2} C${x - r * .55} ${y - r * .5} ${x - r * .3} ${y - r * .66} ${x - r * .05} ${y - r * .7}"/>
      <path class="t" d="M${x + r * .55} ${y + r * .2} C${x + r * .5} ${y + r * .45} ${x + r * .35} ${y + r * .6} ${x + r * .15} ${y + r * .7}"/>
      <path class="f" d="M${x} ${y - r + 3} C${x - 7} ${y - r - 2} ${x - 14} ${y - r + 1} ${x - 19} ${y - r - 3}
        C${x - 12} ${y - r - 6} ${x - 6} ${y - r - 5} ${x - 1} ${y - r - 2} C${x - 3} ${y - r - 9} ${x} ${y - r - 15} ${x + 5} ${y - r - 17}
        C${x + 5} ${y - r - 11} ${x + 4} ${y - r - 6} ${x + 2} ${y - r - 2} C${x + 8} ${y - r - 6} ${x + 15} ${y - r - 6} ${x + 21} ${y - r - 3}
        C${x + 15} ${y - r} ${x + 8} ${y - r + 1} ${x} ${y - r + 3} Z"/>`;

    /* a rounded basil leaf from (x, y), pointing along `rot` */
    const basil = (x, y, rot, sc = 1) => `
      <g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">
        <path class="p" d="M0 0 C6 -14 24 -21 40 -14 C50 -9 54 -2 56 1 C48 9 30 15 14 11 C6 9 2 5 0 0 Z"/>
        <path class="t" d="M2 0 C18 -3 36 -3 52 0 M16 -2 L22 -10 M28 -2 L34 -11 M16 -1 L21 7 M30 -1 L35 8"/>
      </g>`;

    return svg("0 110 560 400", `
      <!-- table line and a little shading under it -->
      <path class="s" d="M14 456 C90 451 170 458 250 454 C330 450 420 457 548 452"/>
      <path class="t" d="M30 470 l18 -6 M62 472 l18 -6 M440 470 l18 -6 M476 471 l18 -6 M510 469 l16 -5"/>

      <!-- steam -->
      <path class="s" d="M206 262 C192 242 220 230 208 208 C198 190 216 178 211 160"/>
      <path class="s" d="M256 252 C240 226 272 214 256 186 C246 168 266 154 260 132"/>
      <path class="s" d="M306 262 C294 244 318 232 306 210 C300 198 308 190 306 180"/>
      <path class="t" d="M176 230 l-6 -6 M336 222 l7 -5 M232 150 l-2 -8 M290 168 l4 -7"/>

      <!-- wooden spoon resting in the pot -->
      <path class="p" d="M417 136 C421 129 429 133 431 141 C405 194 380 244 352 302 L338 298 C366 240 392 188 417 136 Z"/>
      <path class="t" d="M422 146 C404 186 386 222 368 262 M426 150 C414 176 402 200 392 222"/>

      <!-- the pot -->
      <path class="s w" d="M130 328 C106 320 98 344 126 349 M376 328 C400 320 408 344 380 349"/>
      <path class="p w" d="M131 300 C127 356 136 416 168 440 C206 460 302 461 338 441 C369 418 378 360 375 300 Z"/>
      <path class="s" d="M134 334 C196 348 310 348 373 334"/>
      <path class="t" d="M352 344 C354 372 350 400 338 424 M338 348 C340 376 336 402 326 422 M162 350 C160 380 166 404 176 424"/>
      <path class="t" d="M196 446 l8 4 M300 448 l-8 4"/>
      <path class="p w" d="M119 299 C146 279 352 277 388 296 C392 307 358 318 252 319 C152 319 115 311 119 299 Z"/>
      <path class="f" d="M137 302 C170 291 336 290 370 300 C352 310 162 312 137 302 Z"/>
      <path class="p" d="M168 300 c4 -3 10 -2 11 1 c-3 3 -9 3 -11 -1 Z M214 297 c4 -3 9 -2 10 1 c-3 3 -8 3 -10 -1 Z M290 298 c4 -3 10 -2 11 1 c-3 3 -9 3 -11 -1 Z M326 302 c3 -2 8 -1 9 1 c-3 2 -7 2 -9 -1 Z"/>
      <path class="s" d="M116 302 C113 293 121 288 131 286"/>

      <!-- garlic -->
      <path class="p w" d="M80 382 C62 390 44 412 50 440 C60 455 104 454 113 441 C121 414 110 391 92 382 C88 373 90 364 86 352 C82 363 84 373 80 382 Z"/>
      <path class="t" d="M85 386 C73 402 70 428 79 450 M89 386 C101 402 103 428 96 450 M70 398 C62 412 60 430 64 446"/>
      <path class="t" d="M68 452 l-5 6 M80 454 l-1 7 M94 453 l5 6"/>

      <!-- half a lemon -->
      <g transform="translate(390 440) scale(1.35) translate(-392 -440)">
      <path class="p w" d="M360 440 C360 460 424 461 425 440 Z"/>
      <path class="p w" d="M360 440 C362 428 422 426 425 440 C423 451 362 452 360 440 Z"/>
      <path class="t" d="M368 440 C371 432 414 431 417 440 C414 447 371 448 368 440 Z"/>
      <path class="t" d="M392 440 L374 437 M392 440 L384 432 M392 440 L402 432 M392 440 L412 437 M392 440 L410 445 M392 440 L392 447 M392 440 L374 444"/>
      </g>

      <!-- tomatoes on the vine -->
      <path class="s" d="M470 380 C474 356 498 346 518 360 C526 366 528 380 525 398"/>
      ${tomato(472, 420, 33)}
      ${tomato(524, 432, 25)}

      <!-- basil sprig in front -->
      <path class="s" d="M140 488 C200 478 262 482 330 470"/>
      ${basil(170, 484, -38, 1.05)}${basil(208, 481, 28, 1)}${basil(246, 480, -30, .95)}${basil(282, 477, 32, .9)}${basil(316, 472, -18, .85)}
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

    muffin: `
      <path class="s" d="M14 136 C60 133 120 137 190 134"/>
      <path class="p w" d="M64 84 L136 84 L126 133 C108 137 92 137 74 133 Z"/>
      <path class="t" d="M76 88 L82 132 M88 88 L92 134 M100 88 L100 135 M112 88 L108 134 M124 88 L118 132"/>
      <path class="p w" d="M58 86 C50 68 64 50 82 52 C88 38 112 36 120 50 C138 46 150 66 142 86 C124 94 76 94 58 86 Z"/>
      <path class="t" d="M74 66 l4 3 M92 58 l5 1 M110 62 l3 4 M126 70 l4 -2 M84 78 l5 0 M104 76 l4 2 M68 76 l2 4 M132 80 l3 -3"/>
      <path class="p" d="M90 46 C92 38 108 36 112 44 C108 50 94 51 90 46 Z"/>
      <path class="t" d="M97 44 l3 2 M104 43 l2 3"/>
      <path class="p w" d="M146 128 C166 126 182 110 186 86 C187 81 192 81 193 87 C193 116 172 136 146 136 C139 135 139 129 146 128 Z"/>
      <path class="t" d="M152 131 C170 128 184 114 189 94"/>
      <path class="f" d="M186 86 l1 -8 l5 1 l-1 8 Z"/>
      <ellipse class="p" cx="30" cy="128" rx="7" ry="4" transform="rotate(-20 30 128)"/>
      <ellipse class="p" cx="44" cy="131" rx="6" ry="3.5" transform="rotate(15 44 131)"/>
      <ellipse class="p" cx="36" cy="120" rx="6" ry="3.5" transform="rotate(40 36 120)"/>`,

    cookies: `
      <path class="s" d="M14 136 C60 133 120 137 190 134"/>
      <path class="p w" d="M48 120 C46 108 70 100 100 100 C130 100 154 106 152 120 C152 132 126 136 100 136 C72 136 48 132 48 120 Z"/>
      <path class="p w" d="M54 102 C52 90 74 82 100 82 C128 82 148 88 146 102 C146 114 124 118 100 118 C76 118 54 114 54 102 Z"/>
      <path class="p w" d="M60 80 C56 64 74 52 98 52 C126 52 144 62 142 78 C142 92 122 98 100 98 C78 98 62 94 60 80 Z"/>
      <path class="f" d="M80 64 l7 -2 l2 6 l-7 2 Z M108 60 l6 1 l-1 6 l-6 -1 Z M124 74 l6 -2 l2 6 l-6 2 Z M92 80 l6 0 l0 6 l-6 0 Z M72 84 l5 -2 l2 5 l-5 2 Z"/>
      <path class="f" d="M74 108 l5 -1 l1 5 l-5 1 Z M128 108 l5 0 l0 5 l-5 0 Z M68 126 l5 -1 l1 5 l-5 1 Z M118 128 l5 -1 l1 5 l-5 1 Z"/>
      <path class="t" d="M68 70 c4 -3 8 -3 12 0 M112 86 c3 -2 7 -2 10 0 M100 66 c2 -2 5 -2 7 0"/>
      <path class="p w" d="M158 116 C158 104 176 100 186 108 C182 114 182 122 188 128 C178 136 158 130 158 116 Z"/>
      <path class="f" d="M166 112 l4 -1 l1 4 l-4 1 Z M170 124 l4 0 l0 4 l-4 0 Z"/>
      <path class="f" d="M30 130 l5 -2 l2 5 l-5 2 Z M40 124 l4 -1 l1 4 l-4 1 Z"/>`,

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
    if (/עוגיו|עוגיה|קוקיז/.test(text)) return "cookies";
    if (/מאפינ|עוג|בננה|מאפה|קאפקייק/.test(text) || recipe.category === "מאפים") return "muffin";
    return "pasta";
  }

  const dish = (name, cls = "") => svg("0 0 200 150", DISHES[name] || DISHES.pasta, "art-dish " + cls);

  return { hero, dish, dishFor };
})();
