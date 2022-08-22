import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PeriodModel } from '@data/models/business/period.model';
import { Workspace } from '@data/models/business/workspace.model';
import { PeriodService } from '@data/services/period/period.service';
import { UserService } from '@data/services/user/user.service';
import { WorkspacesService } from '@data/services/workspace/workspaces.service';
import { UtilService } from '@shared/services/util.service';
import { OwnerModel } from 'app/data/models/business/owner.model';
import Swal from 'sweetalert2';

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

  constructor(
    private _router: Router,
    private _usuarioService: UserService,
    private _periodService: PeriodService,
    private _utilitariesService: UtilService,
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
        console.log(this.wrkspc);
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
