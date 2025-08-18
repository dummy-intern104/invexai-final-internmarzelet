
import { supabase } from '@/integrations/supabase/client';

export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session validation error:', error);
      return false;
    }
    
    return !!session?.user;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potential XSS characters
    .slice(0, 1000); // Limit length
};

export const validateNumericInput = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : Math.max(0, num);
};

export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const logSecurityEvent = (event: string, details?: any) => {
  console.log(`[SECURITY EVENT] ${event}`, details);
  // In production, this would send to a logging service
};

export const checkRateLimiting = (action: string, userId?: string): boolean => {
  // Simple in-memory rate limiting for demo
  // In production, use Redis or database-based rate limiting
  const key = `${action}_${userId || 'anonymous'}`;
  const now = Date.now();
  const windowMs = 60000; // 1 minute window
  const maxAttempts = 10;
  
  const attempts = JSON.parse(localStorage.getItem(key) || '[]');
  const recentAttempts = attempts.filter((time: number) => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    logSecurityEvent('Rate limit exceeded', { action, userId });
    return false;
  }
  
  recentAttempts.push(now);
  localStorage.setItem(key, JSON.stringify(recentAttempts));
  return true;
};
