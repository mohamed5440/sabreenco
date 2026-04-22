import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function optimizeImageUrl(url: string, width: number = 800) {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fm=webp&fit=crop&q=80&w=${width}`;
  }
  return url;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'مكتمل': return 'bg-success-soft text-success border-success-soft-border';
    case 'نشط': return 'bg-success-soft text-success border-success-soft-border';
    case 'قيد الانتظار': return 'bg-warning-soft text-warning border-warning-soft-border';
    case 'ملغي': return 'bg-danger-soft text-danger border-danger-soft-border';
    case 'غير نشط': return 'bg-surface-alt text-muted-light border-border';
    default: return 'bg-surface-alt text-muted-light border-border';
  }
};

/**
 * Security utilities for input sanitization and validation.
 */
export const securityUtils = {
  /**
   * Sanitizes a string to prevent XSS and other injection attacks.
   * Removes HTML tags and trims whitespace.
   */
  sanitizeString(str: string): string {
    if (!str) return '';
    return str
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .replace(/[<>]/g, '')      // Remove any remaining brackets
      .trim();
  },

  /**
   * Validates an email address.
   */
  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Validates a phone number (basic check).
   */
  isValidPhone(phone: string): boolean {
    const re = /^\+?[0-9\s-]{8,20}$/;
    return re.test(phone);
  },

  /**
   * Validates file type for uploads.
   */
  isValidFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }
};
