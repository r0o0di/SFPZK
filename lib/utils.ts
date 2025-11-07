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
  isLoggedIn() {
    return !!auth.currentUser;
  }
  
};
export default Utilities;