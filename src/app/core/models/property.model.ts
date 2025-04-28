export interface Property {
  id: string;
  name: string;
  totalFloors: number;
  roomCount: number;
}

export interface CreatePropertyDto {
  name: string;
  totalFloors: number;
}

export interface PropertyStats {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  totalTenants: number;
  totalRevenue: number;
  collectedRent: number;
  pendingRent: number;
  totalExpenses: number;
  netIncome: number;
  occupancyRate: number;
  revenueByFloor: { floor: number; revenue: number }[];
  expensesByCategory: { category: string; amount: number }[];
}

export interface Payment {
  tenantName: string;
  amount: number;
  date: Date;
  status: 'Paid' | 'Pending' | 'Partial';
} 