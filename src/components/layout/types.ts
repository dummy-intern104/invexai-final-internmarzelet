
import React from "react";

export interface SidebarItemType {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export interface DropdownItemType {
  icon: React.ReactNode;
  label: string;
  items: {
    icon: React.ReactNode;
    label: string;
    href: string;
  }[];
}
