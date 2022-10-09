import { Component, ElementRef, EventEmitter, Input, OnInit, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { AccountModel } from '@data/models/business/account.model';
import { NotificationExpense } from '@data/models/business/notificationExpense.model';
import { DataOptionsSelectExpense } from '@data/models/Structures/data-expense-options';
import { AccordingService } from '@data/services/according/according.service';
import { AccountService } from '@data/services/account/account.service';
import { NotificationExpenseService } from '@data/services/notification/notification-expense.service';
import { PeriodService } from '@data/services/period/period.service';
import { StorageService } from '@data/services/storage_services/storage.service';
import { UserService } from '@data/services/user/user.service';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { AccordingModel } from 'app/data/models/business/according.model';
import { CategoryModel } from 'app/data/models/business/category.model';
import { ExpenseModel, Tag, Voucher } from 'app/data/models/business/expense.model';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { PaymentMethodModel } from 'app/data/models/business/payment-method.model';
import { PeriodModel } from 'app/data/models/business/period.model';
import { Workspace } from 'app/data/models/business/workspace.model';
import { DataStructureListShared } from 'app/data/models/data.model';
import { ExpensesService } from 'app/data/services/expenses/expenses.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.css']
})
export class ManageExpenseComponent implements OnInit, OnDestroy {

  owner : OwnerModel = new OwnerModel();

  sendComponentParentToCalendar: string = CONSTANTES.CONST_COMPONENT_EXPENSEREGISTER;
  sendComponentToBlockListOptions: string = CONSTANTES.CONST_TEXT_VACIO;

  flagReceiveNotificationParamRoute: boolean = false;
  flagShowListAccording: boolean = false;
  flagShowListCategories: boolean = false;
  flagShowListPaymentMethod: boolean = false;
  flagShowListOptionsSelect: boolean = false;
  flagShowCalendar: boolean = false;
  flagShowBtnSelectCalendar: boolean = false;
  flagIsSaveOK: boolean = false;

  itemPaymentMethod: PaymentMethodModel =  new PaymentMethodModel();
  itemCategory: CategoryModel =  new CategoryModel();
  itemAccording: AccordingModel =  new AccordingModel();
  itemAccount: AccountModel = new AccountModel();
  dateRangeCalendarSelected: Date = new Date();

  // expense: Expense
  expense: ExpenseModel = new ExpenseModel();
  period: PeriodModel = new PeriodModel();
  heightFormRegisterExpense: number = 0;
  textActionButton: string = CONSTANTES.CONST_TEXT_BTN_REGISTRAR;

  dataOptionsSelectExpense: DataOptionsSelectExpense = new DataOptionsSelectExpense();
  dataOptionsSelectExpenseList: DataOptionsSelectExpense[] = [];
  payerSelected: string = CONSTANTES.CONST_TEXT_VACIO;
  tagListSelected: Tag[] = [];

  //Objects from route
  notificationExpense: NotificationExpense = new NotificationExpense();
  expenseToEdit: ExpenseModel = new ExpenseModel();
  vouchersBckp: Voucher[] = [];

  //Account
  accountListSelected: AccountModel[] = [];
  vouchersListToShow: string[] = [];
  listaAccording: AccordingModel[] = [];
  workspace: Workspace = new Workspace();
  show__list__items: boolean = false;
  dataStructure: DataStructureListShared = new DataStructureListShared();

  @Input() show__popup: boolean = false;
  @Output() sendHiddenFormRegister: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('formRegister') formRegister: ElementRef | any;
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;
  @ViewChild('formRegisterContainerToAccountListBlock') formRegisterContainerToAccountListBlock: ElementRef | any;

  constructor(
    private _renderer: Renderer2,
    private _router: Router,
    private _expenseService: ExpensesService,
    private _accountService: AccountService,
    private _accordingService: AccordingService,
    private _notificationExpenseService: NotificationExpenseService,
    private _periodService: PeriodService,
    private _userService: UserService,
    private _storageService: StorageService,
    private _loadSpinnerService: SLoaderService,
    private _rutaActiva: ActivatedRoute
  ) {
    this.workspace = JSON.parse(localStorage.getItem("lcstrg_worskpace")!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.owner = this.workspace.owner;
    this.identifyEventClickOutWindow();
  }

  ngOnDestroy(): void {
    if(!this.flagIsSaveOK) {
      this.setterObjectExpense();
      this._expenseService.saveExpenseToLocalStorage(this.expense);
    }
  }

  ngOnInit(): void {
    this.getAllAccording();
    this.getAccountIfExitPeriod();
    this.validateIfExistNotifitionPayByParamRoute();
    this.validateIfExistExpensePendingRegister();
  }

  validateIfExistExpensePendingRegister() {
    let expensePendingRegister : ExpenseModel = new ExpenseModel();
    expensePendingRegister = JSON.parse(localStorage.getItem("expenseToRegisterPending")!);
    if(expensePendingRegister != null) {
      Swal.fire({
        title: '',
        text: "Tienes un gasto almacenado en memoria, ¿Deseas registrarlo?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText:'No, descartar',
        confirmButtonText: 'Si, continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.setterExpenseReceivedFromParam(expensePendingRegister);
        } else {
          //Clear
          this._expenseService.clearExpennseRegisterFromLocalStorage();
        }
      })
    }
  }

  private setterExpenseReceivedFromParam(expensePendingRegister: ExpenseModel) {
    this.expense = expensePendingRegister;
    this.itemAccording = expensePendingRegister.accordingType;
    this.itemCategory = expensePendingRegister.category;
    this.itemPaymentMethod = expensePendingRegister.paymentMethod;
    this.payerSelected = expensePendingRegister.payer;
    this.tagListSelected = expensePendingRegister.tag;
    this.itemAccount = expensePendingRegister.account;
    this.dateRangeCalendarSelected = expensePendingRegister.createAt;
    expensePendingRegister.vouchers.forEach(item => {
      this.vouchersListToShow.push(item.name);
    });
  }

  private validateIfExistNotifitionPayByParamRoute() {
    this._rutaActiva.params.subscribe(
      (params: Params) => {
        if (params.idNotification != undefined) {
          this.notificationExpense = this._notificationExpenseService.notificationExpense;
          if (this.notificationExpense.id == 0)
            this._router.navigate(["/"]);

          this.flagReceiveNotificationParamRoute = true;
          this.textActionButton = "Realizar Pago";
          this.expense.description = `Se realiza el pago generado por ${this.notificationExpense.expenseShared.workspace.owner.name} para ${this.notificationExpense.expenseShared.category.name} de tipo ${this.notificationExpense.expenseShared.accordingType.name} que asciendió a ${this.notificationExpense.expenseShared.amountShow} soles.`;
          this.expense.amountShow = this.notificationExpense.expenseShared.accordingType.name != "COMPARTIDO" ? this.notificationExpense.expenseShared.amountShow : (parseFloat(this.notificationExpense.expenseShared.amountShow) / 2).toString();
        }

        if (params.idExpense != undefined) {
          this.expenseToEdit = this._expenseService.expenseToEdit;
          if (this.expenseToEdit.id == 0)
            this._router.navigate(["/"]);
 
          this.textActionButton = "Actualizar gasto";
          this.setterExpenseReceivedFromParam(this.expenseToEdit);
          
        }
      }
    );
  }

  private getAccountIfExitPeriod() {
    if (this.period != null) {
      this.flagShowBtnSelectCalendar = true;
      this.getAllAccountByPeriodSelected(this.period.id);
    }
  }

  registerOrUpdateExpense(idExpense: number) {
    if(this.validAmount() == false) return;
    this.setterObjectExpense();
    
    if(idExpense != 0){
      this.updateExpenseObject();
    } else {
      this.saveExpense();
    }
  }

  setterObjectExpense() {
    this.expense.payer = this.payerSelected==''?this.owner.name:this.payerSelected;
    this.expense.amount = this.expense.amountShow;
    this.expense.registerPerson = this.owner;
    this.expense.account = this.itemAccount;
    this.expense.category = this.itemCategory;
    this.expense.accordingType = this.itemAccording;
    this.expense.paymentMethod = this.itemPaymentMethod;
    this.expense.tag = this.tagListSelected;
    this.expense.createAt = this.dateRangeCalendarSelected;
    this.expense.period = this.period;
    this.expense.workspace = this.workspace;
    //vouchers
    if(this.expense.vouchers.length == 0) return;
    this.vouchersBckp = this.expense.vouchers;
    this.expense.vouchers = this.vouchersBckp.filter(item => item.id != 0);
  }

  updateExpenseObject() {
    this._loadSpinnerService.showSpinner();
    this._expenseService.updateObjectExpense(this.expense).subscribe(
      response => {
        this.flagIsSaveOK = true;
        this.expense = response.object;
        this.period = response.object.period;
        this._periodService.saveToLocalStorage(this.period);
        this._expenseService.clearExpennseRegisterFromLocalStorage();
        if(this.vouchersBckp.length > 0) {
          this.uploadImageToFirestore(this.vouchersBckp);
          return;
        }
        this._loadSpinnerService.hideSlow();
        Swal.fire("",response.message,response.status);
        this._router.navigate(["/"]);
      },
      error => {
        this.manageErrorExpense(error);
      }
    );
  }

  private manageErrorExpense(error: any) {
    this.flagIsSaveOK = false;
    this._loadSpinnerService.hideSlow();
    let textBtnConfirm = "OK";
    let showBtnCancelFlag = false;
    if (error.error.status != 'error' && error.error.message.includes("saldo")) {
      showBtnCancelFlag = true;
      textBtnConfirm = "Agregar saldo a cuenta!";
    }
    Swal.fire({
      text: error.error.message,
      icon: error.error.status,
      showCancelButton: showBtnCancelFlag,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: textBtnConfirm
    }).then((result) => {
      if (result.isConfirmed) {
        if (error.error.status != 'error' && error.error.message.includes("saldo")) {
          this._router.navigate(["/period/period-detail/"+this.period.id]);
        }
      }
    });
  }

  saveExpense() {
    this._loadSpinnerService.showSpinner();
    this._expenseService.create(this.expense).subscribe(
      response => {
        this.flagIsSaveOK = true;
        this.expense = response.object;
        this.period = response.object.period;
        this._periodService.saveToLocalStorage(this.period);
        this._expenseService.clearExpennseRegisterFromLocalStorage();
        if(this.vouchersBckp.length > 0) {
          this.uploadImageToFirestore(this.vouchersBckp);
          return;
        }
        this._loadSpinnerService.hideSlow();
        Swal.fire("",response.message,response.status);
        this._router.navigate(["/"]);
      },
      error => {
        this.manageErrorExpense(error);
      }
    );
  }

  getAllAccording() {
    this._accordingService.getAllAccording().subscribe(
      response => {
        this.listaAccording = response;
        if(this.flagReceiveNotificationParamRoute) {
          this.itemAccording = this.listaAccording[5];
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  validAmount(): boolean{
    if(isNaN(Number(this.expense.amountShow)) || Number(this.expense.amountShow) <= 0) {
      Swal.fire("Alerta","El campo Monto solo acepta números mayores a cero","info");
      return false;
    }

    return true;
  }

  getAllAccountByPeriodSelected(idPeriodReceived: number) {
    this._accountService.getListAccountByIdPeriod(idPeriodReceived).subscribe(
      response => {
        this.accountListSelected = response.filter( account => account.statusAccount.toString() == 'PROCESS');

        if(response.length > 0 && this.accountListSelected.length == 0) {
          Swal.fire("","Tiene cuentas pendientes por confirmar, previo a registrar algún gasto","info");
          this._router.navigate(["/period/period-detail/" + this.period.id]);
        }
      },
      error => {
        if(error.status == null) {
          Swal.fire("Error","Se generó un error desconocido, revise su conexión e inténtelo más tarde.","error");
        }
      }
    );
  }

  ngAfterViewInit() {
    this.validateResizeHeightForm();
  }

  private validateResizeHeightForm() {
      this.heightFormRegisterExpense = this.formRegisterContainerToAccountListBlock.nativeElement.clientHeight;
      let windowHeight = window.innerHeight;
      let heightFormRegister = this.formRegister.nativeElement.clientHeight;
      if (heightFormRegister > windowHeight - 200) {
        this._renderer.setStyle(this.formRegister.nativeElement, "height", (windowHeight * 0.7) + "px");
        this._renderer.setStyle(this.formRegister.nativeElement, "overflow-y", "scroll");
      }
  }

  showListCategories() {
    this.show__list__items = true;
    this.flagShowListCategories = true;
    this.dataStructure.component=CONSTANTES.CONST_COMPONENT_CATEGORIAS;
    this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_CATEGORIAS;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_CATEGORIAS
  }

  showListAccording() {
    if(!this.flagReceiveNotificationParamRoute) {
      this.show__list__items = true;
      this.flagShowListAccording = true;
    }
    this.dataStructure.component=CONSTANTES.CONST_COMPONENT_ACUERDOS;
    this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_ACUERDOS;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_ACUERDOS
  }

  showListPaymentMethods() {
    this.show__list__items = true;
    this.flagShowListPaymentMethod = true;
    this.dataStructure.component=CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO;
    this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_MEDIOSDEPAGO;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_MEDIOSDEPAGO;
  }

  showCalendar() {
    this.show__list__items = true;
    this.flagShowCalendar = true;
  }

  showListOptionsSelect(sender: string) {
    this.show__list__items = true;
    this.dataOptionsSelectExpenseList = [];
    switch (sender) {
      case "accounts":
        this.flagShowListOptionsSelect = true;
        this.accountListSelected.forEach(element => {
          this.dataOptionsSelectExpense = new DataOptionsSelectExpense();
          this.dataOptionsSelectExpense.id = element.id;
          this.dataOptionsSelectExpense.name = element.accountName;
          this.dataOptionsSelectExpense.disponible = element.balanceFlow;
          this.dataOptionsSelectExpense.component = CONSTANTES.CONST_COMPONENT_CUENTAS;
          this.dataOptionsSelectExpense.icon = CONSTANTES.CONST_COMPONENT_CUENTAS_ICON;
          this.dataOptionsSelectExpenseList.push(this.dataOptionsSelectExpense);
        });
        break;
      case "payer":
        this.getAllNameUsersToSend();
        break;
      case "tags":
        this.getAllTagsTosend();
        break;
      default:
        break;
    }
  }

  removeVoucherFromList(index: number) {
    // this.vouchersListToShow.splice(index, 1);
    this.expense.vouchers.splice(index, 1);
    //this.voucherSelectedFileToStorageSave.splice(index, 1);
    this.validateResizeHeightForm();
  }

  deleteItemFromListaTag(itemSelected: Tag) {
    this.tagListSelected = this.tagListSelected.filter( item => {
      return item.tagName != itemSelected.tagName;
    });
  }

  hiddenPopUp() {
    this.flagShowListPaymentMethod = false;
    this.flagShowListOptionsSelect = false;
    this.flagShowListCategories = false;
    this.flagShowListAccording = false;
    this.flagShowCalendar = false;
    this.show__list__items = false;
  }

  receivedItemSelectedaFromPopUp(element: any) {
    switch (element.component) {
      case CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO:
        this.itemPaymentMethod = element.itemSelected;
        break;
      case CONSTANTES.CONST_COMPONENT_CATEGORIAS:
        this.itemCategory = element.itemSelected;
        this.catchAccountByCategorySelected();
        break;
      case CONSTANTES.CONST_COMPONENT_ACUERDOS:
        this.itemAccording = element.itemSelected;
        this.validateResizeHeightForm();
        break;
      case CONSTANTES.CONST_COMPONENT_CALENDAR:
        this.dateRangeCalendarSelected = element.dateRange.finalDate;
        break;
      case CONSTANTES.CONST_COMPONENT_CUENTAS:
        if(element.itemSelected.name == "redirectToAccount"){
          this.flagIsSaveOK = false;          
          this._router.navigate(["/period/period-detail/"+this.period.id]);
          return;
        }

        this.itemAccount.id = element.itemSelected.id;
        this.itemAccount.accountName = element.itemSelected.name;
        this.itemAccount.balanceFlow = element.itemSelected.disponible;
        break;
      case CONSTANTES.CONST_COMPONENT_TAG:
        //Validate if name not exist :: Back btn
        let beSelect = (element.itemSelected.name == "")?false:true;

        if(!beSelect) {//Nombre no seleccionado
          break;
        }

        //Validate if element is repeat :: equals names
        this.tagListSelected.forEach(el => {
          if(el.tagName == element.itemSelected.name) {
            beSelect = false;
            Swal.fire("","Tag ya fue agregado","info");
            return;
          }
        });

        if(!beSelect) {//Repeat
          break;
        }

        //If Dont Empty and not repeat => add to list
        let tagSelected = new Tag();
        tagSelected.id = element.itemSelected.id;
        tagSelected.tagName = element.itemSelected.name;
        tagSelected.owner = this.owner;
        this.tagListSelected.push(tagSelected);
        break;
      case CONSTANTES.CONST_COMPONENT_USER:
        this.payerSelected = element.itemSelected.name;
        break;
      default:
        //received ONLY close order, not object
        this.show__list__items = false;
        break;
    }

    this.hiddenPopUp();
  }

  catchAccountByCategorySelected() {
    this.itemAccount = new AccountModel();
    this.accountListSelected.forEach( account => {
      account.categories.forEach(categ => {
        if(categ.id == this.itemCategory.id) {
          this.itemAccount = account;
          return;
        }
      })
    });
  }

  getAllNameUsersToSend() {
    this._userService.getAllPayersDistictToSelect(this.workspace.id).subscribe(
      response => {
        this.flagShowListOptionsSelect = true;

        if(response.length == 0) {
          this.dataOptionsSelectExpense = new DataOptionsSelectExpense();
          this.dataOptionsSelectExpense.component = CONSTANTES.CONST_COMPONENT_USER;
          this.dataOptionsSelectExpense.icon = CONSTANTES.CONST_COMPONENT_PAYER_ICON;
          this.dataOptionsSelectExpenseList.push(this.dataOptionsSelectExpense);
          return;
        }

        response.forEach(element => {
          if(element == this.workspace.owner.name) return;
          this.dataOptionsSelectExpense = new DataOptionsSelectExpense();
          this.dataOptionsSelectExpense.name = element.toString();
          this.dataOptionsSelectExpense.component = CONSTANTES.CONST_COMPONENT_USER;
          this.dataOptionsSelectExpense.icon = CONSTANTES.CONST_COMPONENT_PAYER_ICON;
          this.dataOptionsSelectExpenseList.push(this.dataOptionsSelectExpense);
        });
      },
      error => {
        console.log(error.error);
      }
    );
  }


  getAllTagsTosend() {
    this._expenseService.getAllTagsByOwnerId(this.owner.id).subscribe(
      response => {
        this.flagShowListOptionsSelect = true;
        if(response.length == 0) {
          this.dataOptionsSelectExpense = new DataOptionsSelectExpense();
          this.dataOptionsSelectExpense.component = CONSTANTES.CONST_COMPONENT_TAG;
          this.dataOptionsSelectExpense.icon = CONSTANTES.CONST_COMPONENT_TAG_ICON;
          this.dataOptionsSelectExpenseList.push(this.dataOptionsSelectExpense);
          return;
        }

        response.forEach(element => {
          this.dataOptionsSelectExpense = new DataOptionsSelectExpense();
          this.dataOptionsSelectExpense.id = element.id;
          this.dataOptionsSelectExpense.name = element.tagName;
          this.dataOptionsSelectExpense.component = CONSTANTES.CONST_COMPONENT_TAG;
          this.dataOptionsSelectExpense.icon = CONSTANTES.CONST_COMPONENT_TAG_ICON;
          this.dataOptionsSelectExpenseList.push(this.dataOptionsSelectExpense);
        });
      },
      error => {
        console.log(error.error);
      }
    );
  }

  uploadImageToFirestore(voucherToSaveStorage: Voucher[]) {
    var voucherNews = voucherToSaveStorage.filter(item=> item.id == 0);
    var vouchersOrigins = voucherToSaveStorage.filter(item=> item.id != 0);
    var vouchersNewUploadedStorage: Voucher[] = [];
    var totalElementArray = voucherNews.length;
    var countIteration = 0;

    voucherNews.forEach(voucher => {
      let imgBase64 = voucher.name;
      this._storageService.uploadImage( "IMG_" + Date.now(), imgBase64,
                            "expenses"+ "/"+ this.owner.username)
        .then(
        urlImagen => {
          countIteration++;
          let voucherToSave = new Voucher();
          voucherToSave.name = urlImagen!;
          vouchersNewUploadedStorage.push(voucherToSave);
          if(countIteration == totalElementArray){
            this.expense.vouchers = vouchersNewUploadedStorage.concat(vouchersOrigins);
            this.saveVouchersExpense();
          }
        }, (e) => {
          countIteration++;
          this._loadSpinnerService.hideSlow();
          if(countIteration == totalElementArray){
            this._router.navigate(["/"]);
          }
        }
      );
    });

    if(voucherNews.length == 0 ) {
      this.expense.vouchers = vouchersNewUploadedStorage.concat(vouchersOrigins);
      this._loadSpinnerService.hideSlow();
      this.saveVouchersExpense()
    }

  }

  saveVouchersExpense() {
    this._expenseService.updateVouchersToExpense(this.expense).subscribe(
      response => {
        this._loadSpinnerService.hideSlow();
        if(this.flagReceiveNotificationParamRoute){
          this.notificationExpense.vouchers = response.vouchers;
          this.updateNotificationStatus(this.notificationExpense);
          return;
        }
        Swal.fire("","Registro exitoso","success");
        this._router.navigate(["/"]);
      },
      error => {
        this._loadSpinnerService.hideSlow();
        Swal.fire("","Se registró el gasto correctamente excepto los vouchers, actualice el registro por favor","info");
        this._router.navigate(["/"]);
      }
    );
  }

  uploadFoto(event: any) {
    var allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    
    if((this.expense.vouchers.length + event.target.files.length) > 2) {
      Swal.fire("","Suba hasta 2 comprobantes como máximo.","info");
      return;
    }
    if( event.target.files) {
      for (let index = 0; index <  event.target.files.length; index++) {
        if(!allowedExtensions.exec(event.target.files[index].type)){
          Swal.fire("","Solo se permiten imágenes tipo .png, .jpg y .jpeg.","info");
        } else {
          let reader = new FileReader();
          reader.readAsDataURL(event.target.files[index]);
          reader.onload = (event:any) =>
          {
            let voucher = new Voucher();
            voucher.name = event.target.result;
            this.expense.vouchers.push(voucher);
          }
        }
      }
      this.validateResizeHeightForm();
    }
  }

  private updateNotificationStatus(notificationRequest: NotificationExpense) {
    this._notificationExpenseService.updateStatusNotificationExpense(notificationRequest).subscribe(
      response => {
        this._router.navigate(["/"]);
      },
      error => {
        this._router.navigate(["/"]);
      }
    );
  }

  identifyEventClickOutWindow() {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.popup__formulario && e.target === this.popup__formulario.nativeElement){
        this._router.navigate(['/']);
      }
    });
  }

}
