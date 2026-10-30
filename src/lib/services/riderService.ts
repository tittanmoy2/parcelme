import { Rider } from '@/types/rider';
import { initialRiders } from '@/lib/mock-data/riders';
import { storage } from '@/lib/storage';

export const riderService = {
  getAll: (): Rider[] => {
    return storage.get<Rider[]>('riders', initialRiders);
  },

  getById: (id: string): Rider | undefined => {
    const riders = storage.get<Rider[]>('riders', initialRiders);
    return riders.find((r) => r.id === id);
  },

  getCurrentRider: (): Rider => {
    const riders = storage.get<Rider[]>('riders', initialRiders);
    return riders[0] || initialRiders[0];
  },

  updateCashInHand: (riderId: string, cashDelta: number): boolean => {
    const riders = storage.get<Rider[]>('riders', initialRiders);
    const index = riders.findIndex((r) => r.id === riderId);
    if (index === -1) return false;

    riders[index].cashInHand += cashDelta;
    storage.set('riders', [...riders]);
    return true;
  },

  updateStatus: (riderId: string, status: Rider['status']): boolean => {
    const riders = storage.get<Rider[]>('riders', initialRiders);
    const index = riders.findIndex((r) => r.id === riderId);
    if (index === -1) return false;

    riders[index].status = status;
    storage.set('riders', [...riders]);
    return true;
  },
};

