import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-formulario-shared',
  templateUrl: './formulario-shared.component.html',
  styleUrls: ['./formulario-shared.component.css']
})
export class FormularioSharedComponent implements OnInit {
  
  showCategoriesList: boolean = false;
  show__popup: boolean =  false;
  flagPadre: boolean = false;

  flagInputNameFormulario: boolean = true;
  flagGroupSelectFormulario: boolean = true;
  flagBlockTransferFormulario: boolean = true;
  flagBlockAmountAccountFormulario: boolean = true;

  @Input() title: string = '';
  @Input() imagen: string = '';
  @Input() btnText: string = '';
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
    if(this.title != '')
        this.show__popup = true;

    switch (this.title.toLowerCase()) {
      case "categorías":
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =true;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case "acuerdos":
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case "medios de pago":
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case "transferencia interna":
        this.flagInputNameFormulario=false;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=true;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case "transferencia externa":
        this.flagInputNameFormulario=false;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=true;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case "cuenta":
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
