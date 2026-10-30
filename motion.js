"use strict";

function bootMotion() {
  if (!document.body.classList.contains("marketing-page")) return;

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const heroScene = document.querySelector("[data-hero-scene]");
  const parallaxLayers = heroScene
    ? [...heroScene.querySelectorAll("[data-parallax]")]
    : [];
  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  const routeTabs = document.querySelector(".route-tabs");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopRoutes = window.matchMedia("(min-width: 1000px)");
  let documentHidden = document.hidden;
  let heroInView = false;
  let scrollFrame = 0;
  const routeAnimations = new Set();

  const revealObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -60px", threshold: 0.1 },
        )
      : null;

  const heroObserver =
    heroScene && "IntersectionObserver" in window
      ? new IntersectionObserver(
          ([entry]) => {
            heroInView = Boolean(entry?.isIntersecting);
            syncHeroState();
            requestScrollUpdate();
          },
          { rootMargin: "120px 0px", threshold: 0 },
        )
      : null;

  function motionState() {
    if (reducedMotion.matches) return "reduced";
    if (documentHidden) return "paused";
    return "running";
  }

  function motionIsRunning() {
    return motionState() === "running";
  }

  function revealAll() {
    revealObserver?.disconnect();
    for (const element of revealElements) element.classList.add("is-visible");
  }

  function observePendingReveals() {
    if (!revealObserver || !motionIsRunning()) {
      revealAll();
      return;
    }
    for (const element of revealElements) {
      if (!element.classList.contains("is-visible")) {
        revealObserver.observe(element);
      }
    }
  }

  function cancelRouteAnimations() {
    for (const animation of routeAnimations) animation.cancel();
    routeAnimations.clear();
  }

  function resetParallax() {
    for (const layer of parallaxLayers) {
      layer.style.setProperty("--parallax-y", "0px");
    }
  }

  function syncHeroState() {
    heroScene?.classList.toggle("is-in-view", heroInView && motionIsRunning());
  }

  function syncMotionState() {
    const state = motionState();
    root.dataset.motion = state;
    syncHeroState();

    if (state === "running") {
      observePendingReveals();
      requestScrollUpdate();
      return;
    }

    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    resetParallax();
    cancelRouteAnimations();
    revealAll();
  }

  function updateRouteOrientation() {
    routeTabs?.setAttribute(
      "aria-orientation",
      desktopRoutes.matches ? "vertical" : "horizontal",
    );
  }

  function updateScrollState() {
    scrollFrame = 0;
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
    if (!motionIsRunning() || !heroInView || !heroScene) return;

    const sceneRect = heroScene.getBoundingClientRect();
    const sceneOffset =
      window.innerHeight / 2 - (sceneRect.top + sceneRect.height / 2);

    for (const layer of parallaxLayers) {
      const factor = Number.parseFloat(layer.dataset.parallax || "0");
      const movement = Number.isFinite(factor)
        ? Math.max(-40, Math.min(40, sceneOffset * factor))
        : 0;
      layer.style.setProperty("--parallax-y", `${movement.toFixed(2)}px`);
    }
  }

  function requestScrollUpdate() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScrollState);
  }

  function animateRouteChange() {
    if (!motionIsRunning() || !("animate" in Element.prototype)) return;
    cancelRouteAnimations();

    const targets = [
      "#route-title",
      "#route-description",
      "#route-overview",
      "#route-requirements",
      "#route-caution",
    ]
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);

    targets.forEach((element, index) => {
      const animation = element.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 280,
          delay: index * 35,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      );
      routeAnimations.add(animation);
      const release = () => routeAnimations.delete(animation);
      animation.addEventListener("finish", release, { once: true });
      animation.addEventListener("cancel", release, { once: true });
    });
  }

  document.addEventListener("visibilitychange", () => {
    documentHidden = document.hidden;
    syncMotionState();
  });

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  window.addEventListener("transguru:routechange", animateRouteChange);
  reducedMotion.addEventListener("change", syncMotionState);
  desktopRoutes.addEventListener("change", updateRouteOrientation);

  for (const element of revealElements) {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.94) {
      element.classList.add("is-visible");
    }
  }

  heroObserver?.observe(heroScene);
  if (!heroObserver && heroScene) heroInView = true;
  updateRouteOrientation();
  root.dataset.motionReady = "true";
  syncMotionState();
  updateScrollState();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootMotion, { once: true });
} else {
  bootMotion();
}
