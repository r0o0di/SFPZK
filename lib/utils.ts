import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

const STORAGE_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DISPLAY_DATE_REGEX = /^\d{2}-\d{2}-\d{4}$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeDateForStorage(dateString: string | null | undefined): string {
  const value = String(dateString || '').trim();
  if (!value) return '';

  if (STORAGE_DATE_REGEX.test(value)) {
    return value;
  }

  const parts = value.split('-').map(part => part.trim());
  if (parts.length === 3) {
    const [first, second, third] = parts;
    if (/^\d{4}$/.test(first) && /^\d{1,2}$/.test(second) && /^\d{1,2}$/.test(third)) {
      return `${first}-${second.padStart(2, '0')}-${third.padStart(2, '0')}`;
    }
    if (/^\d{1,2}$/.test(first) && /^\d{1,2}$/.test(second) && /^\d{4}$/.test(third)) {
      return `${third}-${first.padStart(2, '0')}-${second.padStart(2, '0')}`;
    }
  }

  return value;
}

export function formatDateForDisplay(dateString: string | null | undefined): string {
  const value = String(dateString || '').trim();
  if (!value) return '';

  if (DISPLAY_DATE_REGEX.test(value)) {
    return value;
  }

  const parts = value.split('-').map(part => part.trim());
  if (parts.length === 3) {
    const [first, second, third] = parts;
    if (/^\d{4}$/.test(first) && /^\d{1,2}$/.test(second) && /^\d{1,2}$/.test(third)) {
      return `${third.padStart(2, '0')}-${second.padStart(2, '0')}-${first}`;
    }
    if (/^\d{1,2}$/.test(first) && /^\d{1,2}$/.test(second) && /^\d{4}$/.test(third)) {
      return `${first.padStart(2, '0')}-${second.padStart(2, '0')}-${third}`;
    }
  }

  return value;
}

export const adminList = ['rodikhello2000@gmail.com', "sfpzk.s@gmail.com", "kulishikho@gmail.com", "baranecume@gmail.com"];

const Utilities = {
  validateEmail(email: string) {

  },
  validatePhoneNumber(number: string) {

  },
  isAdminEmail(email: string) {
    return adminList.includes(email || '')
  },
  onAuthChange(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback)
  }

};
export default Utilities;