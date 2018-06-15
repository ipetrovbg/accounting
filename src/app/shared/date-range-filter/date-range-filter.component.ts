import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FilterService, PopupCloseEvent, SinglePopupService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { addDays } from '@progress/kendo-date-math';

const closest = (node: any, predicate: any): any => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }

  return node;
};

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss']
})
export class DateRangeFilterComponent implements OnInit, OnDestroy {

  @Input() public filter: CompositeFilterDescriptor;
  @Input() public filterService: FilterService;
  @Input() public field: string;

  public start: any;
  public end: any;

  public get min(): any {
    return this.start ? addDays(this.start, 1) : null;
  }

  public get max(): any {
    return this.end ? addDays(this.end, -1) : null;
  }

  public popupSettings: any = {
    popupClass: 'date-range-filter'
  };

  private popupSubscription: any;

  constructor(private element: ElementRef,
              private popupService: SinglePopupService) {

    // Handle the service onClose event and prevent the menu from closing when the datepickers are still active.
    this.popupSubscription = popupService.onClose.subscribe((e: PopupCloseEvent) => {
      if (document.activeElement && closest(document.activeElement,
          node => node === this.element.nativeElement || (String(node.className).indexOf('date-range-filter') >= 0))) {
        e.preventDefault();
      }
    });
  }

  public ngOnInit(): void {
    this.start = this.findValue('gte');
    this.end = this.findValue('lte');
  }

  public ngOnDestroy(): void {
    this.popupSubscription.unsubscribe();
  }

  public onStartChange(value: any): void {
    this.filterRange(value, this.end);
  }

  public onEndChange(value: any): void {
    this.filterRange(this.start, value);
  }

  private findValue(operator) {
    const filter: any = this.filter.filters.filter((x: any) => x.field === this.field && x.operator === operator)[0];
    return filter ? filter.value : null;
  }

  private filterRange(start, end) {
    const filters = [];

    if (start && (!end || start < end)) {
      filters.push({
        field: this.field,
        operator: 'gte',
        value: start
      });
      this.start = start;
    }

    if (end && (!start || start < end)) {
      filters.push({
        field: this.field,
        operator: 'lte',
        value: end
      });
      this.end = end;
    }

    this.filterService.filter({
      logic: 'and',
      filters: filters
    });
  }
}
