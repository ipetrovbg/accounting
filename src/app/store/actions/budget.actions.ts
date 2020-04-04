import { Action } from '@ngrx/store';
import {Budget} from '../states/budget.state';

export enum BudgetActionTypes {
  ADD_ONE = '[Budget] Add One',
  ADD_MANY = '[Budget] Add Many',
  FETCH = '[Budget] Fetch',
  CREATE = '[Budget] Create',
  DELETE_ALL = '[Budget] Delete All',
}

export class AddOne implements Action {
  public readonly type: BudgetActionTypes.ADD_ONE = BudgetActionTypes.ADD_ONE;
  constructor(public budget: Budget) {}
}

export class AddMany implements Action {
  public readonly type: BudgetActionTypes.ADD_MANY = BudgetActionTypes.ADD_MANY;

  constructor( public budgets: Budget[] ) {
    this.budgets.map(budget => {
      if (budget.StartDate) {
        budget.StartDate = new Date(budget.StartDate);
      }
      if (budget.EndDate) {
        budget.EndDate = new Date(budget.EndDate);
      }
      return budget;
    });
  }
}

export class DeleteAllBudgets implements Action {
  public readonly type: BudgetActionTypes.DELETE_ALL = BudgetActionTypes.DELETE_ALL;
}

export class Fetch implements Action {
  public readonly type: BudgetActionTypes.FETCH = BudgetActionTypes.FETCH;
  constructor(public token: string) {}
}

export class CreateBudget implements Action {
  public readonly type: BudgetActionTypes.CREATE = BudgetActionTypes.CREATE;
  constructor(public budget: Budget) {}
}

export type BudgetActions = AddOne | AddMany | Fetch | CreateBudget |
  DeleteAllBudgets;
