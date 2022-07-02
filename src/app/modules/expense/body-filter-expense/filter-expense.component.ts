import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-expense',
  templateUrl: './filter-expense.component.html',
  styleUrls: ['./filter-expense.component.css']
})
export class FilterExpenseComponent implements OnInit {

  title: string= "";
  active_menu_click: boolean = false;
  showTranslate: boolean = false;
  showFormularioFilter:boolean=false;

  @Input("receivedHeightHeaderToBody") receivedHeightHeaderToBody:string = "";
  constructor() { }

  ngOnInit(): void {
  }

  ReceivedgHiddenMenuNow(e:any) {
      this.showTranslate = false;
      setTimeout(()=> {
        this.showFormularioFilter = false;
      },300);
  }

  showFormFilter(sendTo: string) {
    this.title = sendTo;
    this.active_menu_click = true;
    this.showFormularioFilter = true;

    setTimeout(()=> {
      this.showTranslate = true;
    },100);
  }

}
