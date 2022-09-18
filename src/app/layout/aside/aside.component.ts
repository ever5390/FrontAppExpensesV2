import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OwnerModel } from '@data/models/business/owner.model';
import { Workspace } from '@data/models/business/workspace.model';
import { UserService } from '@data/services/user/user.service';
import { WorkspacesService } from '@data/services/workspace/workspaces.service';
import { PeriodModel } from 'app/data/models/business/period.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {


  flagShowOptionPeriod: boolean = false;
  owner : OwnerModel = new OwnerModel();
  wrkspc: Workspace = new Workspace();
  period : PeriodModel = new PeriodModel();

  @ViewChild('aside') aside: ElementRef | any;
  @Output() hiddenMenuNow: EventEmitter<boolean> = new EventEmitter();
  @Input("active_menu") active_menu: boolean = false;
  @Output() redirectToParent: EventEmitter<boolean> = new EventEmitter();
  
  constructor(
    private _renderer: Renderer2,
    private _routes: Router,
    private _userService: UserService,
    private _workspaceService: WorkspacesService
  ) {

    this._renderer.listen('window','click', (e: Event)=> {
      if( this.aside && e.target === this.aside.nativeElement){
       
        this.hiddenMenu();
      }
    });
   }
  
  ngOnInit(): void {
    this.wrkspc = JSON.parse(localStorage.getItem('lcstrg_worskpace')!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.owner = this.wrkspc.owner;
    // this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    if(this.period != null && this.period.id != 0) {
        this.flagShowOptionPeriod = true;
    }

  }


  loggout() {
    Swal.fire("",`Hola ${this.owner.username}, nos vemos luego`,"info");
    this._userService.logoutSession();
    this._routes.navigate(["/login"]);
  }


  redirectRoutes(destiny: string){

    switch (destiny) {
      case 'workspace':
        this.redirectToParent.emit();
        break;
      case 'according':
        this._routes.navigate(['/according']);
        break;
      case 'category':
        this._routes.navigate(['/category']);
        break;
      case 'paymentmethod':
        this._routes.navigate(['/payment-method']);
        break;
      case 'period':
        this._routes.navigate(['/period']);
        break;
      default:
        break;
    }

    this.hiddenMenu();
  }

  hiddenMenu() {
    this.active_menu = false;
    this.hiddenMenuNow.emit(false);
  }


}
