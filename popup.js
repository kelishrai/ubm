document.getElementById("sort-btn").addEventListener("click", () => {
  const status = document.getElementById("status");
  status.textContent = "Sorting bookmarks...";

  chrome.runtime.sendMessage({ action: "sortBookmarks" }, (response) => {
    if (chrome.runtime.lastError) {
      status.textContent = "⚠️ " + chrome.runtime.lastError.message;
    } else if (response && response.status) {
      status.textContent = response.status;
    } else {
      status.textContent = "⚠️ Didn't get any response";
    }
  });
});
