import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.css']
})
export class SearchingComponent implements OnInit {

  subject = new Subject();
  //Show component menu
  sendFlagShowMenuFilterMain: boolean = false;
  @Output() emitterSearching= new EventEmitter();
  @Input("receivedListExpensesFromSkeleton") receivedListExpensesFromSkeleton:any = [];
  constructor() { }

  ngOnInit(): void {
    this.searchActivateFunction();
  }

  searchActivateFunction() {
    //Deprecated in v.6 , deleting in futures versions
    // this.search.valueChanges.pipe(
    //   debounceTime(200) // Cuando pare de escribir pasen 300 ms recíen enviará .
    // ).subscribe((value:string) => {
    //       this.listaShared = this.dataStructureListReceived.lista.filter(item => {
    //         return item.name.toUpperCase().includes(value.toUpperCase()) 
    //       }
    //       );                    
    //   }
    // )
      this.subject.pipe(
        debounceTime(200)
      ).subscribe((searchText:any) => {
          
          this.emitterSearching.emit(searchText);
        }
      )
  }

  searchMethod(evt:any) {
    const searchText = evt.target.value;
    this.subject.next(searchText)
  }

  //Show and catching menu y height
  showMenuOptions() {
    this.sendFlagShowMenuFilterMain = true;
  }

  receivingFlagHiddenMenuFilterMain(hidden: boolean) {
    this.sendFlagShowMenuFilterMain = hidden;
  }

}
