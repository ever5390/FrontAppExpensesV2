import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { IDataSendItemToExpenseManager } from '@data/interfaces/data-send-item-to-expensemanager.interface';
import { AccountModel } from '@data/models/business/account.model';
import { PeriodModel } from '@data/models/business/period.model';
import { DataOptionsSelectExpense } from '@data/models/Structures/data-expense-options';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SLoaderService } from '../loaders/s-loader/service/s-loader.service';

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

  period: PeriodModel = new PeriodModel();

  constructor(
    private _renderer: Renderer2,
    private _loaderService : SLoaderService
  ) { }

  ngOnInit(): void {
    this._loaderService.hideSpinner();
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.searchActivateFunction();
    this.catchWithSetTime();
  }

  catchWithSetTime() {
    setTimeout(() => {
      this.dataOptionsSelectExpenseList = this.dataOptionsSelectExpenseListReceived;
      this.dataOptionsSelectExpenseList.forEach(element => {
        
        if(element.name ==  CONSTANTES.CONST_TEXT_VACIO){
            this.componenteReceivedToBackWithoutSelect = element.component;
            this.dataOptionsSelectExpenseList = [];
            return
        };
        
        if(element.component ==  CONSTANTES.CONST_COMPONENT_CUENTAS){
          this.componenteReceivedToBackWithoutSelect = element.component;
          this.isAccountList = true;
          this.time = 70;
          return
        };
        
        if(element.component !=  CONSTANTES.CONST_COMPONENT_CUENTAS){
          this.componenteReceivedToBackWithoutSelect = element.component;
          this.time = 70;
          return
        };
      });      
    }, 150);
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
    this.sendEmittAccountSelected.emit(this.dataSendToExpenseManager);
  }

  redirectToAccount() {
    this.dataSendToExpenseManager.itemSelected = new DataOptionsSelectExpense();
    this.dataSendToExpenseManager.itemSelected.name = "redirectToAccount";
    this.dataSendToExpenseManager.component = this.componenteReceivedToBackWithoutSelect;
    this.sendEmittAccountSelected.emit(this.dataSendToExpenseManager);
  }

  resizingWindowList() {
      if(this.heightListAccounts > (this.heightContainerChild - 250) ) {
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
