
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


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
        <Card className="shadow-lg xl:col-span-1 lg:col-span-2"> {/* Adjusted span for better layout on large screens */}
          <CardHeader>
            <CardTitle className="font-headline">Productos Más Vendidos</CardTitle>
            <CardDescription>Unidades vendidas por producto en el último período.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[350px]"> {/* Slightly taller for better label display */}
             <ChartContainer config={barChartConfig} className="w-full h-full">
              <BarChart data={analytics.productosMasVendidos} accessibilityLayer margin={{ top: 5, right: isMobile ? 5 : 20, left: isMobile ? 0 : -10, bottom: isMobile ? 90 : 30 }}>
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey="nombre" 
                  tickLine={false} 
                  tickMargin={isMobile ? 5 : 10} 
                  angle={isMobile ? -60 : -30} 
                  textAnchor="end" 
                  height={isMobile ? 90 : 60} 
                  interval={0} 
                  tick={{ fontSize: isMobile ? 9 : 12 }}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                <RechartsTooltip 
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Legend wrapperStyle={{fontSize: isMobile ? '10px' : '12px', paddingTop: isMobile ? '10px': '0px'}}/>
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
          <CardContent className="h-[300px] sm:h-[350px] flex items-center justify-center"> {/* Slightly taller */}
            <ChartContainer config={dynamicPieChartConfig} className="w-full aspect-square max-h-[250px] sm:max-h-[300px]">
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
                  outerRadius={isMobile ? 80 : 100} 
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    // Adjusted radius for label positioning for better fit on mobile
                    const radius = innerRadius + (outerRadius - innerRadius) * (isMobile ? 0.4 : 0.5); 
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={isMobile ? "8px" : "10px"}>
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {valorInventarioSucursalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{fontSize: isMobile ? '10px' : '12px'}}/>
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
          <CardContent className="h-[300px] sm:h-[350px]">
            <ChartContainer config={lineChartConfig} className="w-full h-full">
              <LineChart data={analytics.rotacionInventario} margin={{ top: 5, right: isMobile ? 5 : 20, left: isMobile ? 0 : -10, bottom: 5 }} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'dataMax + 0.5']} tick={{ fontSize: isMobile ? 10 : 12 }} />
                 <RechartsTooltip 
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Legend wrapperStyle={{fontSize: isMobile ? '10px' : '12px'}}/>
                <Line type="monotone" dataKey="tasa" strokeWidth={2} dot={true} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
