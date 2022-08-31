import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationExpense } from '@data/models/business/notificationExpense.model';
import { URL_BASE_API_V1 } from 'app/config/global.url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationExpenseService {

  private URLCOMPL: string = URL_BASE_API_V1;
  private httpHeaders =  new HttpHeaders({'Content-type':'application/json'});
  private _notificationExpense: NotificationExpense | undefined;

  public get notificationExpense(): NotificationExpense {
    if(this._notificationExpense != null && this._notificationExpense != undefined ) {
      return this._notificationExpense;
    }
    return new NotificationExpense();
  }

  
  constructor(
    private _http: HttpClient
    ) { }
    
    guardarNotificationExpense(notificationReq: NotificationExpense) : void {
      this._notificationExpense = notificationReq;
    }
  
  getAllNotificationByTypeUserAndUserId(idUser: number) : Observable<NotificationExpense[]> {
    return this._http.get<NotificationExpense[]>(`${this.URLCOMPL}/notification/owner?idUser=${idUser}`);
  }

  updateStatusNotificationExpense(notificationUpdate: NotificationExpense) : Observable<any>  {
    return this._http.put(`${this.URLCOMPL}/notification`,notificationUpdate,{ headers: this.httpHeaders})
  }

}
