import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulary-register-expense-shared',
  templateUrl: './formulary-register-expense-shared.component.html',
  styleUrls: ['./formulary-register-expense-shared.component.css']
})
export class FormularyRegisterExpenseSharedComponent implements OnInit {

  show__popup: boolean = false;
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;
  
  constructor(
    private _renderer: Renderer2,
    private _router: Router
  ) {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.popup__formulario && e.target === this.popup__formulario.nativeElement){
        this.show__popup = false;
        // this._router.navigate(['/']);
      }
    });
   }


  ngOnInit(): void {
  }

  showPopUp() {
    this.show__popup = true;
  }

}
