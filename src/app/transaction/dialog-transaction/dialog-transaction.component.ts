import { Update } from './../../store/actions/transaction-manage.action';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { State, getState } from './../../store/accounting.state';
import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionManageState } from '../../store/states/transaction-manage.state';
import { CategoriesService } from '../../categories/categories.service';
import 'rxjs-compat/add/operator/debounceTime';
import { TransactionService } from '../transaction.service';

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
  public selectedCategory = { category: '', id: null };
  public show = false;

  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;

  private subscription: Subscription = new Subscription();

  @HostListener('keydown', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.toggle(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }

  constructor(
    private store: Store<State>,
    private fb: FormBuilder,
    private categories: CategoriesService,
    private transaction: TransactionService
  ) { }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      category: ['', Validators.required]
    });
    const transaction: TransactionManageState = getState(this.store).transactionManage;
    this.transactionState = transaction.type;
    if (this.state === 'new') {
      transaction.date = new Date();
      this.store.dispatch(new Update('userId', getState(this.store).user.id));
      this.store.dispatch(new Update('user', getState(this.store).user));
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

    this.accounts = this.getAccounts().map(accounts => {
      if (this.state === 'new' && accounts.length) {
        this.setMailAccount(accounts);
      }
      accounts.forEach(item => {
        if (transaction.account && transaction.account.id === item.id) {
          this.form.get('account').patchValue({
            id: item.id,
            name: item.name
          });
        }
      });
      return accounts;
    });

    this.form.get('date').valueChanges.subscribe(value => this.store.dispatch(new Update('date', value)));
    this.form.get('amount').valueChanges.subscribe(value => this.store.dispatch(new Update('amount', value)));
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

  setMailAccount(accounts) {
    accounts.forEach(item => {
      if (item.name === 'Main') {
        this.form.get('account').patchValue({
          id: item.id,
          name: item.name
        });
      }
    });
  }

  openCategoryDialog() {
    this.categoryForm.reset();
    this.show = !this.show;
  }
  public toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
  }

  handleStateChange(e) {
    console.log(e);
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
        .subscribe(() => {
          this.allCategories = this.getCategories();
          this.show = false;
      });
    }
  }

  public getAccounts() {
    return this.transaction.fetchAccounts().map((accounts: any) => accounts.response);
  }

  private contains(target: any): boolean {
    return this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false);
  }
}
