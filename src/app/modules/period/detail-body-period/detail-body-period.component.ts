import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from 'app/data/constantes';
import { AccountModel } from 'app/data/models/business/account.model';
import { DataStructureListShared } from 'app/data/models/data.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';

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


  title:string = "";
  sendBtnText:string='';
  flagFormulario: boolean = false;

  dataStructure: DataStructureFormShared = new DataStructureFormShared();

  @Input() accountListReceived: AccountModel[] = [];

  constructor(
    private _route: Router,
    private _renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    console.log("DETAIL-ACCOUNT-PERIOD-BODY");
    console.log(this.accountListReceived);

    this.catchAccountParent();

    this.accountListChildsShow = this.accountListReceived.filter(item => {
      return item.accountType.id == 2 && item.statusAccount.toString() == this.accountParentInit.statusAccount; 
    });

    // this.accountListChildsInit = this.accountListReceived.filter(item => {
    //   return item.accountType.id == 2 && item.statusAccount.toString() == 'INITIAL'; 
    // });

    // this.accountListChildsProcess = this.accountListReceived.filter(item => {
    //   return item.accountType.id == 2 && item.statusAccount.toString() == 'PROCESS'; 
    // });

    // this.accountListChildsClosed = this.accountListReceived.filter(item => {
    //   return item.accountType.id == 2 && item.statusAccount.toString() == 'CLOSED'; 
    // });
  }

  catchAccountParent() {
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

  showFormularyRegister(btnText: string) {
    this.flagFormulario = true;
    this.dataStructure.title = "Cuentas";
    this.dataStructure.component = "Cuentas";
    this.dataStructure.action = "Registrar";
    this.dataStructure.object = new AccountModel();
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_CUENTAS;
  }







  redirectToAccount(btnText: string) {
    this.flagFormulario = true;
    this.dataStructure.title = "Cuentas";
    this.dataStructure.component = "Cuentas";
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_CUENTAS;
    this.sendBtnText = btnText;
  }

  redirectToTransfer(titleTransferInternOrExtern: string) {
    this.flagFormulario = true;
    this.dataStructure.title = titleTransferInternOrExtern;
    this.dataStructure.component = titleTransferInternOrExtern;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_TRANSFERENCIA;
    this.sendBtnText = 'Transferir';
  }

  receiveToSonComponent(e:any) {
    this.flagFormulario = false;
  }

}
