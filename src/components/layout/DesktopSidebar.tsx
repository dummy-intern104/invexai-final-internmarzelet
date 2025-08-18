
import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarItem } from "./SidebarItem";
import { DropdownSidebarItem } from "./DropdownSidebarItem";
import UserProfile from "./UserProfile";
import { SidebarItemType, DropdownItemType } from "./types";

interface DesktopSidebarProps {
  sidebarItems: SidebarItemType[];
  dropdownItems: DropdownItemType[];
  currentPath: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

const DesktopSidebar = ({
  sidebarItems,
  dropdownItems,
  currentPath,
  theme,
  toggleTheme,
  onLogout
}: DesktopSidebarProps) => {
  const [expandedDropdowns, setExpandedDropdowns] = useState<string[]>([]);

  const toggleDropdown = (label: string) => {
    setExpandedDropdowns(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isDropdownExpanded = (label: string) => expandedDropdowns.includes(label);

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-1 min-h-0 bg-card border-r">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8 gap-3">
            <img 
              src="/lovable-uploads/9a717270-f00a-44ad-9c3f-0c002a4c3be6.png" 
              alt="Invex AI Logo" 
              className="w-8 h-8"
            />
            <h1 className="font-bold text-black text-2xl">Invex AI</h1>
          </div>
          
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={currentPath === item.href}
              />
            ))}
            
            {dropdownItems.map((dropdown) => (
              <DropdownSidebarItem
                key={dropdown.label}
                icon={dropdown.icon}
                label={dropdown.label}
                items={dropdown.items}
                isExpanded={isDropdownExpanded(dropdown.label)}
                onToggle={() => toggleDropdown(dropdown.label)}
                currentPath={currentPath}
              />
            ))}
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex flex-col w-full space-y-2">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === 'light' ? 'Dark' : 'Light'}
              </Button>
              
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
