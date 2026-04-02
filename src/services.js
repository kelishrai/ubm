import { sortAllBookmarks } from "./scripts/sort.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("UBM is ready!");
});

let sortTimeout;

function triggerAutoSort() {
  clearTimeout(sortTimeout);
  sortTimeout = setTimeout(() => sortAllBookmarks(), 1000);
}

chrome.bookmarks.onChanged.addListener(triggerAutoSort);
chrome.bookmarks.onRemoved.addListener(triggerAutoSort);
chrome.bookmarks.onMoved.addListener(triggerAutoSort);
