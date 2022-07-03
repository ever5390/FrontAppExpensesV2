import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { DataStructure } from 'app/data/models/data.model';


@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.css']
})
export class ManageExpenseComponent implements OnInit {




  
  show__list__items: boolean = false;
  dataStructure: DataStructure = new DataStructure();
  
  @Input() show__popup: boolean = false;
  @Output() sendHiddenFormRegister: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;

  constructor(
    private _renderer: Renderer2,
    private _router: Router
  ) {
    this.identifyEventClickOutWindow();
   }


  ngOnInit(): void {
  }



  showListCategories() {
    this.show__list__items = true;
    this.dataStructure.item=CONSTANTES.CONST_CATEGORIAS;
    this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_CATEGORIAS;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_CATEGORIAS
  }


  showListAccording() {
    this.show__list__items = true;
    this.dataStructure.item=CONSTANTES.CONST_ACUERDOS;
    this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_ACUERDOS;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_ACUERDOS
    
  } 

  showListPaymentMethods() {
    this.show__list__items = true;
    this.dataStructure.item=CONSTANTES.CONST_MEDIOSDEPAGO;
    this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_MEDIOSDEPAGO;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_MEDIOSDEPAGO;

  }


  showPopUp(){
    this.show__popup = true;
  }

  identifyEventClickOutWindow() {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.popup__formulario && e.target === this.popup__formulario.nativeElement){
        this.show__popup = false;
        this.sendHiddenFormRegister.emit(false);
      }
    });
  }
}
