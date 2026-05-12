export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
  isActive?: boolean;
  isDisabled?: boolean;
  external?: boolean;
  description?: string;
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface SidebarProps {
  navigation: NavigationSection[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  searchPlaceholder?: string;
  showSearch?: boolean;
  showUser?: boolean;
  variant?: 'default' | 'minimal' | 'compact';
}

export interface NavItemProps {
  item: NavigationItem;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: (item: NavigationItem) => void;
  className?: string;
}

export interface SidebarSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: NavigationItem[];
  isCollapsed?: boolean;
  placeholder?: string;
  onSelectResult?: (item: NavigationItem) => void;
}
