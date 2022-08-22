import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-body-expense',
  templateUrl: './body-expense.component.html',
  styleUrls: ['./body-expense.component.css']
})
export class BodyExpenseComponent implements OnInit {

  sendListExpensesToBodyList: any[] = [];
  @Input("receivedHeightHeaderToBody") receivedHeightHeaderToBody:string = '';
  @Input("receivedListExpensesFromSkeleton") receivedListExpensesFromSkeleton:any = [];
  @ViewChild('contentList') contentList: ElementRef  | any;

  constructor(
    private _renderer: Renderer2
  ) { 
  }

  ngOnInit(): void {
    //console.log("HELLO BODY");
    //console.log(this.receivedListExpensesFromSkeleton);
    this.sendListExpensesToBodyList = this.receivedListExpensesFromSkeleton;
  }

  ngAfterViewInit() {
    setTimeout(()=>{      
      this._renderer.setStyle(this.contentList.nativeElement,"height", (parseInt(this.receivedHeightHeaderToBody) - 110)+"px");
      this._renderer.setStyle(this.contentList.nativeElement,"overflow-y","scroll");
    },500);
  }

}
