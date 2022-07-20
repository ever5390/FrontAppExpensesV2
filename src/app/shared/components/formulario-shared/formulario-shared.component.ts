import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CONSTANTES } from 'app/data/constantes';
import { GroupModel } from 'app/data/models/business/group.model';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { ObjectFormularioShared } from 'app/data/models/Structures/data-object-form.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { StorageService } from 'app/data/services/storage_services/storage.service';
import Swal from 'sweetalert2';
import { SLoaderService } from '../loaders/s-loader/service/s-loader.service';

@Component({
  selector: 'app-formulario-shared',
  templateUrl: './formulario-shared.component.html',
  styleUrls: ['./formulario-shared.component.css']
})
export class FormularioSharedComponent implements OnInit {
  
  fotoSeleccionada: File | undefined;
  owner: OwnerModel = new OwnerModel();
  objectToFormShared : ObjectFormularioShared = new ObjectFormularioShared();

  // *** only category
  indexDropSelect: number = 0;
  groupListToSelect: GroupModel[] = [];
  selectGroup: number = 0;

  // *** indicate show tags
  show__popup: boolean =  false;
  showCategoriesList: boolean = false;
  flagInputNameFormulario: boolean = true;
  flagGroupSelectFormulario: boolean = true;

  @Input() dataStructureReceived: DataStructureFormShared = new DataStructureFormShared();
  @Output() responseToFatherComponent = new EventEmitter<any>();

  @ViewChild('imgFormulary') imgFormulary: ElementRef | any;
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;
  @ViewChild('container_formulario') container_formulario: ElementRef | any;
  
  flagActivateInputFile: boolean = true;

  constructor(
    private _renderer: Renderer2,
    private _storageService: StorageService,
    private _loadSpinnerService: SLoaderService
  ) {
    this.catchClickEventOutForm();
  }

  ngOnInit(): void {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.switchDecideFormByComponent();
    this.seteoByComponentParent();
  }

  seteoByComponentParent() {
    this.objectToFormShared.image = this.dataStructureReceived.imagen;

    switch (this.dataStructureReceived.component) {
      case CONSTANTES.CONST_COMPONENT_CATEGORIAS:
        this.objectToFormShared.name = (!this.dataStructureReceived.object)?CONSTANTES.CONST_TEXT_VACIO:this.dataStructureReceived.object.name;
        this.objectToFormShared.group = this.dataStructureReceived.object.group;
        this.selectGroup = this.dataStructureReceived.object.group.id;
        break;
      case CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO:
        this.objectToFormShared.name = (!this.dataStructureReceived.object)?CONSTANTES.CONST_TEXT_VACIO:this.dataStructureReceived.object.name;
        break;
      case CONSTANTES.CONST_COMPONENT_ACUERDOS:
        break;
      default:
        break;
    }
  }

  saveOrUpdate() {
    if(this.validationForm() == false ) return;

    this._loadSpinnerService.showSpinner();

    if(this.dataStructureReceived.component == CONSTANTES.CONST_COMPONENT_CATEGORIAS
        || this.dataStructureReceived.component == CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO) {

        if(this.fotoSeleccionada == undefined) {
            this.emitObjectToSave(CONSTANTES.CONST_TEXT_VACIO);
            return;
        }
        this.uploadImageToFirestore();
    }
  }

  
  emitObjectToSave(urlImagen: any) { 
    
    if(this.dataStructureReceived.component == CONSTANTES.CONST_COMPONENT_CATEGORIAS) {
      this.dataStructureReceived.object.group = this.objectToFormShared.group;
    }
    this.dataStructureReceived.object.name  = this.objectToFormShared.name;
    this.dataStructureReceived.object.image = (urlImagen!=CONSTANTES.CONST_TEXT_VACIO)?urlImagen:this.objectToFormShared.image;
    
    this.responseToFatherComponent.emit({'action':'register_update','object':this.dataStructureReceived.object});

  }

  uploadImageToFirestore() {
    let reader = new FileReader();
    reader.readAsDataURL(this.fotoSeleccionada!);
    reader.onloadend = ()=> {
      this._storageService.uploadImage(this.fotoSeleccionada!.name + "_" + Date.now(), reader.result, 
                          this.dataStructureReceived.component + "/"+ this.owner.username)
        .then(
        urlImagen => {
          this.emitObjectToSave(urlImagen);
        }, () => {
          this.emitObjectToSave(CONSTANTES.CONST_TEXT_VACIO);
        }
      );
    }
  }

  uploadFoto(event: any) {
    if(event.target.files && event.target.files[0]) {
      this.fotoSeleccionada = event.target.files[0];
      const objectURL = URL.createObjectURL(event.target.files[0]);
      this._renderer.setAttribute(this.imgFormulary.nativeElement,"src",objectURL);
    }
  }

  delete() {
    Swal.fire({
      title: 'Estás seguro?',
      text: "Este proceso no podrá revertirse!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar de todas formas!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.responseToFatherComponent.emit({'action':'delete','object':this.dataStructureReceived.object});
      }
    })
  }

  validationForm():boolean {
    
    if(this.objectToFormShared.name == CONSTANTES.CONST_TEXT_VACIO) {
        Swal.fire("Alerta","El campo nombre se encuentra vacío","info");
        return false;
    }

    if(this.dataStructureReceived.component == CONSTANTES.CONST_COMPONENT_CATEGORIAS
        && this.selectGroup == 0) {
        Swal.fire("Alerta","Debe seleccionar un grupo para esta categoría","info");
        return false;
    }

    return true;
  }

  chooseItemGroup(){
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
      case CONSTANTES.CONST_COMPONENT_CATEGORIAS:
        this.dataStructureReceived.titleDos = (flagContentSeleccione===true)?CONSTANTES.CONST_TITLE_REGISTRAR_ITEM_CATEGORIA:this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =true;
        this.flagActivateInputFile=true;
        break;
      case CONSTANTES.CONST_COMPONENT_ACUERDOS:
        this.dataStructureReceived.titleDos = (flagContentSeleccione===true)?CONSTANTES.CONST_TITLE_REGISTRAR_ITEM_ACUERDO:this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =false;
        this.flagActivateInputFile=true;
        break;
      case CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO:
        this.dataStructureReceived.titleDos = (flagContentSeleccione===true)?CONSTANTES.CONST_TITLE_REGISTRAR_ITEM_MEDIOSDEPAGO:this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =false;
        this.flagActivateInputFile=true;
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
