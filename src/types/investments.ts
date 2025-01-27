export interface Investment {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number; // USD
  totalInvested: number; // BRL
  type: 'stocks' | 'crypto' | 'funds' | 'fixed_income' | 'real_estate' | 'others';
}

export interface Portfolio {
  id: string;
  name: string;
  investments: Investment[];
  totalValue: number;
}