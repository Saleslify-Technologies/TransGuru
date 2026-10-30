"use strict";

const languagePickers = [
  ...document.querySelectorAll("[data-language-picker]"),
];
function closeLanguagePickers(except) {
  languagePickers.forEach((picker) => {
    if (picker !== except) picker.open = false;
  });
}
languagePickers.forEach((picker) => {
  picker.addEventListener("toggle", () => {
    if (picker.open) closeLanguagePickers(picker);
  });
  picker.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && picker.open) {
      event.preventDefault();
      picker.open = false;
      picker.querySelector("summary").focus();
    }
  });
});
document.addEventListener("click", (event) => {
  languagePickers.forEach((picker) => {
    if (!picker.contains(event.target)) picker.open = false;
  });
});
document.addEventListener("focusin", (event) => {
  languagePickers.forEach((picker) => {
    if (!picker.contains(event.target)) picker.open = false;
  });
});
document.querySelectorAll("[data-language-switch]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("aria-current") === "page") {
      event.preventDefault();
      const picker = link.closest("[data-language-picker]");
      if (picker) {
        picker.open = false;
        picker.querySelector("summary").focus();
      }
      return;
    }
    const target = new URL(link.href, location.href);
    target.hash = location.hash;
    const selectedRoute = document.querySelector(
      '[data-route][aria-selected="true"]',
    )?.dataset.route;
    if (selectedRoute && selectedRoute !== "i2a")
      target.searchParams.set("route", selectedRoute);
    link.href = target.href;
  });
});
