import { Update } from './../../store/actions/transaction-manage.action';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { State, getState } from './../../store/accounting.state';
import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionManageState } from '../../store/states/transaction-manage.state';
import { CategoriesService } from '../../categories/categories.service';
import 'rxjs-compat/add/operator/debounceTime';
import { TransactionService } from '../transaction.service';
import { AccountService } from '../../account/account.service';
import { Currency } from '../../store/states/currency.state';
import { selectAllCurrenciesSelector } from '../../store/reducers/currency.reducer';
import { CurrencyService } from '../../core/currency.service';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit, OnDestroy {

  @Input() state: 'new' | 'edit';

  public form: FormGroup;
  public transactionState: 'deposit' | 'withdrawal';
  public categoryForm: FormGroup;
  public transactionStateList: string[] = ['deposit', 'withdrawal'];
  public allCategories: Observable<string[]> = null;
  public accounts: Observable<any> = null;
  public currencies$: Observable<Currency[]> = null;
  public currencyForm: FormGroup;
  public selectedCategory = { category: '', id: null };
  public show = false;

  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
  @ViewChild(ComboBoxComponent) public combo: ComboBoxComponent;

  private subscription: Subscription = new Subscription();

  @HostListener('keydown', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.toggle(false);
    }
  }

 /* @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }*/

  constructor(
    private store: Store<State>,
    private fb: FormBuilder,
    private categories: CategoriesService,
    private transaction: TransactionService,
    private account: AccountService,
    private currency: CurrencyService
  ) { }

  ngOnInit() {


    this.currencyManage();

    this.categoryForm = this.fb.group({
      category: ['', Validators.required]
    });
    const transaction: TransactionManageState = getState(this.store).transactionManage;
    this.transactionState = transaction.type;
    if (this.state === 'new') {
      transaction.date = new Date();
      this.store.dispatch(new Update('userId', getState(this.store).user.id));
      this.store.dispatch(new Update('user', getState(this.store).user));
    } else {
      transaction.amount = transaction.originalAmount;
    }

    this.allCategories = this.getCategories().map(categories => {
      categories.map(item => {
        if (transaction.category && transaction.category.id === item.id) {
          this.selectedCategory = item;
        }
        return item;
      });
      return categories;
    });

    this.form = this.fb.group(transaction);
    this.form.setValidators(() => {
      return this.currencyForm && !this.currencyForm.get('from').value && !this.currencyForm.get('to').value ? { currency: true} : null;
    });
    this.form.setErrors({currency: true});

    if (this.state === 'edit') {
      // if (transaction.transactionId) {
        this.form.get('amount').patchValue(transaction.originalAmount);
      // }
      this.form.get('amount').disable();
      this.form.get('simulation').disable();
      this.form.get('account').disable();
      this.form.get('type').disable();
      this.currencyForm.get('from').disable();
      this.currencyForm.get('rate').disable();
      this.currencyForm.get('from').setErrors(null);
    }

    this.accounts = this.getAccounts().map(accounts => {
      if (this.state === 'new' && accounts.length) {
        this.setAccount();
      }
      accounts.forEach(item => {
        if (transaction.account && transaction.account.id === item.id) {
          this.form.get('account').patchValue({
            id: item.id,
            name: item.name
          });
          this.currencyForm.get('to').patchValue({
            id: item.currency.id,
            sign: item.currency.sign
          });
        }
      });
      return accounts;
    });

    this.form.get('date').valueChanges.subscribe(value => this.store.dispatch(new Update('date', value)));
    if (this.state === 'edit') {
      // if (transaction.transactionId) {
        this.form.get('amount').valueChanges.subscribe(() => this.store.dispatch(new Update('amount', transaction.originalAmount)));
      // }
    } else {
      this.form.get('amount').valueChanges.subscribe(value => this.store.dispatch(new Update('amount', value)));
    }
    this.form.get('comment').valueChanges.subscribe(value => this.store.dispatch(new Update('comment', value)));
    this.form.get('simulation').valueChanges.subscribe(value => this.store.dispatch(new Update('simulation', value)));
    this.form.get('type').valueChanges.subscribe(value => this.store.dispatch(new Update('type', value)));
    this.form.get('category').valueChanges.subscribe(value => {
      this.store.dispatch(new Update('category', value));
      this.store.dispatch(new Update('categoryId', value && value.id || null));
    });
    this.form.get('account').valueChanges.subscribe(value => {
      this.store.dispatch(new Update('account', value));
      this.store.dispatch(new Update('accountId', value && value.id || null));
    });

    this.subscription.add(this.store.select(s => s.transactionManage)
      .debounceTime(750)
    .subscribe((t: any) => {
      this.allCategories.subscribe((categories: any) => {
        categories.forEach(cat => {
          if (cat.id === t.category) {
            t.category = cat;
          }
        });
        this.form.patchValue(t, { emitEvent: false, onlySelf: true });
      });

    }));
  }

  setAccount() {
    this.form.get('account').patchValue(getState(this.store).accountManage);
  }

  currencyManage() {
    this.currencies$ = this.store.select(selectAllCurrenciesSelector);



    this.currencyForm = this.fb.group({
      from: null,
      to: null,
      rate: null
    });

    this.currencies$.subscribe(currencies => {
      if (this.state === 'edit') {
        currencies.map(currency => {
          if (currency.id === getState(this.store).transactionManage.currencyId) {
            this.currencyForm.get('from').patchValue(currency);
            setTimeout(() => {
              if (this.currencyForm.get('to').value.id) {
                this.currency.getCurrencyPairRate(getState(this.store).transactionManage.currencyId, this.currencyForm.get('to').value.id)
                  .subscribe((rate: any) => {
                    this.currencyForm.get('rate').patchValue(rate.rate);
                  });
              }
            }, 1000);
          }
        });
      }
    });

    this.currencyForm.get('to').disable();

    this.currencyForm.get('from').setValidators((control: AbstractControl) => {

      let error = { currency: true };
      if (control && control.value) {
        error = null;
      } else {
        error = { currency: true };
        this.form.setErrors({currency: true});
      }
      return error;
    });

    this.subscription.add(this.store.select(state => state.transactionManage.account.currency)
      .subscribe(currency => {
        if (currency) {

          this.currencyForm.get('to').patchValue({
            id: currency.id,
            sign: currency.sign
          });
          const fromField = this.currencyForm.get('from');
          if (this.state === 'new' && !fromField.touched) {
            fromField.patchValue({
              id: currency.id,
              sign: currency.sign
            });
          }
          setTimeout(() => this.currencyChanged(), 100);
        }
    }));

    this.subscription.add(this.currencyForm.get('from').valueChanges.subscribe(() => {
      this.currencyChanged();
    }));
  }

  currencyChanged() {
    if (this.currencyForm.get('from').value && this.currencyForm.get('to').value) {
      if (this.currencyForm.get('from').value.id === this.currencyForm.get('to').value.id) {
        this.currencyForm.get('rate').patchValue(1);
      } else {
        this.currency.getCurrencyPairRate(this.currencyForm.get('from').value.id, this.currencyForm.get('to').value.id)
          .subscribe((rateResponse: any) => {
            this.currencyForm.get('rate').patchValue(rateResponse.rate);
          });
      }
      this.form.setErrors(null);
    } else {
      this.form.setErrors({currency: true});
    }
  }

  openCategoryDialog() {
    this.categoryForm.reset();
    this.combo.toggle(false);
    setTimeout(() => this.show = !this.show, 20);
  }
  public toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
  }

  handleStateChange(e) {
    this.transactionState = e.toLowerCase();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public getCategories() {
    return this.categories.fetchCategories().map(cat => cat.results);
  }

  public createCategory(e) {
    e.preventDefault();
    if (this.categoryForm.valid) {
      this.categories.create(this.categoryForm.get('category').value)
        .subscribe((response: any) => {
          this.allCategories = this.getCategories();
          this.form.get('category').patchValue(response.response);
          this.show = false;
      });
    }
  }

  public getAccounts() {
    return this.account.fetchAccounts().map((accounts: any) => accounts.response);
  }
/*
  private contains(target: any): boolean {
    return this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false);
  }*/
}
