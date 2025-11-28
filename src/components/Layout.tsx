import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { Home, FileText, CheckSquare, Settings, LogOut, Menu, X, Search, BarChart3 } from 'lucide-react';
import { DemoBanner } from '@/components/DemoBanner';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout, isDemoUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return <>{children}</>;

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/projects', label: 'Projects', icon: FileText },
    { path: '/onboarding', label: 'Onboarding', icon: CheckSquare },
    ...(currentUser.role === 'admin' ? [
      { path: '/insights', label: 'Insights', icon: BarChart3 },
      { path: '/settings', label: 'Settings', icon: Settings }
    ] : []),
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DemoBanner />
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">DevHive</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                isActive(path)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{currentUser.email}</p>
            <p className="text-xs text-sidebar-foreground/40 mt-1 capitalize">{currentUser.role}</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate('/auth');
            }}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Desktop Header with Search */}
      <div className="hidden lg:flex fixed top-0 left-64 right-0 z-40 h-16 bg-background border-b border-border">
        <div className="flex items-center justify-between w-full px-6">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search docs, checklists, assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-sidebar-foreground">DevHive</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-sidebar-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        <div className="px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-sidebar pt-16">
          <nav className="p-4 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive(path)
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
              <p className="text-xs text-sidebar-foreground/60">{currentUser.email}</p>
              <p className="text-xs text-sidebar-foreground/40 mt-1 capitalize">{currentUser.role}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                navigate('/auth');
              }}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pt-16 pt-28">
        {children}
      </main>
    </div>
  );
};
