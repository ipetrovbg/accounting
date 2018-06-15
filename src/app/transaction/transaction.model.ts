export interface Transaction {
    id: string;
    reason: string;
    withdrawaw: number;
    deposit: number;
    date: Date;
    updatedAt: Date;
    createdAt: Date;
    isTest: boolean;
}