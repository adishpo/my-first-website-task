(function () {
  "use strict";

  const ART = window.ART;
  const recipes = (window.RECIPES || []).slice().sort((a, b) => (b.added || "").localeCompare(a.added || ""));
  const FAV_KEY = "adi-recipes:favorites";
  const ALL = "all";
  const FAVS = "favorites";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const recipeUrl = (r) => "recipe.html?id=" + encodeURIComponent(r.id);
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/></svg>';

  /* ---------- storage ---------- */
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

  const describe = (r) => r.description || r.ingredients.flatMap((g) => g.items).slice(0, 3).join(" · ");

  /* ---------- shared: header, art, random ---------- */
  let randomPool = () => recipes;

  function goRandom() {
    const list = randomPool();
    const pool = list.length ? list : recipes;
    if (pool.length) location.href = recipeUrl(pool[Math.floor(Math.random() * pool.length)]);
  }

  function initHeader() {
    const header = $(".site-header");
    const toggle = $(".nav-toggle");
    const setOpen = (open) => {
      header.toggleAttribute("data-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", () => setOpen(!header.hasAttribute("data-open")));
    $("#main-nav").addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-random]");
      if (btn) { e.preventDefault(); goRandom(); }
    });
  }

  function markNav(key) {
    $$("#main-nav a").forEach((a) => a.toggleAttribute("aria-current", a.dataset.nav === key));
    $$("#main-nav a[aria-current]").forEach((a) => a.setAttribute("aria-current", "page"));
  }

  function drawArt() {
    $$("[data-art]").forEach((el) => {
      const name = el.dataset.art;
      if (ART[name]) el.innerHTML = ART[name]();
    });
  }

  /* ---------- home page ---------- */
  function initHome() {
    const params = new URLSearchParams(location.search);
    let active = params.get("cat") || ALL;
    if (active !== ALL && active !== FAVS && !recipes.some((r) => r.category === active)) active = ALL;

    const search = $("#search");
    const grid = $("#grid");
    const tabs = $("#tabs");
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
    randomPool = filtered;
    // on the home page, section links just scroll (keeps the current filter)
    $$('#main-nav a[href^="index.html#"]').forEach((a) => a.setAttribute("href", a.getAttribute("href").replace("index.html", "")));

    function syncUrl() {
      const p = new URLSearchParams();
      if (active !== ALL) p.set("cat", active);
      if (search.value.trim()) p.set("q", search.value.trim());
      const qs = p.toString();
      history.replaceState(null, "", (qs ? "?" + qs : location.pathname) + location.hash);
    }

    function renderTabs() {
      const tab = (key, label, count) => {
        const href = key === ALL ? "index.html#recipes" : `index.html?cat=${encodeURIComponent(key)}#recipes`;
        const current = key === active ? ' aria-current="true"' : "";
        const c = count != null ? ` <span class="count">${count}</span>` : "";
        return `<a href="${href}" data-cat="${esc(key)}"${current}>${esc(label)}${c}</a>`;
      };
      tabs.innerHTML =
        tab(ALL, "הכל", recipes.length) +
        categories().map(([cat, n]) => tab(cat, cat, n)).join("") +
        tab(FAVS, "♥ מועדפים", favorites.size);
    }

    function card(r, newestId) {
      const fav = isFav(r.id);
      return `<article class="card">
        ${r.id === newestId ? '<span class="badge-new">חדש!</span>' : ""}
        <p class="card-cat">${esc(r.category)}</p>
        ${ART.dish(ART.dishFor(r), "card-art")}
        <h3><a href="${recipeUrl(r)}">${esc(r.title)}</a></h3>
        <p class="card-desc">${esc(describe(r))}</p>
        <div class="card-foot">
          <span>${r.totalMinutes ? r.totalMinutes + " דק׳" : ""}</span>
          <button class="fav" type="button" data-fav="${esc(r.id)}" aria-pressed="${fav}" aria-label="שמירה במועדפים: ${esc(r.title)}">${HEART}</button>
        </div>
      </article>`;
    }

    function render() {
      renderTabs();
      markNav(active === FAVS ? FAVS : "home");
      const list = filtered();
      const newestId = recipes[0] && recipes[0].id;
      status.textContent = list.length === 1 ? "מתכון אחד בתפריט" : list.length ? `${list.length} מתכונים בתפריט` : "";

      if (!list.length) {
        const msg = active === FAVS && !favorites.size
          ? "עדיין אין מועדפים. לחצו על הלב בכרטיס כדי לשמור מתכון כאן."
          : "לא מצאנו מתכון כזה. נסו חיפוש אחר.";
        grid.innerHTML = `<div class="empty">${ART.dish("wine")}<p>${msg}</p></div>`;
        return;
      }
      grid.innerHTML = list.map((r) => card(r, newestId)).join("");
    }

    function setCategory(key, scroll) {
      active = key;
      syncUrl();
      render();
      if (scroll) $("#recipes").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }

    tabs.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-cat]");
      if (!a) return;
      e.preventDefault();
      setCategory(a.dataset.cat, false);
    });
    // "favourites" links in the header and hero filter in place instead of reloading
    $$("a[data-cat]:not(#tabs a)").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      setCategory(a.dataset.cat, true);
    }));
    $('#main-nav a[data-nav="home"]').addEventListener("click", (e) => {
      e.preventDefault();
      if (active === FAVS) { active = ALL; syncUrl(); render(); }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    grid.addEventListener("click", (e) => {
      const b = e.target.closest("[data-fav]");
      if (!b) return;
      b.setAttribute("aria-pressed", String(toggleFav(b.dataset.fav)));
      if (active === FAVS) render(); else renderTabs();
    });
    search.addEventListener("input", () => { syncUrl(); render(); });

    render();
  }

  /* ---------- recipe page ---------- */
  function initRecipe() {
    const id = new URLSearchParams(location.search).get("id");
    const r = recipes.find((x) => x.id === id);
    const main = $("#recipe");
    markNav(null);

    if (!r) {
      main.innerHTML = `
        <div class="not-found">
          ${ART.dish("wine")}
          <h1>המתכון לא נמצא</h1>
          <a class="btn" href="index.html#recipes">חזרה לתפריט ←</a>
        </div>`;
      return;
    }

    document.title = r.title + " · מחברת המתכונים שלי";
    randomPool = () => recipes.filter((x) => x.id !== r.id);
    renderPrevNext(r);

    const checkKey = "adi-recipes:checked:" + r.id;
    const checked = new Set(store.get(checkKey, []));
    let n = 0;
    const ingredients = r.ingredients.map((g) => {
      const head = g.title ? `<h3>${esc(g.title)}</h3>` : "";
      const items = g.items.map((item) => {
        const key = n++;
        return `<li><label><input type="checkbox" data-i="${key}"${checked.has(key) ? " checked" : ""}><span>${esc(item)}</span></label></li>`;
      }).join("");
      return head + `<ul>${items}</ul>`;
    }).join("");

    const steps = r.steps.map((s) => {
      const tip = s.match(/^טיפ:\s*(.*)$/s);
      return tip
        ? `<li class="tip"><span class="script">טיפ קטן</span>${esc(tip[1])}</li>`
        : `<li><span>${esc(s)}</span></li>`;
    }).join("");

    const facts = [
      r.prepTime && ["הכנה", r.prepTime],
      r.cookTime && ["בישול / אפייה", r.cookTime],
      r.totalMinutes && ["סה״כ", r.totalMinutes + " דק׳"]
    ].filter(Boolean).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");

    const catUrl = `index.html?cat=${encodeURIComponent(r.category)}#recipes`;
    const fav = isFav(r.id);

    main.innerHTML = `
      <nav class="crumbs" aria-label="מיקום"><a href="index.html">הבית</a><span aria-hidden="true">/</span><a href="${catUrl}">${esc(r.category)}</a></nav>

      <div class="recipe-hero">
        <div>
          <p class="kicker">${esc(r.category)}</p>
          <h1>${esc(r.title)}</h1>
          <span class="short-rule" aria-hidden="true"></span>
          ${r.description ? `<p class="lede">${esc(r.description)}</p>` : ""}
          <dl class="facts">${facts}</dl>
          <div class="recipe-actions">
            <button class="btn" id="fav" type="button" aria-pressed="${fav}">${HEART}<span>${fav ? "שמור במועדפים" : "שמירה במועדפים"}</span></button>
            <button class="btn btn-ghost" id="wake" type="button" aria-pressed="false">מסך דולק בזמן הבישול</button>
            <button class="link-arrow" type="button" data-random>מתכון אקראי ←</button>
          </div>
        </div>
        <figure class="recipe-art">
          ${ART.dish(ART.dishFor(r))}
          <figcaption>${esc(r.category)}</figcaption>
        </figure>
      </div>

      <div class="recipe-body">
        <section class="ingredients" aria-labelledby="ing-title">
          <h2 id="ing-title">מצרכים</h2>
          ${ingredients}
          <button class="link-arrow reset" id="reset" type="button">↺ ניקוי סימונים</button>
        </section>
        <section class="steps" aria-labelledby="steps-title">
          <h2 id="steps-title">אופן ההכנה</h2>
          <ol>${steps}</ol>
          ${r.source && r.source.url ? `<p class="source">מקור: <a href="${esc(r.source.url)}" target="_blank" rel="noopener">${esc(r.source.label || "למתכון המקורי")} ↗</a></p>` : ""}
        </section>
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
      $$("input[data-i]", main).forEach((c) => (c.checked = false));
    });
    $("#fav").addEventListener("click", (e) => {
      const on = toggleFav(r.id);
      e.currentTarget.setAttribute("aria-pressed", String(on));
      $("span", e.currentTarget).textContent = on ? "שמור במועדפים" : "שמירה במועדפים";
    });
    initWakeLock($("#wake"));
  }

  function renderPrevNext(current) {
    const el = $("#prev-next");
    if (!el || recipes.length < 2) return;
    const i = recipes.findIndex((r) => r.id === current.id);
    const prev = recipes[(i - 1 + recipes.length) % recipes.length];
    const next = recipes[(i + 1) % recipes.length];
    el.innerHTML =
      `<a href="${recipeUrl(prev)}"><small>→ הקודם</small><span>${esc(prev.title)}</span></a>` +
      `<a href="${recipeUrl(next)}"><small>הבא ←</small><span>${esc(next.title)}</span></a>`;
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
      btn.textContent = lock ? "✓ המסך יישאר דולק" : "מסך דולק בזמן הבישול";
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

  /* ---------- boot ---------- */
  drawArt();
  initHeader();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "recipe") initRecipe();
})();
