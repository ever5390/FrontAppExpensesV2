import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { IDataListAccountShared } from '@data/interfaces/data-account-list-select-shared.interface';
import { AccountModel } from '@data/models/business/account.model';
import { AccordingService } from '@data/services/according/according.service';
import { AccountService } from '@data/services/account/account.service';
import { AccordingModel } from 'app/data/models/business/according.model';
import { CategoryModel } from 'app/data/models/business/category.model';
import { ExpenseModel } from 'app/data/models/business/expense.model';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { PaymentMethodModel } from 'app/data/models/business/payment-method.model';
import { PeriodModel } from 'app/data/models/business/period.model';
import { TypeWSPC, Workspace } from 'app/data/models/business/workspace.model';
import { DataStructureListShared } from 'app/data/models/data.model';
import { ExpensesService } from 'app/data/services/expenses/expenses.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.css']
})
export class ManageExpenseComponent implements OnInit {

  imagenesUpload: string[] = [];
  owner : OwnerModel = new OwnerModel();

  sendComponentParentToCalendar: string = CONSTANTES.CONST_COMPONENT_EXPENSEREGISTER;
  sendComponentToBlockListAccount: string = CONSTANTES.CONST_COMPONENT_EXPENSEREGISTER;

  flagShowListAccording: boolean = false;
  flagShowListCategories: boolean = false;
  flagShowListPaymentMethod: boolean = false;
  flagShowListAccountSelect: boolean = false;
  flagShowCalendar: boolean = false;

  itemPaymentMethod: PaymentMethodModel =  new PaymentMethodModel();
  itemCategory: CategoryModel =  new CategoryModel();
  itemAccording: AccordingModel =  new AccordingModel();
  itemAccount: AccountModel = new AccountModel();
  dateRangeCalendarSelected: any;

  // expense: Expense
  expense: ExpenseModel = new ExpenseModel();
  period: PeriodModel = new PeriodModel();
  heightFormRegisterExpense: number = 0;

  //Account
  accountListSelected: AccountModel[] = [];

  workspace: Workspace = new Workspace(1,"Workspace1");
  
  show__list__items: boolean = false;
  dataStructure: DataStructureListShared = new DataStructureListShared();
  
  @Input() show__popup: boolean = false;
  @Output() sendHiddenFormRegister: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;
  @ViewChild('formRegister') formRegister: ElementRef | any;
  @ViewChild('formRegisterContainerToAccountListBlock') formRegisterContainerToAccountListBlock: ElementRef | any;
  
  constructor(
    private _renderer: Renderer2,
    private _router: Router,
    private _expenseService: ExpensesService,
    private _accountService: AccountService,
    private _accordingService: AccordingService
  ) {
    this.identifyEventClickOutWindow();
    this.getAllAccording2();
   }
   listaAccording: AccordingModel[] = [];

   getAllAccording2() {
    console.log("dererere");
    this._accordingService.getAllAccording().subscribe(
      response => {
        this.listaAccording = response;
        console.log(this.listaAccording);
        
      },
      error => {
        console.log(error);
      }
    );
  }


  ngOnInit(): void {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);

    this.workspace.owner = this.owner;
    this.workspace.typeWSPC = new TypeWSPC(1,'SINGLE');
    console.log("this.workspace");
    console.log(this.workspace);
    if(this.period != null) this.getAllAccountByPeriodSelected(this.period.id);
  }


  create() {
    this._expenseService.create(this.expense).subscribe(
      response => {
        this.period = response.object.period;
        console.log("period post create expense");
        console.log(this.period);
        localStorage.setItem("lcstrg_periodo",JSON.stringify(this.period));
        Swal.fire("","Registro exitoso","success");
        this._router.navigate(["/dashboard"]);
      },
      error => {
        console.log(error.error);
        Swal.fire(error.error.title,error.error.message,error.error.status);
      }
    );
  }

  registerOrUpdateExpense() {

    if(this.validAmount() == false) return;
    this.expense.payer = this.owner.name;
    this.expense.amount = this.expense.amountShow;
    this.expense.registerPerson = this.owner;
    this.expense.account = this.itemAccount;
    this.expense.category = this.itemCategory;
    this.expense.accordingType = this.itemAccording;
    this.expense.paymentMethod = this.itemPaymentMethod;

    if(this.period == null) this.period = new PeriodModel();

    this.expense.period = this.period;
    this.expense.workspace = this.workspace;

    console.log("create expense");
    console.log(this.expense);
    this.create();


    // for (let index = 0; index < this.imagenesUpload.length; index++) {
    //   this.expense.image+= this.imagenesUpload[index]+";";
    // }
    
    
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
        this.accountListSelected = response.filter( account => {
          return account.accountType.id == 2 && account.statusAccount.toString() == 'PROCESS';
        });
      },
      error => {
        console.log(error);
        //Swal.fire("","No se obtuvo datos del periodo buscado","error");
      }
    );
  }

  ngAfterViewInit() {

    this.heightFormRegisterExpense = this.formRegisterContainerToAccountListBlock.nativeElement.clientHeight;
    let windowHeight = window.innerHeight;
    let heightFormRegister = this.formRegister.nativeElement.clientHeight;

    //IF onlyListItems is FALSE :: Viene desde una cuenta para anadir categorias
    //Definiendo valores de acuerdo a de donde es llamado este componente

    if(heightFormRegister > windowHeight -100){
      this._renderer.setStyle(this.formRegister.nativeElement,"height",(windowHeight*0.8)+"px");
      this._renderer.setStyle(this.formRegister.nativeElement,"overflow-y","scroll");
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
    this.show__list__items = true;
    this.flagShowListAccording = true;
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

  showListAccountSelect() {
    this.show__list__items = true;
    this.flagShowListAccountSelect = true;
  }

  uploadFoto(event: any) {
    if( event.target.files) {
      for (let index = 0; index <  event.target.files.length; index++) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[index]);
        reader.onload = (event:any) => 
        {
          this.imagenesUpload.push(event.target.result);
        }
      }
    }
  }

  removeVoucherFromList(index: number) {
    this.imagenesUpload.splice(index, 1);
  }

  hiddenPopUp() {
    this.flagShowListPaymentMethod = false;
    this.flagShowListAccountSelect = false;
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
        break;
      case CONSTANTES.CONST_COMPONENT_CALENDAR:
        console.log(element.dateRange);
        this.dateRangeCalendarSelected = element.dateRange;
        break;
      case CONSTANTES.CONST_COMPONENT_CUENTAS:
        console.log(element.itemSelected);
        this.itemAccount = element.itemSelected;
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
          console.log(account);
          this.itemAccount = account;
          return;
        }
      })
    });
  }

  identifyEventClickOutWindow() {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.popup__formulario && e.target === this.popup__formulario.nativeElement){
        this._router.navigate(['/dashboard']);
      }
    });
  }
}
