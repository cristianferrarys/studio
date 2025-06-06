
"use client";
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/contexts/RoleContext';
import type { UserRole } from '@/types';
import { Sun, Moon } from 'lucide-react'; // Example theme toggle icons
import { Button } from '../ui/button';

export function AppHeader() {
  const { currentRole, setCurrentRole, availableRoles } = useRole();
  // Basic theme toggle state - in a real app, use ThemeProvider context
  const [theme, setTheme] = React.useState('light'); 

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold font-headline">CompVentFacil Mockup</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select value={currentRole} onValueChange={(value: UserRole) => setCurrentRole(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar Rol" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
