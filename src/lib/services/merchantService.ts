import { Merchant } from '@/types/merchant';
import { initialMerchants } from '@/lib/mock-data/merchants';
import { storage } from '@/lib/storage';

export const merchantService = {
  getAll: (): Merchant[] => {
    return storage.get<Merchant[]>('merchants', initialMerchants);
  },

  getById: (id: string): Merchant | undefined => {
    const merchants = storage.get<Merchant[]>('merchants', initialMerchants);
    return merchants.find((m) => m.id === id);
  },

  getCurrentMerchant: (): Merchant => {
    const merchants = storage.get<Merchant[]>('merchants', initialMerchants);
    return merchants[0] || initialMerchants[0];
  },

  updateBalance: (merchantId: string, availableChange: number, pendingChange: number): boolean => {
    const merchants = storage.get<Merchant[]>('merchants', initialMerchants);
    const index = merchants.findIndex((m) => m.id === merchantId);
    if (index === -1) return false;

    merchants[index].availableCodBalance += availableChange;
    merchants[index].pendingCodBalance += pendingChange;
    storage.set('merchants', [...merchants]);
    return true;
  },
};

