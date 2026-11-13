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
      "✿ ברוכים הבאים לספר המתכונים של עדי ✿ " +
      (newest ? `מתכון חדש: ${newest.title} ✿ ` : "") +
      'לא יודעים מה להכין? נסו את כפתור "מתכון אקראי" ✿';
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
    const chars = ["✦", "☺", "♥", "✧"];
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
          <div class="titlebar ${titleColors[i % 3]}"><span class="t">${esc(r.category)}</span><div class="ctl" aria-hidden="true"><span>✕</span></div></div>
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
      `<a href="index.html?cat=${encodeURIComponent(r.category)}">📂 ${esc(r.category)}</a>`
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
            <h4>מצרכים</h4>
            ${ingredients}
            <button class="btn reset" id="reset" type="button">↺ ניקוי סימונים</button>
          </section>
          <section class="panel steps">
            <h4>אופן ההכנה</h4>
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

  renderMarquee();
  cursorTrail();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "recipe") initRecipe();
})();
