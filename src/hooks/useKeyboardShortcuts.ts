import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface KeyboardShortcut {
  id: string;
  category: string;
  action: string;
  shortcut: string;
  description: string;
  route?: string;
  isCustom: boolean;
}

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get shortcuts from localStorage with proper error handling
  const getShortcuts = useCallback((): KeyboardShortcut[] => {
    try {
      const saved = localStorage.getItem('keyboardShortcuts');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading shortcuts:', error);
    }
    
    return [
      // Navigation shortcuts
      { id: '1', category: 'Navigation', action: 'Go to item search', shortcut: 'F1', description: 'Open item search', route: '/products', isCustom: false },
      { id: '2', category: 'Navigation', action: 'Go to customer search', shortcut: 'F11', description: 'Open customer search', route: '/clients', isCustom: false },
      { id: '3', category: 'Navigation', action: 'Open New Tab', shortcut: 'Ctrl+T', description: 'Create new invoice', route: '/sales/invoices/new', isCustom: false },
      { id: '4', category: 'Navigation', action: 'Cancel & Close', shortcut: 'Ctrl+W', description: 'Go to dashboard', route: '/dashboard', isCustom: false },
      { id: '5', category: 'Navigation', action: 'Dashboard', shortcut: 'Ctrl+D', description: 'Go to dashboard', route: '/dashboard', isCustom: false },
      
      // Item Actions (context-aware for invoice pages)
      { id: '6', category: 'Item Actions', action: 'Change Quantity', shortcut: 'F2', description: 'Modify item quantity', route: '/sales/invoices/new', isCustom: false },
      { id: '7', category: 'Item Actions', action: 'Change Discount', shortcut: 'F3', description: 'Apply discount to item', route: '/sales/invoices/new', isCustom: false },
      { id: '8', category: 'Item Actions', action: 'Remove Item', shortcut: 'F4', description: 'Delete selected item', route: '/sales/invoices/new', isCustom: false },
      { id: '9', category: 'Item Actions', action: 'Change Price', shortcut: 'F5', description: 'Modify item price', route: '/sales/invoices/new', isCustom: false },
      { id: '10', category: 'Item Actions', action: 'Change Unit', shortcut: 'F6', description: 'Change item unit', route: '/sales/invoices/new', isCustom: false },
      
      // Transaction Actions
      { id: '11', category: 'Transaction Actions', action: 'Apply Bill Tax', shortcut: 'F7', description: 'Add tax to bill', route: '/sales/invoices/new', isCustom: false },
      { id: '12', category: 'Transaction Actions', action: 'Apply Additional Charges', shortcut: 'F8', description: 'Add extra charges', route: '/sales/invoices/new', isCustom: false },
      { id: '13', category: 'Transaction Actions', action: 'Apply Bill Discount', shortcut: 'F9', description: 'Apply discount to entire bill', route: '/sales/invoices/new', isCustom: false },
      { id: '14', category: 'Transaction Actions', action: 'Redeem Loyalty Points', shortcut: 'F10', description: 'Use loyalty points', route: '/sales/invoices/new', isCustom: false },
      { id: '15', category: 'Transaction Actions', action: 'Remarks', shortcut: 'F12', description: 'Add remarks to transaction', route: '/sales/invoices/new', isCustom: false },
      
      // Save Actions
      { id: '16', category: 'Save Actions', action: 'Save & Print Bill', shortcut: 'Ctrl+P', description: 'Save and print invoice', route: '/sales/invoices', isCustom: false },
      { id: '17', category: 'Save Actions', action: 'Save & New Bill', shortcut: 'Ctrl+N', description: 'Save current and create new', route: '/sales/invoices/new', isCustom: false },
      { id: '18', category: 'Save Actions', action: 'Save Bill', shortcut: 'Ctrl+S', description: 'Save current bill', route: '/sales/invoices', isCustom: false },
      
      // Payment Actions
      { id: '19', category: 'Payment Actions', action: 'Other/Credit Payments', shortcut: 'Ctrl+M', description: 'Process credit payments', route: '/payments', isCustom: false },
      
      // Other Actions
      { id: '20', category: 'Other Actions', action: 'Add Customer', shortcut: 'Alt+C', description: 'Add new customer', route: '/clients', isCustom: false },
      { id: '21', category: 'Other Actions', action: 'View History', shortcut: 'Ctrl+H', description: 'View transaction history', route: '/history', isCustom: false },
      { id: '22', category: 'Other Actions', action: 'Manage Products', shortcut: 'Alt+P', description: 'Go to products page', route: '/products', isCustom: false },
    ];
  }, []);

  // Enhanced shortcut normalization
  const normalizeShortcut = (shortcut: string): string => {
    return shortcut
      .split('+')
      .map(key => key.trim())
      .map(key => {
        // Normalize modifier keys
        if (key.toLowerCase() === 'ctrl' || key.toLowerCase() === 'control') return 'ctrl';
        if (key.toLowerCase() === 'alt') return 'alt';
        if (key.toLowerCase() === 'shift') return 'shift';
        if (key.toLowerCase() === 'cmd' || key.toLowerCase() === 'meta') return 'meta';
        
        // Normalize function keys
        if (key.match(/^f\d+$/i)) return key.toLowerCase();
        
        // Normalize regular keys
        return key.toLowerCase();
      })
      .sort((a, b) => {
        // Sort modifiers first
        const modifierOrder = ['ctrl', 'alt', 'shift', 'meta'];
        const aIndex = modifierOrder.indexOf(a);
        const bIndex = modifierOrder.indexOf(b);
        
        if (aIndex !== -1 && bIndex === -1) return -1;
        if (aIndex === -1 && bIndex !== -1) return 1;
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        
        return a.localeCompare(b);
      })
      .join('+');
  };

  // Build pressed shortcut from event with enhanced detection
  const buildPressedShortcut = (event: KeyboardEvent): string => {
    const keys = [];
    
    // Add modifier keys in consistent order
    if (event.ctrlKey || event.metaKey) keys.push('ctrl');
    if (event.altKey) keys.push('alt');
    if (event.shiftKey) keys.push('shift');
    
    // Handle the main key with better detection
    let mainKey = event.key.toLowerCase();
    
    // Special handling for function keys
    if (event.code && event.code.startsWith('F') && event.code.match(/^F\d+$/)) {
      mainKey = event.code.toLowerCase();
    }
    // Handle other special keys
    else if (event.key === ' ') {
      mainKey = 'space';
    } else if (event.key === 'Escape') {
      mainKey = 'escape';
    } else if (event.key === 'Enter') {
      mainKey = 'enter';
    } else if (event.key === 'Tab') {
      mainKey = 'tab';
    } else if (event.key.length === 1) {
      mainKey = event.key.toLowerCase();
    } else if (event.code) {
      // Fallback to event.code for better key detection
      mainKey = event.code.toLowerCase().replace('key', '').replace('digit', '');
    }
    
    // Don't add modifier keys as main keys
    if (!['control', 'alt', 'shift', 'meta', 'cmd'].includes(mainKey)) {
      keys.push(mainKey);
    }
    
    return keys.join('+');
  };

  // Aggressive event prevention for critical shortcuts
  const preventBrowserDefault = (event: KeyboardEvent, shortcut: string): boolean => {
    const criticalShortcuts = ['ctrl+t', 'ctrl+w', 'ctrl+n', 'ctrl+s', 'ctrl+p', 'ctrl+h'];
    const normalizedShortcut = normalizeShortcut(shortcut);
    
    if (criticalShortcuts.includes(normalizedShortcut)) {
      // Multiple prevention strategies
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Try to prevent the default action multiple times
      setTimeout(() => event.preventDefault(), 0);
      
      return true;
    }
    
    return false;
  };

  // Enhanced keyboard event handler with better debugging
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Enhanced debugging
    console.log('=== KEYBOARD EVENT DEBUG ===');
    console.log('Key pressed:', event.key);
    console.log('Code:', event.code);
    console.log('Ctrl:', event.ctrlKey, 'Alt:', event.altKey, 'Shift:', event.shiftKey, 'Meta:', event.metaKey);
    console.log('Target:', (event.target as HTMLElement)?.tagName);
    console.log('Event phase:', event.eventPhase);
    
    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.contentEditable === 'true' ||
      target.closest('[contenteditable="true"]')
    ) {
      console.log('Skipping shortcut - user is typing in input field');
      return;
    }

    const shortcuts = getShortcuts();
    const pressedShortcut = buildPressedShortcut(event);
    
    console.log('Built shortcut:', pressedShortcut);
    
    // Find matching shortcut FIRST with better matching
    const matchingShortcut = shortcuts.find(shortcut => {
      const normalizedStored = normalizeShortcut(shortcut.shortcut);
      const normalizedPressed = normalizeShortcut(pressedShortcut);
      console.log(`Comparing: ${normalizedStored} === ${normalizedPressed}`);
      return normalizedStored === normalizedPressed;
    });

    // If we have a matching shortcut, prevent default IMMEDIATELY and AGGRESSIVELY
    if (matchingShortcut) {
      console.log('🎯 MATCHED SHORTCUT:', matchingShortcut);
      
      // CRITICAL: Multiple prevention strategies applied immediately
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Additional prevention for critical browser shortcuts
      preventBrowserDefault(event, matchingShortcut.shortcut);
      
      // Handle navigation with slight delay to ensure prevention takes effect
      if (matchingShortcut.route) {
        console.log('🔄 Navigating to:', matchingShortcut.route);
        
        // Use requestAnimationFrame to ensure the event is fully prevented first
        requestAnimationFrame(() => {
          navigate(matchingShortcut.route!);
          
          // Show toast notification
          toast({
            title: "Shortcut Activated",
            description: `${matchingShortcut.action} - ${matchingShortcut.shortcut}`,
            duration: 2000,
          });
        });
      }
      
      console.log('=== EVENT PREVENTED ===');
      return false;
    } else {
      console.log('❌ No matching shortcut found');
      console.log('Available shortcuts:', shortcuts.map(s => `${s.shortcut} -> ${normalizeShortcut(s.shortcut)}`));
    }
    
    console.log('=== END DEBUG ===');
  }, [navigate, toast, getShortcuts]);

  // Special handler for beforeunload to catch Ctrl+W
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    const shortcuts = getShortcuts();
    const ctrlWShortcut = shortcuts.find(s => normalizeShortcut(s.shortcut) === 'ctrl+w');
    
    if (ctrlWShortcut && ctrlWShortcut.route) {
      event.preventDefault();
      event.returnValue = '';
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate(ctrlWShortcut.route!);
        toast({
          title: "Shortcut Activated",
          description: `${ctrlWShortcut.action} - ${ctrlWShortcut.shortcut}`,
          duration: 2000,
        });
      }, 100);
      
      return '';
    }
  }, [navigate, toast, getShortcuts]);

  useEffect(() => {
    // Multiple event listeners with different strategies
    const options = { capture: true, passive: false };
    
    // Primary keydown listener
    document.addEventListener('keydown', handleKeyDown, options);
    
    // Additional prevention for critical shortcuts
    const preventCritical = (e: KeyboardEvent) => {
      const shortcuts = getShortcuts();
      const pressed = buildPressedShortcut(e);
      const match = shortcuts.find(s => normalizeShortcut(s.shortcut) === normalizeShortcut(pressed));
      
      if (match) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    
    // Add to window and document for broader coverage
    window.addEventListener('keydown', preventCritical, options);
    
    // Special handling for Ctrl+W
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, options);
      window.removeEventListener('keydown', preventCritical, options);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleKeyDown, handleBeforeUnload, getShortcuts]);

  // Listen for shortcut changes
  useEffect(() => {
    const handleShortcutsChanged = () => {
      console.log('🔄 Shortcuts configuration updated');
    };
    
    window.addEventListener('shortcutsChanged', handleShortcutsChanged);
    return () => window.removeEventListener('shortcutsChanged', handleShortcutsChanged);
  }, []);

  return null;
};

export default useKeyboardShortcuts;
