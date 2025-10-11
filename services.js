import { sortAllBookmarks } from "./sortBookmarks.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("NoEx installed and ready.");
});

// Doesn't seem to work well right now, need to check
chrome.bookmarks.onChanged.addListener(async (id, bookmark) => {
  try {
    await sortAllBookmarks();
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "NoEx",
      message: "✅ Bookmarks auto-sorted successfully!",
    });
  } catch (err) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "NoEx",
      message: "❌ Auto-sort failed: " + err.message,
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sortBookmarks") {
    (async () => {
      try {
        await sortAllBookmarks();
        console.log("✅ Bookmarks sorted successfully!");
        sendResponse({ status: "✅ Bookmarks sorted successfully!" });
      } catch (err) {
        console.error("❌ Error sorting bookmarks:", err);
        sendResponse({ status: "❌ Error: " + err.message });
      }
    })();

    return true;
  }
});
