import { Parcel, ParcelStatus } from '@/types/parcel';
import { initialParcels } from '@/lib/mock-data/parcels';
import { storage } from '@/lib/storage';

export interface ParcelFilters {
  status?: ParcelStatus | 'all';
  query?: string;
  hubId?: string;
  merchantId?: string;
  riderId?: string;
}

export const parcelService = {
  getAll: (filters?: ParcelFilters): Parcel[] => {
    let parcels = storage.get<Parcel[]>('parcels', initialParcels);

    if (filters?.status && filters.status !== 'all') {
      parcels = parcels.filter((p) => p.status === filters.status);
    }
    if (filters?.hubId && filters.hubId !== 'all') {
      parcels = parcels.filter((p) => p.assignedHubId === filters.hubId);
    }
    if (filters?.merchantId) {
      parcels = parcels.filter((p) => p.merchantId === filters.merchantId);
    }
    if (filters?.riderId) {
      parcels = parcels.filter((p) => p.assignedRiderId === filters.riderId);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      parcels = parcels.filter(
        (p) =>
          p.trackingId.toLowerCase().includes(q) ||
          p.recipientPhone.includes(q) ||
          p.recipientName.toLowerCase().includes(q) ||
          p.merchantName.toLowerCase().includes(q)
      );
    }

    return parcels;
  },

  getByTrackingId: (trackingId: string): Parcel | undefined => {
    const parcels = storage.get<Parcel[]>('parcels', initialParcels);
    return parcels.find((p) => p.trackingId.toUpperCase() === trackingId.trim().toUpperCase());
  },

  getById: (id: string): Parcel | undefined => {
    const parcels = storage.get<Parcel[]>('parcels', initialParcels);
    return parcels.find((p) => p.id === id);
  },

  create: (data: Omit<Parcel, 'id' | 'trackingId' | 'createdAt' | 'updatedAt' | 'timeline'>): Parcel => {
    const parcels = storage.get<Parcel[]>('parcels', initialParcels);
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const trackingId = `PM-${new Date().toISOString().slice(2, 4)}${Math.floor(1000 + Math.random() * 9000)}-${randomHex}`;

    const newParcel: Parcel = {
      ...data,
      id: `prc_${Date.now()}`,
      trackingId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `evt_${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'pending',
          title: 'Parcel Booked',
          description: `Parcel booked by ${data.merchantName || 'merchant'}.`,
        },
      ],
    };

    const updated = [newParcel, ...parcels];
    storage.set('parcels', updated);
    return newParcel;
  },

  updateStatus: (trackingId: string, status: ParcelStatus, note: string): boolean => {
    const parcels = storage.get<Parcel[]>('parcels', initialParcels);
    const index = parcels.findIndex((p) => p.trackingId.toUpperCase() === trackingId.trim().toUpperCase());
    if (index === -1) return false;

    const parcel = { ...parcels[index] };
    parcel.status = status;
    parcel.updatedAt = new Date().toISOString();

    if (status === 'delivered') {
      parcel.deliveredAt = new Date().toISOString();
      parcel.paymentStatus = 'collected_by_rider';
    }

    parcel.timeline = [
      ...parcel.timeline,
      {
        id: `evt_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status,
        title: `Status: ${status.replace(/_/g, ' ').toUpperCase()}`,
        description: note || `Updated to ${status}`,
      },
    ];

    parcels[index] = parcel;
    storage.set('parcels', [...parcels]);
    return true;
  },

  assignRider: (trackingId: string, riderId: string, riderName: string, riderPhone?: string): boolean => {
    const parcels = storage.get<Parcel[]>('parcels', initialParcels);
    const index = parcels.findIndex((p) => p.trackingId.toUpperCase() === trackingId.trim().toUpperCase());
    if (index === -1) return false;

    const parcel = { ...parcels[index] };
    parcel.assignedRiderId = riderId;
    parcel.assignedRiderName = riderName;
    parcel.assignedRiderPhone = riderPhone;
    parcel.status = 'out_for_delivery';
    parcel.updatedAt = new Date().toISOString();

    parcel.timeline = [
      ...parcel.timeline,
      {
        id: `evt_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'out_for_delivery',
        title: 'Assigned to Rider',
        description: `Handed over to ${riderName} for delivery.`,
      },
    ];

    parcels[index] = parcel;
    storage.set('parcels', [...parcels]);
    return true;
  },
};

