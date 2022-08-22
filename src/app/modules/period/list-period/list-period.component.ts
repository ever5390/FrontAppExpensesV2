import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@shared/services/util.service';
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


  periodReceivedFromLocalStorage: PeriodModel = new PeriodModel();
  listPeriodDetailHeader: PeriodDetailHeader[] =[];

  @ViewChild('idFormShared') idFormShared: ElementRef | any;

  constructor(
    private _periodService: PeriodService,
    private _route: Router,
    private _renderer: Renderer2,
    private _utilitariesService: UtilService
  ) {
  }

  ngAfterViewInit() {
    console.log("ngAfter");
      this.getSizeBloclListPeriod();   
  }

  ngOnInit(): void {
    this.periodReceivedFromLocalStorage = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.getAllDataCardPeriod();
  }

  getAllDataCardPeriod() {
    //Obtiene lista de periodos.
    this._periodService.getAllPeriodDetailHeaderByWorkspaceId(this.periodReceivedFromLocalStorage.workSpace.id).subscribe(
      response => {
        this.listPeriodDetailHeader = response;
        this.listPeriodDetailHeader = response.filter( item => {
          item.period.finalDate = this._utilitariesService.getDateAddHoursOffset(item.period.finalDate.toString(), "plus").toString();
          item.period.startDate = this._utilitariesService.getDateAddHoursOffset(item.period.startDate.toString(), "plus").toString();
          return item;
        });

        this.getSizeBloclListPeriod();
      },
      error => {
          console.log(error);
          Swal.fire("","Error al obtener la lista de periodos","error");
      }
    );
  }

  redirectToDetailPeriod( idPeriod: number) {
    console.log(idPeriod);
    this._route.navigate(['dashboard/period-detail/' + idPeriod]);
  }

  getSizeBloclListPeriod() {

    setTimeout(() => {
      let windowHeight = window.innerHeight;
      let heightForm = this.idFormShared.nativeElement.clientHeight;
      console.log(windowHeight + " -- " + heightForm);
      if(heightForm > (windowHeight-20)){
        this._renderer.setStyle(this.idFormShared.nativeElement,"height",(windowHeight*0.8)+"px");
        this._renderer.setStyle(this.idFormShared.nativeElement,"overflow-y","scroll");
      }
    }, 20);
   
  }


}
