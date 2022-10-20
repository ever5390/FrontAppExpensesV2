import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransferenciaModel } from '@data/models/business/transferencia.model';
import { URL_BASE_API_V1, URL_BASE_HOST } from 'app/config/global.url';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransferenceService {

  private URLCOMPL: string =  URL_BASE_API_V1;

  constructor(private _http: HttpClient) { }

  getAllTransferencesByIdPeriod(periodId: number): Observable<TransferenciaModel[]>  {
    return this._http.get(`${this.URLCOMPL}/period/${periodId}/transference`).pipe(
      map(response => response as TransferenciaModel[])
    );
  }

}
