import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@data/services/user/user.service';
import { PeriodModel } from 'app/data/models/business/period.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {


  flagShowOptionPeriod: boolean = false;
  period : PeriodModel = new PeriodModel();

  @ViewChild('aside') aside: ElementRef | any;
  @Output() hiddenMenuNow: EventEmitter<boolean> = new EventEmitter();
  @Input("active_menu") active_menu: boolean = false;
  
  constructor(
    private _renderer: Renderer2,
    private _routes: Router,
    private _userService: UserService
  ) {

    this._renderer.listen('window','click', (e: Event)=> {
      if( this.aside && e.target === this.aside.nativeElement){
       
        this.hiddenMenu();
      }
    });
   }
  
  ngOnInit(): void {
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    if(this.period != null && this.period.id != 0) {
        this.flagShowOptionPeriod = true;     
    }
  }

  loggout() {
    Swal.fire("",`Hola ${this._userService.usuario.username}, nos vemos luego`,"info");
    this._userService.logoutSession();
    this._routes.navigate(["/"]);
  }


  redirectRoutes(destiny: string){

    switch (destiny) {
      case 'expense':
        this._routes.navigate(['/dashboard']);
        break;
      case 'expense-register':
        this._routes.navigate(['/dashboard/expense-detail']);
        break;
      case 'according':
        this._routes.navigate(['/dashboard/according-list']);
        break;
      case 'category':
        this._routes.navigate(['/dashboard/category-list']);
        break;
      case 'paymentmethod':
        this._routes.navigate(['/dashboard/payment-method-list']);
        break;
      case 'period':
        this._routes.navigate(['/dashboard/period-list']);
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
