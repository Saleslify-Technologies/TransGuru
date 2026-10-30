"use strict";

const { routes, ui } = JSON.parse(
  document.querySelector("#app-config").textContent,
);
const assetBase = document.documentElement.dataset.assetBase || "";
const format = (key, count) => ui[key].replace("{count}", String(count));

let activeRoute = "i2a";
const tabs = [...document.querySelectorAll("[data-route]")];
const expand = document.querySelector("#route-expand");
const fullSteps = document.querySelector("#full-steps");

function makeText(tag, value) {
  const element = document.createElement(tag);
  element.textContent = value;
  return element;
}

function selectRoute(key) {
  activeRoute = key;
  const route = routes[key];
  tabs.forEach((tab) => {
    const selected = tab.dataset.route === key;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document
    .querySelector("#route-panel")
    .setAttribute("aria-labelledby", `tab-${key}`);
  document
    .querySelector("#route-title")
    .replaceChildren(
      document.createTextNode(route.title[0]),
      document.createElement("br"),
      document.createTextNode(route.title[1]),
    );
  document.querySelector("#route-description").textContent = route.description;
  document.querySelector("#route-method").textContent = route.method;
  document.querySelector("#route-count").textContent = format(
    "stageCount",
    route.steps.length,
  );
  document.querySelector("#route-icon").src =
    `${assetBase}assets/icons/${route.icon}.svg`;
  document.querySelector("#route-caution").textContent = route.caution;
  document.querySelector("#route-overview").replaceChildren(
    ...route.overview.map(([title, body], index) => {
      const item = document.createElement("li");
      item.append(
        makeText("span", String(index + 1).padStart(2, "0")),
        makeText("strong", title),
        makeText("p", body),
      );
      return item;
    }),
  );
  document
    .querySelector("#route-requirements")
    .replaceChildren(...route.requirements.map((text) => makeText("li", text)));
  document.querySelector("#full-step-list").replaceChildren(
    ...route.steps.map(([title, detail]) => {
      const item = makeText("li", title);
      item.append(makeText("span", detail));
      return item;
    }),
  );
  fullSteps.hidden = true;
  expand.setAttribute("aria-expanded", "false");
  expand.firstChild.textContent = format("expandSteps", route.steps.length);
  window.dispatchEvent(new CustomEvent("transguru:routechange"));
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectRoute(tab.dataset.route));
  tab.addEventListener("keydown", (event) => {
    const rtl = document.documentElement.dir === "rtl";
    const targets = {
      ArrowRight: (index + (rtl ? -1 : 1) + tabs.length) % tabs.length,
      ArrowDown: (index + 1) % tabs.length,
      ArrowLeft: (index + (rtl ? 1 : -1) + tabs.length) % tabs.length,
      ArrowUp: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const target = tabs[targets[event.key]];
    selectRoute(target.dataset.route);
    target.focus();
  });
});

expand.addEventListener("click", () => {
  fullSteps.hidden = !fullSteps.hidden;
  expand.setAttribute("aria-expanded", String(!fullSteps.hidden));
  expand.firstChild.textContent = fullSteps.hidden
    ? format("expandSteps", routes[activeRoute].steps.length)
    : ui.collapseSteps;
});

const dialog = document.querySelector("#checklist-dialog");
const checklistRoute = document.querySelector("#checklist-route");
const checklistItems = document.querySelector("#checklist-items");
const checklistState = { i2a: new Set(), a2i: new Set(), a2a: new Set() };
let dialogTrigger = null;

function updateProgress() {
  const count = checklistState[checklistRoute.value].size;
  document.querySelector("#checklist-progress").textContent =
    count === 4 ? ui.complete : format("progress", count);
}

function renderChecklist() {
  const key = checklistRoute.value;
  checklistItems.replaceChildren(
    ...routes[key].checklist.map((text, index) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = checklistState[key].has(index);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) checklistState[key].add(index);
        else checklistState[key].delete(index);
        updateProgress();
      });
      label.append(checkbox, makeText("span", text));
      return label;
    }),
  );
  updateProgress();
}

document.querySelectorAll("[data-open-checklist]").forEach((button) =>
  button.addEventListener("click", () => {
    dialogTrigger = button;
    checklistRoute.value = activeRoute;
    renderChecklist();
    dialog.showModal();
  }),
);
checklistRoute.addEventListener("change", renderChecklist);
document
  .querySelector("#close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom)
  )
    dialog.close();
});
dialog.addEventListener("close", () => dialogTrigger?.focus());

const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", ui.openMenu);
}
menuButton.addEventListener("click", () => {
  mobileNav.hidden = !mobileNav.hidden;
  menuButton.setAttribute("aria-expanded", String(!mobileNav.hidden));
  menuButton.setAttribute(
    "aria-label",
    mobileNav.hidden ? ui.openMenu : ui.closeMenu,
  );
});
mobileNav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document
  .querySelector('a[href="#faq-privacy"]')
  .addEventListener("click", () => {
    document.querySelector("#faq-privacy").open = true;
  });
const requestedRoute = new URLSearchParams(location.search).get("route");
selectRoute(Object.hasOwn(routes, requestedRoute) ? requestedRoute : "i2a");
