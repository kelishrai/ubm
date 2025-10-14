let currentFolderId = '0'; // root
let folderStack = [];

function renderBookmarks(folderId) {
  chrome.bookmarks.getChildren(folderId, (nodes) => {
    const list = document.getElementById('bookmarkList');
    list.innerHTML = '';

    if (nodes.length === 0) {
      list.innerHTML = '<div class="empty">(empty)</div>';
      return;
    }

    nodes.forEach((node) => {
      const div = document.createElement('div');
      div.className = 'item ' + (node.url ? 'bookmark' : 'folder');

      // Folder icon only for folders
      if (!node.url) {
        const icon = document.createElement('img');
        icon.className = 'icon';
        icon.src =
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="%23fbbf24"><path d="M2 4a1 1 0 0 0-1 1v9.5A1.5 1.5 0 0 0 2.5 16h13a1.5 1.5 0 0 0 1.5-1.5V6a1 1 0 0 0-1-1H9L7 3H2z"/></svg>';
        div.appendChild(icon);
      }

      const text = document.createElement('span');
      text.textContent = node.title || '(untitled)';
      div.appendChild(text);

      // Behavior for clicking
      if (node.url) {
        div.onclick = () => chrome.tabs.create({ url: node.url });
      } else {
        div.onclick = () => openFolder(node.id, node.title);
      }

      list.appendChild(div);
    });

    // Update header and back button
    document.getElementById('pathTitle').textContent =
      folderId === '0' ? 'Bookmarks' : (nodes[0]?.parentTitle || 'Folder');
    document.getElementById('backBtn').style.display =
      folderStack.length > 0 ? 'inline-block' : 'none';
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

document.getElementById('backBtn').addEventListener('click', goBack);
renderBookmarks(currentFolderId);
