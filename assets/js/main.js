(() => {
  const canvas = document.getElementById("neuralCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  /* ---------- CONFIG ---------- */
  const CFG = {
    particleCountDesktop: 150,
    particleCountTablet: 80,
    particleCountMobile: 25,
    tabletMax: 1024,
    mobileMax: 768,
    particleColor: "#0f172a",
    lineColor: "rgba(15, 23, 42, 0.12)",
    maxLineDistance: 180,
    particleMinRadius: 2,
    particleMaxRadius: 4.5,
    speed: 0.35,
    mouseRadius: 250,
    mouseAttraction: 0.02,
  };

  /* ---------- STATE ---------- */
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let w, h;
  let currentParticleCount = 0;

  function getParticleCount() {
    const vw = window.innerWidth;
    if (vw <= CFG.mobileMax) return CFG.particleCountMobile;
    if (vw <= CFG.tabletMax) return CFG.particleCountTablet;
    return CFG.particleCountDesktop;
  }

  /* ---------- RESIZE ---------- */
  function resize() {
    const header = canvas.parentElement;
    w = canvas.width = header.offsetWidth;
    h = canvas.height = header.offsetHeight;

    const nextCount = getParticleCount();
    if (nextCount !== currentParticleCount) {
      currentParticleCount = nextCount;
      initParticles();
    }
  }

  /* ---------- PARTICLE ---------- */
  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * CFG.speed * 2,
      vy: (Math.random() - 0.5) * CFG.speed * 2,
      r:
        CFG.particleMinRadius +
        Math.random() * (CFG.particleMaxRadius - CFG.particleMinRadius),
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < currentParticleCount; i++) {
      particles.push(createParticle());
    }
  }

  /* ---------- UPDATE ---------- */
  function update() {
    for (const p of particles) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.mouseRadius && dist > 0) {
        const force = (1 - dist / CFG.mouseRadius) * CFG.mouseAttraction;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) {
        p.x = 0;
        p.vx *= -1;
      }
      if (p.x > w) {
        p.x = w;
        p.vx *= -1;
      }
      if (p.y < 0) {
        p.y = 0;
        p.vy *= -1;
      }
      if (p.y > h) {
        p.y = h;
        p.vy *= -1;
      }
    }
  }

  /* ---------- DRAW ---------- */
  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CFG.maxLineDistance) {
          const opacity = 1 - dist / CFG.maxLineDistance;
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const mDx = mouse.x - midX;
          const mDy = mouse.y - midY;
          const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
          const nearMouse = mDist < CFG.mouseRadius;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          if (nearMouse) {
            const glow = (1 - mDist / CFG.mouseRadius) * 0.35;
            ctx.strokeStyle =
              "rgba(15, 23, 42, " + (opacity * 0.18 + glow).toFixed(3) + ")";
            ctx.lineWidth = 1.4;
          } else {
            ctx.strokeStyle =
              "rgba(15, 23, 42, " + (opacity * 0.18).toFixed(3) + ")";
            ctx.lineWidth = 1;
          }

          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nearMouse = dist < CFG.mouseRadius;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

      if (nearMouse) {
        const boost = (1 - dist / CFG.mouseRadius) * 0.3;
        ctx.fillStyle = "rgba(15, 23, 42, " + (0.5 + boost).toFixed(2) + ")";
      } else {
        ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
      }

      ctx.fill();
    }
  }

  /* ---------- LOOP ---------- */
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  /* ---------- EVENTS ---------- */
  window.addEventListener("resize", resize);

  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  /* ---------- INIT ---------- */
  resize();
  loop();
})();

/* ---------- CTA WAVE DOTS CANVAS — OPTIMIZED ---------- */
(() => {
  const canvas = document.getElementById("ctaWaveCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const section = canvas.closest(".cta");
  if (!section) return;

  const CFG = {
    spacing: 15,
    dotRadius: 1.75,
    dotRadiusNear: 2.85,
    waveAmp: 20,
    waveSpeed: 0.00015,
    waveFreq: 0.012,
    perspective: 320,
    tiltMax: 0.1,
    dotColor: "rgba(15, 23, 42, ",
  };

  let width = 0;
  let height = 0;
  let dpr = 1;

  let cols = 0;
  let rows = 0;

  let spacing = CFG.spacing;

  let rafId = 0;

  const dotSprite = document.createElement("canvas");
  const dotSpriteCtx = dotSprite.getContext("2d");
  dotSprite.width = 32;
  dotSprite.height = 32;
  (() => {
    const cx = 16;
    const cy = 16;
    const r = 12;
    const g = dotSpriteCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(15, 23, 42, 1)");
    g.addColorStop(0.75, "rgba(15, 23, 42, 1)");
    g.addColorStop(1, "rgba(15, 23, 42, 0)");
    dotSpriteCtx.clearRect(0, 0, 32, 32);
    dotSpriteCtx.fillStyle = g;
    dotSpriteCtx.beginPath();
    dotSpriteCtx.arc(cx, cy, r, 0, Math.PI * 2);
    dotSpriteCtx.fill();
  })();

  let visible = true;

  let tilt = { x: 0, y: 0 };
  let tiltTarget = { x: 0, y: 0 };

  function start() {
    if (rafId) return;
    rafId = requestAnimationFrame(draw);
  }

  function stop() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function updateRunningState() {
    const shouldRun = visible && !document.hidden;
    if (shouldRun) start();
    else stop();
  }

  /* ---------- INTERSECTION OBSERVER ---------- */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        updateRunningState();
      },
      { root: null, threshold: 0.01 },
    );
    observer.observe(section);
  }

  document.addEventListener("visibilitychange", updateRunningState);

  /* ---------- RESIZE ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = section.offsetWidth;
    height = section.offsetHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Adaptive density
    spacing = window.innerWidth < 900 ? CFG.spacing + 4 : CFG.spacing;

    cols = Math.ceil(width / spacing) + 36;
    rows = Math.ceil(height / spacing) + 52;
  }

  /* ---------- HELPERS ---------- */
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function project(x, y, z, p) {
    const scale = p / (p + z);
    return {
      x: x * scale,
      y: y * scale,
      s: scale,
    };
  }

  /* ---------- DRAW LOOP ---------- */
  function draw(t) {
    ctx.clearRect(0, 0, width, height);

    // Easing tilt
    tilt.x += (tiltTarget.x - tilt.x) * 0.05;
    tilt.y += (tiltTarget.y - tilt.y) * 0.05;

    const centerX = width / 2;
    const baseY = height * 0.7;

    const baseTiltX = -0.92;

    const xStretch = 2.05;
    const yStretch = 1.45;

    const startX = -((cols - 1) * spacing) / 2;
    const startY = -((rows - 1) * spacing) / 2;

    const tt = t * CFG.waveSpeed;

    // PRE-CALCULATED SIN/COS
    const cosX = Math.cos(baseTiltX + tilt.x);
    const sinX = Math.sin(baseTiltX + tilt.x);
    const cosY = Math.cos(tilt.y);
    const sinY = Math.sin(tilt.y);

    for (let ry = 0; ry < rows; ry++) {
      const y = startY + ry * spacing;

      for (let cx = 0; cx < cols; cx++) {
        const x = startX + cx * spacing;

        const distX = x * xStretch;
        const distY = y * yStretch;

        const wave =
          Math.sin((distY + tt * 1000) * CFG.waveFreq) +
          Math.cos((distX - tt * 240) * (CFG.waveFreq * 0.85));

        let z = wave * CFG.waveAmp;

        // ROTATE X
        const ryY = distY * cosX - z * sinX;
        const ryZ = distY * sinX + z * cosX;

        // ROTATE Y
        const rxX = distX * cosY + ryZ * sinY;
        const rxZ = -distX * sinY + ryZ * cosY;

        const pr = project(rxX, ryY, rxZ + 40, CFG.perspective);

        const sx = centerX + pr.x;
        const sy = baseY + pr.y;

        if (sx < -320 || sx > width + 320 || sy < -220 || sy > height + 220)
          continue;

        const fade = clamp(sy / height, 0, 1);
        const alpha = 0.06 + fade * 0.4;

        const r =
          CFG.dotRadius +
          (CFG.dotRadiusNear - CFG.dotRadius) * clamp(pr.s - 0.65, 0, 1);

        ctx.globalAlpha = alpha;
        ctx.drawImage(dotSprite, sx - r, sy - r, r * 2, r * 2);
      }
    }

    ctx.globalAlpha = 1;

    rafId = requestAnimationFrame(draw);
  }

  /* ---------- EVENTS ---------- */
  window.addEventListener("resize", resize);

  if (!window.matchMedia("(pointer: coarse)").matches) {
    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      tiltTarget.x = (0.5 - py) * (CFG.tiltMax * 0.35);
      tiltTarget.y = (px - 0.5) * (CFG.tiltMax * 0.85);
    });

    section.addEventListener("mouseleave", () => {
      tiltTarget.x = 0;
      tiltTarget.y = 0;
    });
  }

  resize();
  updateRunningState();
})();

/* ---------- TIMELINE — COME FUNZIONA ---------- */
(() => {
  const steps = document.querySelectorAll("[data-tl-step]");
  const lineFill = document.getElementById("tlLineFill");
  const track = document.querySelector(".tl__track");
  if (!steps.length || !track) return;

  /* Reveal steps on scroll */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.2 },
  );
  steps.forEach((s) => revealObs.observe(s));

  /* Active step + line fill on scroll */
  function updateTimeline() {
    const trackRect = track.getBoundingClientRect();
    const trackTop = trackRect.top + window.scrollY;
    const trackH = track.offsetHeight;
    const scrollCenter = window.scrollY + window.innerHeight * 0.45;

    /* Line fill */
    if (lineFill) {
      const progress = Math.min(
        Math.max((scrollCenter - trackTop) / trackH, 0),
        1,
      );
      lineFill.style.height = progress * 100 + "%";
    }

    /* Active step = last step whose top is above viewport center */
    let activeIdx = -1;
    steps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.55) activeIdx = i;
    });

    steps.forEach((s, i) => {
      s.classList.toggle("is-active", i === activeIdx);
    });
  }

  window.addEventListener("scroll", updateTimeline, { passive: true });
  updateTimeline();
})();

/* ---------- SERVICES SCROLL-REVEAL ---------- */
(() => {
  const panels = document.querySelectorAll("[data-sv-panel]");
  const links = document.querySelectorAll("[data-sv-link]");
  if (!panels.length || !links.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 },
  );

  panels.forEach((p) => revealObserver.observe(p));

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        links.forEach((l) => {
          l.classList.toggle("is-active", l.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
  );

  panels.forEach((p) => activeObserver.observe(p));
})();

/* ---------- UNIVERSAL SCROLL-REVEAL ---------- */
(() => {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  items.forEach((el) => observer.observe(el));
})();

/* ---------- FOR-WHO — SECTION INTERACTIONS ---------- */
(() => {
  const section = document.querySelector(".for-who");
  if (!section) return;

  const cards = section.querySelectorAll("[data-fw-card]");
  const titleWords = section.querySelectorAll(".for-who__title-word");
  const counters = section.querySelectorAll("[data-fw-counter]");
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  /* ---- Section reveal (title words + line) ---- */
  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          section.classList.add("is-visible");
          sectionObs.unobserve(section);
        }
      });
    },
    { threshold: 0.15 },
  );
  sectionObs.observe(section);

  /* ---- Card reveal (3D slide-in) ---- */
  const cardObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          cardObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  cards.forEach((c) => cardObs.observe(c));

  /* ---- Animated counters ---- */
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.getAttribute("data-fw-target"), 10);
        if (isNaN(target)) return;
        counterObs.unobserve(el);

        const duration = 600;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = String(current).padStart(2, "0");
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => counterObs.observe(c));

  /* ---- Cursor glow tracking ---- */
  if (!isCoarse) {
    cards.forEach((card) => {
      const glow = card.querySelector(".for-who__glow");
      if (!glow) return;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.setProperty("--mouse-x", x + "px");
        glow.style.setProperty("--mouse-y", y + "px");
      });
    });
  }

  /* ---- Tap / click to expand detail ---- */
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const wasExpanded = card.classList.contains("is-expanded");

      // Close all cards first
      cards.forEach((c) => c.classList.remove("is-expanded"));

      // Toggle current
      if (!wasExpanded) {
        card.classList.add("is-expanded");
      }
    });
  });
})();

/* ---------- SW-RANGE — ROW REVEAL + GLOW ---------- */
(() => {
  const rows = document.querySelectorAll("[data-sw-row]");
  if (!rows.length) return;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  /* Reveal */
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  rows.forEach((r) => obs.observe(r));

  /* Cursor glow */
  if (!isCoarse) {
    rows.forEach((row) => {
      const glow = row.querySelector(".sw-range__glow");
      if (!glow) return;
      row.addEventListener("mousemove", (e) => {
        const rect = row.getBoundingClientRect();
        glow.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
        glow.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
      });
    });
  }
})();

/* ---------- SPLIT-DARK — PANEL REVEAL + GLOW ---------- */
(() => {
  const panels = document.querySelectorAll("[data-split-panel]");
  if (!panels.length) return;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  /* Reveal from opposite sides */
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  panels.forEach((p) => obs.observe(p));

  /* Cursor glow */
  if (!isCoarse) {
    panels.forEach((panel) => {
      const glow = panel.querySelector(".split-dark__glow");
      if (!glow) return;
      panel.addEventListener("mousemove", (e) => {
        const rect = panel.getBoundingClientRect();
        glow.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
        glow.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
      });
    });
  }
})();

/* ---------- PILLARS — TAP EXPAND ---------- */
(() => {
  const cols = document.querySelectorAll("[data-pillar]");
  if (!cols.length) return;

  cols.forEach((col) => {
    col.addEventListener("click", () => {
      const wasExpanded = col.classList.contains("is-expanded");
      cols.forEach((c) => c.classList.remove("is-expanded"));
      if (!wasExpanded) col.classList.add("is-expanded");
    });
  });
})();

/* ---------- PRICING CARDS — GLOW CURSOR TRACKING ---------- */
(() => {
  const cards = document.querySelectorAll("[data-pricing-card]");
  if (!cards.length) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach((card) => {
    const glow = card.querySelector(".pricing__glow");
    if (!glow) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.setProperty("--mouse-x", x + "px");
      glow.style.setProperty("--mouse-y", y + "px");
    });
  });
})();

/* ---------- PRICING TOGGLE (Mensile / Annuale) — sitiweb ---------- */
(() => {
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  if (!toggleButtons.length) return;

  const prices = document.querySelectorAll(".pricing__amount");
  const annualBadges = document.querySelectorAll(".annual-badge");
  const pricePeriods = document.querySelectorAll(".pricing__period");
  const ctas = document.querySelectorAll(".pricing__cta");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const isAnnual = btn.getAttribute("data-plan") === "annual";

      prices.forEach((price) => {
        const monthly = price.getAttribute("data-monthly");
        const annual = price.getAttribute("data-annual");
        price.textContent = isAnnual ? annual : monthly;
      });

      pricePeriods.forEach((period) => {
        period.textContent = isAnnual ? "/anno" : "/mese";
      });

      annualBadges.forEach((badge) => {
        badge.classList.toggle("hidden", !isAnnual);
      });

      ctas.forEach((cta) => {
        const href = cta.getAttribute("href") || "";
        if (!href) return;
        const nextHref = href.replace(
          /([?&]billing=)(monthly|yearly)/,
          "$1" + (isAnnual ? "yearly" : "monthly"),
        );
        cta.setAttribute("href", nextHref);
      });
    });
  });
})();

/* ---------- OUTCOMES — COUNTER ANIMATION ---------- */
(() => {
  const counters = document.querySelectorAll("[data-oc-counter]");
  if (!counters.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        obs.unobserve(el);

        const prefix = el.getAttribute("data-oc-prefix") || "";
        const suffix = el.getAttribute("data-oc-suffix") || "";
        const raw = el.getAttribute("data-oc-target");

        // Non-numeric targets (like ∞) just reveal directly
        const target = parseInt(raw, 10);
        if (isNaN(target)) {
          el.textContent = prefix + raw + suffix;
          return;
        }

        const duration = 800;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => obs.observe(c));
})();

/* ---------- NAVBAR SCROLL EFFECT ---------- */

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const navbar = document.querySelector(".navbar");

  if (scrollY > 30) {
    navbar.classList.add("scroll");
  } else {
    navbar.classList.remove("scroll");
  }
});

/* ---------- MOBILE NAV TOGGLE ---------- */
(() => {
  const toggle = document.querySelector(".nav__toggle");
  const list = document.querySelector(".nav__list");
  if (!toggle || !list) return;

  function open() {
    toggle.classList.add("is-open");
    list.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function close() {
    toggle.classList.remove("is-open");
    list.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    toggle.classList.contains("is-open") ? close() : open();
  });

  list.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", close);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* ---------- CARD TILT 3D ---------- */
(() => {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cards = document.querySelectorAll(".services__card");
  const MAX_TILT = 6;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * MAX_TILT * 2;
      const rotateX = (y / rect.height - 0.5) * -MAX_TILT * 2;
      card.style.transform =
        "perspective(600px) rotateX(" +
        rotateX +
        "deg) rotateY(" +
        rotateY +
        "deg) translateY(-4px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ---------- CONTACT FORM — VALIDATION ---------- */
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successEl = document.getElementById("contactSuccess");

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Inserisci il tuo nome"),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Email non valida",
    service: (v) => (v ? "" : "Seleziona un servizio"),
    message: (v) =>
      v.trim().length >= 10
        ? ""
        : "Il messaggio deve avere almeno 10 caratteri",
    privacy: (_, el) => (el.checked ? "" : "Devi accettare la privacy policy"),
  };

  function showError(name, msg) {
    const errEl = form.querySelector('[data-error="' + name + '"]');
    const input =
      form.querySelector('[name="' + name + '"]') ||
      form.querySelector("#cf-" + name);
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.toggle("is-visible", !!msg);
    }
    if (input && input.type !== "checkbox") {
      input.classList.toggle("has-error", !!msg);
    }
  }

  function validateField(name) {
    const el = form.querySelector('[name="' + name + '"]');
    if (!el || !validators[name]) return true;
    const msg = validators[name](el.value, el);
    showError(name, msg);
    return !msg;
  }

  /* Live validation on blur */
  const fields = form.querySelectorAll(
    ".contact__input, .contact__textarea, .contact__select",
  );
  fields.forEach((f) => {
    f.addEventListener("blur", () => {
      const name = f.getAttribute("name");
      if (name && validators[name]) validateField(name);
    });

    /* Clear error on input */
    f.addEventListener("input", () => {
      const name = f.getAttribute("name");
      if (name) showError(name, "");
    });
  });

  /* Privacy checkbox */
  const privacyCheck = form.querySelector('[name="privacy"]');
  if (privacyCheck) {
    privacyCheck.addEventListener("change", () => {
      validateField("privacy");
    });
  }

  /* Submit */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;
    for (const name of Object.keys(validators)) {
      if (!validateField(name)) valid = false;
    }

    if (!valid) {
      /* Scroll to first error */
      const firstErr = form.querySelector(".has-error");
      if (firstErr) firstErr.focus();
      return;
    }

    /* Invio e success/error gestiti da contact.js (EmailJS) */
  });
})();

/* ---------- GSAP CARD STACKING EFFECT ---------- */
(() => {
  if (
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger === "undefined"
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".problema__card");

  cards.forEach((card, i) => {
    if (i < cards.length - 1) {
      gsap.to(card, {
        scale: 0.9,
        opacity: 0.6,
        scrollTrigger: {
          trigger: cards[i + 1],
          start: "top center",
          end: "top top+=180",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  });
})();
