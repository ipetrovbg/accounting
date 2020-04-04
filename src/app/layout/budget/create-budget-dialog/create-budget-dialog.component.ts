import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../../store/accounting.state';
import {Observable} from 'rxjs';
import {CategoriesService} from '../../../categories/categories.service';
import {map} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {selectAllCurrenciesSelector} from '../../../store/reducers/currency.reducer';
import {Currency} from '../../../store/states/currency.state';

@Component({
  selector: 'app-create-budget-dialog',
  templateUrl: './create-budget-dialog.component.html',
  styleUrls: ['./create-budget-dialog.component.scss']
})
export class CreateBudgetDialogComponent implements OnInit {

  public categories$: Observable<string[]> = null;
  public currencies$:  Observable<Currency[]> = null;
  public form: FormGroup;

  constructor(
    private store: Store<State>,
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      category: [null, Validators.required],
      budgetName: ['', Validators.required],
      goal: [1, Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      currency: [null, Validators.required]
    });
    this.categories$ = this.getCategories();
    this.currencies$ = this.store.select(selectAllCurrenciesSelector);
  }

  public getCategories() {
    return this.categoriesService.fetchCategories().pipe(map(cat => cat.results));
  }
}
