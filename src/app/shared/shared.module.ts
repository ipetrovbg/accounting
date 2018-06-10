import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToolbarComponent } from './app-toolbar/app-toolbar.component';

import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { MenuModule } from '@progress/kendo-angular-menu';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { ReactiveFormsModule } from '@angular/forms';

const kendo = [
  ToolBarModule,
  MenuModule,
  GridModule,
  ChartsModule
];
const modules = [
  ReactiveFormsModule,
  HttpClientModule
];
const components = [
  AppToolbarComponent
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
