export interface Transaction {
    id: string;
    reason: string;
    withdrawal: number;
    deposit: number;
    date: Date;
    updatedAt: Date;
    createdAt: Date;
    isTest: boolean;
}
