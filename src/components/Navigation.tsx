import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  LayoutDashboard, 
  Store, 
  Coins, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';

interface User {
  name: string;
  email: string;
}

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  coinCount: number;
  user: User;
  onProfileClick: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
  disabled?: boolean;
  description?: string;
}

// Navigation items configuration
const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'View your daily progress and statistics'
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Store,
    description: 'Exchange coins for rewards and discounts'
  },
  // Add more nav items as needed
  // {
  //   id: 'challenges',
  //   label: 'Challenges',
  //   icon: Target,
  //   badge: 'New',
  //   description: 'Join daily and weekly challenges'
  // },
  // {
  //   id: 'leaderboard',
  //   label: 'Leaderboard',
  //   icon: Trophy,
  //   description: 'See how you rank against friends'
  // }
];

// Memoized components for better performance
const NavButton = memo(({ 
  item, 
  isActive, 
  onClick,
  isMobile = false 
}: { 
  item: NavItem; 
  isActive: boolean; 
  onClick: () => void;
  isMobile?: boolean;
}) => {
  const IconComponent = item.icon;
  
  const buttonContent = (
    <Button
      variant={isActive ? "default" : "ghost"}
      size={isMobile ? "lg" : "sm"}
      className={`
        relative transition-all duration-200 
        ${isMobile ? 'w-full justify-start' : 'px-3'} 
        ${isActive 
          ? 'bg-primary text-primary-foreground shadow-sm' 
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
        }
        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={onClick}
      disabled={item.disabled}
      aria-label={`Navigate to ${item.label}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <IconComponent className={`h-4 w-4 ${isMobile ? 'mr-3' : ''}`} />
      {isMobile && <span className="font-medium">{item.label}</span>}
      {item.badge && (
        <Badge 
          variant="secondary" 
          className="ml-auto text-xs px-1.5 py-0.5"
        >
          {item.badge}
        </Badge>
      )}
      {item.count !== undefined && item.count > 0 && (
        <Badge 
          variant="destructive" 
          className="ml-auto text-xs px-1.5 py-0.5"
        >
          {item.count}
        </Badge>
      )}
    </Button>
  );

  if (isMobile || !item.description) {
    return buttonContent;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {buttonContent}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-sm">{item.description}</p>
      </TooltipContent>
    </Tooltip>
  );
});

const CoinDisplay = memo(({ 
  coinCount, 
  isMobile = false 
}: { 
  coinCount: number; 
  isMobile?: boolean 
}) => (
  <div className={`
    flex items-center gap-2 px-3 py-2 rounded-lg 
    bg-gradient-to-r from-yellow-50 to-orange-50 
    border border-yellow-200
    ${isMobile ? 'w-full justify-center' : ''}
  `}>
    <Coins className="h-4 w-4 text-yellow-600 animate-pulse" />
    <span className="font-semibold text-yellow-800">
      {coinCount.toLocaleString()}
    </span>
    <span className="text-xs text-yellow-600 hidden sm:inline">
      {coinCount === 1 ? 'Coin' : 'Coins'}
    </span>
  </div>
));

const UserMenu = memo(({ 
  user, 
  onProfileClick, 
  onLogout 
}: { 
  user: User; 
  onProfileClick: () => void;
  onLogout: () => void;
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onProfileClick}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

const MobileNav = memo(({ 
  navItems, 
  activeTab, 
  onTabChange, 
  coinCount, 
  user, 
  onProfileClick,
  onLogout 
}: {
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  coinCount: number;
  user: User;
  onProfileClick: () => void;
  onLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabChange = useCallback((tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  }, [onTabChange]);

  const handleProfileClick = useCallback(() => {
    onProfileClick();
    setIsOpen(false);
  }, [onProfileClick]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-3">
            <Logo />
            <span>Bolta</span>
          </SheetTitle>
          <SheetDescription>
            Navigate through your fitness journey
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          {/* Coin Display */}
          <CoinDisplay coinCount={coinCount} isMobile />

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={() => handleTabChange(item.id)}
                isMobile
              />
            ))}
          </nav>

          <div className="pt-4 border-t space-y-2">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start"
              onClick={handleProfileClick}
            >
              <User className="mr-3 h-4 w-4" />
              <span>Profile</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start"
            >
              <Settings className="mr-3 h-4 w-4" />
              <span>Settings</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start"
            >
              <HelpCircle className="mr-3 h-4 w-4" />
              <span>Help & Support</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start text-red-600 hover:text-red-600"
              onClick={onLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

const Navigation = ({ 
  activeTab, 
  onTabChange, 
  coinCount, 
  user, 
  onProfileClick 
}: NavigationProps) => {
  const isMobile = useIsMobile();

  const handleTabChange = useCallback((tab: string) => {
    onTabChange(tab);
  }, [onTabChange]);

  const handleLogout = useCallback(() => {
    // In a real app, this would clear authentication state
    if (confirm('Are you sure you want to log out?')) {
      window.location.reload();
    }
  }, []);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left: Logo and Desktop Navigation */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu */}
            <MobileNav
              navItems={NAV_ITEMS}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              coinCount={coinCount}
              user={user}
              onProfileClick={onProfileClick}
              onLogout={handleLogout}
            />

            {/* Desktop Logo */}
            <div className="hidden md:flex items-center gap-2">
              <Logo />
              <span className="font-bold text-lg text-foreground">Bolta</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2" role="navigation">
              {NAV_ITEMS.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  onClick={() => handleTabChange(item.id)}
                />
              ))}
            </nav>
          </div>

          {/* Right: Actions and User Menu */}
          <div className="flex items-center gap-3">
            {/* Coin Display (Desktop) */}
            {!isMobile && <CoinDisplay coinCount={coinCount} />}

            {/* Notifications (placeholder) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {/* Notification indicator */}
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications (Coming Soon)</p>
              </TooltipContent>
            </Tooltip>

            {/* Search (placeholder) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hidden lg:flex"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search (Coming Soon)</p>
              </TooltipContent>
            </Tooltip>

            {/* User Menu (Desktop) */}
            <div className="hidden md:block">
              <UserMenu 
                user={user} 
                onProfileClick={onProfileClick}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default memo(Navigation);