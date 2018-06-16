export interface TransactionManageState {
    id: string;
    date: Date;
    reason: string;
    withdrawal: string;
    deposit: string;
    isTest: boolean;
    updatedAt: Date;
    createdAt: Date;
    userId?: string;
}