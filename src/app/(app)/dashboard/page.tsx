
"use client";
import React, { useEffect, useState } from 'react';
import { PageTitle } from '@/components/custom/PageTitle';
import { StatCard } from '@/components/custom/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, Package, AlertTriangle, BarChart, Users } from 'lucide-react';
import type { FinancialSummary, InventoryItem } from '@/types';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  ingresos: { label: "Ingresos", color: "hsl(var(--chart-1))" },
  gastos: { label: "Gastos", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const summaryRes = await fetch('/data/financial_summary.json');
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        const inventoryRes = await fetch('/data/inventory.json');
        const inventoryData = await inventoryRes.json();
        setInventory(inventoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalInventoryValue = inventory?.reduce((acc, item) => acc + item.cantidad * (item.minimo * 5), 0) || 0; // Simplified value calculation
  const lowStockItems = inventory?.filter(item => item.cantidad < item.minimo).length || 0;

  const branchFinancialData = summary?.ingresosPorSucursal.map(branch => ({
    name: branch.sucursal,
    ingresos: branch.ingresos,
    gastos: branch.gastos,
  })) || [];


  if (loading) {
    return (
      <div>
        <PageTitle title="Resumen General" subtitle="Vista rápida de las métricas clave de su negocio." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[126px]" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle title="Resumen General" subtitle="Vista rápida de las métricas clave de su negocio." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Ingresos Totales"
          value={`$${summary?.ingresosTotales.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
          icon={DollarSign}
          description="Ingresos brutos totales del período."
          valueClassName="text-green-600"
        />
        <StatCard
          title="Gastos Totales"
          value={`$${summary?.gastosTotales.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
          icon={TrendingUp}
          description="Gastos totales incurridos."
           valueClassName="text-red-600"
        />
        <StatCard
          title="Valor de Inventario"
          value={`$${totalInventoryValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Package}
          description="Valor estimado del stock actual."
        />
        <StatCard
          title="Items con Bajo Stock"
          value={lowStockItems.toString()}
          icon={AlertTriangle}
          description="Productos que necesitan reposición."
          valueClassName={lowStockItems > 0 ? "text-orange-500" : ""}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="font-headline">Rendimiento por Sucursal</CardTitle>
            <CardDescription>Ingresos y gastos por cada sucursal.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-4 pt-0 sm:p-6 sm:pt-0">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <RechartsBarChart data={branchFinancialData} accessibilityLayer>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip 
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={4} />
                <Bar dataKey="gastos" fill="var(--color-gastos)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="font-headline">Actividad Reciente</CardTitle>
             <CardDescription>Un resumen de las últimas actividades.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full"><DollarSign className="h-4 w-4 text-green-600" /></div>
                <p className="text-sm">Nueva venta de <span className="font-semibold">Portátil Gamer XZ</span> por $1250.75 en Sucursal Central.</p>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full"><TrendingUp className="h-4 w-4 text-red-600" /></div>
                <p className="text-sm">Pago de alquiler de <span className="font-semibold">Sucursal Norte</span> por $800.00.</p>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full"><Package className="h-4 w-4 text-blue-600" /></div>
                <p className="text-sm">Recepción de <span className="font-semibold">20 unidades</span> de Teclado Mecánico RGB.</p>
              </li>
               <li className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full"><Users className="h-4 w-4 text-yellow-600" /></div>
                <p className="text-sm">Nuevo usuario <span className="font-semibold">Ana Pérez</span> añadido al sistema.</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
