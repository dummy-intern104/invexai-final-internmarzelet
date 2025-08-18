
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SidebarItemType, DropdownItemType } from "./types";

interface MobileNavigationProps {
  sidebarItems: SidebarItemType[];
  dropdownItems: DropdownItemType[];
  currentPath: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

const MobileNavigation = ({
  sidebarItems,
  dropdownItems,
  currentPath,
  theme,
  toggleTheme,
  onLogout
}: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDropdowns, setExpandedDropdowns] = useState<string[]>([]);

  const toggleDropdown = (label: string) => {
    setExpandedDropdowns(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isDropdownExpanded = (label: string) => expandedDropdowns.includes(label);

  const handleLinkClick = () => {
    setIsOpen(false);
    setExpandedDropdowns([]);
  };

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 z-40 bg-card border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/9a717270-f00a-44ad-9c3f-0c002a4c3be6.png" 
              alt="Invex AI Logo" 
              className="w-6 h-6"
            />
            <h1 className="text-lg font-bold text-black">Invex AI</h1>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        currentPath === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className="mr-3 flex-shrink-0">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}
                  
                  {dropdownItems.map((dropdown) => (
                    <div key={dropdown.label}>
                      <button
                        onClick={() => toggleDropdown(dropdown.label)}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <span className="mr-3 flex-shrink-0">
                          {dropdown.icon}
                        </span>
                        <span className="flex-1 text-left">{dropdown.label}</span>
                        {isDropdownExpanded(dropdown.label) ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </button>
                      
                      {isDropdownExpanded(dropdown.label) && (
                        <div className="mt-1 space-y-1 pl-4">
                          {dropdown.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={handleLinkClick}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                                currentPath === item.href
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <span className="mr-3 flex-shrink-0">
                                {item.icon}
                              </span>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                
                <div className="border-t p-4 space-y-2">
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
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onLogout();
                        handleLinkClick();
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Spacer to account for fixed header */}
      <div className="h-14"></div>
    </div>
  );
};

export default MobileNavigation;
