import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeriodModel } from '@data/models/business/period.model';
import { Workspace } from '@data/models/business/workspace.model';
import { PeriodService } from '@data/services/period/period.service';
import { UserService } from '@data/services/user/user.service';
import { WorkspacesService } from '@data/services/workspace/workspaces.service';
import { OwnerModel } from 'app/data/models/business/owner.model';
import Swal from 'sweetalert2';
import { interval } from 'rxjs';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { ExpensesService } from '@data/services/expenses/expenses.service';

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
    private _workspaceService: WorkspacesService,
    private _loadSpinnerService: SLoaderService,
    private _expenseService: ExpensesService,
  ) { 
  }

  ngOnInit(): void {
    //this._loadSpinnerService.showSpinner();
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    if(!this._usuarioService.isAuthenticated()) {
      this._router.navigate(['/login']);
      return;
    }
    this.getAllWorkspaceByOwnerId();
  }

  getAllWorkspaceByOwnerId() {
    this._loadSpinnerService.showSpinner();
    this._workspaceService.getAllWorkspaceByOwnerId(this.owner.id).subscribe(
      response => {
        this.wrkspc = response.filter( item => item.active == true)[0];
        localStorage.setItem("lcstrg_worskpace", JSON.stringify(this.wrkspc));
        this.getAllPeriodsByWorskpaceId();

      }, error => {
        console.log(error);
        Swal.fire("Error","Se produjo un error al ejecutar la solicitud, recargue la aplicación e intente nuevamente","error")
        this._loadSpinnerService.hideSpinner();
        this._router.navigate(["/"]);
      }
    );
  }
 
  getAllPeriodsByWorskpaceId() {
    this._periodService.getAllPeriodaByWorkspace(this.wrkspc.id).subscribe(
      response => {
        if(response.length != 0){ 
          this.period = response.filter( item => item.statusPeriod == true)[0];
          if(this.period.id != null){
            this._periodService.saveToLocalStorage(this.period);
            this.compareFinalDatePeriodAutomaticBySecond();
          } else {
            this._router.navigate(["period"]);
          }
        }
        this.showBody = true;
        this._loadSpinnerService.hideSpinner();
      },
      error => {
        this._loadSpinnerService.hideSpinner();
          Swal.fire("","Error al obtener la lista de periodos","error");
      }
    );
  }

  compareFinalDatePeriodAutomaticBySecond() {
    if(this.period != null && this.period.activate == true && this.period.statusPeriod == true && (this.dateFinalAutomaticCatch.getTime() > new Date(this.period.finalDate).getTime())){
      Swal.fire("","Su periodo ha finalizado, modifique su fecha de cierre o cierre de forma manual para continuar con el registro de gastos.","info");
      this._router.navigate(["period/period-detail/"+this.period.id]);
    }

    const intervalCompareFinalDate = interval(1000);
    intervalCompareFinalDate.subscribe(
      (n) => {
        this.dateFinalAutomaticCatch = new Date();
        this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
        if(this.period != null  && this.dateFinalAutomaticCatch.getFullYear() == new Date(this.period.finalDate).getFullYear() &&
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
        this.validExpensesStatusPayInPeriod("automatic");
      } else {
        this._router.navigate(["period/period-detail/"+this.period.id]);
        Swal.fire("","Presione en modificar fecha de cierre para continuar con su registro de gastos.","info");
      }
    })
  }

  validExpensesStatusPayInPeriod(originAction: string) {
    this._loadSpinnerService.showSpinner();
    this._expenseService.getAllExpensesWithStatusPayEqualsTrueByPeriodid(this.period.id).subscribe(
      response => {
        if(response.length > 0) {
          this.confirmationExpensePendingPay(originAction);
          return;
        }
        this.closePeriod();
      },
      error => {
        Swal.fire("","Ocurrió un error inesperado al intentar validar gastos pendientes previo cierre de periodo","error");
      }
    );
  }

  closePeriod() {
    this._periodService.closePeriod(this.period).subscribe(
      response => {
        this._loadSpinnerService.hideSpinner();
        Swal.fire(response.title, response.message,response.status);
        this._periodService.saveToLocalStorage(response.object);
        this._router.navigate(["/period"]);
      }, 
      error => {
        this._loadSpinnerService.hideSpinner();
        Swal.fire(error.error.title, error.error.message,error.error.status);
      }
    );
  }

  confirmationExpensePendingPay(originAction: string){
    Swal.fire({
      title: '',
      text: " Se encontraron gasto pendientes de pago en este periodo ¿Desea continuar con el cierre?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closePeriod();
      }
      this._loadSpinnerService.hideSpinner();
    })
    
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

  ReceivingAsideAction(objectSendExpenses: any) {
    this.showBody = false;
    this.getAllWorkspaceByOwnerId();
    this._router.navigate(['/']);
  }

  ReceivingHeaderAction(objectSendExpenses: any) {
    this.showBody = false;
    this.getAllWorkspaceByOwnerId();
    this._router.navigate(['/']);
  }

}
