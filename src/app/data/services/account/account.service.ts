import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BASE_COMPLEMENT } from 'app/config/global.url';
import { AccountModel } from 'app/data/models/business/account.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  private URLCOMPL: string = URL_BASE_COMPLEMENT;
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(
    private _http: HttpClient
  ) { }


  getListAccountByIdPeriod(idPeriod: number): Observable<AccountModel[]> {
    return this._http.get(`${this.URLCOMPL}/list-account/period/${idPeriod}`).pipe(
      map(response => response as AccountModel[])
    );
  }

  createAccount(accountToSave: AccountModel): Observable<AccountModel> {
    return this._http.post<AccountModel>(`${this.URLCOMPL}/account`, accountToSave, {headers: this.httpHeaders});
  }

}
