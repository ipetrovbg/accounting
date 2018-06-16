import { Action } from '@ngrx/store';
import { TransactionManageState } from '../states/transaction-manage.state';

export enum TransactionManageActionTypes {
    UPDATE = '[TransactionManage] Update',
    LOAD = '[TransactionManage] Load'
}

export class Update implements Action {
    public readonly type: TransactionManageActionTypes.UPDATE = TransactionManageActionTypes.UPDATE;
    constructor( public field: string, public value: any ) {}
}

export class Load implements Action {
    public readonly type: TransactionManageActionTypes.LOAD = TransactionManageActionTypes.LOAD;
    constructor( public transaction: TransactionManageState ) {}
}

export type TransactionMangeActions = Update | Load;
