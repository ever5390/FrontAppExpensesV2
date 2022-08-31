import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { IDataSendItemToExpenseManager } from '@data/interfaces/data-send-item-to-expensemanager.interface';
import { AccountModel } from '@data/models/business/account.model';
import { DataOptionsSelectExpense } from '@data/models/Structures/data-expense-options';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-list-accounts-shared',
  templateUrl: './list-accounts-shared.component.html',
  styleUrls: ['./list-accounts-shared.component.css']
})
export class ListAccountsSharedComponent implements OnInit {

  dataSendToExpenseManager: IDataSendItemToExpenseManager = {
    component:'',
    itemSelected: null
  };
  
  accountSelected: AccountModel = new AccountModel();
  heightListAccounts: number = 0;
  time: number = 0;

  subject = new Subject();
  txtSearch: string = '';
  dataOptionsSelectExpenseList: DataOptionsSelectExpense[] = [];
  dataOptionsSelectExpense: DataOptionsSelectExpense = new DataOptionsSelectExpense();
  
  @Input() dataOptionsSelectExpenseListReceived: DataOptionsSelectExpense[] = [];
  @Input() receiveComponentToBlockListAccount: string = CONSTANTES.CONST_TEXT_VACIO;
  @Input() listaAccountReceived: AccountModel[] = [];
  @Input() heightContainerChild: number = 0;
  @Input() flagShowComponentReceived: boolean = false;
  @Output() sendEmittAccountSelected = new EventEmitter<any>();
  @ViewChild('lisCategoriesForSelect') lisCategoriesForSelect: ElementRef | any;

  isAccountList: boolean = false;
  showBtnAddItem : boolean = false;
  componenteReceivedToBackWithoutSelect: string = "";
  textSearch: string = "";

  constructor(
    private _renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.searchActivateFunction();
    this.catchWithSetTime();
  }

  catchWithSetTime() {
    
    //this.dataOptionsSelectExpenseList = [];
    this.dataOptionsSelectExpenseList = this.dataOptionsSelectExpenseListReceived;
    console.log(this.dataOptionsSelectExpenseList);
    setTimeout(() => {
      
      this.dataOptionsSelectExpenseList.forEach(element => {
        
        if(element.name ==  CONSTANTES.CONST_TEXT_VACIO){
            console.log("DEFAULT");
            this.componenteReceivedToBackWithoutSelect = element.component;
            this.dataOptionsSelectExpenseList = [];
            
            return
        };
        
        if(element.component ==  CONSTANTES.CONST_COMPONENT_CUENTAS){
          console.log("CUENTA");
          this.isAccountList =  true;
          this.componenteReceivedToBackWithoutSelect = element.component;
          //this.dataOptionsSelectExpenseList = [];
          this.time = 70;
          
          return
        };
        
        if(element.component !=  CONSTANTES.CONST_COMPONENT_CUENTAS){
          console.log("DF CUENTAS Y DEF");
          this.componenteReceivedToBackWithoutSelect = element.component;
          //this.dataOptionsSelectExpenseList = [];
          this.time = 70;
          
          return
        };
      });      
    }, 60);
  }

  searchActivateFunction() {
      
      this.subject.pipe(
        debounceTime(100)
      ).subscribe((searchText:any) => {
        this.showBtnAddItem = false;
        this.dataOptionsSelectExpenseList = this.dataOptionsSelectExpenseListReceived.filter(item => {
          return item.name.toUpperCase().includes(searchText.toUpperCase()) 
            }
          );
          console.log(this.textSearch);
          if(this.textSearch != '' && this.dataOptionsSelectExpenseList.length == 0) {
            this.showBtnAddItem = true;
          }

        }
      )
  }

  selectNewOptionToSendExpense() {
    let datOptionWithPayerNew = new DataOptionsSelectExpense();
    datOptionWithPayerNew.id = 0;
    datOptionWithPayerNew.name = this.textSearch;
    
    this.dataSendToExpenseManager.itemSelected = datOptionWithPayerNew;
    this.dataSendToExpenseManager.component = this.componenteReceivedToBackWithoutSelect;
    
    this.sendEmittAccountSelected.emit(this.dataSendToExpenseManager);
    this.flagShowComponentReceived = false;
  }

  catchOptionSelected(itemSelected: DataOptionsSelectExpense) {
    this.dataSendToExpenseManager.itemSelected = itemSelected;
    this.dataSendToExpenseManager.component = itemSelected.component;
    this.sendEmittAccountSelected.emit(this.dataSendToExpenseManager);
    this.flagShowComponentReceived = false;
  }
  
  backToEmitAccount() {
    this.dataSendToExpenseManager.itemSelected = new DataOptionsSelectExpense();
    this.dataSendToExpenseManager.component = this.componenteReceivedToBackWithoutSelect;
    console.log(this.dataSendToExpenseManager);
    this.sendEmittAccountSelected.emit(this.dataSendToExpenseManager);
    this.flagShowComponentReceived = false;
  }

  resizingWindowList() {
      if(this.heightListAccounts > (this.heightContainerChild - 50) ) {
        this._renderer.setStyle(this.lisCategoriesForSelect.nativeElement, "height",(this.heightContainerChild - 220) + "px");
        this._renderer.setStyle(this.lisCategoriesForSelect.nativeElement, "overflow-y","scroll");
      } else {
        this._renderer.setStyle(this.lisCategoriesForSelect.nativeElement, "overflow-y","none");
      }
  }

  ngAfterViewInit() {
    this.catchHeightAndConfig();
  }

  private catchHeightAndConfig() {
    setTimeout(() => {
      this.heightListAccounts = this.lisCategoriesForSelect.nativeElement.clientHeight;
      this.resizingWindowList();
    }, 200);
  }

  searchMethod(evt: any){
    const searchText = evt.target.value;
    this.textSearch = searchText;
    this.subject.next(searchText)
  }

}
