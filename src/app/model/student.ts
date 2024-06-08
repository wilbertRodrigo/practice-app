import { Transaction } from './transaction';

export interface Student {
  id?: string;
  name: string;
  balance: number;
  currency: string;
  wallet: {
    transactions: Transaction[];
  };
}
