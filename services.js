import { sortAllBookmarks } from "./sortBookmarks.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("UBM is ready to take over your bookmarks!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sortBookmarks") {
    (async () => {
      try {
        await sortAllBookmarks();
        sendResponse({ status: 200 });
      } catch (err) {
        console.log("`chrome.runtime.onMessage` error:" + err);
        sendResponse({ status: 400 });
      }
    })();

    return true;
  }
});
