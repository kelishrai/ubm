export async function sortAllBookmarks() {
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
      // ignore invalid moves
    }
  }

  for (const folder of folders) {
    await sortNode(folder);
  }
}
