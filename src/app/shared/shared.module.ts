import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
//import * as fromComponents from './components';
import { FormularioSharedComponent } from './components/formulario-shared/formulario-shared.component';
import { ListaSharedComponent } from './components/lista-shared/lista-shared.component';
import { FilterByItemSharedComponent } from './components/filter-by-item-shared/filter-by-item-shared.component';
import { FormularyRegisterExpenseSharedComponent } from './components/formulary-register-expense-shared/formulary-register-expense-shared.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  declarations: [
    FormularioSharedComponent,
    ListaSharedComponent,
    FilterByItemSharedComponent,
    FormularyRegisterExpenseSharedComponent
   // ...fromComponents.components, FormularioSharedComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    
    FormularioSharedComponent,
    ListaSharedComponent,
    FilterByItemSharedComponent,
    FormularyRegisterExpenseSharedComponent
    //...fromComponents.components
  ]
})
export class SharedModule { }
