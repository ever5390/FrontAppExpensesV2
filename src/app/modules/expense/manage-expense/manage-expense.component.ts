import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.css']
})
export class ManageExpenseComponent implements OnInit {

  show__popup: boolean = true;
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;
  
  constructor(
    private _renderer: Renderer2,
    private _router: Router
  ) {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.popup__formulario && e.target === this.popup__formulario.nativeElement){
        this._router.navigate(['/']);
      }
    });
   }

  ngOnInit(): void {
  }

  showPopUp(){
    
  }

}
