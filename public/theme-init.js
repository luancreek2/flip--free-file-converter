/**
 * Flip - pre-paint theme bootstrap
 *
 * Loaded synchronously in <head> so a saved theme is applied before the first paint and the page
 * does not flash the wrong color scheme. The full theme toggle lives in /flip.js.
 */
(function () {
  "use strict";

  var root = document.documentElement;

  try {
    var stored = localStorage.getItem("flip-theme");
    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
      return;
    }
  } catch {
    /* localStorage can be blocked; fall through to the system preference. */
  }

  root.setAttribute(
    "data-theme",
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );
})();
