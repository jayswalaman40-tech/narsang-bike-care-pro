import { format, isToday, isYesterday } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatRelativeDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  
  return format(date, 'MMM d, yyyy');
};

export const validatePhone = (phone: string): boolean => {
  // Simple validation for Indian 10-digit numbers
  // This removes any +91 or spaces before checking
  const cleaned = phone.replace(/\D/g, '');
  const digitsOnly = cleaned.startsWith('91') && cleaned.length === 12 
    ? cleaned.slice(2) 
    : cleaned;
    
  return /^[6-9]\d{9}$/.test(digitsOnly);
};

export const cleanPhoneForWA = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `91${cleaned}`;
  if (cleaned.startsWith('91') && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith('0') && cleaned.length === 11) return `91${cleaned.slice(1)}`;
  return cleaned; // Fallback
};

export const generateWALink = (phone: string, text: string): string => {
  const cleanNum = cleanPhoneForWA(phone);
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
};
