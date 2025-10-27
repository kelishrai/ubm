import { sortAllBookmarks } from "./sort.js";

const sortButton = document.getElementById("sort-button");

sortButton.addEventListener("click", async () => {
  try {
    await sortAllBookmarks();
    sortButton.style.backgroundColor = "#16a34a";
  } catch {
    sortButton.style.backgroundColor = "#dc2626";
  }
});
