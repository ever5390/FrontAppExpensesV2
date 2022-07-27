import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { ExpenseModel } from '@data/models/business/expense.model';
import { FilterExpensesModel } from '@data/models/Structures/data-object-filtering.model';

@Component({
  selector: 'app-filter-expense',
  templateUrl: './filter-expense.component.html',
  styleUrls: ['./filter-expense.component.css']
})
export class FilterExpenseComponent implements OnInit {

  sendTitleMenuSecundary: string= CONSTANTES.CONST_TEXT_VACIO;
  categoryDistinctList: FilterExpensesModel[] = [];
  accordingDistinctList: FilterExpensesModel[] = [];
  paymentMethodDistinctList: FilterExpensesModel[] = [];

  sendListFilterBytemResumeShow:any[] = [];

 // Show && Hidden Menu Main and Menu Secundary
  showTranslateMenuFilterMain: boolean = false;
  showTranslateMenuFilterSecundary: boolean = false;
  showMenuFilterSecundary:boolean=false;
  showMenuFilterSecundaryTranslate:boolean=false;

  @Input("receivedFlagShowMenuFilterMain") receivedFlagShowMenuFilterMain:boolean = false;
  @Input("receivedListExpensesFromSearching") receivedListExpensesFromSearching :ExpenseModel[] = [];
  @Output() emitterFlagHiddenMenuFilterMain= new EventEmitter();
  @Output() emitterTagFilterSearch = new EventEmitter();
  @ViewChild("containerMenuFilterMain") containerMenuFilterMain : ElementRef | any;
  

  constructor(
    private _renderer: Renderer2
  ) {
    this.identifyEventClickOutWindow();
   }

  ngOnInit(): void {
    this.showMenuFilterMain();
    this.transformListExpenses();
  }

  transformListExpenses() {
    this.listExpensesToBodyBackup = this.receivedListExpensesFromSearching;
    this.getCategoryResume();
    this.getAccordingResume();
    this.getPaymentMethodResume();

  }
  getPaymentMethodResume() {
    this.paymentMethodDistinctList = [];
    this.receivedListExpensesFromSearching.forEach((expense)=> {
      if(this.paymentMethodDistinctList.some( (val) => val.name == expense.paymentMethod.name)) {
        this.paymentMethodDistinctList.forEach(element => {
          if(element.name == expense.paymentMethod.name) {
            element.countItems++;
            element.totalAmountSpent+= parseFloat(expense.amount);
          }
        });
      } else {
        let array = new FilterExpensesModel();
        array.id = expense.paymentMethod.id;
        array.name = expense.paymentMethod.name;
        array.image = expense.paymentMethod.image;
        array.countItems = 1;
        array.totalAmountSpent = parseFloat(expense.amount);
        array.component = CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO;
        this.paymentMethodDistinctList.push(array); 
      }
    })
  }
  getAccordingResume() {
    this.accordingDistinctList = [];
    this.receivedListExpensesFromSearching.forEach((expense)=> {
      if(this.accordingDistinctList.some( (val) => val.name == expense.accordingType.name)) {
        this.accordingDistinctList.forEach(accord => {
          if(accord.name == expense.accordingType.name) {
            accord.countItems++;
            accord.totalAmountSpent+= parseFloat(expense.amount);
          }
        });
      } else {
        let array = new FilterExpensesModel();
        array.id = expense.accordingType.id;
        array.name = expense.accordingType.name;
        array.image = expense.accordingType.image;
        array.countItems = 1;
        array.totalAmountSpent = parseFloat(expense.amount);
        array.component = CONSTANTES.CONST_COMPONENT_ACUERDOS;
        this.accordingDistinctList.push(array); 
      }
    })
  }

  getCategoryResume() {
    this.categoryDistinctList = [];
    this.receivedListExpensesFromSearching.forEach((expense)=> {
      if(this.categoryDistinctList.some( (val) => val.name == expense.category.name)) {
        this.categoryDistinctList.forEach(cat => {
          if(cat.name == expense.category.name) {
            cat.countItems++;
            cat.totalAmountSpent+= parseFloat(expense.amount);
          }
        });
      } else {
        let array = new FilterExpensesModel();
        array.id = expense.category.id;
        array.name = expense.category.name;
        array.image = expense.category.image;
        array.countItems = 1;
        array.totalAmountSpent = parseFloat(expense.amount);
        array.component = CONSTANTES.CONST_COMPONENT_CATEGORIAS;
        this.categoryDistinctList.push(array); 
      }
    })
  }

  /* -- SHow Hidden Menu -- */

  showMenuFilterMain() {
    setTimeout(()=> {
      this.showTranslateMenuFilterMain = true;
    },50);
  }

  translateHiddenMenuFilterMain() {
    this.showTranslateMenuFilterMain = false;
    setTimeout(()=> {
      this.receivedFlagShowMenuFilterMain = false;
      this.emitterFlagHiddenMenuFilterMain.emit(false);
    },300);
  }

  ReceivingHiddenMenuFilterSecundary(e:any) {
      this.showMenuFilterSecundaryTranslate = false;
      setTimeout(()=> {
        this.showMenuFilterSecundary = false;
      },100);
  }

  showBody: boolean = false;
  listShowExpenses: ExpenseModel[] = [];
  listExpensesToBodyBackup: ExpenseModel[] = [];
  receivingDataFromChildFilter(response: any) {
     console.log("sdsdsd");
    let listActive = response.filter( (itemActive: { active: boolean; }) => itemActive.active === true);
      
    this.showBody = false;
    let cont = 0;
    this.receivedListExpensesFromSearching = this.listExpensesToBodyBackup;
    if(listActive.length == 0) this.listShowExpenses = this.receivedListExpensesFromSearching;

    listActive.forEach( (itemActive: FilterExpensesModel) => {
      cont++;
      if(cont == 1) {
        this.listShowExpenses = this.receivedListExpensesFromSearching.filter( item => {
          return item.strFilterParamsJoin.includes(itemActive.name);
        });
      } else {
        let listaNew = this.receivedListExpensesFromSearching.filter( item => {
          return item.strFilterParamsJoin.includes(itemActive.name);
        });
        this.listShowExpenses = this.listShowExpenses.concat(listaNew);
      }
      
    });
    console.log(this.listShowExpenses);

    this.receivedListExpensesFromSearching =  this.listShowExpenses;

    this.getCategoryResume();
    this.getAccordingResume();
    this.getPaymentMethodResume();
  }

  showFilterMenuSecundaryByOptionSelect(titleMenuSecundaryToSend: string) {
    this.showMenuFilterSecundary = true;
    this.sendTitleMenuSecundary = titleMenuSecundaryToSend;
    switch (titleMenuSecundaryToSend) {
      case "Categorías":
        this.sendListFilterBytemResumeShow = this.categoryDistinctList;
        break;
      case "Acuerdos":
        this.sendListFilterBytemResumeShow = this.accordingDistinctList;
        break;
      case "Métodos de Pago":
        this.sendListFilterBytemResumeShow = this.paymentMethodDistinctList;
        break;
      default:
        break;
    }
    
    setTimeout(()=> {
      this.showMenuFilterSecundaryTranslate = true;
    },100);
    
  }

  identifyEventClickOutWindow() {
    this._renderer.listen("window","click",(e: Event)=> {
      if( this.containerMenuFilterMain && e.target === this.containerMenuFilterMain.nativeElement){
        this.translateHiddenMenuFilterMain();
      }
    });
  }
}
