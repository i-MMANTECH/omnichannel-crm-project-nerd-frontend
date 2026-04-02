const DB_NAME = "omnicrm-failed-messages";
const STORE_NAME = "failed-messages";
const DB_VERSION = 1;

const openDatabase = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("chatKey", "chatKey", { unique: false });
      }
    };
  });

const runTransaction = async (mode, executor) => {
  const db = await openDatabase();

  if (!db) {
    return mode === "readonly" ? [] : undefined;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);

    let request;
    try {
      request = executor(store);
    } catch (error) {
      reject(error);
      return;
    }

    if (request) {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } else {
      transaction.oncomplete = () => resolve(undefined);
      transaction.onerror = () => reject(transaction.error);
    }
  });
};

export const saveFailedMessageRecord = async (record) =>
  runTransaction("readwrite", (store) => store.put(record));

export const deleteFailedMessageRecord = async (id) =>
  runTransaction("readwrite", (store) => store.delete(id));

export const getFailedMessageRecords = async (chatKey) => {
  const db = await openDatabase();

  if (!db) {
    return [];
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("chatKey");
    const request = index.getAll(chatKey);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};
