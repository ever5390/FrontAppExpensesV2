import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-period',
  templateUrl: './list-period.component.html',
  styleUrls: ['./list-period.component.css']
})
export class ListPeriodComponent implements OnInit {

  @ViewChild('idFormShared') idFormShared: ElementRef | any;

  constructor(
    private _route: Router,
    private _renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightForm = this.idFormShared.nativeElement.clientHeight;

    if(heightForm > (windowHeight-20)){
      this._renderer.setStyle(this.idFormShared.nativeElement,"height",(windowHeight*0.8)+"px");
      this._renderer.setStyle(this.idFormShared.nativeElement,"overflow-y","scroll");
    }

  }



  ngOnInit(): void {
  }

  redirectToDetailPeriod() {
    this._route.navigate(['/period-detail']);
  }

}
