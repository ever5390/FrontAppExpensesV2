import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-body-period',
  templateUrl: './detail-body-period.component.html',
  styleUrls: ['./detail-body-period.component.css']
})
export class DetailBodyPeriodComponent implements OnInit {

  title:string = "";
  sendBtnText:string='';
  flagFormulario: boolean = false;

  constructor(
    private _route: Router,
    private _renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
  }

  redirectToAccount(btnText: string) {
    this.flagFormulario = true;
    this.title = "cuenta";
    this.sendBtnText = btnText;
  }

  redirectToTransfer(origin: string) {
    this.flagFormulario = true;
    this.title = origin;
    this.sendBtnText = 'Transferir';
  }

  receiveToSonComponent(e:any) {
    this.flagFormulario = false;
  }

}
