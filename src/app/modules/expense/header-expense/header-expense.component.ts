import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header-expense',
  templateUrl: './header-expense.component.html',
  styleUrls: ['./header-expense.component.css']
})
export class HeaderExpenseComponent implements OnInit {

  



  //Show component menu
  sendFlagShowMenuFilterMain: boolean = false;

  //Catching & send height header component
  heightHeader: number = 0;
  @ViewChild("container_header") container_header : ElementRef | any;
  @Output() emitterHeight= new EventEmitter();
  
  constructor(
    private _renderer: Renderer2
  ) { 
  }

  ngOnInit(): void {
  }




  //Show and catching menu y height
  showMenuOptions() {
    this.sendFlagShowMenuFilterMain = true;
  }

  receivingFlagHiddenMenuFilterMain(hidden: boolean) {
    this.sendFlagShowMenuFilterMain = hidden;
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightForm = this.container_header.nativeElement.clientHeight;
    this.heightHeader=windowHeight-heightForm;
    this.emitterHeight.emit(this.heightHeader);
  }

}
