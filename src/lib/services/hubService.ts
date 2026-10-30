import { Hub } from '@/types/hub';
import { initialHubs } from '@/lib/mock-data/hubs';
import { storage } from '@/lib/storage';

export const hubService = {
  getAll: (): Hub[] => {
    return storage.get<Hub[]>('hubs', initialHubs);
  },

  getById: (id: string): Hub | undefined => {
    const hubs = storage.get<Hub[]>('hubs', initialHubs);
    return hubs.find((h) => h.id === id);
  },

  getByCode: (code: string): Hub | undefined => {
    const hubs = storage.get<Hub[]>('hubs', initialHubs);
    return hubs.find((h) => h.code.toUpperCase() === code.trim().toUpperCase());
  },
};

