import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from 'app/data/constantes';
import { DataStructure } from 'app/data/models/data.model';

@Component({
  selector: 'app-detail-body-period',
  templateUrl: './detail-body-period.component.html',
  styleUrls: ['./detail-body-period.component.css']
})
export class DetailBodyPeriodComponent implements OnInit {

  title:string = "";
  sendBtnText:string='';
  flagFormulario: boolean = false;

  dataStructure: DataStructure = new DataStructure();

  constructor(
    private _route: Router,
    private _renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.dataStructure.item
  }

  redirectToAccount(btnText: string) {
    this.flagFormulario = true;
    this.dataStructure.title = "Cuentas";
    this.dataStructure.item = "Cuentas";
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_CUENTAS;
    this.sendBtnText = btnText;
  }

  redirectToTransfer(titleTransferInternOrExtern: string) {
    this.flagFormulario = true;
    this.dataStructure.title = titleTransferInternOrExtern;
    this.dataStructure.item = titleTransferInternOrExtern;
    this.dataStructure.imagen = CONSTANTES.CONST_IMAGEN_TRANSFERENCIA;
    this.sendBtnText = 'Transferir';
  }

  receiveToSonComponent(e:any) {
    this.flagFormulario = false;
  }

}
