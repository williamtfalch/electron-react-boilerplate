/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';

export function useIndexedDB(
  dbName: string,
  onReady: (db: IDBDatabase) => void,
  onError: (error: Event) => void,
) {
  const [db, setDb] = React.useState<IDBDatabase | null>(null);

  React.useEffect(() => {
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
      setDb((event.target as any).result);
    };

    request.onupgradeneeded = (event) => {
      const _db = (event.target as any).result;

      _db.createObjectStore('logs', { keyPath: 'id' });
    };

    request.onerror = (event) => onError(event);
  }, []);

  return db;
}
