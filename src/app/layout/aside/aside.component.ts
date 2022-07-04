import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  @ViewChild('aside') aside: ElementRef | any;
  @Output() hiddenMenuNow: EventEmitter<boolean> = new EventEmitter();
  @Input("active_menu") active_menu: boolean = false;
  
  constructor(
    private _renderer: Renderer2,
    private _routes: Router
  ) {

    this._renderer.listen('window','click', (e: Event)=> {
      console.log(e.target);
      if( this.aside && e.target === this.aside.nativeElement){
       
        this.hiddenMenu();
      }
    });
   }
  
  ngOnInit(): void {
  }


  redirectRoutes(destiny: string){

    switch (destiny) {
      case 'expense':
        this._routes.navigate(['/']);
        break;
      case 'expense-register':
        this._routes.navigate(['/expense-detail']);
        break;
      case 'according':
        this._routes.navigate(['/according-list']);
        break;
      case 'category':
        this._routes.navigate(['/category-list']);
        break;
      case 'paymentmethod':
        this._routes.navigate(['/payment-method-list']);
        break;
      case 'period':
        this._routes.navigate(['/period-list']);
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
