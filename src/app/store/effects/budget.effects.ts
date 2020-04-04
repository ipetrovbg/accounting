import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, mergeMap, switchMap} from 'rxjs/operators';
import {BudgetService} from '../../layout/budget/budget.service';
import {AddMany, AddOne, BudgetActionTypes, CreateBudget, Fetch} from '../actions/budget.actions';
import {Injectable} from '@angular/core';
import {Budget} from '../states/budget.state';
import {of as observableOf} from 'rxjs';

@Injectable()
export class BudgetEffects {

  constructor(
    private actions: Actions,
    private budget: BudgetService
  ) {}

  @Effect() fetchBudgets = this.actions.pipe(
    ofType(BudgetActionTypes.FETCH),
    switchMap((action: Fetch) => this.budget.getAll(action.token)),
    switchMap(data => [new AddMany(data.response) ])
  );

  @Effect() createBudget = this.actions.pipe(
    ofType(BudgetActionTypes.CREATE),
    switchMap((action: CreateBudget) => this.budget.create(action.budget)),
    mergeMap((data: {response: Budget}) => [new AddOne(data.response)]),
    catchError(err => observableOf({}))
  );
}
