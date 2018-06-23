import { Update } from './../../store/actions/transaction-manage.action';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { State, getState } from './../../store/accounting.state';
import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionManageState } from '../../store/states/transaction-manage.state';
import { CategoriesService } from '../../categories/categories.service';

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit, OnDestroy {

  @Input() state: 'new' | 'edit';
  @Input() transactionState: 'deposit' | 'withdrawal';

  public form: FormGroup;
  public categoryForm: FormGroup;
  public transactionStateList: string[] = ['Deposit', 'Withdrawal'];
  public allCategories: Observable<string[]> = null;
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
    private categories: CategoriesService
  ) { }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      category: ['', Validators.required]
    });
    const transaction: any = getState(this.store).transactionManage;
    if (this.state === 'new') {
      transaction.date = new Date();
      transaction.category = null;
      if (this.transactionState === 'deposit') {
        transaction.deposit = 0;
      } else {
        transaction.withdrawal = 0;
      }
    }

    this.allCategories = this.getCategories().map(categories => {
      categories.map(item => {
        if (transaction.category.id === item.id) {
          this.selectedCategory = item;
        }
        return item;
      });
      return categories;
    });

    this.form = this.fb.group(transaction);

    this.form.get('date').valueChanges.subscribe(value => this.store.dispatch(new Update('date', value)));
    this.form.get('withdrawal').valueChanges.subscribe(value => this.store.dispatch(new Update('withdrawal', value)));
    this.form.get('deposit').valueChanges.subscribe(value => this.store.dispatch(new Update('deposit', value)));
    this.form.get('reason').valueChanges.subscribe(value => this.store.dispatch(new Update('reason', value)));
    this.form.get('isTest').valueChanges.subscribe(value => this.store.dispatch(new Update('isTest', value)));
    this.form.get('category').valueChanges.subscribe(value => {
      console.log(value);
      this.store.dispatch(new Update('category', value));
    });

    this.subscription.add(this.store.select(s => s.transactionManage)
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

  openCategoryDialog() {
    this.categoryForm.reset();
    this.show = !this.show;
  }
  public toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
  }

  handleStateChange(e) {
    if (e === 'Deposit') {
      this.form.get('deposit').patchValue(this.form.get('withdrawal').value);
      this.form.get('withdrawal').patchValue(null);
    } else {
      this.form.get('withdrawal').patchValue(this.form.get('deposit').value);
      this.form.get('deposit').patchValue(null);
    }
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

  private contains(target: any): boolean {
    return this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false);
  }
}
