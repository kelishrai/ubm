const sortButton = document.getElementById("sort-button");

sortButton.addEventListener("click", async () => {
  try {
    await sortAllBookmarks();
    sortButton.style.backgroundColor = "#16a34a";
  } catch {
    sortButton.style.backgroundColor = "#dc2626";
  }
});

async function sortAllBookmarks() {
  const [root] = await chrome.bookmarks.getTree();
  await sortNode(root);
}

async function sortNode(node) {
  if (!node.children || node.children.length === 0) return;

  const folders = node.children.filter((c) => !c.url);
  const bookmarks = node.children.filter((c) => c.url);

  folders.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );
  bookmarks.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );

  const sorted = [...folders, ...bookmarks];
  for (let i = 0; i < sorted.length; i++) {
    try {
      await chrome.bookmarks.move(sorted[i].id, { index: i });
    } catch {
      console.log("Invalid move");
    }
  }

  for (const folder of folders) {
    await sortNode(folder);
  }
}
