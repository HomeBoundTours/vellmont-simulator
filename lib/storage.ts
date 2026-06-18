import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AssessmentData } from '@/types';

interface VellmontDB extends DBSchema {
  assessments: {
    key: string;
    value: AssessmentData;
    indexes: { 'by-date': string };
  };
}

let dbPromise: Promise<IDBPDatabase<VellmontDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<VellmontDB>('vellmont-simulator', 1, {
      upgrade(db) {
        const store = db.createObjectStore('assessments', { keyPath: 'id' });
        store.createIndex('by-date', 'createdAt');
      },
    });
  }
  return dbPromise;
}

export async function saveAssessment(data: AssessmentData): Promise<string> {
  const db = await getDB();
  if (!db) throw new Error('IndexedDB not available');
  const id = data.id || `assessment-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const now = new Date().toISOString();
  const record: AssessmentData = {
    ...data,
    id,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
  await db.put('assessments', record);
  return id;
}

export async function loadAssessment(id: string): Promise<AssessmentData | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('assessments', id);
}

export async function listAssessments(): Promise<AssessmentData[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('assessments');
}

export async function deleteAssessment(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('assessments', id);
}
