export interface TransactionManageState {
  id: number;
  date: Date;
  comment: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  originalAmount: number;
  simulation: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId: number;
  transactionId: number;
  categoryId: number;
  currencyId: number;
  accountId: number;
  account: {
    id: number;
    name: string;
    currency: {
      id: null,
      sign: '',
      currency: '',
      country: ''
    }
  };
  user: {
    email: string;
    name: string;
    id: number;
  };
  category: {
    id: number;
    category: string;
  };
}
