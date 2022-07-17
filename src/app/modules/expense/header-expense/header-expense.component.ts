import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { PeriodModel } from 'app/data/models/business/period.model';

@Component({
  selector: 'app-header-expense',
  templateUrl: './header-expense.component.html',
  styleUrls: ['./header-expense.component.css']
})
export class HeaderExpenseComponent implements OnInit {

  
  period: PeriodModel = new PeriodModel();

  @Input() totalGastadoReceived: number = 0.00;


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
    if(this.period != null && this.period.id != 0) {
      this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    }

     console.log(this.period);
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
