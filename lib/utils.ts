import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from '@/lib/firebase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Utilities = {
  validateEmail(email: string) {

  },
  validatePhoneNumber(number: string) {

  },
  isAdminEmail(email: string) {
   const adminList = ['rodikhello2000@gmail.com'];
    return adminList.includes(email || '')
  },
  onAuthChange(callback: (user: any) => void) {
    return auth.onAuthStateChanged(callback)
  }

};
export default Utilities;