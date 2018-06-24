import { TransactionMangeActions, TransactionManageActionTypes } from './../actions/transaction-manage.action';
import { TransactionManageState } from '../states/transaction-manage.state';
import { initialState } from '../accounting.state';

export function transactionManageReducer(state: TransactionManageState = initialState.transactionManage, action: TransactionMangeActions): TransactionManageState {
    switch (action.type) {
        case TransactionManageActionTypes.UPDATE:
            return { ...state, [action.field]: action.value };

        case TransactionManageActionTypes.LOAD:
        const { id, date, simulation, createdAt, type, categoryId, updatedAt, deletedAt, comment, userId, amount, category, user } = action.transaction;

            return { ...state, ...{ id, date, simulation, type, categoryId, createdAt, updatedAt, deletedAt, comment, userId, amount, category, user } };

        default: return state;
    }
}
