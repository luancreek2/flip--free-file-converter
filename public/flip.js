/* Flip's shell interactions. Conversion/upload handling remains in script.js. */
(function () {
  "use strict";
  const root = document.documentElement;
  const search = document.getElementById("search-dialog");
  const menu = document.getElementById("mobile-menu");
  const menuButton = document.getElementById("mobile-menu-button");
  const input = document.getElementById("search-input");
  const main = document.querySelector("main");
  if (main && !main.id) main.id = "main-content";

  function storedTheme() {
    try {
      const value = localStorage.getItem("flip-theme");
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }
  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
      icon.classList.toggle("hidden", icon.dataset.themeIcon !== theme);
    });
  }
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  applyTheme(storedTheme() || (system.matches ? "dark" : "light"));
  document.querySelectorAll("[data-theme-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("flip-theme", next);
      } catch {
        /* Session toggle still works. */
      }
    }),
  );
  system.addEventListener("change", () => {
    if (!storedTheme()) applyTheme(system.matches ? "dark" : "light");
  });

  function closeCategories(except) {
    document.querySelectorAll(".flip-nav-category[open]").forEach((category) => {
      if (category !== except) category.open = false;
    });
  }
  document.querySelectorAll(".flip-nav-category").forEach((category) => {
    category.addEventListener("toggle", () => {
      if (category.open) closeCategories(category);
    });
    category.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        category.open = false;
        category.querySelector("summary").focus();
      }
      if (event.key === "ArrowDown" && event.target.tagName === "SUMMARY") {
        event.preventDefault();
        category.open = true;
        closeCategories(category);
        category.querySelector("a")?.focus();
      }
    });
    category.addEventListener("focusout", (event) => {
      if (!category.contains(event.relatedTarget)) category.open = false;
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".flip-nav-category")) closeCategories();
  });

  function syncModalState() {
    document.body.style.overflow = search?.open || menu?.open ? "hidden" : "";
    menuButton?.setAttribute("aria-expanded", String(Boolean(menu?.open)));
  }
  [search, menu].forEach((dialog) => {
    if (!dialog) return;
    dialog.addEventListener("close", syncModalState);
    dialog.addEventListener("click", (event) => {
      const box = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom)
      )
        dialog.close();
    });
  });
  menuButton?.addEventListener("click", () => {
    menu.showModal();
    syncModalState();
  });
  document.querySelector("[data-mobile-close]")?.addEventListener("click", () => menu.close());
  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) menu.close();
  });
  window.matchMedia("(min-width: 1200px)").addEventListener("change", (event) => {
    if (event.matches && menu?.open) menu.close();
  });

  if (!search || !input) return;
  const results = Array.from(search.querySelectorAll("[data-search-result]"));
  function filterResults() {
    const words = input.value
      .toLowerCase()
      .replace(/→/g, " ")
      .split(/\s+/)
      .filter((word) => word && word !== "to");
    let count = 0;
    results.forEach((result) => {
      const match = words.every((word) =>
        (result.textContent + " " + result.dataset.keywords).toLowerCase().includes(word),
      );
      result.classList.toggle("hidden", !match);
      if (match) count++;
    });
    document.getElementById("search-empty").classList.toggle("hidden", count > 0);
  }
  function openSearch() {
    if (menu?.open) menu.close();
    closeCategories();
    if (!search.open) search.showModal();
    input.focus();
    syncModalState();
  }
  document
    .querySelectorAll("[data-search-trigger]")
    .forEach((button) => button.addEventListener("click", openSearch));
  document.querySelector("[data-search-close]")?.addEventListener("click", () => search.close());
  input.addEventListener("input", filterResults);
  search.addEventListener("close", () => {
    input.value = "";
    filterResults();
  });
  search.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) search.close();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (search.open) search.close();
      else openSearch();
    }
  });
  search.addEventListener("keydown", (event) => {
    const visible = results.filter((result) => !result.classList.contains("hidden"));
    if (!visible.length) return;
    const index = visible.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next =
        event.key === "ArrowDown"
          ? (index + 1) % visible.length
          : index <= 0
            ? visible.length - 1
            : index - 1;
      visible[next].focus();
    } else if (event.key === "Enter" && document.activeElement === input) {
      event.preventDefault();
      visible[0].click();
    }
  });
})();
