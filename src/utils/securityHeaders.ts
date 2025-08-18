
export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'speaker=()'
  ].join(', ')
};

export const applySecurityHeaders = (): void => {
  // Add security headers to document
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = SECURITY_HEADERS['Content-Security-Policy'];
  document.head.appendChild(meta);

  // Set additional security attributes
  document.documentElement.setAttribute('data-security-enhanced', 'true');
  
  // Disable right-click context menu in production
  if (import.meta.env.PROD) {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  console.log('[SECURITY] Security headers applied');
};

export const validateSecureContext = (): boolean => {
  // Check if we're in a secure context (HTTPS)
  if (!window.isSecureContext && import.meta.env.PROD) {
    console.warn('[SECURITY] Application should be served over HTTPS in production');
    return false;
  }
  return true;
};
