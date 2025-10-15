const sortButton = document.getElementById("sort-button");

sortButton.addEventListener("click", () => {
  sortButton.style.backgroundColor = "#2563eb";

  chrome.runtime.sendMessage({ action: "sortBookmarks" }, (response) => {
    if (chrome.runtime.lastError) {
      console.log(
        "`chrome.runtime.lastError` error:" + chrome.runtime.lastError.message
      );
      sortButton.style.backgroundColor = "#dc2626";
    } else if (response && response.status === 200) {
      sortButton.style.backgroundColor = "#16a34a";
    } else {
      console.log("Didn't get any response");
      sortButton.style.backgroundColor = "#dc2626";
    }
  });
});
