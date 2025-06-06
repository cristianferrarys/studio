
"use client";
import React, { useState } from 'react';
import { PageTitle } from '@/components/custom/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRole } from '@/contexts/RoleContext';
import { useBranches } from '@/contexts/BranchContext';
import { AlertCircle, UserPlus, Users, PlusCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function GestionUsuariosPage() {
  const { currentRole } = useRole();
  const { branches, addBranch, isLoadingBranches } = useBranches();
  const [newBranchName, setNewBranchName] = useState('');

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

  const handleAddBranch = () => {
    if (newBranchName.trim()) {
      addBranch(newBranchName.trim());
      setNewBranchName('');
    }
  };

  return (
    <div>
      <PageTitle title="Gestión de Usuarios y Sucursales" subtitle="Administre usuarios, roles y sucursales en el sistema." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle className="font-headline text-xl">Listado de Usuarios</CardTitle>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" /> Añadir Usuario
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul role="list" className="divide-y divide-border">
              {users.map((user) => (
                <li key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-x-6 gap-y-2 p-3 sm:p-4 hover:bg-muted/50 transition-colors">
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
                  <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                    <p className="text-sm leading-6 text-foreground">{user.role}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">Sucursal: {user.branch}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 sm:mt-0 sm:w-auto">Editar</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="p-4 sm:p-6">
             <CardTitle className="font-headline text-xl">Gestión de Sucursales</CardTitle>
             <CardDescription>Añada nuevas sucursales o visualice las existentes.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-semibold mb-2">Añadir Nueva Sucursal</h3>
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <Input 
                    type="text" 
                    placeholder="Nombre de la nueva sucursal" 
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleAddBranch} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                  </Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-md font-semibold mb-2">Sucursales Actuales</h3>
                {isLoadingBranches ? (
                  <p className="text-sm text-muted-foreground">Cargando sucursales...</p>
                ) : branches.length > 0 ? (
                  <ul className="space-y-1 list-disc list-inside text-sm">
                    {branches.map(branch => (
                      <li key={branch} className="flex items-center">
                        <Home className="mr-2 h-4 w-4 text-muted-foreground"/> {branch}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay sucursales definidas.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
