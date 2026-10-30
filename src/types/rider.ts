export type RiderStatus = 'online' | 'offline' | 'on_route';
export type VehicleType = 'bike' | 'cycle' | 'van';

export interface Rider {
  id: string;
  name: string;
  phone: string;
  assignedHubId: string;
  assignedHubName: string;
  status: RiderStatus;
  vehicleType: VehicleType;
  vehiclePlateNumber?: string;
  activeDeliveryCount: number;
  cashInHand: number; // Current undeposited COD cash in BDT
  todayDeliveredCount: number;
  successRatePercentage: number;
}

