
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { PageTitle } from '@/components/custom/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { InventoryItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useBranches } from '@/contexts/BranchContext'; // Import useBranches

export default function InventarioPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const { branches: contextBranches, isLoadingBranches } = useBranches(); // Get branches from context

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data/inventory.json');
        const data = await res.json();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const branchesForFilter = useMemo(() => {
    return ['all', ...contextBranches];
  }, [contextBranches]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(inventory.map(item => item.categoria));
    return ['all', ...Array.from(categories)];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch = filterBranch === 'all' || item.sucursal === filterBranch;
      const matchesCategory = filterCategory === 'all' || item.categoria === filterCategory;
      return matchesSearch && matchesBranch && matchesCategory;
    });
  }, [inventory, searchTerm, filterBranch, filterCategory]);

  const getStockStatus = (item: InventoryItem): { text: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
    if (item.cantidad === 0) return { text: 'Agotado', variant: 'destructive' };
    if (item.cantidad < item.minimo) return { text: 'Bajo Stock', variant: 'outline' }; 
    if (item.cantidad < item.minimo * 1.5) return { text: 'Stock Limitado', variant: 'secondary' };
    return { text: 'En Stock', variant: 'default' }; 
  };

  if (loading) {
    return (
      <div>
        <PageTitle title="Niveles de Stock" subtitle="Supervise las cantidades de inventario en todas las sucursales." />
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 pt-2">
              <Skeleton className="h-10 w-full md:w-1/3" />
              <Skeleton className="h-10 w-full md:w-1/4" />
              <Skeleton className="h-10 w-full md:w-1/4" />
            </div>
          </CardHeader>
          <CardContent>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between p-4 border-b">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Niveles de Stock" subtitle="Supervise las cantidades de inventario en todas las sucursales." />
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              placeholder="Buscar por nombre o ID de producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm flex-grow"
            />
             <div className="flex gap-2 flex-wrap">
              <Select value={filterBranch} onValueChange={(value) => setFilterBranch(value)} disabled={isLoadingBranches}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sucursal" />
                </SelectTrigger>
                <SelectContent>
                   {isLoadingBranches ? (
                       <SelectItem value="loading" disabled>Cargando sucursales...</SelectItem>
                    ) : (
                      branchesForFilter.map(branch => (
                        <SelectItem key={branch} value={branch}>{branch === 'all' ? 'Todas las Sucursales' : branch}</SelectItem>
                      ))
                    )}
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category === 'all' ? 'Todas las Categorías' : category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Producto</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead className="text-right">Cantidad Actual</TableHead>
                  <TableHead className="text-right">Nivel Mínimo</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <TableRow key={item.id + item.sucursal}>
                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.nombre}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.sucursal}</TableCell>
                      <TableCell className="text-right font-semibold">{item.cantidad}</TableCell>
                      <TableCell className="text-right">{item.minimo}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={status.variant} 
                          className={cn(
                            status.variant === 'destructive' && 'bg-red-500 text-white',
                            status.variant === 'outline' && 'border-orange-500 text-orange-600 bg-orange-50',
                            status.variant === 'secondary' && 'bg-yellow-100 text-yellow-700',
                            status.variant === 'default' && 'bg-green-100 text-green-700'
                          )}
                        >{status.text}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
           {filteredInventory.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No se encontraron productos que coincidan con los filtros.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
