export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'rejected';
export type PayoutMethod = 'bkash' | 'nagad' | 'bank';

export interface PayoutRequest {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: PayoutMethod;
  accountNumber: string;
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  transactionReference?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  merchantId: string;
  merchantName: string;
  periodStart: string;
  periodEnd: string;
  totalParcels: number;
  totalCod: number;
  deliveryFees: number;
  codFees: number;
  netPayable: number;
  status: 'draft' | 'issued' | 'settled';
  createdAt: string;
}

export interface CodReconciliationRecord {
  id: string;
  riderId: string;
  riderName: string;
  hubId: string;
  hubName: string;
  date: string;
  collectedAmount: number;
  depositedAmount: number;
  discrepancy: number;
  status: 'matched' | 'discrepancy' | 'resolved';
  notes?: string;
}

