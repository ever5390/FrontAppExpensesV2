import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-filter-expense',
  templateUrl: './filter-expense.component.html',
  styleUrls: ['./filter-expense.component.css']
})
export class FilterExpenseComponent implements OnInit {

  sendTitleMenuSecundary: string= "";



 // Show && Hidden Menu Main and Menu Secundary
  showTranslateMenuFilterMain: boolean = false;
  showTranslateMenuFilterSecundary: boolean = false;
  showMenuFilterSecundary:boolean=false;

  @Input("receivedFlagShowMenuFilterMain") receivedFlagShowMenuFilterMain:boolean = false;
  @Output() emitterFlagHiddenMenuFilterMain= new EventEmitter();
  @ViewChild("containerMenuFilterMain") containerMenuFilterMain : ElementRef | any;

  constructor(
    private _renderer: Renderer2
  ) {

    this._renderer.listen("window","click",(e: Event)=> {
      if( this.containerMenuFilterMain && e.target === this.containerMenuFilterMain.nativeElement){
        this.translateHiddenMenuFilterSecundary();
      }
    });

   }

  ngOnInit(): void {
    this.showMenuFilterMain();   
  }




  /* -- SHow Hidden Menu -- */

  showMenuFilterMain() {
    setTimeout(()=> {
      this.showTranslateMenuFilterMain = true;
    },50); 
  }

  translateHiddenMenuFilterSecundary() {
    this.showTranslateMenuFilterMain = false;
    setTimeout(()=> {
      this.receivedFlagShowMenuFilterMain = false;
      this.emitterFlagHiddenMenuFilterMain.emit(false);
    },300);
  }

  ReceivingHiddenMenuFilterSecundary(e:any) {
      this.showTranslateMenuFilterSecundary = false;
      setTimeout(()=> {
        this.showMenuFilterSecundary = false;
      },500);
  }

  showFilterMenuSecundaryByOptionSelect(titleMenuSecundaryToSend: string) {
    this.sendTitleMenuSecundary = titleMenuSecundaryToSend;
    this.showMenuFilterSecundary = true;

    setTimeout(()=> {
      this.showTranslateMenuFilterSecundary = true;
    },100);
  }

}
