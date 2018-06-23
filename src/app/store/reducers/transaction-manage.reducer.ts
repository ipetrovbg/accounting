import { TransactionMangeActions, TransactionManageActionTypes } from './../actions/transaction-manage.action';
import { TransactionManageState } from '../states/transaction-manage.state';
import { initialState } from '../accounting.state';

export function transactionManageReducer(state: TransactionManageState = initialState.transactionManage, action: TransactionMangeActions): TransactionManageState {
    switch (action.type) {
        case TransactionManageActionTypes.UPDATE:
            return { ...state, [action.field]: action.value };

        case TransactionManageActionTypes.LOAD:
        const { id, date, isTest, createdAt, updatedAt, reason, userId, withdrawal, deposit, category } = action.transaction;

            return { ...state, ...{ id, date, isTest, createdAt, updatedAt, reason, userId, withdrawal, deposit, category } };

        default: return state;
    }
}
