
"use client";
import React, { useEffect, useState } from 'react';
import { PageTitle } from '@/components/custom/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { FinancialSummary } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

export default function InformesPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data/financial_summary.json');
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching financial summary:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <PageTitle title="Informes Financieros" subtitle="Análisis detallado de la salud financiera de su empresa." />
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!summary) {
    return <p>Error al cargar los datos financieros.</p>;
  }

  return (
    <div>
      <PageTitle title="Informes Financieros" subtitle="Análisis detallado de la salud financiera de su empresa." />
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-8">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline text-green-600">
              ${summary.ingresosTotales.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline text-red-600">
              ${summary.gastosTotales.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficio Neto</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline text-primary">
              ${summary.beneficioNeto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Rendimiento por Sucursal</CardTitle>
            <CardDescription>Desglose de ingresos y gastos por cada ubicación.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sucursal</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Gastos</TableHead>
                  <TableHead className="text-right">Beneficio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.ingresosPorSucursal.map((item) => (
                  <TableRow key={item.sucursal}>
                    <TableCell className="font-medium">{item.sucursal}</TableCell>
                    <TableCell className="text-right text-green-600">
                      ${item.ingresos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      ${item.gastos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                     <TableCell className="text-right font-semibold">
                      ${(item.ingresos - item.gastos).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Resumen de Gastos por Categoría</CardTitle>
            <CardDescription>Distribución de los gastos en diferentes categorías.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.gastosPorCategoria.map((item) => (
                  <TableRow key={item.categoria}>
                    <TableCell className="font-medium">{item.categoria}</TableCell>
                    <TableCell className="text-right">
                      ${item.monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
