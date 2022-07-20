import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PeriodModel } from 'app/data/models/business/period.model';
import { PeriodDetailHeader } from 'app/data/models/business/periodDetailHeader.model';
import { PeriodService } from 'app/data/services/period/period.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-period',
  templateUrl: './list-period.component.html',
  styleUrls: ['./list-period.component.css']
})
export class ListPeriodComponent implements OnInit {


  period: PeriodModel = new PeriodModel();
  periodDetailHeader: PeriodDetailHeader = new PeriodDetailHeader();
  listPeriodDetailHeader: PeriodDetailHeader[] =[];

  @ViewChild('idFormShared') idFormShared: ElementRef | any;

  constructor(
    private _periodService: PeriodService,
    private _route: Router,
    private _renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    this.getSizeBloclListPeriod();
  }

  ngOnInit(): void {
    this.catchPeriod();
    this.getAllDataCardPeriod();
  }

  catchPeriod() {
    if(this.period != null && this.period.id != 0) {
      this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    }
  }

  getAllDataCardPeriod() {
    //Obtiene lista de periodos.
    this._periodService.getAllPeriodDetailHeaderByWorkspaceId(this.period.workSpace.id).subscribe(
      response => {
        this.listPeriodDetailHeader = response;
      },
      error => {
          console.log(error);
          Swal.fire("","Error al obtener la lista de periodos","error");
      }
    );
  }

  redirectToDetailPeriod( idPeriod: number) {
    this._route.navigate(['/period-detail/' + idPeriod]);
  }

  getSizeBloclListPeriod() {
    let windowHeight = window.innerHeight;
    let heightForm = this.idFormShared.nativeElement.clientHeight;

    if(heightForm > (windowHeight-20)){
      this._renderer.setStyle(this.idFormShared.nativeElement,"height",(windowHeight*0.8)+"px");
      this._renderer.setStyle(this.idFormShared.nativeElement,"overflow-y","scroll");
    }
  }


}
