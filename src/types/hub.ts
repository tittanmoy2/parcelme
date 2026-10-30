export interface Hub {
  id: string;
  code: string; // e.g. "MIR-01"
  name: string; // "Mirpur Hub"
  district: string;
  address: string;
  phone: string;
  managerName: string;
  activeRiderCount: number;
  parcelsAtHub: number;
}

