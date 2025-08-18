
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

export const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span className="mr-3 flex-shrink-0">
        {icon}
      </span>
      {label}
    </Link>
  );
};

