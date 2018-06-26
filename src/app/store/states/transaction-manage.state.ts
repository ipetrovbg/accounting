export interface TransactionManageState {
  id: number;
  date: Date;
  comment: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  simulation: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userId: number;
  categoryId: number;
  accountId: number;
  account: {
    id: number;
    name: string;
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
