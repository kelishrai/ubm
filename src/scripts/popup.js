import { sortAllBookmarks } from "./sort.js";

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search__input").focus();
});

const sortButton = document.getElementById("sort-button");

sortButton.addEventListener("click", async () => {
  try {
    await sortAllBookmarks();
    sortButton.style.backgroundColor = "#16a34a";
  } catch {
    sortButton.style.backgroundColor = "#dc2626";
  }
});
