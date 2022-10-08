import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BASE_API_V1 } from 'app/config/global.url';
import { ExpenseModel, Tag } from 'app/data/models/business/expense.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private URLCOMPL: string = URL_BASE_API_V1;
  private httpHeaders =  new HttpHeaders({'Content-type':'application/json'});

  private _expenseToEdit: ExpenseModel | undefined;

  public get expenseToEdit(): ExpenseModel {
    if(this._expenseToEdit != null && this._expenseToEdit != undefined ) {
      return this._expenseToEdit;
    }
    return new ExpenseModel();
  }
  
  constructor(
    private _http: HttpClient
    ) { }

  guardarExpenseToEdit(expenseReqToEdit: ExpenseModel) : void {
      this._expenseToEdit = expenseReqToEdit;
  }
    
  getAllExpensesByWorkspaceAndDateRangePeriod(idWorkspace: number, dateBegin: string, dateEnd: string): Observable<ExpenseModel[]>  {
    return this._http.get(`${this.URLCOMPL}/expense-workspace?idWorkspace=${idWorkspace}&dateBegin=${dateBegin}&dateEnd=${dateEnd}`)
      .pipe(
        map(response => response as ExpenseModel[])
        );
  }

  create(expenseObject: ExpenseModel) : Observable<any> {
    return this._http.post<ExpenseModel>(`${this.URLCOMPL}/expense`,expenseObject,{ headers: this.httpHeaders})
  }

  updateVouchersToExpense(expenseObject: ExpenseModel) : Observable<any> {
    return this._http.put<ExpenseModel>(`${this.URLCOMPL}/expense/vouchers`,expenseObject,{ headers: this.httpHeaders})
  }

  updateObjectExpense(expenseObject: ExpenseModel) : Observable<any> {
    return this._http.put<ExpenseModel>(`${this.URLCOMPL}/expense/${expenseObject.id}`,expenseObject,{ headers: this.httpHeaders})
  }
  
  getAllTagsByOwnerId(idOwner: number) : Observable<Tag[]> {
    return this._http.get<Tag[]>(`${this.URLCOMPL}/owner/${idOwner}/tag-list`);
  }
  
  updateStatusPayedExpense(idExpense: number): Observable<any> {
    return this._http.get<any>(`${this.URLCOMPL}/expense/check-pay/${idExpense}`);
  }
  
  deleteExpenseById(idExpense: number): Observable<any> {
    return this._http.delete<any>(`${this.URLCOMPL}/expense/${idExpense}`);
  }
  
  clearExpennseRegisterFromLocalStorage() {
    localStorage.removeItem("expenseToRegisterPending");
  }

  saveExpenseToLocalStorage(expenseToSaveLocalStorage: ExpenseModel) {
    let willBeSaveExpense: boolean = false;  
    if(expenseToSaveLocalStorage.amountShow != '') {
      willBeSaveExpense = true;
    }
    if(expenseToSaveLocalStorage.description != '') {
      willBeSaveExpense = true;
    }
    if(expenseToSaveLocalStorage.category.name != '') {
      willBeSaveExpense = true;
    }
    if(expenseToSaveLocalStorage.paymentMethod.name != '') {
      willBeSaveExpense = true;
    }
    if(expenseToSaveLocalStorage.accordingType.name != '') {
      willBeSaveExpense = true;
    }
    if(expenseToSaveLocalStorage.tag.length > 0) {
      willBeSaveExpense = true;
    }
    if(expenseToSaveLocalStorage.account.accountName != '') {
      willBeSaveExpense = true;
    }
    if(expenseToSaveLocalStorage.vouchers.length > 0 ) {
      willBeSaveExpense = true;
    }
    if(willBeSaveExpense == false) {
      this.clearExpennseRegisterFromLocalStorage();
      return;
    }

    localStorage.setItem("expenseToRegisterPending",JSON.stringify(expenseToSaveLocalStorage));
  }
  
}
