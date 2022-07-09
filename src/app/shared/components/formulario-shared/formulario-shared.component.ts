import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { GroupModel } from 'app/data/models/business/group.model';
import { ObjectFormularioShared } from 'app/data/models/Structures/data-object-form.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-shared',
  templateUrl: './formulario-shared.component.html',
  styleUrls: ['./formulario-shared.component.css']
})
export class FormularioSharedComponent implements OnInit {
  
  objectToFormShared : ObjectFormularioShared = new ObjectFormularioShared();
  indexDropSelect: number = 0; //ONLY CATEGORY - GROUP
  groupListToSelect: GroupModel[] = [];
  selectGroup: number = 0;


  show__popup: boolean =  false;
  showCategoriesList: boolean = false;
  flagInputNameFormulario: boolean = true;
  flagGroupSelectFormulario: boolean = true;
  flagBlockTransferFormulario: boolean = true;
  flagBlockAmountAccountFormulario: boolean = true;

  @Input() dataStructureReceived: DataStructureFormShared = new DataStructureFormShared();
  @Output() responseToFatherComponent = new EventEmitter<any>();
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;

  constructor(
    private _renderer: Renderer2
  ) {
    this.catchClickEventOutForm();
  }

  ngOnInit(): void {
    console.log("INICIO DE FORM SHARED");
    this.switchDecideFormByComponent();
    this.seteoObjectForm();
  }

  seteoObjectForm() {
    console.log( "OBJECTO RECIBIDO : IF NULL -> NUEVO ELSE ACTUALIZAR");
    console.log(this.dataStructureReceived.object);
    if(this.dataStructureReceived.object.id == 0) { //OBJETO NUEVO
      // alert("wwww");
      this.objectToFormShared = new ObjectFormularioShared();
      this.selectGroup = 0;
      return;
    }

    //OBJETO ACTUALIZAR
    this.objectToFormShared.name = this.dataStructureReceived.object?this.dataStructureReceived.object.name:"";
    this.objectToFormShared.image = this.dataStructureReceived.imagen;
    
    //only category case
    if(this.flagGroupSelectFormulario){
      this.objectToFormShared.group = this.dataStructureReceived.object.group;
      this.selectGroup = this.dataStructureReceived.object.group.id;
    }

  }

  saveOrUpdate() {
      if(this.validationForm() == false ) return;
      
      this.dataStructureReceived.object.name  = this.objectToFormShared.name;
      this.dataStructureReceived.object.image = this.objectToFormShared.image;
      
      //only category case
      if(this.flagGroupSelectFormulario){
        this.dataStructureReceived.object.group = this.objectToFormShared.group;
      }

      console.log(this.dataStructureReceived);
      this.responseToFatherComponent.emit(this.dataStructureReceived.object);
  }

  validationForm():boolean {
    if(this.objectToFormShared.name == '') {
        Swal.fire("Alerta","El campo nombre se encuentra vacío","info");
      return false;
    }

    if(this.flagGroupSelectFormulario == true && this.selectGroup == 0) {
        Swal.fire("Alerta","Debe seleccionar un grupo para esta categoría","info");
      return false;
    }

    return true;
  }

  chooseItem(){
    this.objectToFormShared.group = new GroupModel();

    if(this.selectGroup == 0) {
      return;
    }

    for (let index = 0; index <  this.dataStructureReceived.listGroupOnlyCategory.length; index++) {
      if(this.selectGroup == this.dataStructureReceived.listGroupOnlyCategory[index].id) {
        this.objectToFormShared.group =  this.dataStructureReceived.listGroupOnlyCategory[index];
        break;
      }
     }
  }

  switchDecideFormByComponent() {
    var flagContentSeleccione = false;

    if(this.dataStructureReceived.title.toLocaleLowerCase().includes('seleccione'))
      flagContentSeleccione = true;

    if(this.dataStructureReceived.component != CONSTANTES.CONST_TEXT_VACIO)
        this.show__popup = true;

    switch (this.dataStructureReceived.component) {
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
        this.responseToFatherComponent.emit(null);
      }
    });
  }

}
