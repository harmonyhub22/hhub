export const getAllKeys = (dbName:string, objectStoreName:string, callback:any) => {
  const request = indexedDB.open(dbName, 1);
  request.onerror = () => {
    console.log('error connecting to indexed db');
  }
  request.onsuccess = (event:any) => {
    const db = request.result;
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const getAllRequest = transaction.objectStore(objectStoreName).getAllKeys();
    getAllRequest.onerror = () => {
      console.log('error deleting all');
    };
    getAllRequest.onsuccess = () => {
      const allRecords = getAllRequest.result;
      callback(allRecords);
    };
  };
};

export const deleteAll = (dbName:string, objectStoreName:string, callback:any) => {
  const request = indexedDB.open(dbName, 1);
  request.onerror = () => {
    console.log('error connecting to indexed db');
  }
  request.onsuccess = (event:any) => {
    const db = request.result;
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const getAllRequest = transaction.objectStore(objectStoreName).getAllKeys();
    getAllRequest.onerror = () => {
      console.log('error deleting all');
    };
    getAllRequest.onsuccess = () => {
      const allRecords = getAllRequest.result;
      allRecords.forEach((key:any) => {
        const deleteRequest = transaction.objectStore(objectStoreName).delete(key);
        deleteRequest.onsuccess = () => {
          console.log('deleted');
        };
      });
    };
  };
};

export const get = (dbName:string, objectStoreName:string, query:string, callback:any) => {
  const request = indexedDB.open(dbName, 1);
  request.onerror = () => {
    console.log('error connecting to indexed db');
  };
  request.onsuccess = (event:any) => {
    const db = request.result;
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const getRequest = transaction.objectStore(objectStoreName)
      .get(query);
    getRequest.onerror = () => {
      console.log('error getting data');
    }
    getRequest.onsuccess = (event:any) => {
      const buffer = getRequest.result;
      callback(buffer);
    };
  };
};

export const put = (dbName:string, objectStoreName:string, key:string, value:any, callback:any) => {
  const request = indexedDB.open(dbName, 1);
  request.onerror = () => {
    console.log('error connecting to indexed db');
  };
  request.onsuccess = (event:any) => {
    const db = request.result;
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const putRequest = transaction.objectStore(objectStoreName)
      .put(value, key);
    putRequest.onerror = () => {
      console.log('error putting data');
    };
    putRequest.onsuccess = (event:any) => {
      console.log('putted');
    };
  }
};