import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const adminList = ['rodikhello2000@gmail.com', "sfpzk.s@gmail.com"];

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