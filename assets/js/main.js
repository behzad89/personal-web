/* ==========================================================================
   Behzad Valipour — site interactions
   Dependency-free vanilla JS. Replaces jQuery, AOS, typed.js, waypoints, etc.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme toggle (persisted, respects OS default) -------------------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored === "light" || stored === "dark") {
    root.setAttribute("data-theme", stored);
  } else {
    // No explicit choice: mirror the OS preference and let CSS media query drive.
    root.removeAttribute("data-theme");
  }

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#0b1120" : "#f7f9fc");
    });
  }

  /* ---- Header shadow on scroll ----------------------------------------- */
  var header = document.getElementById("site-header");
  var toTop = document.getElementById("to-top");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 12);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---- Mobile navigation ------------------------------------------------ */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---- Scroll reveal (IntersectionObserver) ----------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Scroll-spy for active nav link ----------------------------------- */
  var sections = document.querySelectorAll("main section[id]");
  var linkFor = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    linkFor[a.getAttribute("href").slice(1)] = a;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        Object.keys(linkFor).forEach(function (key) {
          linkFor[key].classList.toggle("active", key === id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Typed role rotator ---------------------------------------------- */
  var typedEl = document.getElementById("typed");
  var roles = [
    "production ML models",
    "scalable data pipelines",
    "cloud infrastructure",
    "geospatial data systems"
  ];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      var r = 0, c = 0, deleting = false;
      (function tick() {
        var word = roles[r];
        typedEl.textContent = word.slice(0, c);
        if (!deleting && c < word.length) {
          c++;
        } else if (deleting && c > 0) {
          c--;
        } else if (!deleting && c === word.length) {
          deleting = true;
          return setTimeout(tick, 1600);
        } else {
          deleting = false;
          r = (r + 1) % roles.length;
        }
        setTimeout(tick, deleting ? 45 : 85);
      })();
    }
  }

  /* ---- Footer year ------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Medium feed ------------------------------------------------------ */
  (function loadMedium() {
    var list = document.getElementById("medium-posts");
    if (!list) return;

    var feed = "https://bvsh.medium.com/feed";
    var api = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feed);

    function message(html) {
      list.innerHTML = '<li class="muted">' + html + "</li>";
      list.setAttribute("aria-busy", "false");
    }

    fetch(api)
      .then(function (res) { if (!res.ok) throw new Error("bad response"); return res.json(); })
      .then(function (data) {
        if (!data || !data.items || !data.items.length) {
          return message('No posts found yet. <a href="https://bvsh.medium.com/" target="_blank" rel="noopener">Visit Medium &rarr;</a>');
        }
        list.innerHTML = "";
        data.items.slice(0, 6).forEach(function (item) {
          var li = document.createElement("li");
          li.className = "post-item";
          var a = document.createElement("a");
          a.href = item.link;
          a.target = "_blank";
          a.rel = "noopener noreferrer";

          var title = document.createElement("span");
          title.className = "post-title";
          title.textContent = item.title || "Untitled";

          var date = document.createElement("span");
          date.className = "post-date";
          date.textContent = item.pubDate
            ? new Date(item.pubDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
            : "";

          a.appendChild(title);
          a.appendChild(date);
          li.appendChild(a);
          list.appendChild(li);
        });
        list.setAttribute("aria-busy", "false");
      })
      .catch(function () {
        message('Couldn&rsquo;t load posts right now. <a href="https://bvsh.medium.com/" target="_blank" rel="noopener">Read them on Medium &rarr;</a>');
      });
  })();
})();
