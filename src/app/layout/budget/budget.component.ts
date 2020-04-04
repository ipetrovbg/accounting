import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {GridComponent} from '@progress/kendo-angular-grid';
import {BehaviorSubject, Subscriber, Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {getState, State} from '../../store/accounting.state';
import {CreateBudget, Fetch} from '../../store/actions/budget.actions';
import {selectAllBudgetsSelector} from '../../store/reducers/budget.reducer';
import {Budget} from '../../store/states/budget.state';
import {DialogService} from '@progress/kendo-angular-dialog';
import {CreateBudgetDialogComponent} from './create-budget-dialog/create-budget-dialog.component';
import {map, skipWhile, take} from 'rxjs/operators';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetComponent implements OnInit, OnDestroy {

  @ViewChild(GridComponent, {static: false}) private grid: GridComponent;
  public view: BehaviorSubject<Budget[]> = new BehaviorSubject<Budget[]>([]);
  public formGroup: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private store: Store<State>,
    private dialog: DialogService,
  ) { }

  ngOnInit() {
    this.subscription.add(this.store.select(state => state.user)
      .subscribe(user => {
        if (user && user.token) {
          this.store.dispatch(new Fetch(user.token));
        }
      }));
    this.subscription.add(this.store.select(selectAllBudgetsSelector)
      .pipe(
        map(budgets => budgets.map(budget => {
            if (budget.StartDate) {
              budget.StartDate = new Date(budget.StartDate);
            }
            if (budget.EndDate) {
              budget.EndDate = new Date(budget.EndDate);
            }
            return budget;
          }))
      )
      .subscribe(budgets => {
        this.view.next(budgets);
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public addHandler(): void {
    const createBudgetDialog = this.dialog.open({
      width: 1000,
      title: 'Create Budget',
      content: CreateBudgetDialogComponent,
      actions: [
        { text: 'Cancel', primary: false },
        { text: 'Create', primary: true }
      ]
    });

    createBudgetDialog.result.pipe(
      take(1),
      skipWhile((r: {text: string, primary: boolean}) => !r.primary)
    ).subscribe(() => {
      const form = createBudgetDialog.content.instance.form;
      if (form.valid && !form.pristine) {
        const budget = new Budget();
        const value = form.value;

        budget.UserId = getState(this.store).user.id;
        budget.updateFromForm(value);
        const budgets = this.view.getValue();

        const matchingBudget = budgets.find(b => ((budget.EndDate >= b.StartDate && budget.StartDate <= b.EndDate)
          && b.CategoryId === budget.CategoryId));

        if (!matchingBudget) {
          this.store.dispatch(new CreateBudget(budget));
        }
      }
    });
  }

}
