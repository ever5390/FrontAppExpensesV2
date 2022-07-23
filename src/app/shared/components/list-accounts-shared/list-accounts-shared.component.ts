import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { IDataListAccountShared } from '@data/interfaces/data-account-list-select-shared.interface';
import { IDataSendItemToExpenseManager } from '@data/interfaces/data-send-item-to-expensemanager.interface';
import { AccountModel } from '@data/models/business/account.model';

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
  
  @Input() receiveComponentToBlockListAccount: string = CONSTANTES.CONST_TEXT_VACIO;
  @Input() listaAccountReceived: AccountModel[] = [];
  @Input() heightContainerChild: number = 0;
  @Input() flagShowComponentReceived: boolean = false;
  @Output() sendEmittAccountSelected = new EventEmitter<any>();
  @ViewChild('lisCategoriesForSelect') lisCategoriesForSelect: ElementRef | any;

  constructor(
    private _renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    if(this.receiveComponentToBlockListAccount == CONSTANTES.CONST_COMPONENT_EXPENSEREGISTER)
      this.time = 70;
    
    if(this.receiveComponentToBlockListAccount == CONSTANTES.CONST_COMPONENT_CUENTAS)
      this.time = 1;
  }

  catchAccountSelected(accountorigenSelected: AccountModel) {
    this.dataSendToExpenseManager.itemSelected = accountorigenSelected;
    this.dataSendToExpenseManager.component = CONSTANTES.CONST_COMPONENT_CUENTAS;
    this.sendEmittAccountSelected.emit(this.dataSendToExpenseManager);
    this.flagShowComponentReceived = false;
  }

  
  backToEmitAccount() {
    this.dataSendToExpenseManager.itemSelected = new AccountModel();
    this.dataSendToExpenseManager.component = CONSTANTES.CONST_COMPONENT_CUENTAS;
    this.sendEmittAccountSelected.emit(this.dataSendToExpenseManager);
  }

  resizingWindowList() {
    // setTimeout(()=> {
      if(this.heightListAccounts > (this.heightContainerChild - 50) ) {
        this._renderer.setStyle(this.lisCategoriesForSelect.nativeElement, "height",(this.heightContainerChild - 80) + "px");
        this._renderer.setStyle(this.lisCategoriesForSelect.nativeElement, "overflow-y","scroll");
      } else {
        this._renderer.setStyle(this.lisCategoriesForSelect.nativeElement, "overflow-y","none");
      }
    // },1);
  }

  ngAfterViewInit() {
    setTimeout(()=> {
      this.heightListAccounts = this.lisCategoriesForSelect.nativeElement.clientHeight;
      this.resizingWindowList();
    },this.time);
  }

}
