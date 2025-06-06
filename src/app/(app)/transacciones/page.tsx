
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { PageTitle } from '@/components/custom/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Filter } from 'lucide-react';
import type { Transaction } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type SortKey = keyof Transaction;

export default function TransaccionesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Ingreso' | 'Egreso'>('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data/transactions.json');
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

  const uniqueBranches = useMemo(() => {
    const branches = new Set(transactions.map(t => t.sucursal));
    return ['all', ...Array.from(branches)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let_items = [...transactions];

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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
            <CardTitle className="font-headline">Filtros</CardTitle>
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
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              placeholder="Buscar por descripción o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm flex-grow"
            />
            <div className="flex gap-2 flex-wrap">
              <Select value={filterType} onValueChange={(value: 'all' | 'Ingreso' | 'Egreso') => setFilterType(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Tipos</SelectItem>
                  <SelectItem value="Ingreso">Ingreso</SelectItem>
                  <SelectItem value="Egreso">Egreso</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBranch} onValueChange={(value) => setFilterBranch(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueBranches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch === 'all' ? 'Todas las Sucursales' : branch}</SelectItem>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
    </div>
  );
}

