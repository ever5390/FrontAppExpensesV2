import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SLoaderService {

  public isSpinnerVisible = true;

  showSpinner() {
    this.isSpinnerVisible =  true;
  }

  hideSpinner() {
    this.isSpinnerVisible =  false;
  }

  hideSlow(t:number = 1000) {
    setTimeout(
      ()=> {
        this.hideSpinner()
      },t
    );
  }
}
