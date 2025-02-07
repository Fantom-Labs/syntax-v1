
export interface Investment {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number; // Frontend property
  purchase_price?: number; // Database property
  totalInvested: number;
  type: 'stocks' | 'crypto' | 'funds' | 'fixed_income' | 'real_estate' | 'others';
}

export interface Portfolio {
  id: string;
  name: string;
  investments: Investment[];
  totalValue: number;
}
