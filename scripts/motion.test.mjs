import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const motionSource = await readFile(
  path.join(projectDirectory, "motion.js"),
  "utf8",
);

class EventTargetStub {
  listeners = new Map();

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatchEvent(event) {
    for (const listener of this.listeners.get(event.type) ?? []) listener(event);
  }
}

class ClassListStub {
  values = new Set();

  add(value) {
    this.values.add(value);
  }

  contains(value) {
    return this.values.has(value);
  }

  toggle(value, force) {
    const enabled = force ?? !this.values.has(value);
    if (enabled) this.values.add(value);
    else this.values.delete(value);
    return enabled;
  }
}

class StyleStub {
  values = new Map();

  setProperty(name, value) {
    this.values.set(name, value);
  }

  getPropertyValue(name) {
    return this.values.get(name) ?? "";
  }
}

class AnimationStub extends EventTargetStub {
  cancelled = false;

  cancel() {
    this.cancelled = true;
    this.dispatchEvent({ type: "cancel" });
  }
}

class ElementStub extends EventTargetStub {
  constructor({ top = 1200, height = 200 } = {}) {
    super();
    this.classList = new ClassListStub();
    this.style = new StyleStub();
    this.dataset = {};
    this.attributes = new Map();
    this.hidden = true;
    this.textContent = "";
    this.rect = { top, height };
    this.childrenBySelector = new Map();
    this.animations = [];
  }

  animate() {
    const animation = new AnimationStub();
    this.animations.push(animation);
    return animation;
  }

  click() {
    this.dispatchEvent({ type: "click" });
  }

  getBoundingClientRect() {
    return this.rect;
  }

  querySelectorAll(selector) {
    return this.childrenBySelector.get(selector) ?? [];
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
}

class MediaQueryStub extends EventTargetStub {
  constructor(matches) {
    super();
    this.matches = matches;
  }

  setMatches(matches) {
    this.matches = matches;
    this.dispatchEvent({ type: "change", matches });
  }
}

function createRuntime({ reduced = false, compact = false } = {}) {
  const root = new ElementStub();
  const body = new ElementStub();
  body.classList.add("marketing-page");
  const header = new ElementStub({ top: 0, height: 80 });
  const scene = new ElementStub({ top: 200, height: 500 });
  const layer = new ElementStub();
  layer.dataset.parallax = "0.08";
  scene.childrenBySelector.set("[data-parallax]", [layer]);
  const reveal = new ElementStub({ top: 1200, height: 200 });
  const routeTabs = new ElementStub();
  const routeTargets = Object.fromEntries(
    [
      "#route-title",
      "#route-description",
      "#route-overview",
      "#route-requirements",
      "#route-caution",
    ].map((selector) => [selector, new ElementStub()]),
  );
  const selectors = new Map([
    [".site-header", header],
    ["[data-hero-scene]", scene],
    [".route-tabs", routeTabs],
    ...Object.entries(routeTargets),
  ]);

  const document = new EventTargetStub();
  Object.assign(document, {
    body,
    documentElement: root,
    hidden: false,
    readyState: "complete",
    querySelector: (selector) => selectors.get(selector) ?? null,
    querySelectorAll: (selector) =>
      selector === "[data-reveal]" ? [reveal] : [],
  });

  const reducedQuery = new MediaQueryStub(reduced);
  const desktopQuery = new MediaQueryStub(!compact);
  const compactQuery = new MediaQueryStub(compact);
  const window = new EventTargetStub();
  Object.assign(window, {
    innerHeight: 800,
    scrollY: 0,
    matchMedia: (query) =>
      query.includes("prefers-reduced-motion")
        ? reducedQuery
        : query.includes("max-width")
          ? compactQuery
          : desktopQuery,
  });

  const observers = [];
  class IntersectionObserverStub {
    constructor(callback) {
      this.callback = callback;
      this.targets = new Set();
      observers.push(this);
    }

    observe(target) {
      this.targets.add(target);
    }

    unobserve(target) {
      this.targets.delete(target);
    }

    disconnect() {
      this.targets.clear();
    }

    fire(target, isIntersecting) {
      if (this.targets.has(target)) {
        this.callback([{ target, isIntersecting }]);
      }
    }
  }

  const frames = new Map();
  let nextFrame = 1;
  const requestAnimationFrame = (callback) => {
    const id = nextFrame++;
    frames.set(id, callback);
    return id;
  };
  const cancelAnimationFrame = (id) => frames.delete(id);
  const flushFrames = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    for (const callback of callbacks) callback();
  };

  window.IntersectionObserver = IntersectionObserverStub;
  vm.runInNewContext(motionSource, {
    document,
    window,
    Element: ElementStub,
    IntersectionObserver: IntersectionObserverStub,
    requestAnimationFrame,
    cancelAnimationFrame,
    Number,
    JSON,
  });

  return {
    compactQuery,
    desktopQuery,
    document,
    flushFrames,
    layer,
    observers,
    reducedQuery,
    reveal,
    root,
    routeTabs,
    routeTargets,
    scene,
    window,
  };
}

test("reduced motion starts static and never animates route changes", () => {
  const runtime = createRuntime({ reduced: true });

  assert.equal(runtime.root.dataset.motion, "reduced");
  assert.equal(runtime.root.dataset.motionReady, "true");
  assert.equal(runtime.reveal.classList.contains("is-visible"), true);

  runtime.window.dispatchEvent({ type: "transguru:routechange" });
  assert.equal(
    Object.values(runtime.routeTargets).flatMap(
      (element) => element.animations,
    ).length,
    0,
  );
});

test("a compact viewport starts static without observers or parallax work", () => {
  const runtime = createRuntime({ compact: true });

  assert.equal(runtime.root.dataset.motion, "reduced");
  assert.equal(runtime.root.dataset.motionReady, "true");
  assert.equal(runtime.observers.length, 0);
  assert.equal(runtime.routeTabs.getAttribute("aria-orientation"), "horizontal");
  runtime.window.dispatchEvent({ type: "scroll" });
  runtime.window.dispatchEvent({ type: "transguru:routechange" });
  runtime.flushFrames();
  assert.equal(runtime.layer.style.getPropertyValue("--parallax-y"), "");
  assert.equal(Object.values(runtime.routeTargets).some((element) => element.animations.length), false);

  runtime.desktopQuery.setMatches(true);
  assert.equal(runtime.routeTabs.getAttribute("aria-orientation"), "vertical");
});

test("entering a compact viewport stops an active desktop scene", () => {
  const runtime = createRuntime();
  runtime.compactQuery.setMatches(true);

  assert.equal(runtime.root.dataset.motion, "reduced");
  assert.equal(runtime.layer.style.getPropertyValue("--parallax-y"), "0px");
  assert.equal(runtime.reveal.classList.contains("is-visible"), true);
});

test("a hidden page pauses motion and cancels route animation until visible", () => {
  const runtime = createRuntime();
  const heroObserver = runtime.observers.find((observer) =>
    observer.targets.has(runtime.scene),
  );
  heroObserver.fire(runtime.scene, true);
  runtime.flushFrames();

  assert.equal(runtime.root.dataset.motion, "running");
  assert.equal(runtime.routeTabs.getAttribute("aria-orientation"), "vertical");
  assert.notEqual(runtime.layer.style.getPropertyValue("--parallax-y"), "0px");

  runtime.window.dispatchEvent({ type: "transguru:routechange" });
  const animations = Object.values(runtime.routeTargets).flatMap(
    (element) => element.animations,
  );
  assert.equal(animations.length, 5);

  runtime.document.hidden = true;
  runtime.document.dispatchEvent({ type: "visibilitychange" });
  assert.equal(runtime.root.dataset.motion, "paused");
  assert.equal(runtime.layer.style.getPropertyValue("--parallax-y"), "0px");
  assert.equal(runtime.reveal.classList.contains("is-visible"), true);
  assert.equal(animations.every((animation) => animation.cancelled), true);

  runtime.document.hidden = false;
  runtime.document.dispatchEvent({ type: "visibilitychange" });
  assert.equal(runtime.root.dataset.motion, "running");
});

test("a live reduced-motion preference safely switches static mode on and off", () => {
  const runtime = createRuntime();
  runtime.reducedQuery.setMatches(true);

  assert.equal(runtime.root.dataset.motion, "reduced");
  assert.equal(runtime.layer.style.getPropertyValue("--parallax-y"), "0px");
  assert.equal(runtime.reveal.classList.contains("is-visible"), true);

  runtime.reducedQuery.setMatches(false);
  assert.equal(runtime.root.dataset.motion, "running");

  runtime.desktopQuery.setMatches(false);
  assert.equal(runtime.routeTabs.getAttribute("aria-orientation"), "horizontal");
});
