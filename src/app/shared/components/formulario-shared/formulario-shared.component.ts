import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { DataStructure } from 'app/data/models/data.model';

@Component({
  selector: 'app-formulario-shared',
  templateUrl: './formulario-shared.component.html',
  styleUrls: ['./formulario-shared.component.css']
})
export class FormularioSharedComponent implements OnInit {
  
  showCategoriesList: boolean = false;
  show__popup: boolean =  false;

  flagInputNameFormulario: boolean = true;
  flagGroupSelectFormulario: boolean = true;
  flagBlockTransferFormulario: boolean = true;
  flagBlockAmountAccountFormulario: boolean = true;

  @Input() btnText: string = '';
  @Input() dataStructureReceived: DataStructure = new DataStructure();
  @Output() responseToFatherComponent = new EventEmitter<any>();
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;

  constructor(
    private _renderer: Renderer2
  ) {
    this.catchClickEventOutForm();
  }

  ngOnInit(): void {
    this.switchDecideFormByComponent();
  }

  showPopUp() {
    this.show__popup = true;
  }

  hiddenPopUp() {
    this.show__popup = false;
    this.responseToFatherComponent.emit(false);
  }

  catchClickEventOutForm() {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.popup__formulario && e.target === this.popup__formulario.nativeElement){
        this.show__popup = false;
        this.responseToFatherComponent.emit(false);
      }
    });
  }

  switchDecideFormByComponent() {
    var flagContentSeleccione = false;
    
    if(this.dataStructureReceived.title.toLocaleLowerCase().includes('seleccione'))
      flagContentSeleccione = true;

    if(this.dataStructureReceived.item != '')
        this.show__popup = true;

    switch (this.dataStructureReceived.item) {
      case CONSTANTES.CONST_CATEGORIAS:
        this.dataStructureReceived.titleDos = (flagContentSeleccione===true)?CONSTANTES.CONST_TITLE_REGISTRAR_ITEM_CATEGORIA:this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =true;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case CONSTANTES.CONST_ACUERDOS:
        this.dataStructureReceived.titleDos = (flagContentSeleccione===true)?CONSTANTES.CONST_TITLE_REGISTRAR_ITEM_ACUERDO:this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case CONSTANTES.CONST_MEDIOSDEPAGO:
        this.dataStructureReceived.titleDos = (flagContentSeleccione===true)?CONSTANTES.CONST_TITLE_REGISTRAR_ITEM_MEDIOSDEPAGO:this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case CONSTANTES.CONST_TRANSFERENCIA_INTERNA:
        this.dataStructureReceived.titleDos = this.dataStructureReceived.title;
        this.flagInputNameFormulario=false;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=true;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case CONSTANTES.CONST_TRANSFERENCIA_EXTERNA:
        this.dataStructureReceived.titleDos = this.dataStructureReceived.title;
        this.flagInputNameFormulario=false;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=true;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case CONSTANTES.CONST_CUENTAS:
        this.dataStructureReceived.titleDos = this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=true;
        break;
      default:
        break;
    }
  }
}
