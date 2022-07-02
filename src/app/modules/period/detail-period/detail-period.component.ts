import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-period',
  templateUrl: './detail-period.component.html',
  styleUrls: ['./detail-period.component.css']
})
export class DetailPeriodComponent implements OnInit {

  @ViewChild('idPeriod') idPeriod: ElementRef | any;
  
  constructor(
    private _route: Router,
    private _renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightidPeriod = this.idPeriod.nativeElement.clientHeight;
    if(heightidPeriod > (windowHeight-100)){
      this._renderer.setStyle(this.idPeriod.nativeElement,"height",(windowHeight-40)+"px");
      this._renderer.setStyle(this.idPeriod.nativeElement,"overflow-y","scroll");
    }

  }

  ngOnInit(): void {
  }

}
