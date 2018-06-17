import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToolbarComponent } from './app-toolbar/app-toolbar.component';

import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { MenuModule } from '@progress/kendo-angular-menu';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { DateRangeFilterComponent } from './date-range-filter/date-range-filter.component';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';

const kendo = [
  ToolBarModule,
  MenuModule,
  GridModule,
  ChartsModule,
  DatePickerModule,
  ButtonsModule,
  DialogsModule,
  InputsModule,
  LayoutModule,
  TooltipModule,
  DropDownsModule
];
const modules = [
  ReactiveFormsModule,
  HttpClientModule,
  FormsModule
];
const components = [
  AppToolbarComponent,
  DateRangeFilterComponent
];

const forExports = [
  ...kendo,
  ...modules,
  ...components
];

@NgModule({
  imports: [
    CommonModule,
    ...kendo,
    ...modules
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...forExports
  ]
})
export class SharedModule { }
