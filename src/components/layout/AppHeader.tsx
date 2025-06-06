
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
    <header className="sticky top-0 z-10 flex h-auto min-h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 py-2 md:px-6 flex-wrap">
      <div className="flex items-center">
        <SidebarTrigger className="md:hidden mr-2" />
        <h1 className="text-lg font-semibold font-headline">CompVentFacil Mockup</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 ml-auto flex-wrap justify-end">
        <Select value={currentRole} onValueChange={(value: UserRole) => setCurrentRole(value)}>
          <SelectTrigger className="w-full min-w-[150px] sm:w-auto sm:min-w-[180px] max-w-xs">
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
