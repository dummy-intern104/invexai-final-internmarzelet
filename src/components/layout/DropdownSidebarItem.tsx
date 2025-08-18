
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownItemType } from "./types";

interface DropdownSidebarItemProps {
  icon: React.ReactNode;
  label: string;
  items: DropdownItemType['items'];
  isExpanded: boolean;
  onToggle: () => void;
  currentPath: string;
}

export const DropdownSidebarItem = ({
  icon,
  label,
  items,
  isExpanded,
  onToggle,
  currentPath
}: DropdownSidebarItemProps) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150",
          "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <span className="mr-3 flex-shrink-0">
          {icon}
        </span>
        <span className="flex-1 text-left">{label}</span>
        {isExpanded ? (
          <ChevronDown className="ml-auto h-4 w-4" />
        ) : (
          <ChevronRight className="ml-auto h-4 w-4" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-1 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center pl-8 pr-2 py-2 text-sm rounded-md transition-colors duration-150",
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
  );
};

