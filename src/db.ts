let db: IDBDatabase;

const dbName = 'InterviewResponsesDB';
const storeName = 'responses';

const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("IndexedDB error");
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    };
  });
};

export const saveResponse = async (question: string, textResponse: string, audioFile: string, videoFile: string): Promise<number> => {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add({
      question,
      textResponse,
      audioFile,
      videoFile,
      createdAt: new Date().toISOString()
    });

    request.onerror = () => reject("Error saving response");
    request.onsuccess = () => resolve(request.result as number);
  });
};

export const getResponses = async (): Promise<any[]> => {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject("Error getting responses");
    request.onsuccess = () => resolve(request.result);
  });
};

export default { initDB, saveResponse, getResponses };