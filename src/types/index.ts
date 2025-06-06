export interface Transaction {
  id: string;
  fecha: string; // Consider using Date type if processing dates
  descripcion: string;
  tipo: 'Ingreso' | 'Egreso';
  monto: number;
  sucursal: string;
}

export interface InventoryItem {
  id: string;
  nombre: string;
  sucursal: string;
  cantidad: number;
  minimo: number;
  categoria: string;
}

export interface FinancialSummary {
  ingresosTotales: number;
  gastosTotales: number;
  beneficioNeto: number;
  ingresosPorSucursal: Array<{ sucursal: string; ingresos: number; gastos: number }>;
  gastosPorCategoria: Array<{ categoria: string; monto: number }>;
}

export interface InventoryAnalytics {
  rotacionInventario: Array<{ mes: string; tasa: number }>;
  productosMasVendidos: Array<{ nombre: string; unidades: number }>;
  valorInventarioPorSucursal: Array<{ sucursal: string; valor: number }>;
  tendenciaStock: Array<{ fecha: string; valorTotal: number; unidadesTotales: number }>;
}

export type UserRole = 'Administrador' | 'Gerente' | 'Empleado';

export const USER_ROLES: UserRole[] = ['Administrador', 'Gerente', 'Empleado'];

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
}
