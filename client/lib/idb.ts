/**
 * idb.ts — Thin IndexedDB wrapper for Guidely offline storage.
 * Stores quiz questions, quiz results, and timeline events so the
 * app can work with zero connectivity after the first visit.
 */

const DB_NAME = "guidely_offline";
const DB_VERSION = 1;

type StoreName = "quiz_questions" | "quiz_result" | "timelines";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      ["quiz_questions", "quiz_result", "timelines"].forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id", autoIncrement: true });
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Overwrite all records in a store with a new array. */
export async function idbSetAll<T extends object>(
  store: StoreName,
  items: T[]
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const s = tx.objectStore(store);
    s.clear();
    items.forEach((item, i) => s.put({ ...item, id: (item as Record<string, unknown>)["id"] ?? i + 1 }));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Read all records from a store. */
export async function idbGetAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

/** Put a single object (upsert). Object must have an `id` field or one will be auto-added. */
export async function idbPut<T extends object>(
  store: StoreName,
  item: T,
  key: IDBValidKey = "singleton"
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put({ ...item, id: key });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Retrieve a single object by key. */
export async function idbGet<T>(
  store: StoreName,
  key: IDBValidKey = "singleton"
): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}
