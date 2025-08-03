import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, ShoppingBag, User, Coins, Menu, X } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  coinCount: number;
  user: { name: string; email: string };
  onProfileClick: () => void;
}

const Navigation = ({ activeTab, onTabChange, coinCount, user, onProfileClick }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'marketplace', label: 'Rewards', icon: ShoppingBag }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-card border-0 shadow-soft rounded-lg p-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Bolta</h1>
            </div>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const IconComponent = item.icon as React.ElementType;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-2 ${
                      activeTab === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/20 rounded-lg">
              <Coins className="h-4 w-4 text-accent" />
              <span className="font-semibold text-accent-foreground">{coinCount}</span>
              <Badge variant="secondary" className="text-xs">Boltacoins</Badge>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={onProfileClick}
            >
              <User className="h-4 w-4 mr-2" />
              {user.name}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden bg-card border-0 shadow-soft rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Bolta</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-accent/20 rounded">
              <Coins className="h-3 w-3 text-accent" />
              <span className="text-sm font-semibold text-accent-foreground">{coinCount}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start gap-2 ${
                    activeTab === item.id 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            
            <div className="pt-2 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  onProfileClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;