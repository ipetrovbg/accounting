
import {tap} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../../transaction/account.model';
import { selectAllAccountsSelector } from '../../store/reducers/account.reducer';
import { Store } from '@ngrx/store';
import { getState, State as AppState } from '../../store/accounting.state';
import { AccountsFetch } from '../../store/actions/account.actions';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { AccountLoad, UpdateEdit } from '../../store/actions/account-manage.actions';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public loading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public gridData: BehaviorSubject<GridDataResult> = new BehaviorSubject<GridDataResult>({data: [], total: 0 });
  public accounts$: Observable<Account[]>;
  public state: State = {skip: 0, take: 1000};

  constructor(
    private store: Store<AppState>,
    private dialogService: DialogService,
    private account: AccountService
  ) { }

  ngOnInit() {
    this.store.select(state => state.user.token)
      .subscribe(token => {
        if (token)
          this.refreshData();
      });

    this.accounts$ = this.store.select(selectAllAccountsSelector).pipe(tap(() => this.loading.next(false)));

    this.accounts$.subscribe(accounts => this.gridData.next(process(accounts, this.state)));
  }

  public addEditAccount(e?: any): void {

    this.store
      .dispatch(new UpdateEdit(e && e.dataItem || {name: '', id: null, currency: { id: null, sign: '', currency: '', country: '' }}));

    const dialog: DialogRef = this.dialogService.open({
      title: `${e ? 'Edit' : 'New'} Account`,
      content: AccountDialogComponent,
      actions: [
        {text: 'Cancel'},
        {text: 'Save', primary: true}
      ],
      height: 400
    });
    dialog.result.subscribe(actions => {
      if (!(actions instanceof DialogCloseResult) && actions.primary) {
        const newAccount = getState(this.store).accountManage.edit;
        this.account.updateAccount(newAccount)
          .subscribe(accountResponse => {
            this.refreshData();
            if (newAccount.id ===  getState(this.store).accountManage.id) {
              this.store.dispatch(new AccountLoad({
                edit: { ...newAccount },
                currency: {
                  id: newAccount.currency.id,
                  sign: newAccount.currency.sign,
                  currency: newAccount.currency.currency,
                  country: newAccount.currency.country
                },
                amount: newAccount.amount,
                id: newAccount.id,
                name: newAccount.name
              }));
            }
          }, err => console.log(err));
      }
    });
  }

  public dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.refreshData();
  }

  private refreshData() {
    this.store.dispatch(new AccountsFetch());
  }

}
