import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-body-expense',
  templateUrl: './body-expense.component.html',
  styleUrls: ['./body-expense.component.css']
})
export class BodyExpenseComponent implements OnInit {

  @Input("receivedHeightHeaderToBody") receivedHeightHeaderToBody:string = '';
  @ViewChild('contentList') contentList: ElementRef  | any;

  constructor(
    private _renderer: Renderer2
  ) { 
  }

  ngOnInit(): void {
    

  }

  ngAfterViewInit() {
    setTimeout(()=>{      
      this._renderer.setStyle(this.contentList.nativeElement,"height", (parseInt(this.receivedHeightHeaderToBody) - 60)+"px");
      this._renderer.setStyle(this.contentList.nativeElement,"overflow-y","scroll");
    },500);
  }

}
