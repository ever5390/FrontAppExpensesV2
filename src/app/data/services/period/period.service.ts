import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentMethodModel } from '@data/models/business/payment-method.model';
import { UtilService } from '@shared/services/util.service';
import { URL_BASE_API_V1, URL_BASE_HOST } from 'app/config/global.url';
import { PeriodModel } from 'app/data/models/business/period.model';
import { PeriodDetailHeader } from 'app/data/models/business/periodDetailHeader.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  private URLCOMPL: string =  URL_BASE_API_V1;
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});

  constructor(private _http: HttpClient) { }

  getAllPeriodaByWorkspace(workspaceId: number): Observable<PeriodModel[]>  {
    return this._http.get(`${this.URLCOMPL}/workspace/${workspaceId}/periods`).pipe(
      map(response => response as PeriodModel[])
    );
  }

  getAllPeriodDetailHeaderByWorkspaceId(workspaceId: number): Observable<PeriodDetailHeader[]>  {
    return this._http.get(`${this.URLCOMPL}/workspace/${workspaceId}/list-period-detail`).pipe(
      map(response => response as PeriodDetailHeader[])
    );
  }

  getPeriodDetailHeaderByPeriodId(periodId: number, idOwner: number): Observable<PeriodDetailHeader>  {
    return this._http.get(`${this.URLCOMPL}/owner/${idOwner}/period/${periodId}/period-detail`).pipe(
      map(response => response as PeriodDetailHeader)
    );
  }

  updatePeriod(period: PeriodModel, idPeriod: number) : Observable<any> {
    return this._http.put<PeriodModel>(`${this.URLCOMPL}/period/${idPeriod}`,period,{ headers: this.httpHeaders})
  }

  closePeriod(period: PeriodModel) : Observable<any> {
    return this._http.post<PeriodModel>(`${this.URLCOMPL}/period/close-period`,period,{ headers: this.httpHeaders})
  }

  savePeriod(period: PeriodModel) : Observable<any> {
    return this._http.post<PeriodModel>(`${this.URLCOMPL}/period`,period,{ headers: this.httpHeaders})
  }

  saveToLocalStorage(period: PeriodModel) {
    localStorage.setItem("lcstrg_periodo", JSON.stringify(period));
  }

}
