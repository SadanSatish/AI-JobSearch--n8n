import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { LogOut, Menu, User } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-2 focus:ring-primary">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-50 min-w-[200px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95" align="end" sideOffset={5}>
              <div className="px-2 py-1.5 text-sm font-semibold">My Account</div>
              <div className="px-2 pb-2 text-xs text-muted-foreground">{user?.email}</div>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item 
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
