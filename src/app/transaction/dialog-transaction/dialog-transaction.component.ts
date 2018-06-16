import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('new transaction');
  }

}
