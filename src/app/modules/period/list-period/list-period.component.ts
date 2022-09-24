import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Workspace } from '@data/models/business/workspace.model';
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

  workspace: Workspace = new Workspace();
  period: PeriodModel = new PeriodModel();
  listPeriodDetailHeader: PeriodDetailHeader[] =[];
  flagShowBtn: boolean = true;

  @ViewChild('idFormShared') idFormShared: ElementRef | any;

  constructor(
    private _periodService: PeriodService,
    private _route: Router,
    private _renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.getSizeBloclListPeriod();   
  }

  ngOnInit(): void {
    this.workspace = JSON.parse(localStorage.getItem("lcstrg_worskpace")!);
    this.getAllDataCardPeriod();
  }

  initializerPeriod() {
    this.period.workSpace = this.workspace;
    this._periodService.savePeriod(this.period).subscribe(
      response => {
        console.log(response);
        this._periodService.saveToLocalStorage(response.object);
        Swal.fire("Éxito","Se inicializó el periodo correctamente","success");
        this._route.navigate(["/period/period-detail/"+response.object.id]);
      },
      error => {
        Swal.fire("Error","Ocurrió un error al inicializar el periodo, inténtelo nuevamente","error");
        this._route.navigate(["/period"]);
      }
    );
  }

  getAllDataCardPeriod() {
    //Obtiene lista de periodos.
    this._periodService.getAllPeriodDetailHeaderByWorkspaceId(this.workspace.id).subscribe(
      response => {
        this.listPeriodDetailHeader = response;
        if(this.listPeriodDetailHeader.length == 0) {
          this.flagShowBtn = false;
        }
        this.getSizeBloclListPeriod();
      },
      error => {
          console.log(error);
          Swal.fire("","Error al obtener la lista de periodos","error");
          this._route.navigate(["/"]);
      }
    );
  }

  redirectToDetailPeriod( idPeriod: number) {
    this._route.navigate(['period/period-detail/' + idPeriod]);
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
    }, 10);
   
  }


}
