import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { DataStructureListShared } from 'app/data/models/data.model';


@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.css']
})
export class ManageExpenseComponent implements OnInit {




  
  show__list__items: boolean = false;
  dataStructure: DataStructureListShared = new DataStructureListShared();
  
  @Input() show__popup: boolean = false;
  @Output() sendHiddenFormRegister: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;
  @ViewChild('formRegister') formRegister: ElementRef | any;

  
  constructor(
    private _renderer: Renderer2,
    private _router: Router
  ) {
    this.identifyEventClickOutWindow();
   }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightForm = this.formRegister.nativeElement.clientHeight;

    //IF onlyListItems is FALSE :: Viene desde una cuenta para anadir categorias
    //Definiendo valores de acuerdo a de donde es llamado este componente

    if(heightForm > windowHeight -100){
      this._renderer.setStyle(this.formRegister.nativeElement,"height",(windowHeight*0.8)+"px");
      this._renderer.setStyle(this.formRegister.nativeElement,"overflow-y","scroll");
    }

  }


  showListCategories() {
    this.show__list__items = true;
    this.dataStructure.component=CONSTANTES.CONST_COMPONENT_CATEGORIAS;
    this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_CATEGORIAS;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_CATEGORIAS
  }


  showListAccording() {
    this.show__list__items = true;
    this.dataStructure.component=CONSTANTES.CONST_COMPONENT_ACUERDOS;
    this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_ACUERDOS;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_ACUERDOS
    
  } 

  showListPaymentMethods() {
    this.show__list__items = true;
    this.dataStructure.component=CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO;
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
