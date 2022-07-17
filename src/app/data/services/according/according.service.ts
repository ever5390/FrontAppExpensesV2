import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BASE_HOST, URL_BASE_COMPLEMENT } from 'app/config/global.url';
import { AccordingModel } from 'app/data/models/business/according.model';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccordingService {

  private URLCOMPL: string =  URL_BASE_COMPLEMENT;
  private httHeaders = new HttpHeaders({'Content-type':'appilcation/json'});

  constructor(private _http: HttpClient) { }

  getAllAccording(): Observable<AccordingModel[]>  {
    return this._http.get(`${this.URLCOMPL}/according`)
    .pipe(
      map(response => response as AccordingModel[])
    );
  }
}


