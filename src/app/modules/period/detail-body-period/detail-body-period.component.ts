import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpenseModel } from '@data/models/business/expense.model';
import { AccountClosedStructure } from '@data/models/Structures/data-account.model';
import { PeriodService } from '@data/services/period/period.service';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { CONSTANTES } from 'app/data/constantes';
import { AccountModel, TypeSatusAccountOPC } from 'app/data/models/business/account.model';
import { PeriodModel } from 'app/data/models/business/period.model';
import { TransferenciaModel } from 'app/data/models/business/transferencia.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { AccountService } from 'app/data/services/account/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-body-period',
  templateUrl: './detail-body-period.component.html',
  styleUrls: ['./detail-body-period.component.css']
})
export class DetailBodyPeriodComponent implements OnInit {

  transferObject: TransferenciaModel = new TransferenciaModel();

  accountParentShow: AccountModel = new AccountModel();
  accountListChildsShow: AccountModel[] = [];
  accountClosedStructureList: AccountClosedStructure[] = [];
  accountClosedStructure: AccountClosedStructure = new AccountClosedStructure();

  accountParentInit: AccountModel = new AccountModel();
  accountParentProcess: AccountModel = new AccountModel();
  accountParentClosed: AccountModel = new AccountModel();

  accountListChildsInit: AccountModel[] = [];
  accountListChildsProcess: AccountModel[] = [];
  accountListChildsClosed: AccountModel[] = [];

  period: PeriodModel = new PeriodModel();

  title:string = "";
  sendBtnText:string='';
  flagFormulario: boolean = false;
  blockAccount: boolean = false;

  dataStructure: DataStructureFormShared = new DataStructureFormShared();

  @Input() accountListReceived: AccountModel[] = [];  
  @Output() sendUpdateAmountInitialHeader= new EventEmitter();

  constructor(
    private _loadSpinnerService: SLoaderService,
    private _accountService: AccountService,
    private _periodService: PeriodService
  ) {
  }

  ngOnInit(): void {
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.catchAccountParent();
    this.catchAccountChilds();
    this.validateShowBlockAccounts();
  }

  validateShowBlockAccounts() {
    this.blockAccount = true;
    if(!this.accountParentShow.period.statusPeriod && this.accountClosedStructureList.length == 0) {
      this.blockAccount = false;
    }
  }

  catchAccountChilds() {
    //Case Closed
    if(this.accountParentShow.statusAccount.toString() == TypeSatusAccountOPC.CLOSED) {
      this.accountListChildsShow = this.accountListReceived.filter(item => {
        return item.accountType.id == 2 && item.statusAccount.toString() == this.accountParentShow.statusAccount; 
      });

      this.accountListChildsInit = this.accountListReceived.filter(item => {
        return item.accountType.id == 2 && item.statusAccount.toString() == TypeSatusAccountOPC.INITIAL; 
      });

      this.accountListChildsShow.forEach(itemClosed=> {
        this.accountListChildsInit.forEach(itemInit=> {
          if(itemClosed.accountNumber == itemInit.accountNumber){
            this.accountClosedStructure = new AccountClosedStructure();
            this.accountClosedStructure.account = itemClosed;
            this.accountClosedStructure.amountInitial = parseFloat(itemInit.balance);
            this.accountClosedStructure.spent = parseFloat(itemClosed.balance) - parseFloat(itemClosed.balanceFlow);
            this.accountClosedStructure.diferenciaAmountByStatus = parseFloat(itemInit.balance) - this.accountClosedStructure.spent;
            this.accountClosedStructureList.push(this.accountClosedStructure);
          }
        })
      })

      return;
    } else {
      this.accountClosedStructureList = []; 
      this.accountListChildsShow = this.accountListReceived.filter(item => {
        return item.accountType.id == 2 && item.statusAccount.toString() == this.accountParentShow.statusAccount; 
      });
      
      for (let index = 0; index < this.accountListChildsShow.length; index++) {
        this.accountClosedStructure = new AccountClosedStructure();
        this.accountClosedStructure.account = this.accountListChildsShow[index];
        this.accountClosedStructureList.push(this.accountClosedStructure);
      }
    }

  }

  catchAccountParent() {
    this.accountParentInit = new AccountModel();
    this.accountParentProcess = new AccountModel();
    this.accountParentClosed = new AccountModel();
    this.accountParentShow = new AccountModel();

    this.accountListReceived.forEach(account => {
        if(account.accountType.id == 1 && account.statusAccount.toString() == 'INITIAL'){
          this.accountParentInit = account;
        }

        if(account.accountType.id == 1 && account.statusAccount.toString() == 'PROCESS'){
          this.accountParentProcess = account;
          return;
        }

        if(account.accountType.id == 1 && account.statusAccount.toString() == 'CLOSED'){
          this.accountParentClosed = account;
          return;
        }
    });

    //Caso No existe ParentInitial
    if(this.accountParentInit.id == 0) {
      console.log("No existen cuentas para este periodo, agregue cuentas...");
      return;
    }

    //Caso existe ParentInitial
    if(this.accountParentInit.id != 0) {
      this.accountParentShow = this.accountParentInit;
    }

    //Caso existe ParentProcess
    if(this.accountParentProcess.id != 0) {
      this.accountParentShow = this.accountParentProcess;
    }

    //Caso existe accountParentClosed
    if(this.accountParentClosed.id != 0) {
      this.accountParentShow = this.accountParentClosed;
    }

  }

  registerAccount(accountToSave: AccountModel) {
    accountToSave.period = this.period;
    this._accountService.createAccount(accountToSave).subscribe(
      (response :any)=> {
        Swal.fire("","Cuenta registrada con éxito","success");
        this._periodService.saveToLocalStorage(response.object.period);
        this.getAllAccountByPeriodSelected(response.object.period.id);
        this.sendUpdateAmountInitialHeader.emit(response.object);
      },
      error => {
        console.log(error);
        Swal.fire(error.error.title,error.error.message,error.error.status);
        this.getAllAccountByPeriodSelected(this.period.id);
      }
    );
  }

  
  updateAccount(accountToSave: AccountModel) {
    console.log("accountToSave");
    console.log(accountToSave);
    this._accountService.updateAccount(accountToSave).subscribe(
      (response :any)=> {
        console.log("accountToSave");
        console.log(response);
        Swal.fire(response.title,response.message, response.status);
        this.getAllAccountByPeriodSelected(response.object.period.id);
        this.sendUpdateAmountInitialHeader.emit(response.object);
      },
      error => {
        console.log(error);
        this.getAllAccountByPeriodSelected(accountToSave.period.id);
        Swal.fire(error.error.title,error.error.message,error.error.status);
      }
    );
  }

  getAllAccountByPeriodSelected(idPeriodReceived: number) {
    this._accountService.getListAccountByIdPeriod(idPeriodReceived).subscribe(
      response => {
        this.accountListReceived = response;
        this.catchAccountParent();
        this.catchAccountChilds();
      },
      error => {
        console.log(error);
        //Swal.fire("","No se obtuvo datos del periodo buscado","error");
      }
    );
  }

  confirmAccount() {
    this._accountService.confirmAccountStatus(this.period.id).subscribe(
      response => {
        Swal.fire("",response.message,response.status);
        this.getAllAccountByPeriodSelected(this.period.id);
      },
      error => {
        Swal.fire(error.error.title,error.error.message,error.error.status);
      }
    );
  }

  deleteConfirmAccount(account: AccountModel) {

    let textMessage = "Se elminará por completo la subcuenta seleccionada";
    if(account.accountType.id== 1)
        textMessage = "Se eliminarán por completo todas las cuentas creadas.";
    
    Swal.fire({
      title: 'Estás seguro?',
      text: textMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAccount(account)
      }
    })
    
  }

  deleteAccount(account: AccountModel) {
    this._accountService.deleteAccount(account.id).subscribe(
      response => {
        Swal.fire(response.title, response.message, response.status);
        this.getAllAccountByPeriodSelected(this.period.id);
      },
      error => {
        console.log(error);
        Swal.fire(error.error.title, error.error.message, error.error.status);
        this.getAllAccountByPeriodSelected(this.period.id);
      }
    );
  }

  showFormularyRegisterOrUpdate(order: any, object: any) {
    this.flagFormulario = true;
    this.dataStructure.title = CONSTANTES.CONST_CUENTAS;
    this.dataStructure.component = CONSTANTES.CONST_CUENTAS;
    this.dataStructure.action = CONSTANTES.CONST_TEXT_BTN_REGISTRAR;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_CUENTAS;
    this.dataStructure.object = new AccountModel();

    if(object == 'parent') {
      this.dataStructure.object.accountName = "Principal";
    }

    if(object == 'child') {
      this.dataStructure.object.accountType.id = 2;
    }

    if(order == 'Actualizar') {
      this.dataStructure.action = CONSTANTES.CONST_TEXT_BTN_ACTUALIZAR;
      this.dataStructure.object = object;
    }
  }

  redirectToTransfer(titleTransferInternOrExtern: string, object: any) {
    this.flagFormulario = true;
    this.dataStructure.title = titleTransferInternOrExtern;
    this.dataStructure.component = titleTransferInternOrExtern;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_TRANSFERENCIA;

    this.transferObject.accountDestiny = object;
    this.transferObject.accountOrigin = new AccountModel();
    this.transferObject.amount = "",
    this.transferObject.createDate = new Date();
    this.transferObject.period = object.period;
    this.transferObject.reason = "";
    this.transferObject.typeEntryExtern = false; //Extern

    this.dataStructure.object = this.transferObject;
    this.dataStructure.action = 'Transferir';

    if(titleTransferInternOrExtern=='Transferencia interna') {
      this.transferObject.typeEntryExtern = true; //Intern
      this.dataStructure.listAccoutOrigen = this.accountListChildsShow.filter(item => {
        return item.id != object.id; 
      });

      this.dataStructure.listAccoutOrigen.push(this.accountParentShow);
    }
  }

  receiveToSonComponent(dataStructureReceived:any) {
    this.flagFormulario = false;

    if(dataStructureReceived == null) return;
    this._loadSpinnerService.hideSpinner();

    //Transfer
    if(dataStructureReceived.component != CONSTANTES.CONST_CUENTAS) {
      this.registerTransference(dataStructureReceived.object);
      return;
    }
    //Cuentas
    if(dataStructureReceived.object.id == 0){
      this.registerAccount(dataStructureReceived.object);
    } else {
      this.updateAccount(dataStructureReceived.object);
    }
  }

  registerTransference(transferToSave: TransferenciaModel) {

    this._accountService.saveTransferenceAccount(transferToSave).subscribe(
      (response :any)=> {
        Swal.fire(response.title,response.message,response.status);
        this.getAllAccountByPeriodSelected(response.object.period.id);
        this.sendUpdateAmountInitialHeader.emit(response.object);
      },
      error => {
        console.log(error);
        Swal.fire(error.error.title,error.error.message,error.error.status);
        this.getAllAccountByPeriodSelected(this.period.id);
      }
    );
  }


}
