const list = document.getElementById("navigate__bookmark-list");
const pathTitle = document.getElementById("navigate__header__path-tile");
const navigateBackBtn = document.getElementById("navigate__header__back-button");
const searchInput = document.getElementById("search__input");
const searchClearBtn = document.getElementById("search__clear-button");

let currentFolderId = "1";
let folderStack = [];

function renderBookmarks(folderId) {
  chrome.bookmarks.getChildren(folderId, (nodes) => {
    list.innerHTML = "";

    if (!nodes.length) {
      list.innerHTML = '<div class="bookmark-list__empty">(empty)</div>';
      return;
    }

    for (const node of nodes) {
      const div = document.createElement("div");
      div.className = "bookmark-list__item " + (node.url ? "bookmark-list__bookmark" : "bookmark-list__folder");

      if (!node.url) {
        const icon = document.createElement("img");
        icon.className = "icon";
        icon.src =
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="%23fbbf24"><path d="M2 4a1 1 0 0 0-1 1v9.5A1.5 1.5 0 0 0 2.5 16h13a1.5 1.5 0 0 0 1.5-1.5V6a1 1 0 0 0-1-1H9L7 3H2z"/></svg>';
        div.appendChild(icon);
      }

      const text = document.createElement("span");
      text.textContent = node.title || "(untitled)";
      div.appendChild(text);

      div.onclick = () =>
        node.url
          ? chrome.tabs.create({ url: node.url })
          : openFolder(node.id, node.title);

      list.appendChild(div);
    }

    pathTitle.textContent = folderId === "0" ? "Bookmarks" : "Folder";
    navigateBackBtn.style.display = folderStack.length > 0 ? "inline-block" : "none";
  });
}

function openFolder(id, title) {
  folderStack.push(currentFolderId);
  currentFolderId = id;
  renderBookmarks(id);
}

function goBack() {
  if (folderStack.length > 0) {
    currentFolderId = folderStack.pop();
    renderBookmarks(currentFolderId);
  }
}

navigateBackBtn.addEventListener("click", goBack);
renderBookmarks(currentFolderId);

/* Bookmarks search */

let searchTimeout;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  clearTimeout(searchTimeout);

  if (query === "") {
    searchClearBtn.style.display = "none";
    renderBookmarks(currentFolderId);
    return;
  }

  searchClearBtn.style.display = "inline-block";
  searchTimeout = setTimeout(() => performSearch(query), 200);
});

searchClearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchClearBtn.style.display = "none";
  renderBookmarks(currentFolderId);
});

async function performSearch(query) {
  const bookmarks = await new Promise((resolve) =>
    chrome.bookmarks.search(query, (results) =>
      resolve(results.filter((n) => n.url))
    )
  );

  list.innerHTML = "";

  if (!bookmarks.length) {
    list.innerHTML = '<div class="bookmark-list__empty">No results found</div>';
    pathTitle.textContent = `Search: "${query}"`;
    return;
  }

  const paths = await Promise.all(
    bookmarks.map((b) => getBookmarkPath(b.parentId))
  );

  for (let i = 0; i < bookmarks.length; i++) {
    const node = bookmarks[i];
    const div = document.createElement("div");
    div.className = "bookmark-list__item bookmark-list__bookmark fade-in";
    div.style.flexDirection = "column";
    div.style.alignItems = "flex-start";

    const pathElem = document.createElement("div");
    pathElem.className = "bookmark-list__item-path";
    pathElem.textContent = paths[i] || "Bookmarks";
    div.appendChild(pathElem);

    const title = document.createElement("div");
    title.textContent = node.title || "(untitled)";
    title.className = "bookmark-list__item-title";
    div.appendChild(title);

    div.onclick = () => chrome.tabs.create({ url: node.url });
    list.appendChild(div);
  }

  pathTitle.textContent = `Search: "${query}"`;
  navigateBackBtn.style.display = folderStack.length > 0 ? "inline-block" : "none";
}

async function getBookmarkPath(parentId) {
  return new Promise((resolve) => {
    if (!parentId || parentId === "1") return resolve("Bookmarks");

    chrome.bookmarks.get(parentId, (parentNodes) => {
      const parent = parentNodes?.[0];
      if (!parent) return resolve("Bookmarks");

      getBookmarkPath(parent.parentId).then((ancestorPath) => {
        resolve(`${ancestorPath}/${parent.title}`);
      });
    });
  });
}
