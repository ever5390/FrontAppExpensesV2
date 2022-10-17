import { Component, ElementRef, EventEmitter, Input, OnInit, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { AccountModel, TypeSatusAccountOPC } from '@data/models/business/account.model';
import { CategoryModel } from '@data/models/business/category.model';
import { GroupModel } from '@data/models/business/group.model';
import { PeriodModel } from '@data/models/business/period.model';
import { TransferenciaModel } from '@data/models/business/transferencia.model';
import { DataOptionsSelectExpense } from '@data/models/Structures/data-expense-options';
import { AccountService } from '@data/services/account/account.service';
import { CategoryService } from '@data/services/category/category.service';
import { PeriodService } from '@data/services/period/period.service';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { CONSTANTES } from 'app/data/constantes';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { ObjectFormularioShared } from 'app/data/models/Structures/data-object-form.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {

  subject = new Subject();
  textSearch: string = '';
  showBtnAddItem: boolean = false;
  textSaveCategory: string = '';
  
  fotoSeleccionada: File | undefined;
  owner: OwnerModel = new OwnerModel();
  objectToFormShared : ObjectFormularioShared = new ObjectFormularioShared();

  // *** only List accounts & categories select
  heightForm: number = 0;
  item: ElementRef | any;
  heightListContent: number = 0;
  listaCategoriesFixed: CategoryModel[] = [];
  listaCategories: CategoryModel[] = [];
  flagShowListOptionsSelect: boolean = false;

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
  newCategory: CategoryModel = new CategoryModel();

  dataOptionsSelectExpense: DataOptionsSelectExpense = new DataOptionsSelectExpense();
  dataOptionsSelectExpenseList: DataOptionsSelectExpense[] = [];

  period: PeriodModel = new PeriodModel();
  
  constructor(
    private _categoryService: CategoryService,
    private _renderer: Renderer2,
    private _loadSpinnerService: SLoaderService,
    private _accountService: AccountService,
    private _periodService: PeriodService
  ) {
    this.catchClickEventOutForm();
  }

  ngOnInit(): void {
    this._loadSpinnerService.hideSpinner();
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    
    this.searchActivateFunction();
    this.switchDecideFormByComponent();
    this.seteoByComponentParent();
    console.log("catecCheck");
    console.log(this.categoriesChecked);
    this.categoriesChecked = this.dataStructureReceived.object.categories;
    this.setterDataStructureSendToAccouuntList();
  }

  ngOnDestroy() {
    console.log("Sdios account");
    //this._loadSpinnerService.hideSpinner();
  }


  private setterDataStructureSendToAccouuntList() {
    this.dataOptionsSelectExpenseList = [];
    this.dataStructureReceived.listAccoutOrigen.forEach((element: { id: number; accountName: string; balanceFlow: string; }) => {
      this.dataOptionsSelectExpense = new DataOptionsSelectExpense();
      this.dataOptionsSelectExpense.id = element.id;
      this.dataOptionsSelectExpense.name = element.accountName;
      this.dataOptionsSelectExpense.disponible = element.balanceFlow;
      this.dataOptionsSelectExpense.component = CONSTANTES.CONST_COMPONENT_CUENTAS;
      this.dataOptionsSelectExpense.icon = CONSTANTES.CONST_COMPONENT_CUENTAS_ICON;
      this.dataOptionsSelectExpenseList.push(this.dataOptionsSelectExpense);
    });
  }

  switchDecideFormByComponent() {
    // if(this.dataStructureReceived.component != CONSTANTES.CONST_TEXT_VACIO)
    //     this.show__popup = true;

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
        if(this.dataStructureReceived.object.id != 0){
          this.objectToFormShared.inputDisabled = this.dataStructureReceived.object.statusAccount.toString()=='PROCESS'?true:false;
        }
       
        break;
      default:
        break;
    }
  }

  saveOrUpdate() {
    if(this.validationForm() == false ) return;
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
      
      this.registerTransference(this.dataStructureReceived.object);
      return;
    }

    if(this.dataStructureReceived.component == CONSTANTES.CONST_CUENTAS) {
        if(this.dataStructureReceived.object.accountType.id == 2)
            this.catchCategoriesSelectAssoc();

        if(this.dataStructureReceived.object.statusAccount == TypeSatusAccountOPC.INITIAL.toString()) {
          this.redirectToActionsAccount();
          return;
        }

        let textMessage = "El monto y las categorías que asigne no podrán ser modificadas una vez guardadas.";

        if(this.dataStructureReceived.object.id != 0) {
          textMessage = "Solo se permite asociar categorias, no podrá quitar alguna que ya se encuentre asignada.";
        }

        Swal.fire({
          title: 'Recuerde!',
          text: textMessage,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.redirectToActionsAccount();
            return;
          }
        })  
    }
  }

  private redirectToActionsAccount() {
    this.dataStructureReceived.object.accountName  = this.objectToFormShared.name;
    this.dataStructureReceived.object.balance = this.objectToFormShared.monto;
    this.dataStructureReceived.object.categories =  this.categoriesChecked;
    
    if (this.dataStructureReceived.object.id == 0) {
      this.registerAccount(this.dataStructureReceived.object);
    } else {
      this.updateAccount(this.dataStructureReceived.object);
    }
  }

  registerTransference(transferToSave: TransferenciaModel) {
    this._loadSpinnerService.showSpinner();
    this._accountService.saveTransferenceAccount(transferToSave).subscribe(
      (response :any)=> {
        // Swal.fire(response.title,response.message,response.status);
        this._loadSpinnerService.hideSpinner();
        this.responseToFatherComponent.emit(response);
      },
      error => {
        console.log(error);
        Swal.fire(error.error.title,error.error.message,error.error.status);
      }
    );
  }

  registerAccount(accountToSave: AccountModel) {
    this._loadSpinnerService.showSpinner();
    accountToSave.period = this.period;
    this._accountService.createAccount(accountToSave).subscribe(
      (response :any)=> {
        // Swal.fire("","Cuenta registrada con éxito","success");
        this._periodService.saveToLocalStorage(response.object.period);
        // this._loadSpinnerService.hideSpinner();
        this.responseToFatherComponent.emit(response);
      },
      error => {
        console.log(error);
        this._loadSpinnerService.hideSpinner();
        Swal.fire(error.error.title,error.error.message,error.error.status);
      }
    );
  }

  updateAccount(accountToSave: AccountModel) {
    this._loadSpinnerService.showSpinner();
    this._accountService.updateAccount(accountToSave).subscribe(
      (response :any)=> {
        // Swal.fire(response.title,response.message, response.status);
        // this._loadSpinnerService.hideSpinner();
        this.responseToFatherComponent.emit(response);
      },
      error => {
        console.log(error);
        this._loadSpinnerService.hideSpinner();
        Swal.fire(error.error.title,error.error.message,error.error.status);
      }
    );
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
      this.flagShowListOptionsSelect = true;
    }
  }

  getAllCategories() {
    //this._loadSpinnerService.showSpinner();
    this._categoryService.getAllCategories(this.owner.id).subscribe(
      response => {
        this._loadSpinnerService.hideSpinner();
        this.listaCategories = response.reverse();
        this.showCategoriesActivesByAccountAndPendings();
      },
      error => {
        this._loadSpinnerService.hideSpinner();
        console.log(error);
      }
    );
  }

  showCategoriesActivesByAccountAndPendings() {
    this.listaCategories = this.listaCategories.filter((categ)=>{
      return categ.active == false;
    });

    this.dataStructureReceived.object.categories.forEach((categAccount: CategoryModel)=>{
      if(this.dataStructureReceived.object.statusAccount.toString() == "PROCESS") categAccount.isDisabled = true;
      this.listaCategories.unshift(categAccount);
    });

    this.listaCategoriesFixed = this.listaCategories;

  }

  showPopUp() {
    this.show__popup = true;
  }

  hiddenPopUp() {
    this.show__popup = false;
    this.responseToFatherComponent.emit(false);
  }

  searchActivateFunction() {
    this.subject.pipe(
      debounceTime(100)
    ).subscribe((searchText:any) => {
      this.showBtnAddItem = false;
      this.listaCategories = this.listaCategoriesFixed.filter(item => {
        return item.name.toUpperCase().includes(searchText.toUpperCase()) 
          }
        );
        if(this.textSearch != '' && this.listaCategories.length == 0) {
          this.showBtnAddItem = true;
        }

      }
    )
  }

  searchMethod(evt: any){
    const searchText = evt.target.value;
    this.textSearch = searchText;
    this.subject.next(searchText)
  }

  createNewCategory() {
    this._loadSpinnerService.showSpinner();
    this.newCategory.active = false;
    this.newCategory.group = new GroupModel(true,"","",2,"",new OwnerModel());
    this.newCategory.image = CONSTANTES.CONST_IMAGEN_DEFAULT;
    this.newCategory.name = this.textSearch;
    this.newCategory.owner = this.owner;
    this._categoryService.create(this.newCategory).subscribe(
      response=> {
        
        setTimeout(() => {
          this.textSaveCategory = "categoría creada!";
        }, 100);
        this.textSaveCategory = "";
        this.textSearch = "";
        this.getAllCategories();
      },
      error => {
        console.log("Error al crear la categoria nueva");
      }
    );
  }

  receivedItemSelectedaFromPopUp(itemReceived: any) {
    this.objectToFormShared.origen.id = itemReceived.itemSelected.id;
    this.objectToFormShared.origen.accountName = itemReceived.itemSelected.name;
    this.objectToFormShared.origen.balanceFlow = itemReceived.itemSelected.disponible;
    this.flagShowListOptionsSelect = false;
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
