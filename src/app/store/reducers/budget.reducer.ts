import {createEntityAdapter} from '@ngrx/entity';
import {Budget, BudgetState} from '../states/budget.state';
import {BudgetActions, BudgetActionTypes} from '../actions/budget.actions';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const budgetAdapter = createEntityAdapter<Budget>({
  selectId: (budget: Budget) => budget.Id
});

const initialState: BudgetState = budgetAdapter.getInitialState();

export function budgetReducer(state: BudgetState = initialState, action: BudgetActions ): BudgetState {
  switch (action.type) {
    case BudgetActionTypes.ADD_ONE:
      return budgetAdapter.addOne(action.budget, state);
    case BudgetActionTypes.DELETE_ALL:
      return budgetAdapter.removeAll(state);
    case BudgetActionTypes.ADD_MANY:
      return budgetAdapter.upsertMany(action.budgets, state);
    default: return state;
  }
}

export const {
  // select the array of budget ids
  selectIds: selectBudgetIds,

  // select the dictionary of budget entities
  selectEntities: selectBudgetEntities,

  // select the array of budgets
  selectAll: selectAllBudgets,

  // select the total budget count
  selectTotal: selectTotalBudgets
} = budgetAdapter.getSelectors();

export const selectBudgetState = createFeatureSelector<BudgetState>('budgets');

export const selectAllBudgetsSelector = createSelector(
  selectBudgetState,
  selectAllBudgets
);
