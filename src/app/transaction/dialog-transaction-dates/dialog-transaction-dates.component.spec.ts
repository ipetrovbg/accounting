import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTransactionDatesComponent } from './dialog-transaction-dates.component';

describe('DialogTransactionDatesComponent', () => {
  let component: DialogTransactionDatesComponent;
  let fixture: ComponentFixture<DialogTransactionDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTransactionDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTransactionDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
