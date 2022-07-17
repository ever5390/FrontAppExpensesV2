import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
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
  
  objectToFormShared : ObjectFormularioShared = new ObjectFormularioShared();
  indexDropSelect: number = 0; //ONLY CATEGORY - GROUP
  groupListToSelect: GroupModel[] = [];
  selectGroup: number = 0;
  owner: OwnerModel = new OwnerModel();

  fotoSeleccionada: File | undefined;
  show__popup: boolean =  false;
  showCategoriesList: boolean = false;
  flagInputNameFormulario: boolean = true;
  flagGroupSelectFormulario: boolean = true;
  flagBlockTransferFormulario: boolean = true;
  flagBlockAmountAccountFormulario: boolean = true;

  @Input() dataStructureReceived: DataStructureFormShared = new DataStructureFormShared();
  @Output() responseToFatherComponent = new EventEmitter<any>();

  @ViewChild('imgFormulary') imgFormulary: ElementRef | any;
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;

  constructor(
    private _renderer: Renderer2,
    private _storageService: StorageService,
    private _loadSpinnerService: SLoaderService
  ) {
    this.catchClickEventOutForm();
  }

  ngOnInit(): void {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);

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

      if(this.flagBlockAmountAccountFormulario){
        this.objectToFormShared.name = (!this.dataStructureReceived.object.accountName)?CONSTANTES.CONST_TEXT_VACIO:this.dataStructureReceived.object.accountName;
      } else {
        this.objectToFormShared.name = (!this.dataStructureReceived.object.name)?CONSTANTES.CONST_TEXT_VACIO:this.dataStructureReceived.object.name;
        this.selectGroup = 0;
      }

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

    if(!this.flagBlockTransferFormulario) this.uploadImageToFireStore();

    if(this.flagBlockTransferFormulario){
      this.persistObject(null);
    }
  }

  uploadImageToFireStore() {
    this._loadSpinnerService.showSpinner();
    if(this.fotoSeleccionada != undefined) {
      let reader = new FileReader();
      reader.readAsDataURL(this.fotoSeleccionada);
      reader.onloadend = ()=> {
          this._storageService.uploadImage(this.fotoSeleccionada!.name + "_" + 
                              Date.now(), reader.result, 
                              this.dataStructureReceived.component + "/"+ 
                              this.owner.username)
            .then(
              urlImagen => {
                this.persistObject(urlImagen);
              }, () => {
                this.persistObject("");
              }
            );
        }
      
    } else {
      this.persistObject("");
    }
  }

   persistObject(urlImagen: any) {
    //if(this.validationForm() == false ) return;
      
    
    
    if(this.flagBlockAmountAccountFormulario) {
      this.dataStructureReceived.object.accountName  = this.objectToFormShared.name;
      this.dataStructureReceived.object.balance = this.objectToFormShared.monto;
    } else {
      this.dataStructureReceived.object.name  = this.objectToFormShared.name;
      this.dataStructureReceived.object.image = (urlImagen!="")?urlImagen:this.objectToFormShared.image;
      //only category case
      if(this.flagGroupSelectFormulario){
        this.dataStructureReceived.object.group = this.objectToFormShared.group;
      }
    }
    

    //console.log(this.dataStructureReceived);
    this.responseToFatherComponent.emit({'action':'register_update','object':this.dataStructureReceived.object});

  }

  uploadFoto(event: any) {
    if(event.target.files && event.target.files[0]) {
      this.fotoSeleccionada = event.target.files[0];
      // this.persistImageToDB = true;
      //this.objectToFormShared.image = event.target.files[0];
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
    if(this.objectToFormShared.name == '') {
        Swal.fire("Alerta","El campo nombre se encuentra vacío","info");
      return false;
    }

    if(this.flagGroupSelectFormulario == true && this.selectGroup == 0) {
        Swal.fire("Alerta","Debe seleccionar un grupo para esta categoría","info");
      return false;
    }

    if(this.flagBlockAmountAccountFormulario == true && this.objectToFormShared.monto == '') {
      Swal.fire("Alerta","El campo Monto se encuentra vacío","info");
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
      case CONSTANTES.CONST_COMPONENT_CATEGORIAS:
        this.dataStructureReceived.titleDos = (flagContentSeleccione===true)?CONSTANTES.CONST_TITLE_REGISTRAR_ITEM_CATEGORIA:this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =true;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case CONSTANTES.CONST_COMPONENT_ACUERDOS:
        this.dataStructureReceived.titleDos = (flagContentSeleccione===true)?CONSTANTES.CONST_TITLE_REGISTRAR_ITEM_ACUERDO:this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagGroupSelectFormulario =false;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=false;
        break;
      case CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO:
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
