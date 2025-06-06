
"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { LayoutDashboard, ArrowRightLeft, BarChart3, Boxes, LineChart, Users, Settings, LogOut } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import type { NavItem, UserRole } from '@/types';
import { Button } from '../ui/button';
import Image from 'next/image';

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard, allowedRoles: ['Administrador', 'Gerente', 'Empleado'] },
  { href: '/transacciones', label: 'Transacciones', icon: ArrowRightLeft, allowedRoles: ['Administrador', 'Gerente', 'Empleado'] },
  { href: '/inventario', label: 'Niveles de Stock', icon: Boxes, allowedRoles: ['Administrador', 'Gerente', 'Empleado'] },
  { href: '/analitica-inventario', label: 'Análisis de Inventario', icon: LineChart, allowedRoles: ['Administrador', 'Gerente'] },
  { href: '/informes', label: 'Informes Financieros', icon: BarChart3, allowedRoles: ['Administrador', 'Gerente'] },
  { href: '/gestion-usuarios', label: 'Gestión de Usuarios', icon: Users, allowedRoles: ['Administrador'] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { currentRole } = useRole();

  const filteredNavItems = navItems.filter(item => item.allowedRoles.includes(currentRole));

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar" defaultOpen={true}>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="https://placehold.co/32x32.png" alt="Logo" width={32} height={32} data-ai-hint="logo abstract" className="rounded-sm"/>
          <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">CompVentFacil</span>
        </Link>
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: 'right' }}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: "Configuración", side: 'right' }} aria-label="Configuración">
                    <Settings className="h-5 w-5" />
                    <span>Configuración</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: "Cerrar Sesión", side: 'right' }} aria-label="Cerrar Sesión">
                    <LogOut className="h-5 w-5 text-destructive" />
                    <span className="text-destructive">Cerrar Sesión</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

