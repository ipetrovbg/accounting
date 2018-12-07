import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToolbarComponent } from './app-toolbar/app-toolbar.component';

import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { MenuModule } from '@progress/kendo-angular-menu';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { PopupModule } from '@progress/kendo-angular-popup';
import { UploadModule } from '@progress/kendo-angular-upload';
import { RippleModule } from '@progress/kendo-angular-ripple';


import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { DateRangeFilterComponent } from './date-range-filter/date-range-filter.component';
import { DatePickerModule, DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

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
  DropDownsModule,
  IntlModule,
  DateInputsModule,
  PopupModule,
  UploadModule,
  ExcelModule,
  PDFModule,
  RippleModule
];
const modules = [
  ReactiveFormsModule,
  HttpClientModule,
  FormsModule
];
const components = [
  AppToolbarComponent,
  DateRangeFilterComponent,
  ConfirmDialogComponent
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
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule { }
