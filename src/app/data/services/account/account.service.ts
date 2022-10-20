import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BASE_API_V1 } from 'app/config/global.url';
import { AccountModel, TypeSatusAccountOPC } from 'app/data/models/business/account.model';
import { TransferenciaModel } from 'app/data/models/business/transferencia.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  private URLCOMPL: string = URL_BASE_API_V1;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(
    private _http: HttpClient
  ) { }


  getListAccountByIdPeriod(idPeriod: number): Observable<AccountModel[]> {
    return this._http.get(`${this.URLCOMPL}/period/${idPeriod}/accounts`).pipe(
      map(response => response as AccountModel[])
    );
  }

  createAccount(accountToSave: AccountModel): Observable<AccountModel> {
    return this._http.post<AccountModel>(`${this.URLCOMPL}/account`, accountToSave, {headers: this.httpHeaders});
  }

  confirmAccountStatus(idPeriod: number): Observable<any> {
    return this._http.get(`${this.URLCOMPL}/period/${idPeriod}/accounts/confirm-status-accounts`);
  }

  updateAccount(accountToSave: AccountModel): Observable<AccountModel> {
    return this._http.put<AccountModel>(`${this.URLCOMPL}/account/${accountToSave.id}`, accountToSave, {headers: this.httpHeaders});
  }

  deleteAccount(idAccount: number): Observable<any> {
    return this._http.delete(`${this.URLCOMPL}/account/${idAccount}`);
  }

  saveTransferenceAccount(transferToSave: TransferenciaModel): Observable<TransferenciaModel> {
    return this._http.post<TransferenciaModel>(`${this.URLCOMPL}/transference`, transferToSave, {headers: this.httpHeaders});
  }

  findAccountByTypeAccountAndStatusAccountAndPeriodId(idAccountType: number, status: TypeSatusAccountOPC, idPeriod: number): Observable<AccountModel>  {
    return this._http.get(`${this.URLCOMPL}/periodo/${idPeriod}/account/filter-account?idAccountType=${idAccountType}&status=${status}`)
    .pipe(
      map(response => response as AccountModel)
    );
    
  }
}
