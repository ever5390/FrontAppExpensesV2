import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  subject = new Subject();
  txtSearch: string = '';
  dataListToProcessAndEmitToFather: any[] = [];
  //Receive from ExpenseManager: order selected item
  @Input() receivedDataFromFather: any[] = [];
  //Send to ExpenseManager: item selected
  @Output() sendDataFromSearchToFather = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
    this.dataListToProcessAndEmitToFather = this.receivedDataFromFather;
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
        debounceTime(100)
      ).subscribe((searchText:any) => {
        this.dataListToProcessAndEmitToFather = this.receivedDataFromFather.filter(item => {
              return item.name.toUpperCase().includes(searchText.toUpperCase()) 
            }
          ); 
          this.sendDataFromSearchToFather.emit(this.dataListToProcessAndEmitToFather);                   
        }
      )
  }

  searchMethod(evt:any) {
    const searchText = evt.target.value;
    this.subject.next(searchText)
  }

}
