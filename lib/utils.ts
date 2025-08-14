import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Utilities = {
    validateEmail(email: string) {

    },
    validatePhoneNumber(number: string) {

    }

};
export default Utilities;