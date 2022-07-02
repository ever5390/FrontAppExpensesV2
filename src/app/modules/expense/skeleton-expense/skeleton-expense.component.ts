import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-expense',
  templateUrl: './skeleton-expense.component.html',
  styleUrls: ['./skeleton-expense.component.css']
})
export class SkeletonExpenseComponent implements OnInit {

  sendHeightHeaderToBody: string = '';
  showBody: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }





  
  receivedHeightHeader(e:string) {
    this.sendHeightHeaderToBody = e;
    setTimeout(()=> {
      this.showBody = true;
    },100);
  }

}
