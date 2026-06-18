import { db } from "../config";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  deleteDoc
} from "firebase/firestore";

// Detect if we should use local storage fallback
const isDummy = () => {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !key || key.includes("Dummy") || key === "" || !db;
};

// LocalStorage Helper functions
const getLocalCollection = (colName: string): any[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(`galf_db_${colName}`);
  return data ? JSON.parse(data) : [];
};

const saveLocalCollection = (colName: string, data: any[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`galf_db_${colName}`, JSON.stringify(data));
};

export const dbGetDoc = async (colName: string, id: string): Promise<any> => {
  if (isDummy()) {
    const list = getLocalCollection(colName);
    const item = list.find((x) => x.id === id || x.uid === id);
    return item ? { exists: () => true, data: () => item, id } : { exists: () => false, data: () => null, id };
  } else {
    try {
      const docRef = doc(db, colName, id);
      const snap = await getDoc(docRef);
      return snap;
    } catch (e) {
      console.warn("Firestore error, falling back to LocalStorage:", e);
      const list = getLocalCollection(colName);
      const item = list.find((x) => x.id === id || x.uid === id);
      return item ? { exists: () => true, data: () => item, id } : { exists: () => false, data: () => null, id };
    }
  }
};

export const dbSetDoc = async (colName: string, id: string, data: any): Promise<void> => {
  const docData = { ...data, id, updatedAt: new Date().toISOString() };
  if (!docData.createdAt) {
    docData.createdAt = new Date().toISOString();
  }

  if (isDummy()) {
    const list = getLocalCollection(colName);
    const idx = list.findIndex((x) => x.id === id || x.uid === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...docData };
    } else {
      list.push(docData);
    }
    saveLocalCollection(colName, list);
  } else {
    try {
      const docRef = doc(db, colName, id);
      await setDoc(docRef, data, { merge: true });
    } catch (e) {
      console.warn("Firestore error in dbSetDoc, saving to LocalStorage:", e);
      const list = getLocalCollection(colName);
      const idx = list.findIndex((x) => x.id === id || x.uid === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...docData };
      } else {
        list.push(docData);
      }
      saveLocalCollection(colName, list);
    }
  }
};

export const dbUpdateDoc = async (colName: string, id: string, data: any): Promise<void> => {
  const docData = { ...data, updatedAt: new Date().toISOString() };
  if (isDummy()) {
    const list = getLocalCollection(colName);
    const idx = list.findIndex((x) => x.id === id || x.uid === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...docData };
      saveLocalCollection(colName, list);
    } else {
      throw new Error(`Document not found: ${colName}/${id}`);
    }
  } else {
    try {
      const docRef = doc(db, colName, id);
      await updateDoc(docRef, data);
    } catch (e) {
      console.warn("Firestore error in dbUpdateDoc, updating in LocalStorage:", e);
      const list = getLocalCollection(colName);
      const idx = list.findIndex((x) => x.id === id || x.uid === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...docData };
        saveLocalCollection(colName, list);
      } else {
        throw e;
      }
    }
  }
};

export const dbAddDoc = async (colName: string, data: any): Promise<string> => {
  const id = `${colName.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const docData = { 
    ...data, 
    id, 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  };

  if (isDummy()) {
    const list = getLocalCollection(colName);
    list.push(docData);
    saveLocalCollection(colName, list);
    return id;
  } else {
    try {
      const docRef = await addDoc(collection(db, colName), data);
      return docRef.id;
    } catch (e) {
      console.warn("Firestore error in dbAddDoc, adding to LocalStorage:", e);
      const list = getLocalCollection(colName);
      list.push(docData);
      saveLocalCollection(colName, list);
      return id;
    }
  }
};

export interface QueryFilter {
  field: string;
  op: '==' | '>' | '<' | '>=' | '<=' | 'array-contains';
  value: any;
}

export const dbGetDocs = async (
  colName: string, 
  filters?: QueryFilter[], 
  orderField?: string, 
  orderDir: 'asc' | 'desc' = 'asc',
  limitVal?: number
): Promise<any[]> => {
  if (isDummy()) {
    let list = getLocalCollection(colName);
    
    // Apply filters
    if (filters) {
      for (const filter of filters) {
        const { field, op, value } = filter;
        list = list.filter((item) => {
          const itemVal = item[field];
          if (op === '==') return itemVal === value;
          if (op === '>') return itemVal > value;
          if (op === '<') return itemVal < value;
          if (op === '>=') return itemVal >= value;
          if (op === '<=') return itemVal <= value;
          if (op === 'array-contains') return Array.isArray(itemVal) && itemVal.includes(value);
          return true;
        });
      }
    }

    // Apply sorting
    if (orderField) {
      list.sort((a, b) => {
        const aVal = a[orderField] || "";
        const bVal = b[orderField] || "";
        if (aVal < bVal) return orderDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return orderDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (limitVal) {
      list = list.slice(0, limitVal);
    }

    return list.map(item => ({
      id: item.id || item.uid,
      data: () => item,
      exists: () => true
    }));
  } else {
    try {
      const colRef = collection(db, colName);
      const queryConstraints: any[] = [];
      
      if (filters) {
        filters.forEach(f => {
          queryConstraints.push(where(f.field, f.op, f.value));
        });
      }
      
      if (orderField) {
        queryConstraints.push(orderBy(orderField, orderDir));
      }
      
      if (limitVal) {
        queryConstraints.push(limit(limitVal));
      }

      const q = query(colRef, ...queryConstraints);
      const snap = await getDocs(q);
      return snap.docs;
    } catch (e) {
      console.warn("Firestore error in dbGetDocs, querying LocalStorage:", e);
      // Fallback query execution on localStorage
      let list = getLocalCollection(colName);
      if (filters) {
        for (const filter of filters) {
          const { field, op, value } = filter;
          list = list.filter((item) => {
            const itemVal = item[field];
            if (op === '==') return itemVal === value;
            if (op === '>') return itemVal > value;
            if (op === '<') return itemVal < value;
            if (op === '>=') return itemVal >= value;
            if (op === '<=') return itemVal <= value;
            if (op === 'array-contains') return Array.isArray(itemVal) && itemVal.includes(value);
            return true;
          });
        }
      }
      if (orderField) {
        list.sort((a, b) => {
          const aVal = a[orderField] || "";
          const bVal = b[orderField] || "";
          if (aVal < bVal) return orderDir === 'asc' ? -1 : 1;
          if (aVal > bVal) return orderDir === 'asc' ? 1 : -1;
          return 0;
        });
      }
      if (limitVal) list = list.slice(0, limitVal);
      return list.map(item => ({
        id: item.id || item.uid,
        data: () => item,
        exists: () => true
      }));
    }
  }
};

export const dbDeleteDoc = async (colName: string, id: string): Promise<void> => {
  if (isDummy()) {
    const list = getLocalCollection(colName);
    const filtered = list.filter((x) => x.id !== id && x.uid !== id);
    saveLocalCollection(colName, filtered);
  } else {
    try {
      const docRef = doc(db, colName, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn("Firestore error in dbDeleteDoc, deleting from LocalStorage:", e);
      const list = getLocalCollection(colName);
      const filtered = list.filter((x) => x.id !== id && x.uid !== id);
      saveLocalCollection(colName, filtered);
    }
  }
};
