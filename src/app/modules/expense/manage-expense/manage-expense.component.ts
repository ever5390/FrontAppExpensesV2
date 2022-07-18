import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { AccordingModel } from 'app/data/models/business/according.model';
import { CategoryModel } from 'app/data/models/business/category.model';
import { ExpenseModel } from 'app/data/models/business/expense.model';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { PaymentMethodModel } from 'app/data/models/business/payment-method.model';
import { PeriodModel } from 'app/data/models/business/period.model';
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

  flagShowListCategories: boolean = false;
  flagShowListAccording: boolean = false;
  flagShowListPaymentMethod: boolean = false;
  flagShowCalendar: boolean = false;

  itemPaymentMethod: PaymentMethodModel =  new PaymentMethodModel();
  itemCategory: CategoryModel =  new CategoryModel();
  itemAccording: AccordingModel =  new AccordingModel();
  dateRangeCalendarSelected: any;

  // expense: Expense
  expense: ExpenseModel = new ExpenseModel();
  period: PeriodModel = new PeriodModel();
  
  show__list__items: boolean = false;
  dataStructure: DataStructureListShared = new DataStructureListShared();
  
  @Input() show__popup: boolean = false;
  @Output() sendHiddenFormRegister: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;
  @ViewChild('formRegister') formRegister: ElementRef | any;
  
  constructor(
    private _renderer: Renderer2,
    private _router: Router,
    private _expenseService: ExpensesService
  ) {
    this.identifyEventClickOutWindow();
   }


  ngOnInit(): void {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    //this.startDate = this._utilService.convertDateToString(this.period);
  }


  create() {
    console.log("create expense");
    this._expenseService.create(this.expense).subscribe(
      response => {
        console.log(response);
        this.period = response.object.period;
        localStorage.setItem("lcstrg_periodo",JSON.stringify(this.period));
        Swal.fire("","Registro exitoso","success");
        this._router.navigate(["/"]);
      },
      error => {
        console.log(error.error);
      }
    );
  }

  registerOrUpdateExpense() {
    this.expense.payer = this.owner.name;
    this.expense.amount = this.expense.amountShow;
    this.expense.registerPerson = this.owner;
    this.expense.category = this.itemCategory;
    this.expense.accordingType = this.itemAccording;
    this.expense.paymentMethod = this.itemPaymentMethod;

    if(this.period == null) this.period = new PeriodModel();

    this.expense.period = this.period;
    console.log(this.expense);
    this.create();


    // for (let index = 0; index < this.imagenesUpload.length; index++) {
    //   this.expense.image+= this.imagenesUpload[index]+";";
    // }
    
    
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
    // this.dataStructure.component=CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO;
    // this.dataStructure.title=CONSTANTES.CONST_TITLE_SELECCIONE_ITEM_MEDIOSDEPAGO;
    // this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_MEDIOSDEPAGO;
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
    this.flagShowListCategories = false;
    this.flagShowListAccording = false;
    this.flagShowListPaymentMethod = false;
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
        break;
      case CONSTANTES.CONST_COMPONENT_ACUERDOS:
        this.itemAccording = element.itemSelected;
        break;
      case CONSTANTES.CONST_COMPONENT_CALENDAR:
        console.log(element.dateRange);
        this.dateRangeCalendarSelected = element.dateRange;
        break;
      default:
        //received ONLY close order, not object
        this.show__list__items = false;
        break;
    }
    
    this.hiddenPopUp();
  }

  identifyEventClickOutWindow() {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.popup__formulario && e.target === this.popup__formulario.nativeElement){
        this._router.navigate(['/']);
      }
    });
  }
}
