// Cache for mapping Appwrite user IDs to display names (e.g., 'wahid', 'zero')
const STORAGE_KEY = 'inkflow_author_map';

function getAuthorMap() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveAuthorName(userId, name) {
  if (!userId || !name || name === 'Author' || name === 'Inkflow Writer') return;
  try {
    const map = getAuthorMap();
    map[userId] = name;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Error saving author to cache:', e);
  }
}

export function getAuthorName(userId, currentUserData, postAuthorName) {
  if (postAuthorName && postAuthorName !== 'Author' && postAuthorName !== 'Inkflow Writer') {
    if (userId) saveAuthorName(userId, postAuthorName);
    return postAuthorName;
  }

  if (userId && currentUserData?.$id && String(userId).trim() === String(currentUserData.$id).trim()) {
    if (currentUserData.name) {
      saveAuthorName(userId, currentUserData.name);
      return currentUserData.name;
    }
  }

  if (userId) {
    const map = getAuthorMap();
    if (map[userId]) {
      return map[userId];
    }
  }

  return 'Author';
}
