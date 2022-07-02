import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-by-item-shared',
  templateUrl: './filter-by-item-shared.component.html',
  styleUrls: ['./filter-by-item-shared.component.css']
})
export class FilterByItemSharedComponent implements OnInit {

  flagShowSelectGroup: boolean = true;
  flagShowSearch: boolean = true;

  @Input() title = "";
  @Input() active_menu: boolean = false;
  @Output() reditectToMenu: EventEmitter<boolean> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {

    this.showBlockSearchOrGroupSelect();
  }



  redirectToMenuExpense() {
    this.reditectToMenu.emit(false);
  }

  showBlockSearchOrGroupSelect() {
    if(this.title != "Categorías") {
      this.flagShowSelectGroup = false;
    }

    if(this.title == "Métodos de Pago" || this.title == "Acuerdos") {
      this.flagShowSearch = false;
    }
  }

}
