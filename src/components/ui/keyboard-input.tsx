
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KeyboardInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const KeyboardInput = ({ value, onChange, placeholder, className }: KeyboardInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const formatKeyName = (key: string): string => {
    const keyMap: { [key: string]: string } = {
      'Control': 'Ctrl',
      'Meta': 'Cmd',
      'ArrowUp': 'Up',
      'ArrowDown': 'Down',
      'ArrowLeft': 'Left',
      'ArrowRight': 'Right',
      ' ': 'Space'
    };
    return keyMap[key] || key;
  };

  const buildShortcutString = (keys: Set<string>): string => {
    const modifiers = ['Ctrl', 'Alt', 'Shift', 'Cmd'];
    const sortedKeys = Array.from(keys).sort((a, b) => {
      const aIsModifier = modifiers.includes(a);
      const bIsModifier = modifiers.includes(b);
      
      if (aIsModifier && !bIsModifier) return -1;
      if (!aIsModifier && bIsModifier) return 1;
      
      return modifiers.indexOf(a) - modifiers.indexOf(b);
    });
    
    return sortedKeys.join('+');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isListening) return;
    
    event.preventDefault();
    event.stopPropagation();

    const newKeys = new Set(pressedKeys);
    
    // Add modifier keys
    if (event.ctrlKey) newKeys.add('Ctrl');
    if (event.altKey) newKeys.add('Alt');
    if (event.shiftKey) newKeys.add('Shift');
    if (event.metaKey) newKeys.add('Cmd');
    
    // Add the main key (if it's not a modifier)
    if (!['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
      const formattedKey = formatKeyName(event.key);
      newKeys.add(formattedKey);
    }
    
    setPressedKeys(newKeys);
    
    // If we have a non-modifier key, finalize the shortcut
    if (!['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
      const shortcutString = buildShortcutString(newKeys);
      onChange(shortcutString);
      setIsListening(false);
      setPressedKeys(new Set());
      inputRef.current?.blur();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (!isListening) return;
    
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFocus = () => {
    setIsListening(true);
    setPressedKeys(new Set());
  };

  const handleBlur = () => {
    setIsListening(false);
    setPressedKeys(new Set());
  };

  const currentPreview = pressedKeys.size > 0 ? buildShortcutString(pressedKeys) : '';

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={isListening ? currentPreview : value}
        onChange={() => {}} // Controlled by key events
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={isListening ? "Press key combination..." : placeholder}
        className={cn(
          "font-mono",
          isListening && "ring-2 ring-blue-500 border-blue-500",
          className
        )}
        readOnly={!isListening}
      />
      {isListening && (
        <Badge variant="secondary" className="absolute -top-2 right-2 text-xs">
          Recording...
        </Badge>
      )}
    </div>
  );
};
