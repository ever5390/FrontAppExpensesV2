import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CategoryModel } from '@data/models/business/category.model';
import { CategoryService } from '@data/services/category/category.service';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { CONSTANTES } from 'app/data/constantes';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { ObjectFormularioShared } from 'app/data/models/Structures/data-object-form.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  fotoSeleccionada: File | undefined;
  owner: OwnerModel = new OwnerModel();
  objectToFormShared : ObjectFormularioShared = new ObjectFormularioShared();

  // *** only List accounts & categories select
  heightForm: number = 0;
  item: ElementRef | any;
  heightListContent: number = 0;
  listaCategories: CategoryModel[] = [];
  flagShowListAccountOrigenSelect: boolean = false;

  activeOnChange: boolean = false;
  // *** indicate show tags
  show__popup: boolean =  false;
  flagInputNameFormulario: boolean = true;
  flagBlockTransferFormulario: boolean = true;
  flagBlockAmountAccountFormulario: boolean = true;

  @Output() responseToFatherComponent = new EventEmitter<any>();
  @Input() dataStructureReceived: DataStructureFormShared = new DataStructureFormShared();
  sendComponentToBlockListAccount: string = CONSTANTES.CONST_COMPONENT_CUENTAS;


  @ViewChild('imgFormulary') imgFormulary: ElementRef | any;
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;
  @ViewChild('container_formulario') container_formulario: ElementRef | any;
  @ViewChild('lisAccountOrigenSelect') lisAccountOrigenSelect: ElementRef | any;
  @ViewChild('lisCategoriesForSelect') lisCategoriesForSelect: ElementRef | any;

  showBtnSelectCategoriesOnlyChildAccount: boolean = false;
  show__list__items: boolean = false;
  flagActivateInputFile: boolean = true;
  flagShowListCategories: boolean = false;


  categoriesSelected: CategoryModel[] = [];
  categoriesChecked: CategoryModel[] = [];

  constructor(
    private _categoryService: CategoryService,
    private _renderer: Renderer2,
    private _loadSpinnerService: SLoaderService
  ) {
    this.catchClickEventOutForm();
  }

  ngOnInit(): void {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.switchDecideFormByComponent();
    this.seteoByComponentParent();

    this.categoriesChecked = this.dataStructureReceived.object.categories;
  }

  seteoByComponentParent() {
    this.objectToFormShared.image = this.dataStructureReceived.imagen;

    switch (this.dataStructureReceived.component) {
      case CONSTANTES.CONST_TRANSFERENCIA_INTERNA:
        this.objectToFormShared.destino = (!this.dataStructureReceived.object)?CONSTANTES.CONST_TEXT_VACIO:this.dataStructureReceived.object.accountDestiny;
        break;
      case CONSTANTES.CONST_TRANSFERENCIA_EXTERNA:
        this.objectToFormShared.destino = (!this.dataStructureReceived.object)?CONSTANTES.CONST_TEXT_VACIO:this.dataStructureReceived.object.accountDestiny;
        break;
      case CONSTANTES.CONST_CUENTAS:
        this.objectToFormShared.name = this.dataStructureReceived.object.accountName;
        this.objectToFormShared.monto = this.dataStructureReceived.object.balance;
        this.objectToFormShared.inputDisabled = this.dataStructureReceived.object.statusAccount.toString()=='PROCESS'?true:false;
        break;
      default:
        break;
    }
  }

  saveOrUpdate() {
    if(this.validationForm() == false ) return;

    this._loadSpinnerService.showSpinner();

    if(this.dataStructureReceived.component == CONSTANTES.CONST_TRANSFERENCIA_EXTERNA
      || this.dataStructureReceived.component == CONSTANTES.CONST_TRANSFERENCIA_INTERNA ) {
    
      if(this.dataStructureReceived.component == CONSTANTES.CONST_TRANSFERENCIA_INTERNA
        && this.objectToFormShared.monto > this.objectToFormShared.origen.balanceFlow) {
        Swal.fire("Alerta","El monto a transferir supera al monto origen","info");
        this._loadSpinnerService.hideSpinner();
        return;
      }

      this.dataStructureReceived.object.accountDestiny  = this.objectToFormShared.destino;
      this.dataStructureReceived.object.accountOrigin  = this.objectToFormShared.origen;
      this.dataStructureReceived.object.amount = this.objectToFormShared.monto;
      this.responseToFatherComponent.emit(this.dataStructureReceived);
      return;
    }

    if(this.dataStructureReceived.component == CONSTANTES.CONST_CUENTAS) {
        if(this.dataStructureReceived.object.accountType.id == 2){
          this.catchCategoriesSelectAssoc();
        }  
        this.dataStructureReceived.object.accountName  = this.objectToFormShared.name;
        this.dataStructureReceived.object.balance = this.objectToFormShared.monto;
        this.dataStructureReceived.object.categories =  this.categoriesChecked;
        this.responseToFatherComponent.emit(this.dataStructureReceived);
        return;
    }
  }

  backToAccountWithCategoriesSelected() {
    this.flagShowListCategories = false;
    this.catchCategoriesSelectAssoc();
  }

  catchCategoriesSelectAssoc() {
    if(!this.activeOnChange) {
      this.categoriesChecked = this.dataStructureReceived.object.categories;
      return;
    };
    
    this.categoriesChecked = this.categoriesSelected.filter((category) => {
      return category.active === true
    });

    console.log(this.categoriesChecked);
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
    
    if(this.dataStructureReceived.component == CONSTANTES.CONST_TRANSFERENCIA_EXTERNA ){      
      return this.validMonto();
    }

    if(this.dataStructureReceived.component == CONSTANTES.CONST_TRANSFERENCIA_INTERNA) {
      if(this.objectToFormShared.origen.id == 0){
        Swal.fire("Alerta","No seleccionó la cuenta origen","info");
        return false;
      }
      return this.validMonto();
    }

    if(this.objectToFormShared.name == CONSTANTES.CONST_TEXT_VACIO) {
        Swal.fire("Alerta","El campo nombre se encuentra vacío","info");
        return false;
    }

    if(this.dataStructureReceived.component == CONSTANTES.CONST_CUENTAS){
      return this.validMonto();
    }

    return true;
  }

  validMonto():boolean {
    if(this.objectToFormShared.monto == CONSTANTES.CONST_TEXT_VACIO) {
      Swal.fire("Alerta","El campo Monto se encuentra vacío","info");
      return false;
    }
    console.log(Number(this.objectToFormShared.monto));
    if(isNaN(Number(this.objectToFormShared.monto))) {
      Swal.fire("Alerta","El campo Monto solo acepta números mayores a cero","info");
      return false;
    }

    if(Number(this.objectToFormShared.monto) <= 0) {
      Swal.fire("Alerta","El campo Monto solo acepta números mayores a cero","info");
      return false;
    }

    return true;
  }

  showListItemsForSelect(itemShow: string) {

    if(itemShow == 'categories') {
      this.flagShowListCategories = true;
      this.item = this.lisCategoriesForSelect.nativeElement;
      this.resizingWindowList();
    } else {
      this.flagShowListAccountOrigenSelect = true;
    }
  }

  receivedObjectAccountSelected(itemReceived: any) {
    this.objectToFormShared.origen = itemReceived.itemSelected;
    this.flagShowListAccountOrigenSelect = false;
  }

  getAllCategories() {
    this._categoryService.getAllCategories().subscribe(
      response => {
        this.listaCategories = response;
        this.showCategoriesActivesByAccountAndPendings();
        this._loadSpinnerService.hideSpinner();
      },
      error => {
        console.log(error);
      }
    );
  }

  showCategoriesActivesByAccountAndPendings() {
    this.listaCategories = this.listaCategories.filter((categ)=>{
      return categ.active == false;
    });

    this.dataStructureReceived.object.categories.forEach((categAccount: CategoryModel)=>{
      this.listaCategories.unshift(categAccount);
    });

  }

  switchDecideFormByComponent() {
    var flagContentSeleccione = false;
    if(this.dataStructureReceived.title.toLocaleLowerCase().includes('seleccione'))
      flagContentSeleccione = true;

    if(this.dataStructureReceived.component != CONSTANTES.CONST_TEXT_VACIO)
        this.show__popup = true;

    switch (this.dataStructureReceived.component) {
      case CONSTANTES.CONST_TRANSFERENCIA_INTERNA:
        this.dataStructureReceived.titleDos = this.dataStructureReceived.title;
        this.flagInputNameFormulario=false;
        this.flagBlockTransferFormulario=true;
        this.flagBlockAmountAccountFormulario=false;
        this.flagActivateInputFile=false;
        break;
      case CONSTANTES.CONST_TRANSFERENCIA_EXTERNA:
        this.dataStructureReceived.titleDos = this.dataStructureReceived.title;
        this.flagInputNameFormulario=false;
        this.flagBlockTransferFormulario=true;
        this.flagBlockAmountAccountFormulario=false;
        this.flagActivateInputFile=false;
        break;
      case CONSTANTES.CONST_CUENTAS:
        this.dataStructureReceived.titleDos = this.dataStructureReceived.title;
        this.flagInputNameFormulario=true;
        this.flagBlockTransferFormulario=false;
        this.flagBlockAmountAccountFormulario=true;
        this.flagActivateInputFile=false;
        if(this.dataStructureReceived.object.accountType.id == 2){
          this.showBtnSelectCategoriesOnlyChildAccount = true;
          this.getAllCategories();
        }
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

  resizingWindowList() {
    setTimeout(()=> {
      this.heightListContent = this.item.clientHeight;
      if(this.heightListContent > (this.heightForm - 50) ) {
        this._renderer.setStyle(this.item, "height",(this.heightForm - 80) + "px");
        this._renderer.setStyle(this.item, "overflow-y","scroll");
      } else {
        this._renderer.setStyle(this.item, "overflow-y","none");
      }
    },1);
  }

  ngAfterViewInit() {
    this.heightForm = this.container_formulario.nativeElement.clientHeight;
  }

  onChangeCategory(event: any) {
    this.activeOnChange = true;
    const idCateSelected = event.target.value;
    const isChecked = event.target.checked;

    this.categoriesSelected = this.listaCategories.map((cat) => {
        if(cat.id == idCateSelected) {
          cat.active = isChecked;
          //this.parentSelector = false;
          return cat;
        }
       return cat;
    });

  }

}
