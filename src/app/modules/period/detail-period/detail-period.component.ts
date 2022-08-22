import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AccountModel } from 'app/data/models/business/account.model';
import { PeriodDetailHeader } from 'app/data/models/business/periodDetailHeader.model';
import { AccountService } from 'app/data/services/account/account.service';
import { PeriodService } from 'app/data/services/period/period.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-period',
  templateUrl: './detail-period.component.html',
  styleUrls: ['./detail-period.component.css']
})
export class DetailPeriodComponent implements OnInit {

  flagShowHeader: boolean = false;
  flagShowBody: boolean = false;
  blockAccount: boolean = false;

  periodDetailHeaderSend: PeriodDetailHeader = new PeriodDetailHeader();
  accountListSend: AccountModel[] = [];

  @ViewChild('idPeriod') idPeriod: ElementRef | any;
  
  constructor(
    private _accountService: AccountService,
    private _rutaActiva: ActivatedRoute,
    private _renderer: Renderer2,
    private _periodService: PeriodService
  ) {
  }

  ngAfterViewInit() {
    //this.getSizeBloclListPeriod();
  }

  ngOnInit(): void {

    this._rutaActiva.params.subscribe(
      (params: Params) => {
        if(params.idPeriod != undefined) {
          let idPeriodReceivedFromListPeriod = params.idPeriod;
          this.getAllDataCardPeriod(idPeriodReceivedFromListPeriod);
        }
      }
    );

  }
  
  validateShowBlockAccounts() {
    this.blockAccount = true;
    if(!this.periodDetailHeaderSend.period.statusPeriod && this.accountListSend.length == 0) {
      this.blockAccount = false;
      return;
    }
  }

  getAllDataCardPeriod(idPeriodReceived: number) {
    //Obtiene lista de periodos.
    this.flagShowHeader = false;
    this._periodService.getPeriodDetailHeaderByPeriodId(idPeriodReceived).subscribe(
      response => {
        this.periodDetailHeaderSend = response;
        this.flagShowHeader = true;
        this.getAllAccountByPeriodSelected(this.periodDetailHeaderSend.period.id);
      },
      error => {
          console.log(error);
          Swal.fire("","No se obtuvo datos del periodo buscado","error");
      }
    );
  }


  getAllAccountByPeriodSelected(idPeriodReceived: number) {
    this._accountService.getListAccountByIdPeriod(idPeriodReceived).subscribe(
      response => {
        console.log(response);
        this.accountListSend = response;
        this.flagShowBody = true;
        this.validateShowBlockAccounts();
      },
      error => {
        console.log(error);
      }
    );
  }

  receivedUpdateAmountInitialHeader(object: any) {
    this.getAllDataCardPeriod(object.period.id);
  }

  getSizeBloclListPeriod() {
    let windowHeight = window.innerHeight;
    let heightidPeriod = this.idPeriod.nativeElement.clientHeight;
    if(heightidPeriod > (windowHeight-100)){
      this._renderer.setStyle(this.idPeriod.nativeElement,"height",(windowHeight-50)+"px");
      this._renderer.setStyle(this.idPeriod.nativeElement,"overflow-y","scroll");
    }
  }
}
