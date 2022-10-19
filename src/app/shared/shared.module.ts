import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
//import * as fromComponents from './components';
import { FormularioSharedComponent } from './components/formulario-shared/formulario-shared.component';
import { SLoaderComponent } from './components/loaders/s-loader/s-loader.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ListCategoryComponent } from '@modules/category/list-category/list-category.component';
import { ListAccountsSharedComponent } from './components/list-accounts-shared/list-accounts-shared.component';
import { VisualizadorVoucherComponent } from './components/visualizador-voucher/visualizador-voucher.component';
import { NumberDirective } from './directives/numbers-only.directive';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  declarations: [
    NumberDirective,
    FormularioSharedComponent,
    SLoaderComponent,
    CalendarComponent,
    ListCategoryComponent,
    ListAccountsSharedComponent,
    VisualizadorVoucherComponent,
    SearchComponent,
    
       // ...fromComponents.components, FormularioSharedComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    
    FormularioSharedComponent,
    SLoaderComponent,
    CalendarComponent,
    ListCategoryComponent,
    ListAccountsSharedComponent,
    VisualizadorVoucherComponent,
    SearchComponent

    //...fromComponents.components
  ]
})
export class SharedModule { }
