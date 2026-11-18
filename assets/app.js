(function () {
  "use strict";

  const recipes = (window.RECIPES || []).slice().sort((a, b) => (b.added || "").localeCompare(a.added || ""));
  const FAV_KEY = "adi-recipes:favorites";
  const ALL = "הכל";
  const FAVS = "favorites";

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const recipeUrl = (r) => "recipe.html?id=" + encodeURIComponent(r.id);

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    }
  };

  const favorites = new Set(store.get(FAV_KEY, []));
  const isFav = (id) => favorites.has(id);
  function toggleFav(id) {
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    store.set(FAV_KEY, [...favorites]);
    return favorites.has(id);
  }

  function categories() {
    const counts = new Map();
    recipes.forEach((r) => counts.set(r.category, (counts.get(r.category) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "he"));
  }

  function randomRecipe(pool) {
    const list = pool && pool.length ? pool : recipes;
    if (!list.length) return;
    location.href = recipeUrl(list[Math.floor(Math.random() * list.length)]);
  }

  /* ---------- cartoon mascots (original drawings, 120x140) ---------- */
  const INK = "#3b2e2c";
  const S = `stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`;
  const limb = (x1, y1, x2, y2, bend) =>
    `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + bend} ${(y1 + y2) / 2} ${x2} ${y2}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  const glove = (x, y) => `<circle cx="${x + 4}" cy="${y - 4}" r="3.6" fill="#fff" ${S}/><circle cx="${x}" cy="${y}" r="7.5" fill="#fff" ${S}/>`;
  const shoe = (x, y) =>
    `<ellipse cx="${x}" cy="${y}" rx="11" ry="6.5" fill="#e8572a" ${S}/><path d="M${x - 8} ${y + 2.5} H${x + 8}" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;
  const face = (cx, cy) => `
    <ellipse cx="${cx - 9}" cy="${cy - 4}" rx="6.5" ry="8" fill="#fff" ${S}/>
    <ellipse cx="${cx + 9}" cy="${cy - 4}" rx="6.5" ry="8" fill="#fff" ${S}/>
    <circle cx="${cx - 7}" cy="${cy - 2}" r="3.2" fill="${INK}"/><circle cx="${cx + 11}" cy="${cy - 2}" r="3.2" fill="${INK}"/>
    <path d="M${cx - 16} ${cy - 15} L${cx - 4} ${cy - 12} M${cx + 4} ${cy - 12} L${cx + 16} ${cy - 15}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${cx - 18}" cy="${cy + 7}" r="4" fill="#ff7a5c" opacity=".55"/><circle cx="${cx + 18}" cy="${cy + 7}" r="4" fill="#ff7a5c" opacity=".55"/>
    <path d="M${cx - 11} ${cy + 7} Q${cx} ${cy + 23} ${cx + 11} ${cy + 7} Z" fill="${INK}" ${S}/>
    <path d="M${cx - 5} ${cy + 14} Q${cx} ${cy + 19} ${cx + 5} ${cy + 14} Q${cx} ${cy + 11} ${cx - 5} ${cy + 14} Z" fill="#ff7a8a"/>`;

  const MASCOTS = {
    tomato:
      limb(50, 94, 45, 120, -4) + limb(70, 94, 77, 120, 4) + shoe(43, 124) + shoe(80, 124) +
      limb(30, 62, 13, 40, -6) + limb(90, 70, 107, 86, 6) +
      `<circle cx="60" cy="64" r="34" fill="#ec4b2f" ${S}/>
       <ellipse cx="42" cy="46" rx="7" ry="4" fill="#fff" opacity=".55" transform="rotate(-35 42 46)"/>
       <path d="M60 33 C52 31 46 27 43 24 C51 23 56 25 60 29 C60 22 62 17 66 15 C67 21 65 26 62 29 C66 26 72 24 79 25 C74 29 68 32 60 33 Z" fill="#7cb85a" ${S}/>` +
      face(60, 66) + glove(13, 38) + glove(107, 88),
    egg:
      limb(50, 96, 45, 120, -3) + limb(70, 96, 77, 120, 3) + shoe(43, 124) + shoe(80, 124) +
      limb(27, 72, 11, 88, -4) + limb(92, 58, 108, 40, 6) +
      `<path d="M60 30 C84 28 98 46 94 66 C100 88 80 100 60 97 C38 102 20 88 24 68 C18 46 36 30 60 30 Z" fill="#fffaf0" ${S}/>
       <ellipse cx="36" cy="46" rx="6" ry="3.5" fill="#e9dcc0" transform="rotate(-40 36 46)"/>
       <circle cx="60" cy="64" r="23" fill="#f4b83a" ${S}/>` +
      face(60, 66) + glove(10, 90) + glove(108, 38),
    cupcake:
      limb(50, 108, 45, 122, -3) + limb(70, 108, 77, 122, 3) + shoe(43, 126) + shoe(80, 126) +
      limb(33, 92, 14, 106, -4) + limb(87, 90, 106, 70, 5) +
      `<path d="M30 74 L90 74 L82 110 L38 110 Z" fill="#f4b83a" ${S}/>
       <path d="M45 77 L48 108 M60 77 V108 M75 77 L72 108" stroke="${INK}" stroke-width="2.5" opacity=".45"/>
       <path d="M24 76 C18 62 30 52 38 54 C36 40 50 34 58 40 C62 28 80 30 80 44 C92 42 100 56 96 76 Z" fill="#ffc2d6" ${S}/>
       <path d="M38 64 l5 -2 M50 49 l3 4 M72 50 l5 1 M85 62 l-2 4 M30 68 l4 2 M64 60 l4 -2" stroke="#8cc3ea" stroke-width="3.5" stroke-linecap="round"/>
       <path d="M62 24 Q64 14 73 11" fill="none" ${S}/>
       <circle cx="62" cy="30" r="7" fill="#e23b2e" ${S}/>` +
      face(60, 90) + glove(13, 108) + glove(107, 67)
  };
  const MASCOT_NAMES = Object.keys(MASCOTS);
  const mascot = (name, cls) =>
    `<svg class="${cls}" viewBox="0 0 120 140" aria-hidden="true" focusable="false">${MASCOTS[name]}</svg>`;

  function decorate() {
    const head = $(".masthead");
    if (head) head.insertAdjacentHTML("beforeend", mascot("tomato", "mascot m-left") + mascot("egg", "mascot m-right"));
    const pic = $("#hero-pic");
    if (pic) pic.innerHTML = mascot("cupcake", "");
  }

  function startClock() {
    const el = $("#clock");
    if (!el) return;
    const tick = () => {
      const d = new Date();
      const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
      el.innerHTML = `${time}<br>${date}`;
    };
    tick();
    setInterval(tick, 30000);
  }

  function renderMenu(active) {
    const nav = $("#menu");
    if (!nav) return;
    const link = (key, label, count) => {
      const href = key === ALL ? "index.html" : "index.html?cat=" + encodeURIComponent(key);
      const current = key === active ? ' aria-current="page"' : "";
      const c = count != null ? ` <span class="count">(${count})</span>` : "";
      return `<a href="${href}" data-cat="${esc(key)}"${current}>${esc(label)}${c}</a>`;
    };
    nav.innerHTML =
      link(ALL, ALL, recipes.length) +
      categories().map(([cat, n]) => link(cat, cat, n)).join("") +
      link(FAVS, "♥ מועדפים");
  }

  function renderPrevNext(current) {
    const el = $("#prev-next");
    if (!el || !current || recipes.length < 2) return;
    const i = recipes.findIndex((r) => r.id === current.id);
    const prev = recipes[(i - 1 + recipes.length) % recipes.length];
    const next = recipes[(i + 1) % recipes.length];
    el.innerHTML =
      `<a class="pill-btn small" href="${recipeUrl(prev)}">→ המתכון הקודם</a>` +
      `<a class="pill-btn small" href="${recipeUrl(next)}">המתכון הבא ←</a>`;
  }

  function favButton(r) {
    const on = isFav(r.id);
    return `<button class="fav" type="button" data-fav="${esc(r.id)}" aria-pressed="${on}" aria-label="הוספה למועדפים" title="מועדפים">♥</button>`;
  }

  const describe = (r) => r.description || r.ingredients.flatMap((g) => g.items).slice(0, 3).join(" · ");

  /* ---------- home page ---------- */
  function initHome() {
    const params = new URLSearchParams(location.search);
    let active = params.get("cat") || ALL;
    if (active !== ALL && active !== FAVS && !recipes.some((r) => r.category === active)) active = ALL;

    const search = $("#search");
    const grid = $("#grid");
    const status = $("#status");
    search.value = params.get("q") || "";

    const normalize = (s) => String(s).toLowerCase().replace(/[֑-ׇ]/g, "");
    const haystack = (r) => normalize([r.title, r.category, r.description || "", ...r.ingredients.flatMap((g) => g.items)].join(" "));

    function filtered() {
      const q = normalize(search.value.trim());
      return recipes.filter((r) => {
        if (active === FAVS && !isFav(r.id)) return false;
        if (active !== ALL && active !== FAVS && r.category !== active) return false;
        return !q || q.split(/\s+/).every((w) => haystack(r).includes(w));
      });
    }

    function syncUrl() {
      const p = new URLSearchParams();
      if (active !== ALL) p.set("cat", active);
      if (search.value.trim()) p.set("q", search.value.trim());
      const qs = p.toString();
      history.replaceState(null, "", qs ? "?" + qs : location.pathname);
    }

    function dish(r, newestId) {
      const time = r.totalMinutes ? `<span class="time">${r.totalMinutes} דק׳</span>` : "";
      const badge = r.id === newestId ? '<span class="badge-new">חדש!</span>' : "";
      return `<article class="dish">
          <h4 class="t-3"><a href="${recipeUrl(r)}">${esc(r.title)}</a>${badge}</h4>
          ${time}
          <p>${esc(describe(r))}</p>
          ${favButton(r)}
        </article>`;
    }

    function render() {
      renderMenu(active);
      $("#tool-favs").setAttribute("aria-pressed", String(active === FAVS));
      const list = filtered();
      const newestId = recipes[0] && recipes[0].id;
      status.textContent = list.length === 1 ? "נמצא מתכון אחד" : list.length ? `נמצאו ${list.length} מתכונים` : "";
      if (!list.length) {
        grid.innerHTML = `<div class="empty">${mascot("egg", "")}${
          active === FAVS && !favorites.size
            ? "עדיין אין מועדפים. לחצו על ♥ במתכון כדי לשמור אותו כאן."
            : "לא נמצאו מתכונים. נסו חיפוש אחר ☺"
        }</div>`;
        return;
      }
      const order = categories().map(([c]) => c);
      const groups = order.map((cat) => [cat, list.filter((r) => r.category === cat)]).filter(([, items]) => items.length);
      grid.innerHTML = groups.map(([cat, items], i) => `
        <section class="cat-sec${i % 2 === 0 ? " boxed" : ""}">
          <h3 class="t-2">${mascot(MASCOT_NAMES[i % MASCOT_NAMES.length], "")}<span>${esc(cat)}</span></h3>
          <div class="dishes">${items.map((r) => dish(r, newestId)).join("")}</div>
        </section>`).join("");
    }

    function update() { syncUrl(); render(); }

    $("#menu").addEventListener("click", (e) => {
      const a = e.target.closest("a[data-cat]");
      if (!a) return;
      e.preventDefault();
      active = a.dataset.cat;
      update();
    });
    grid.addEventListener("click", (e) => {
      const b = e.target.closest("[data-fav]");
      if (!b) return;
      b.setAttribute("aria-pressed", toggleFav(b.dataset.fav));
      if (active === FAVS) render();
    });
    search.addEventListener("input", update);
    $("#random").addEventListener("click", () => randomRecipe(filtered()));
    $("#tool-favs").addEventListener("click", () => { active = active === FAVS ? ALL : FAVS; update(); });
    $("#tool-clear").addEventListener("click", () => { search.value = ""; update(); search.focus(); });
    $("#tool-all").addEventListener("click", () => { active = ALL; search.value = ""; update(); });

    render();
  }

  /* ---------- recipe page ---------- */
  function initRecipe() {
    const id = new URLSearchParams(location.search).get("id");
    const r = recipes.find((x) => x.id === id);
    const main = $("#recipe");
    renderMenu(r ? r.category : null);
    renderPrevNext(r);

    const bar = () => `<div class="win-bar orange"><span class="pill-url" dir="ltr">${esc(location.host + location.pathname + location.search)}</span><span class="sq" aria-hidden="true"><i>–</i><i>□</i><i>○</i></span></div>`;

    if (!r) {
      main.innerHTML = bar() + `
        <div class="recipe-in not-found">${mascot("egg", "")}
          <h1 class="t-1">אופס! המתכון לא נמצא</h1>
          <p><a class="pill-btn mustard" href="index.html">חזרה לכל המתכונים</a></p>
        </div>`;
      return;
    }

    document.title = r.title + " | ספר המתכונים של עדי";
    const checkKey = "adi-recipes:checked:" + r.id;
    const checked = new Set(store.get(checkKey, []));
    let n = 0;
    const ingredients = r.ingredients.map((g) => {
      const head = g.title ? `<h3 class="t-4">${esc(g.title)}</h3>` : "";
      const items = g.items.map((item) => {
        const key = n++;
        return `<li><label><input type="checkbox" data-i="${key}"${checked.has(key) ? " checked" : ""}> <span>${esc(item)}</span></label></li>`;
      }).join("");
      return head + `<ul>${items}</ul>`;
    }).join("");

    const meta = [
      r.prepTime && `<span>⏱ הכנה: ${esc(r.prepTime)}</span>`,
      r.cookTime && `<span>🔥 בישול/אפייה: ${esc(r.cookTime)}</span>`,
      `<a href="index.html?cat=${encodeURIComponent(r.category)}">🍽 ${esc(r.category)}</a>`
    ].filter(Boolean).join("");

    const fav = isFav(r.id);
    main.innerHTML = bar() + `
      <div class="recipe-in">
        <h1 class="t-1">${esc(r.title)}</h1>
        <div class="recipe-meta">${meta}</div>
        <div class="recipe-actions">
          <button class="pill-btn orange" id="fav" type="button" aria-pressed="${fav}">${fav ? "♥ במועדפים" : "♡ הוספה למועדפים"}</button>
          <button class="pill-btn sky" id="wake" type="button" aria-pressed="false">☀ מסך דולק</button>
          <button class="pill-btn mustard" id="random" type="button">🎲 מתכון אקראי</button>
        </div>
        <div class="recipe-body">
          <section class="panel ingredients">
            <h2 class="t-2">מצרכים</h2>
            <div class="ingredients-box">
              ${ingredients}
              <button class="pill-btn small reset" id="reset" type="button">↺ ניקוי סימונים</button>
            </div>
          </section>
          <section class="panel steps">
            <h2 class="t-2">אופן ההכנה</h2>
            <ol>${r.steps.map((s) => `<li><span>${esc(s)}</span></li>`).join("")}</ol>
          </section>
        </div>
        ${r.source && r.source.url ? `<div class="src">מקור: <a href="${esc(r.source.url)}" target="_blank" rel="noopener">${esc(r.source.label || "למתכון המקורי")} ↗</a></div>` : ""}
        ${mascot("cupcake", "recipe-mascot")}
      </div>`;

    main.addEventListener("change", (e) => {
      const i = e.target.dataset && e.target.dataset.i;
      if (i == null) return;
      e.target.checked ? checked.add(+i) : checked.delete(+i);
      store.set(checkKey, [...checked]);
    });
    $("#reset").addEventListener("click", () => {
      checked.clear();
      store.set(checkKey, []);
      main.querySelectorAll("input[data-i]").forEach((c) => (c.checked = false));
    });
    $("#fav").addEventListener("click", (e) => {
      const on = toggleFav(r.id);
      e.currentTarget.setAttribute("aria-pressed", on);
      e.currentTarget.textContent = on ? "♥ במועדפים" : "♡ הוספה למועדפים";
    });
    $("#random").addEventListener("click", () => randomRecipe(recipes.filter((x) => x.id !== r.id)));
    initWakeLock($("#wake"));
  }

  function initWakeLock(btn) {
    if (!("wakeLock" in navigator)) {
      btn.disabled = true;
      btn.title = "הדפדפן הזה לא תומך בהשארת המסך דולק";
      return;
    }
    let lock = null;
    let wanted = false;
    const update = () => {
      btn.setAttribute("aria-pressed", String(!!lock));
      btn.textContent = lock ? "☀ המסך יישאר דולק" : "☀ מסך דולק";
    };
    async function acquire() {
      try {
        lock = await navigator.wakeLock.request("screen");
        lock.addEventListener("release", () => { lock = null; update(); });
      } catch { lock = null; }
      update();
    }
    btn.addEventListener("click", async () => {
      wanted = !lock;
      if (lock) { await lock.release(); lock = null; update(); }
      else await acquire();
    });
    document.addEventListener("visibilitychange", () => {
      if (wanted && !lock && document.visibilityState === "visible") acquire();
    });
  }

  decorate();
  startClock();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "recipe") initRecipe();
})();
