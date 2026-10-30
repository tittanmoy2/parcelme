export type MerchantStatus = 'active' | 'pending_verification' | 'suspended';

export interface PayoutAccount {
  type: 'bkash' | 'nagad' | 'bank';
  accountNumber: string;
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
}

export interface Merchant {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  email: string;
  assignedHubId: string;
  status: MerchantStatus;
  totalParcels: number;
  deliveredParcels: number;
  returnRatePercentage: number;
  availableCodBalance: number;
  pendingCodBalance: number;
  payoutAccount: PayoutAccount;
}

