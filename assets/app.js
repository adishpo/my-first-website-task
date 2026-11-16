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

  function renderMarquee() {
    const el = $("#marquee span");
    if (!el) return;
    const newest = recipes[0];
    el.textContent =
      "🍓 ברוכים הבאים לספר המתכונים של עדי 🧁 " +
      (newest ? `מתכון חדש: ${newest.title} 🍋 ` : "") +
      'לא יודעים מה להכין? נסו את כפתור "מתכון אקראי" 🍒';
  }

  function renderWebring(current) {
    const el = $("#webring");
    if (!el || !recipes.length) return;
    let prev, next;
    const i = current ? recipes.findIndex((r) => r.id === current.id) : -1;
    if (i === -1) { prev = recipes[recipes.length - 1]; next = recipes[0]; }
    else { prev = recipes[(i - 1 + recipes.length) % recipes.length]; next = recipes[(i + 1) % recipes.length]; }
    el.innerHTML = `« <a href="${recipeUrl(prev)}">הקודם</a> | ☺ טבעת המתכונים ☺ | <a href="${recipeUrl(next)}">הבא</a> »`;
  }

  function cursorTrail() {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = ["✦", "♥", "✧", "🍓", "🍋", "🧁", "🍒"];
    const colors = ["#ff5fc8", "#a48ff0", "#3fc4a3", "#e6d43a", "#7fc4ff"];
    let last = 0;
    addEventListener("mousemove", (e) => {
      if (Date.now() - last < 45) return;
      last = Date.now();
      const s = document.createElement("div");
      s.className = "sparkle";
      s.textContent = chars[Math.floor(Math.random() * chars.length)];
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.color = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
    });
  }

  /* ---------- food decorations ---------- */
  const INK = 'stroke="#3d3566" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const FOOD = {
    cupcake: `<path d="M24 56 L76 56 L68 92 L32 92 Z" fill="#ffb3e3" ${INK}/>
      <path d="M38 57 L41 91 M50 57 L50 91 M62 57 L59 91" fill="none" stroke="#3d3566" stroke-width="2"/>
      <path d="M18 58 C13 46 24 39 30 42 C28 30 42 26 48 32 C51 20 67 22 66 34 C77 32 85 45 80 58 Z" fill="#c9b8ff" ${INK}/>
      <path d="M34 48 l5 -2 M50 41 l3 4 M63 47 l5 -1 M44 53 l-4 -2 M70 53 l3 -3" stroke="#fff27a" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M56 16 Q58 7 67 4" fill="none" ${INK}/>
      <circle cx="56" cy="22" r="7" fill="#ff5f7e" ${INK}/>`,
    strawberry: `<path d="M50 92 C30 80 14 60 18 42 C22 28 38 26 50 30 C62 26 78 28 82 42 C86 60 70 80 50 92 Z" fill="#ff6f91" ${INK}/>
      <g fill="#fff27a"><ellipse cx="36" cy="46" rx="2.5" ry="3.5"/><ellipse cx="50" cy="44" rx="2.5" ry="3.5"/><ellipse cx="64" cy="46" rx="2.5" ry="3.5"/><ellipse cx="42" cy="60" rx="2.5" ry="3.5"/><ellipse cx="58" cy="60" rx="2.5" ry="3.5"/><ellipse cx="50" cy="75" rx="2.5" ry="3.5"/><ellipse cx="29" cy="57" rx="2.5" ry="3.5"/><ellipse cx="71" cy="57" rx="2.5" ry="3.5"/></g>
      <path d="M30 32 L40 18 L46 28 L50 11 L54 28 L60 18 L70 32 C62 37 38 37 30 32 Z" fill="#6fe3c6" ${INK}/>`,
    egg: `<path d="M20 52 C14 30 34 16 52 20 C70 14 90 30 84 50 C92 70 74 88 54 82 C36 92 12 78 20 52 Z" fill="#fff" ${INK}/>
      <circle cx="52" cy="50" r="18" fill="#fff27a" ${INK}/>
      <ellipse cx="46" cy="47" rx="2.2" ry="4" fill="#3d3566"/><ellipse cx="58" cy="47" rx="2.2" ry="4" fill="#3d3566"/>
      <path d="M45 55 Q52 62 59 55" fill="none" ${INK}/>`,
    lemon: `<circle cx="50" cy="50" r="42" fill="#fff27a" ${INK}/>
      <circle cx="50" cy="50" r="33" fill="#ffe94d" stroke="#e6d43a" stroke-width="2"/>
      <path d="M50 18 L50 82 M18 50 L82 50 M27 27 L73 73 M73 27 L27 73" stroke="#fffbd0" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="4" fill="#fffbd0"/>`,
    donut: `<circle cx="50" cy="50" r="40" fill="#f2c48d" ${INK}/>
      <path d="M50 15 C66 12 80 22 84 36 C89 50 81 58 84 66 C78 82 62 88 50 84 C36 90 22 82 18 68 C12 56 18 46 16 36 C22 22 36 15 50 15 Z" fill="#ffb3e3" ${INK}/>
      <path d="M30 34 l5 3 M62 26 l4 4 M71 52 l-2 5 M36 67 l5 -2 M57 72 l4 2 M26 50 l1 5 M46 26 l5 -1" stroke="#6fe3c6" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M40 22 l-1 5 M74 40 l4 1 M66 64 l3 3 M24 60 l4 -2" stroke="#fff27a" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="11" fill="#fff" ${INK}/>`,
    fish: `<path d="M72 50 L92 33 L88 50 L92 67 Z" fill="#c9b8ff" ${INK}/>
      <path d="M12 50 C26 27 58 26 76 50 C58 74 26 73 12 50 Z" fill="#a9dcff" ${INK}/>
      <path d="M46 39 Q53 50 46 61 M57 41 Q63 50 57 59" fill="none" stroke="#3d3566" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="28" cy="46" r="4" fill="#3d3566"/><circle cx="29.3" cy="44.7" r="1.3" fill="#fff"/>
      <path d="M19 54 Q23 57 28 55" fill="none" stroke="#3d3566" stroke-width="2.5" stroke-linecap="round"/>`,
    cherry: `<path d="M34 58 Q44 30 62 14 M64 62 Q61 36 62 14" fill="none" ${INK}/>
      <path d="M62 14 C72 5 86 9 88 18 C78 24 68 22 62 14 Z" fill="#6fe3c6" ${INK}/>
      <circle cx="34" cy="70" r="14" fill="#ff5f7e" ${INK}/><circle cx="64" cy="74" r="14" fill="#ff5f7e" ${INK}/>
      <ellipse cx="29" cy="65" rx="3" ry="4.5" fill="#fff" opacity=".8"/><ellipse cx="59" cy="69" rx="3" ry="4.5" fill="#fff" opacity=".8"/>`
  };
  const sticker = (name, cls) =>
    `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${FOOD[name]}</svg>`;

  function foodDecor() {
    const desk = $(".desktop");
    if (desk) {
      desk.insertAdjacentHTML("afterbegin",
        ["cupcake", "strawberry", "egg", "lemon", "donut", "fish", "cherry"]
          .map((f) => sticker(f, "food f-" + f)).join(""));
    }
    const h1 = $(".site-header h1 a");
    if (h1) {
      h1.insertAdjacentHTML("afterbegin", sticker("strawberry", "h1-food"));
      h1.insertAdjacentHTML("beforeend", sticker("cupcake", "h1-food"));
    }
  }

  const CAT_ICONS = {
    "עיקריות": "🍲", "מנות עיקריות": "🍲", "קינוחים": "🧁", "עוגות": "🍰", "עוגיות": "🍪",
    "סלטים": "🥗", "מרקים": "🥣", "מאפים": "🥐", "לחמים": "🍞", "תוספות": "🍚",
    "ארוחת בוקר": "🍳", "דגים": "🐟", "פסטה": "🍝", "שתייה": "🥤", "משקאות": "🥤"
  };
  const catIcon = (cat) => CAT_ICONS[cat] || "🍴";

  function favButton(r) {
    const on = isFav(r.id);
    return `<button class="fav" type="button" data-fav="${esc(r.id)}" aria-pressed="${on}" aria-label="הוספה למועדפים" title="מועדפים">♥</button>`;
  }

  /* ---------- home page ---------- */
  function initHome() {
    const params = new URLSearchParams(location.search);
    let active = params.get("cat") || ALL;
    if (active !== ALL && active !== FAVS && !recipes.some((r) => r.category === active)) active = ALL;

    const search = $("#search");
    const grid = $("#grid");
    const status = $("#status");
    search.value = params.get("q") || "";

    const normalize = (s) => String(s).toLowerCase().replace(/[\u0591-\u05C7]/g, "");
    const haystack = (r) => normalize([r.title, r.category, ...r.ingredients.flatMap((g) => g.items)].join(" "));

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

    const titleColors = ["", "mint", "sun"];
    function render() {
      renderMenu(active);
      const list = filtered();
      const newestId = recipes[0] && recipes[0].id;
      status.textContent = list.length === 1 ? "נמצא מתכון אחד" : list.length ? `נמצאו ${list.length} מתכונים` : "";
      if (!list.length) {
        grid.innerHTML = `<div class="win empty" style="grid-column:1/-1"><div class="content">${
          active === FAVS && !favorites.size
            ? "עדיין אין מועדפים. לחצו על ♥ במתכון כדי לשמור אותו כאן."
            : "לא נמצאו מתכונים. נסו חיפוש אחר ☺"
        }</div></div>`;
        return;
      }
      grid.innerHTML = list.map((r, i) => {
        const style = i % 4 === 1 ? " checker" : i % 3 === 0 ? " stack" : "";
        const time = r.totalMinutes ? ` · ⏱ ${r.totalMinutes} דק׳` : "";
        return `<article class="win card${style}">
          ${r.id === newestId ? '<div class="badge-new">חדש!</div>' : ""}
          <div class="titlebar ${titleColors[i % 3]}"><span class="t">${catIcon(r.category)} ${esc(r.category)}</span><div class="ctl" aria-hidden="true"><span>✕</span></div></div>
          <div class="content">
            <h3><a href="${recipeUrl(r)}">${esc(r.title)}</a></h3>
            <small>${esc(r.category)}${time}</small>
            ${favButton(r)}
          </div>
        </article>`;
      }).join("");
    }

    $("#menu").addEventListener("click", (e) => {
      const a = e.target.closest("a[data-cat]");
      if (!a) return;
      e.preventDefault();
      active = a.dataset.cat;
      syncUrl();
      render();
    });
    grid.addEventListener("click", (e) => {
      const b = e.target.closest("[data-fav]");
      if (!b) return;
      b.setAttribute("aria-pressed", toggleFav(b.dataset.fav));
      if (active === FAVS) render();
    });
    search.addEventListener("input", () => { syncUrl(); render(); });
    $("#random").addEventListener("click", () => randomRecipe(filtered()));

    renderWebring(null);
    render();
  }

  /* ---------- recipe page ---------- */
  function initRecipe() {
    const id = new URLSearchParams(location.search).get("id");
    const r = recipes.find((x) => x.id === id);
    const main = $("#recipe");
    renderMenu(r ? r.category : null);
    renderWebring(r);

    if (!r) {
      main.innerHTML = `<div class="titlebar"><span class="t" dir="ltr">error.exe</span><div class="ctl" aria-hidden="true"><span>✕</span></div></div>
        <div class="content"><h2>אופס! המתכון לא נמצא</h2><p><a href="index.html">חזרה לכל המתכונים</a></p></div>`;
      return;
    }

    document.title = r.title + " | ספר המתכונים של עדי";
    const checkKey = "adi-recipes:checked:" + r.id;
    const checked = new Set(store.get(checkKey, []));
    let n = 0;
    const ingredients = r.ingredients.map((g) => {
      const head = g.title ? `<h5>${esc(g.title)}</h5>` : "";
      const items = g.items.map((item) => {
        const key = n++;
        return `<li><label><input type="checkbox" data-i="${key}"${checked.has(key) ? " checked" : ""}> <span>${esc(item)}</span></label></li>`;
      }).join("");
      return head + `<ul>${items}</ul>`;
    }).join("");

    const meta = [
      r.prepTime && `<span>⏱ הכנה: ${esc(r.prepTime)}</span>`,
      r.cookTime && `<span>🔥 בישול/אפייה: ${esc(r.cookTime)}</span>`,
      `<a href="index.html?cat=${encodeURIComponent(r.category)}">${catIcon(r.category)} ${esc(r.category)}</a>`
    ].filter(Boolean).join("");

    const fav = isFav(r.id);
    main.innerHTML = `
      <div class="titlebar"><span class="t" dir="ltr">${esc(r.id)}.txt</span><div class="ctl" aria-hidden="true"><span>_</span><span>□</span><span>✕</span></div></div>
      <div class="content">
        <h2>${esc(r.title)}</h2>
        <div class="recipe-meta">${meta}</div>
        <div class="recipe-actions">
          <button class="btn pink" id="fav" type="button" aria-pressed="${fav}">${fav ? "♥ במועדפים" : "♡ הוספה למועדפים"}</button>
          <button class="btn mint" id="wake" type="button" aria-pressed="false">☀ מסך דולק</button>
          <button class="btn sun" id="random" type="button">🎲 מתכון אקראי</button>
        </div>
        <div class="recipe-body">
          <section class="panel">
            <h4>🥕 מצרכים</h4>
            ${ingredients}
            <button class="btn reset" id="reset" type="button">↺ ניקוי סימונים</button>
          </section>
          <section class="panel steps">
            <h4>🥄 אופן ההכנה</h4>
            <ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
          </section>
        </div>
        ${r.source && r.source.url ? `<div class="src">מקור: <a href="${esc(r.source.url)}" target="_blank" rel="noopener">${esc(r.source.label || "למתכון המקורי")} ↗</a></div>` : ""}
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

  foodDecor();
  renderMarquee();
  cursorTrail();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "recipe") initRecipe();
})();
