import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Map Kurdish level names to numbers for document IDs
 */
const levelToNumber = (level: string): string => {
  return level
    .replace('Yekem', '1')
    .replace('Duyem', '2')
    .replace('Sêyem', '3');
};

/**
 * Generate a Firestore document ID
 */
export const generateDocId = (parts: string[], options?: { separator?: string; sanitize?: boolean }): string => {
  const { separator = ' ', sanitize = false } = options || {};
  let id = parts.join(separator);
  
  if (sanitize) {
    id = id.replace(/\s+/g, ' ').replace(/\//g, '-');
  }
  
  return id;
};

/**
 * Save data to Firestore with error handling
 */
export const saveToFirestore = async (
  collectionName: string,
  docId: string,
  payload: Record<string, any>
): Promise<void> => {
  try {
    await setDoc(doc(db, collectionName, docId), payload);
  } catch (error) {
    console.error(`Failed to save to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Generate course application document ID: "1 2026-06-13 John Doe"
 */
export const generateCourseDocId = (option: string, name: string): string => {
  const level = levelToNumber(option);
  const today = new Date().toISOString().slice(0, 10);
  return generateDocId([level, today, name]);
};

/**
 * Generate certificate document ID: "2026-06-13 1 John Doe"
 */
export const generateCertificateDocId = (date: string, level: string, name: string): string => {
  const levelNum = levelToNumber(level);
  return generateDocId([date, levelNum, name], { separator: ' ', sanitize: true });
};
