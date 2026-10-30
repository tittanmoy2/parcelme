export type ParcelStatus =
  | 'pending'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned'
  | 'on_hold'
  | 'cancelled';

export type PaymentStatus =
  | 'unpaid'
  | 'collected_by_rider'
  | 'deposited_at_hub'
  | 'settled_to_merchant';

export interface ParcelEvent {
  id: string;
  timestamp: string;
  status: ParcelStatus;
  title: string;
  description: string;
  hubId?: string;
  hubName?: string;
  actorName?: string;
}

export interface Parcel {
  id: string;                      // Internal ID
  trackingId: string;              // e.g. "PM-2410-8F3K29"
  merchantId: string;
  merchantName: string;
  merchantPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientAltPhone?: string;
  deliveryAddress: string;
  division: string;
  district: string;
  thana: string;
  weightKg: number;
  codAmount: number;               // In Bangladeshi Taka
  deliveryFee: number;
  status: ParcelStatus;
  paymentStatus: PaymentStatus;
  assignedHubId: string;
  assignedHubName: string;
  assignedRiderId?: string;
  assignedRiderName?: string;
  assignedRiderPhone?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  timeline: ParcelEvent[];
}

