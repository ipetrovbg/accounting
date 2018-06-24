export interface Transaction {
  id: number;
  comment: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: Date;
  simulation: boolean;
  userId: number;
  categoryId: number;
  updatedAt?: Date;
  createdAt: Date;
  deletedAt?: Date;
  category: {
    id: number;
    category: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}
