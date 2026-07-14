import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Job Search', path: '/jobs', icon: Briefcase },
  { name: 'Resume Hub', path: '/resume', icon: FileText },
  { name: 'Applications', path: '/applications', icon: Briefcase }, // Kanban doesn't exist in lucide by default, using Briefcase temporarily or Kanba if available.
];

export function Sidebar() {
  const { user } = useAuth();
  
  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <div className="p-6 flex items-center space-x-2">
        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight">AI Job Search</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground mt-8',
                isActive ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'text-muted-foreground'
              )
            }
          >
            <ShieldAlert className="h-5 w-5" />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}
