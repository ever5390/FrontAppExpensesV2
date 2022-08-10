import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BASE_API_V1, URL_BASE_HOST } from 'app/config/global.url';
import { PeriodModel } from 'app/data/models/business/period.model';
import { PeriodDetailHeader } from 'app/data/models/business/periodDetailHeader.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  private URLCOMPL: string =  URL_BASE_API_V1;
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});

  constructor(private _http: HttpClient) { }

  getPeriodByWorkspaceIdAndSatusTrue(workspaceId: number): Observable<PeriodModel>  {
    return this._http.get(`${this.URLCOMPL}/period/workspace/${workspaceId}`).pipe(
      map(response => response as PeriodModel)
    );
  }

  getAllPeriodaByWorkspace(workspaceId: number): Observable<PeriodModel[]>  {
    return this._http.get(`${this.URLCOMPL}/list-period/workspace/${workspaceId}`).pipe(
      map(response => response as PeriodModel[])
    );
  }

  getAllPeriodDetailHeaderByWorkspaceId(workspaceId: number): Observable<PeriodDetailHeader[]>  {
    return this._http.get(`${this.URLCOMPL}/list-period-detail/workspace/${workspaceId}`).pipe(
      map(response => response as PeriodDetailHeader[])
    );
  }

  getPeriodDetailHeaderByPeriodId(periodId: number): Observable<PeriodDetailHeader>  {
    return this._http.get(`${this.URLCOMPL}/period-detail/${periodId}`).pipe(
      map(response => response as PeriodDetailHeader)
    );
  }








  getAllPeriodByWorkspaceId(workspaceId: number): Observable<PeriodModel[]>  {
    return this._http.get(`${this.URLCOMPL}/list-period/workspace/${workspaceId}`).pipe(
      map(response => response as PeriodModel[])
    );
  }

  // create(paymentObject: PaymentMethodModel) : Observable<any> {
  //   return this._http.post<PaymentMethodModel>(`${this.URLCOMPL}/paymentMethod`,paymentObject,{ headers: this.httpHeaders})
  // }

  // update(paymentObject: PaymentMethodModel, id: number) : Observable<any> {
  //   return this._http.put<PaymentMethodModel>(`${this.URLCOMPL}/paymentMethod/${id}`,paymentObject,{ headers: this.httpHeaders})
  // }

  // delete(id: number) : Observable<any> {
  //   return this._http.delete<PaymentMethodModel[]>(`${this.URLCOMPL}/paymentMethod/${id}`);
  // }


}
