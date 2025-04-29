export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'villa' | 'pg';
  totalRooms: number;
  occupiedRooms: number;
  imageUrl: string;
} 