
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { PageTitle } from '@/components/custom/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, PlusCircle } from 'lucide-react';
import type { Transaction } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AddTransactionForm, type TransactionFormData } from '@/components/custom/AddTransactionForm';
import { useBranches } from '@/contexts/BranchContext'; // Import useBranches

type SortKey = keyof Transaction;

export default function TransaccionesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Ingreso' | 'Egreso'>('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { branches: contextBranches, isLoadingBranches } = useBranches(); // Get branches from context

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data/transactions.json');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const branchesForFilter = useMemo(() => {
    return ['all', ...contextBranches];
  }, [contextBranches]);

  // For AddTransactionForm, it expects just the branch names, not 'all'
  const branchesForForm = useMemo(() => {
    return contextBranches;
  }, [contextBranches]);

  const handleAddTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: `t${Math.random().toString(36).substring(2, 9)}`, // Simple unique ID
      fecha: new Date().toISOString().split('T')[0], // Current date
      ...data,
      monto: Number(data.monto)
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    setIsAddModalOpen(false);
  };

  const filteredTransactions = useMemo(() => {
    let _items = [...transactions];

    if (searchTerm) {
      _items = _items.filter(t =>
        t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'all') {
      _items = _items.filter(t => t.tipo === filterType);
    }
    if (filterBranch !== 'all') {
      _items = _items.filter(t => t.sucursal === filterBranch);
    }

    if (sortConfig !== null) {
      _items.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return _items;
  }, [transactions, searchTerm, filterType, filterBranch, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? '🔼' : '🔽';
  };
  
  if (loading) {
    return (
      <div>
        <PageTitle title="Listado de Transacciones" subtitle="Explore todas las transacciones financieras registradas." />
        <Card className="shadow-lg">
          <CardHeader>
             <div className="flex justify-between items-center">
              <CardTitle className="font-headline">Filtros y Acciones</CardTitle>
               <Skeleton className="h-10 w-40" />
            </div>
            <div className="flex flex-col md:flex-row gap-4 pt-2">
              <Skeleton className="h-10 w-full md:w-1/3" />
              <Skeleton className="h-10 w-full md:w-1/4" />
              <Skeleton className="h-10 w-full md:w-1/4" />
            </div>
          </CardHeader>
          <CardContent>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between p-4 border-b">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Listado de Transacciones" subtitle="Explore todas las transacciones financieras registradas." />
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between md:items-center">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center flex-grow w-full md:w-auto">
              <Input
                placeholder="Buscar por descripción o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:max-w-sm md:flex-grow"
              />
              <div className="flex flex-col sm:flex-row sm:gap-2 w-full md:w-auto">
                <Select value={filterType} onValueChange={(value: 'all' | 'Ingreso' | 'Egreso') => setFilterType(value)}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Tipos</SelectItem>
                    <SelectItem value="Ingreso">Ingreso</SelectItem>
                    <SelectItem value="Egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterBranch} onValueChange={(value) => setFilterBranch(value)} disabled={isLoadingBranches}>
                  <SelectTrigger className="w-full sm:w-[180px]">
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
              </div>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="mt-2 md:mt-0 w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Transacción
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => requestSort('fecha')} className="cursor-pointer">
                    Fecha {getSortIndicator('fecha')}
                  </TableHead>
                  <TableHead onClick={() => requestSort('descripcion')} className="cursor-pointer">
                    Descripción {getSortIndicator('descripcion')}
                  </TableHead>
                  <TableHead onClick={() => requestSort('tipo')} className="cursor-pointer">
                    Tipo {getSortIndicator('tipo')}
                  </TableHead>
                  <TableHead onClick={() => requestSort('monto')} className="text-right cursor-pointer">
                    Monto {getSortIndicator('monto')}
                  </TableHead>
                  <TableHead onClick={() => requestSort('sucursal')} className="cursor-pointer">
                    Sucursal {getSortIndicator('sucursal')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.fecha).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>{transaction.descripcion}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        transaction.tipo === 'Ingreso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.tipo}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${transaction.tipo === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                      ${transaction.monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{transaction.sucursal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredTransactions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No se encontraron transacciones que coincidan con los filtros.</p>
          )}
        </CardContent>
      </Card>
      <AddTransactionForm 
        isOpen={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onSubmitForm={handleAddTransaction}
        branches={branchesForForm} // Pass branches from context
        isLoadingBranches={isLoadingBranches}
      />
    </div>
  );
}
