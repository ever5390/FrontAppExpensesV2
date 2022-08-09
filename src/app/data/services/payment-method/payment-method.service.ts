import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BASE_API_V1, URL_BASE_HOST } from 'app/config/global.url';
import { PaymentMethodModel } from 'app/data/models/business/payment-method.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private URLCOMPL: string =  URL_BASE_API_V1;
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});

  constructor(private _http: HttpClient) { }

  getAllPaymentMethod(): Observable<PaymentMethodModel[]>  {
    return this._http.get(`${this.URLCOMPL}/paymentMethod/owner/1`)
    .pipe(
      map(response => response as PaymentMethodModel[])
    );
  }

  create(paymentObject: PaymentMethodModel) : Observable<any> {
    return this._http.post<PaymentMethodModel>(`${this.URLCOMPL}/paymentMethod`,paymentObject,{ headers: this.httpHeaders})
  }

  update(paymentObject: PaymentMethodModel, id: number) : Observable<any> {
    return this._http.put<PaymentMethodModel>(`${this.URLCOMPL}/paymentMethod/${id}`,paymentObject,{ headers: this.httpHeaders})
  }

  delete(id: number) : Observable<any> {
    return this._http.delete<PaymentMethodModel[]>(`${this.URLCOMPL}/paymentMethod/${id}`);
  }


}
