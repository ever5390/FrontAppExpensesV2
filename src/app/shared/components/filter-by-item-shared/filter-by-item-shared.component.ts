import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterExpensesModel } from '@data/models/Structures/data-object-filtering.model';
import { UtilService } from '@shared/services/util.service';

@Component({
  selector: 'app-filter-by-item-shared',
  templateUrl: './filter-by-item-shared.component.html',
  styleUrls: ['./filter-by-item-shared.component.css']
})
export class FilterByItemSharedComponent implements OnInit {

  flagShowSelectGroup: boolean = true;
  flagShowSearch: boolean = true;
  activeOnChange: boolean = false;
  listResumens: FilterExpensesModel[] = [];

  @Input() title = "";
  @Input() active_menu: boolean = false;
  @Input() receivedListSendFilterBytemResume: FilterExpensesModel[] = [];
  @Output() reditectToMenu: EventEmitter<boolean> = new EventEmitter();
  @Output() listendFather: EventEmitter<any> = new EventEmitter();
  
  constructor(
    private _utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.listResumens = this. receivedListSendFilterBytemResume;
    this.showBlockSearchOrGroupSelect();
  }

  translateHiddenMenuFilterSecundary() {
    console.log(this.listResumens);
    this.active_menu = false;
    setTimeout(()=> {
      this.reditectToMenu.emit(false);
    },300);
  }

  showBlockSearchOrGroupSelect() {
    if(this.title != "Categorías") {
      this.flagShowSelectGroup = false;
    }

    if(this.title == "Métodos de Pago" || this.title == "Acuerdos") {
      this.flagShowSearch = false;
    }
  }

  onChangeItemResume(event: any) {
    this.activeOnChange = true;
    const idItemResumenSELECETED = event.target.value;
    const isChecked = event.target.checked;
    let itemFound: FilterExpensesModel = new FilterExpensesModel();
    this.listResumens = this.receivedListSendFilterBytemResume.map((itemRes) => {
        if(itemRes.id == idItemResumenSELECETED) {
          
          itemRes.active = isChecked;
          itemFound = itemRes;
          return itemRes;
        }
       return itemRes;
    });
    this.listendFather.emit(this.listResumens);
    //let listActive = this.listResumens.filter( itemActive => itemActive.active === true);
    //console.log(listActive);
    //this._utilService.sendItemResumeSelected(listActive);
    this._utilService.sendItemResumeSelected(this.listResumens);
    // this._utilService.sendItemResumeSelected({
    //   id:idItemResumenSELECETED,
    //   component:this.receivedListSendFilterBytemResume[0].component
    // });

  }

  itemResumeSelected(itemResume: any) {
    console.log("intemSend");
    this._utilService.sendItemResumeSelected(itemResume);
    return;
  }

}
