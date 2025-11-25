import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  // Check if clipboard API is available
  if (typeof window !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy using clipboard API:", err);
      // Fall through to fallback method
    }
  }

  // Fallback method for browsers that don't support clipboard API
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error("Failed to copy using fallback method:", err);
    return false;
  }
}

