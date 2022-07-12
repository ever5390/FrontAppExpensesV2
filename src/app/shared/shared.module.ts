import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
//import * as fromComponents from './components';
import { FormularioSharedComponent } from './components/formulario-shared/formulario-shared.component';
import { ListaSharedComponent } from './components/lista-shared/lista-shared.component';
import { FilterByItemSharedComponent } from './components/filter-by-item-shared/filter-by-item-shared.component';
import { SLoaderComponent } from './components/loaders/s-loader/s-loader.component';

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
    SLoaderComponent
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
    SLoaderComponent

    //...fromComponents.components
  ]
})
export class SharedModule { }
