import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SLoaderService } from './service/s-loader.service';

@Component({
  selector: 'app-s-loader',
  templateUrl: './s-loader.component.html',
  styleUrls: ['./s-loader.component.css']
})
export class SLoaderComponent implements OnInit {

  constructor(
    private _router: Router,
    public _sloaderService: SLoaderService
  ) { 
      this._router.events.subscribe(
        (event) => {
          if(event instanceof NavigationStart) {
            this._sloaderService.showSpinner();
          } else if(
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
          ){
            this._sloaderService.hideSpinner();
          }
        },
        () => {
          this._sloaderService.hideSpinner();
        }
      )

  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._sloaderService.hideSpinner();
  }

}
