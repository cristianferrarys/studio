
"use client";
import React, { useEffect, useState } from 'react';
import { PageTitle } from '@/components/custom/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import type { InventoryAnalytics } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const barChartConfig = {
  unidades: { label: "Unidades Vendidas", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const pieChartConfig = {
  valor: { label: "Valor de Inventario" }, // Colors will be assigned dynamically
} satisfies ChartConfig;

const lineChartConfig = {
  tasa: { label: "Tasa de Rotación", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AnaliticaInventarioPage() {
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data/inventory_analytics.json');
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching inventory analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div>
        <PageTitle title="Análisis de Inventario" subtitle="Visualice tendencias y métricas clave de su inventario." />
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[350px]" />)}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <p>Error al cargar los datos de análisis de inventario.</p>;
  }

  // Prepare data for PieChart with dynamic colors
  const valorInventarioSucursalData = analytics.valorInventarioPorSucursal.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));
  
  // Update pieChartConfig with dynamic colors
  const dynamicPieChartConfig = analytics.valorInventarioPorSucursal.reduce((acc, item, index) => {
    acc[item.sucursal] = { label: item.sucursal, color: COLORS[index % COLORS.length] };
    return acc;
  }, {} as ChartConfig);


  return (
    <div>
      <PageTitle title="Análisis de Inventario" subtitle="Visualice tendencias y métricas clave de su inventario." />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="shadow-lg xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Productos Más Vendidos</CardTitle>
            <CardDescription>Unidades vendidas por producto en el último período.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ChartContainer config={barChartConfig} className="w-full h-full">
              <BarChart data={analytics.productosMasVendidos} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="nombre" tickLine={false} tickMargin={10} angle={-30} textAnchor="end" height={60} />
                <YAxis />
                <RechartsTooltip 
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Legend />
                <Bar dataKey="unidades" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Valor de Inventario por Sucursal</CardTitle>
             <CardDescription>Distribución del valor total del inventario.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ChartContainer config={dynamicPieChartConfig} className="w-full aspect-square max-h-[280px]">
              <PieChart>
                <RechartsTooltip 
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie 
                  data={valorInventarioSucursalData} 
                  dataKey="valor" 
                  nameKey="sucursal" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10px">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {valorInventarioSucursalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-1 mt-6">
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Rotación de Inventario</CardTitle>
            <CardDescription>Tasa de rotación mensual del inventario.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={lineChartConfig} className="w-full h-full">
              <LineChart data={analytics.rotacionInventario} margin={{ left: 12, right: 12 }} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'dataMax + 0.5']} />
                 <RechartsTooltip 
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Legend />
                <Line type="monotone" dataKey="tasa" strokeWidth={2} dot={true} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

