import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BASE_API_V1 } from 'app/config/global.url';
import { ExpenseModel } from 'app/data/models/business/expense.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private URLCOMPL: string = URL_BASE_API_V1;
  private httpHeaders =  new HttpHeaders({'Content-type':'application/json'});
  
  constructor(
    private _http: HttpClient
  ) { }

  getAllExpenses(dateBegin: string, dateEnd: string): Observable<ExpenseModel[]>  {
    return this._http.get(`${this.URLCOMPL}/expense?dateBegin=${dateBegin}&dateEnd=${dateEnd}`)
    .pipe(
      map(response => response as ExpenseModel[])
    );
  }

  create(expenseObject: ExpenseModel) : Observable<any> {
    return this._http.post<ExpenseModel>(`${this.URLCOMPL}/expense`,expenseObject,{ headers: this.httpHeaders})
  }


}
