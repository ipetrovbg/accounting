export interface Transaction {
    id: string;
    costId?: string;
    incomeId?: string;
    income?: number;
    cost?: number;
    reason: string;
    withdrawal: number;
    deposit: number;
    date: Date;
    userId?: number;
    updatedAt: Date;
    createdAt: Date;
    isTest: boolean;
}
