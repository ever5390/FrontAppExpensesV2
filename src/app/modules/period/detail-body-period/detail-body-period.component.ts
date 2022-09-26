import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountClosedStructure } from '@data/models/Structures/data-account.model';
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
    private _accountService: AccountService,
    private _loaderService: SLoaderService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this._loaderService.hideSpinner();
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

  getAllAccountByPeriodSelected(idPeriodReceived: number) {
    this._accountService.getListAccountByIdPeriod(idPeriodReceived).subscribe(
      response => {
        this._loaderService.hideSpinner();
        this.accountListReceived = response;
        this.catchAccountParent();
        this.catchAccountChilds();
      },
      error => {
        console.log(error);
        this._loaderService.hideSpinner();
        this._router.navigate(["/period"]);
      }
    );
  }

  confirmAccount() {
    this._loaderService.showSpinner();
    this._accountService.confirmAccountStatus(this.period.id).subscribe(
      response => {
        Swal.fire("",response.message,response.status);
        this.getAllAccountByPeriodSelected(this.period.id);
      },
      error => {
        this._loaderService.hideSpinner();
        Swal.fire(error.error.title,error.error.message,error.error.status);
      }
    );
  }

  deleteConfirmAccount(account: AccountModel) {
    this._loaderService.showSpinner();
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
    this._loaderService.hideSpinner();
    
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
    this.dataStructure.object.statusAccount = this.accountParentShow.statusAccount;

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

  receiveToSonComponent(response:any) {
    this.flagFormulario = false;
    if(response == null) return;
    this.getAllAccountByPeriodSelected(response.object.period.id);
    this.sendUpdateAmountInitialHeader.emit(response.object);
  }

}
