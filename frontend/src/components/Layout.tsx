import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TableProperties, 
  BarChart3, 
  BellRing, 
  Settings, 
  Search, 
  Moon, 
  Sun, 
  Menu,
  X,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, onLogout, activeTab, onTabChange }: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, current: activeTab === 'Dashboard' },
    { name: 'Data Explorer', icon: TableProperties, current: activeTab === 'Data Explorer' },
    { name: 'Reports', icon: BarChart3, current: activeTab === 'Reports' },
    { name: 'Alerts', icon: BellRing, current: activeTab === 'Alerts' },
    { name: 'Settings', icon: Settings, current: activeTab === 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
            <span className="font-serif italic text-2xl font-bold tracking-tight text-foreground">InsightForge</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground px-3 mb-2 mt-4">Main View</p>
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  onTabChange(item.name);
                  setSidebarOpen(false);
                }}
                className={`
                  flex w-full text-left items-center px-3 py-2 text-sm transition-colors
                  ${item.current 
                    ? 'font-semibold bg-primary/20 rounded text-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground rounded'
                  }
                `}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t border-border mt-auto">
            <div className="bg-primary/20 p-4 rounded-lg">
              <p className="text-xs font-bold mb-1 text-foreground">Alert Status</p>
              <p className="text-[10px] leading-tight opacity-70 text-foreground">3 active anomalies detected in Q3 revenue.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-4 sm:px-6">
          <div className="flex items-center gap-4 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="max-w-md w-full hidden sm:flex items-center relative">
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search datasets..." 
                className="pl-10 bg-background/50 border-border rounded-full focus-visible:ring-primary w-64 h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={onLogout} className="hidden sm:inline-flex px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded shadow-sm hover:brightness-95 h-8">
              Sign Out
            </Button>
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold">JD</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </div>

        {/* Footer Status */}
        <footer className="h-8 shrink-0 bg-foreground text-background flex items-center justify-between px-8 text-[10px] font-bold tracking-widest uppercase">
          <div className="flex gap-4">
            <span>Status: All Systems Nominal</span>
            <span className="opacity-40 border-l border-background/20 pl-4 hidden sm:inline-flex">Last sync: 2 minutes ago</span>
          </div>
          <div className="flex gap-4">
            <span>Environment: Production</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
