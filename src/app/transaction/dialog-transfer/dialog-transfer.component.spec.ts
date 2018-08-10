import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTransferComponent } from './dialog-transfer.component';

describe('DialogTransferComponent', () => {
  let component: DialogTransferComponent;
  let fixture: ComponentFixture<DialogTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
