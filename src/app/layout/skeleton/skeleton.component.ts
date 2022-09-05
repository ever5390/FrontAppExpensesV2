import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeriodModel } from '@data/models/business/period.model';
import { Workspace } from '@data/models/business/workspace.model';
import { PeriodService } from '@data/services/period/period.service';
import { UserService } from '@data/services/user/user.service';
import { WorkspacesService } from '@data/services/workspace/workspaces.service';
import { UtilService } from '@shared/services/util.service';
import { OwnerModel } from 'app/data/models/business/owner.model';
import Swal from 'sweetalert2';
import { interval } from 'rxjs';


@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent implements OnInit {

  active_menu_click: boolean = false;
  showAside: boolean = false;
  jsonOwner : OwnerModel = new OwnerModel();
  showBody: boolean = false;

  owner : OwnerModel = new OwnerModel();
  wrkspc: Workspace = new Workspace();
  period : PeriodModel = new PeriodModel();
  dateFinalAutomaticCatch: Date = new Date();

  constructor(
    private _router: Router,
    private _usuarioService: UserService,
    private _periodService: PeriodService,
    private _workspaceService: WorkspacesService
  ) { 
  }

  ngOnInit(): void {
    if(!this._usuarioService.isAuthenticated()) {
      this._router.navigate(['/login']);
      return;
    } 
    
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.getAllWorkspaceByOwnerId();
    
  }

getAllWorkspaceByOwnerId() {
    this._workspaceService.getAllWorkspaceByOwnerId(this.owner.id).subscribe(
      response => {
        this.wrkspc = response.filter( item => item.active == true)[0];
        localStorage.setItem("lcstrg_worskpace", JSON.stringify(this.wrkspc));
        this.getAllPeriodsByWorskpaceId();

      }, error => {
        console.log(error);
      }
    );
  }

  getAllPeriodsByWorskpaceId() {
    //Obtiene lista de periodos.
    this._periodService.getAllPeriodaByWorkspace(this.wrkspc.id).subscribe(
      response => {
        if(response.length != 0){ 
          this.period = response.filter( item => item.statusPeriod == true)[0];
          if(this.period.id != null){
            this._periodService.saveToLocalStorage(this.period);
            this.compareFinalDatePeriodAutomaticBySecond();
          } else {
            this._router.navigate(["/dashboard/period-list"]);
          }
        }

        this.showBody = true;
      },
      error => {
          console.log(error);
          Swal.fire("","Error al obtener la lista de periodos","error");
      }
    );
}

compareFinalDatePeriodAutomaticBySecond() {
  if(this.period != null && this.period.activate == true && (this.dateFinalAutomaticCatch.getTime() > new Date(this.period.finalDate).getTime())){
    Swal.fire("","Su periodo ha finalizado, modifique su fecha de cierre o cierre de forma manual para continuar con el registro de gastos.","info");
    this._router.navigate(["/dashboard/period-detail/"+this.period.id]);
  }

  const intervalCompareFinalDate = interval(1000);
  intervalCompareFinalDate.subscribe(
    (n) => {
      this.dateFinalAutomaticCatch = new Date();
      this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
      console.log(new Date(this.dateFinalAutomaticCatch.getFullYear(), this.dateFinalAutomaticCatch.getMonth(), this.dateFinalAutomaticCatch.getDate(),
      this.dateFinalAutomaticCatch.getHours(), this.dateFinalAutomaticCatch.getMinutes(), this.dateFinalAutomaticCatch.getSeconds()) +"---"+
      new Date(new Date(this.period.finalDate).getFullYear(), new Date(this.period.finalDate).getMonth(), new Date(this.period.finalDate).getDate(),
      new Date(this.period.finalDate).getHours(), new Date(this.period.finalDate).getMinutes(), new Date(this.period.finalDate).getSeconds()));

      if(this.dateFinalAutomaticCatch.getFullYear() == new Date(this.period.finalDate).getFullYear() &&
         this.dateFinalAutomaticCatch.getMonth() == new Date(this.period.finalDate).getMonth() && 
         this.dateFinalAutomaticCatch.getDate() == new Date(this.period.finalDate).getDate() && 
         this.dateFinalAutomaticCatch.getHours() == new Date(this.period.finalDate).getHours() &&
         this.dateFinalAutomaticCatch.getMinutes() == new Date(this.period.finalDate).getMinutes() &&
         this.dateFinalAutomaticCatch.getSeconds() == new Date(this.period.finalDate).getSeconds()) {
          this.actionConfirmPrevClosePeriod();
      }
  })
}

actionConfirmPrevClosePeriod() {
  Swal.fire({
    title: '',
    text: "El periodo finalizó, presiona en confirmar para darlo por cerrado y aperturar un nuevo periodo, caso contrario modifique su fecha de cierre.",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Modificar fecha de cierre',
    confirmButtonText: 'Confirmar cierre!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.closePeriodAtomatic();
    } else {
      this._router.navigate(["/dashboard/period-detail/"+this.period.id]);
      Swal.fire("","Presione en modificar fecha de cierre para continuar con su registro de gastos.","info");
    }
  })
}

closePeriodAtomatic() {
  this._periodService.closePeriod(this.period).subscribe(
    response => {
      Swal.fire(response.title, response.message,response.status);
      this._periodService.saveToLocalStorage(response.object);
      this._router.navigate(["/dashboard/period-list"]);
    }, 
    error => {
      console.log(error);
      if(error.error.status == "info"){
        Swal.fire(error.error.title, error.error.message,error.error.status);
        this._router.navigate(["/dashboard/period-detail/"+this.period.id]);
      }
      Swal.fire(error.error.title, error.error.message,error.error.status);
    }
  );
}

ReceivedshowMenuNow(event: boolean) {
    this.showAside = true;
    setTimeout(() => {
      this.active_menu_click = event;
    }, 50);
}

ReceivedgHiddenMenuNow(event: boolean) {
    this.active_menu_click = event;
    setTimeout(() => {
      this.showAside = false;
    }, 1000);
  }
}
