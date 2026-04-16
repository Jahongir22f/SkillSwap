export interface Wallet {
  uid: string;
  balance: number; // in credits (1 credit = 60 mins teaching)
  history: Transaction[];
  updatedAt: any;
}

export interface Transaction {
  id: string;
  amount: number; // positive for earned, negative for spent
  type: 'earn' | 'spend' | 'bonus';
  sessionId?: string;
  description: string;
  createdAt: any;
}
