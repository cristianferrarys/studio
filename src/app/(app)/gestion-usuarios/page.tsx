
"use client";
import React from 'react';
import { PageTitle } from '@/components/custom/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/contexts/RoleContext';
import { AlertCircle, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function GestionUsuariosPage() {
  const { currentRole } = useRole();

  if (currentRole !== 'Administrador') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <PageTitle title="Acceso Denegado" />
        <p className="text-muted-foreground">No tiene permisos para acceder a esta sección.</p>
        <p className="text-sm text-muted-foreground mt-1">Contacte al administrador si cree que esto es un error.</p>
      </div>
    );
  }

  // Dummy user data
  const users = [
    { id: 'u001', name: 'Juan Pérez', email: 'juan.perez@example.com', role: 'Gerente', branch: 'Central', avatar: 'https://placehold.co/40x40/E6E6FA/333333?text=JP' , dataAiHint: "profile avatar" },
    { id: 'u002', name: 'Ana López', email: 'ana.lopez@example.com', role: 'Empleado', branch: 'Norte', avatar: 'https://placehold.co/40x40/F0E68C/333333?text=AL', dataAiHint: "profile avatar" },
    { id: 'u003', name: 'Carlos García', email: 'carlos.garcia@example.com', role: 'Empleado', branch: 'Sur', avatar: 'https://placehold.co/40x40/ADD8E6/333333?text=CG', dataAiHint: "profile avatar" },
  ];

  return (
    <div>
      <PageTitle title="Gestión de Usuarios" subtitle="Administre los usuarios y sus roles en el sistema." />
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold font-headline">Listado de Usuarios</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Añadir Usuario
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <ul role="list" className="divide-y divide-border">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between gap-x-6 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex min-w-0 gap-x-4">
                  <Image 
                    className="h-12 w-12 flex-none rounded-full bg-muted" 
                    src={user.avatar} 
                    alt="" 
                    width={48} 
                    height={48}
                    data-ai-hint={user.dataAiHint}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-foreground">{user.name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-foreground">{user.role}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Sucursal: {user.branch}</p>
                </div>
                <Button variant="outline" size="sm">Editar</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

