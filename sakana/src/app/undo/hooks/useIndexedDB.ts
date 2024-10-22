import { useCallback, useMemo } from 'react'

interface StrokeData {
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
}

interface IndexedDBParams {
  testId: string | null;
  deliveryId: string | null;
}

export const useIndexedDB = ({ testId, deliveryId }: IndexedDBParams) => {
  const DB_NAME = useMemo(() => {
    if (!testId || !deliveryId) return null;
    return `canvas-db-${testId}-${deliveryId}`;
  }, [testId, deliveryId]);

  const STORE_NAME = useMemo(() => {
    if (!testId || !deliveryId) return null;
    return `canvas-store-${testId}-${deliveryId}`;
  }, [testId, deliveryId]);

  const openDB = useCallback(() => {
    if (!DB_NAME || !STORE_NAME) return Promise.reject('Invalid DB or store name');

    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      };
    });
  }, [DB_NAME, STORE_NAME]);

  const saveStroke = useCallback(async (strokeData: StrokeData) => {
    if (!STORE_NAME || !deliveryId) return;
    try {
      const db = await openDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ ...strokeData, id: deliveryId });

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Failed to save stroke:', error);
    }
  }, [STORE_NAME, deliveryId, openDB]);

  const getStroke = useCallback(async (): Promise<StrokeData | null> => {
    if (!STORE_NAME || !deliveryId) return null;
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(deliveryId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || null);
      });
    } catch (error) {
      console.error('Failed to get stroke:', error);
      return null;
    }
  }, [STORE_NAME, deliveryId, openDB]);

  const clearStrokes = useCallback(async () => {
    if (!STORE_NAME) return;
    try {
      const db = await openDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Failed to clear strokes:', error);
    }
  }, [STORE_NAME, openDB]);

  const deleteAllDatabases = useCallback(async () => {
    try {
      const databases = await window.indexedDB.databases();
      const deletionPromises = databases.map(database => 
        new Promise<void>((resolve, reject) => {
          const request = window.indexedDB.deleteDatabase(database.name!);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        })
      );
      await Promise.all(deletionPromises);
      console.log('All IndexedDB databases deleted');
    } catch (error) {
      console.error('Failed to delete all databases:', error);
    }
  }, []);

  return { saveStroke, getStroke, clearStrokes, deleteAllDatabases };
};