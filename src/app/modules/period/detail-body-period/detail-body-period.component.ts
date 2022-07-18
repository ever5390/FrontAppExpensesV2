import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { CONSTANTES } from 'app/data/constantes';
import { AccountModel } from 'app/data/models/business/account.model';
import { PeriodModel } from 'app/data/models/business/period.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { AccountService } from 'app/data/services/account/account.service';
import { Console } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-body-period',
  templateUrl: './detail-body-period.component.html',
  styleUrls: ['./detail-body-period.component.css']
})
export class DetailBodyPeriodComponent implements OnInit {


  accountParentShow: AccountModel = new AccountModel();
  accountListChildsShow: AccountModel[] = [];

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

  dataStructure: DataStructureFormShared = new DataStructureFormShared();

  @Input() accountListReceived: AccountModel[] = [];  
  @Output() sendUpdateAmountInitialHeader= new EventEmitter();

  constructor(
    private _route: Router,
    private _renderer: Renderer2,
    private _loadSpinnerService: SLoaderService,
    private _accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);

    console.log("DETAIL-ACCOUNT-PERIOD-BODY");
    console.log(this.accountListReceived);

    this.catchAccountParent();
    this.catchAccountChilds();
  }

  catchAccountChilds() {
    this.accountListChildsShow = this.accountListReceived.filter(item => {
      return item.accountType.id == 2 && item.statusAccount.toString() == this.accountParentShow.statusAccount; 
    });
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
    if(this.accountParentProcess.id == 0) {
      this.accountParentShow = this.accountParentInit;
      return;
    }

    //Caso existe ParentProcess
    if(this.accountParentClosed.id == 0) {
      this.accountParentShow = this.accountParentProcess;
      return;
    }

    //Caso exista parentCLOSED => Mostrar el parentFinal
    this.accountParentShow = this.accountParentClosed;

  }

  registerAccount(accountToSave: AccountModel) {
    accountToSave.period = this.period;
    this._accountService.createAccount(accountToSave).subscribe(
      (response :any)=> {
        Swal.fire("","Cuenta registrada con éxito","success");
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
    
    this._accountService.updateAccount(accountToSave).subscribe(
      (response :any)=> {
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
        console.log(response);
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

  showFormularyRegisterOrUpdate(order: any, object: any) {
    this.flagFormulario = true;
    this.dataStructure.title = "Cuentas";
    this.dataStructure.component = "Cuentas";
    this.dataStructure.action = CONSTANTES.CONST_TEXT_BTN_REGISTRAR;
    this.dataStructure.object = new AccountModel();
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_CUENTAS;

    if(order == 'Actualizar') {
      this.dataStructure.action = CONSTANTES.CONST_TEXT_BTN_ACTUALIZAR;
      this.dataStructure.object = object;
      console.log(this.dataStructure.object);
    }
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

  redirectToTransfer(titleTransferInternOrExtern: string, object: any) {
    this.flagFormulario = true;
    this.dataStructure.title = titleTransferInternOrExtern;
    this.dataStructure.component = titleTransferInternOrExtern;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_TRANSFERENCIA;
    this.dataStructure.object = object;
    this.dataStructure.action = 'Transferir';
  }

  receiveToSonComponent(dataStructureReceived:any) {
    console.log("RECEIVE TO FATHER FROM SHARED ACCOUNT");
    this.flagFormulario = false;
    if(dataStructureReceived == null) return;
    this._loadSpinnerService.hideSpinner();

    if(dataStructureReceived.object.id == 0){
      this.registerAccount(dataStructureReceived.object);
    } else {
      this.updateAccount(dataStructureReceived.object);
    }

  }

}
