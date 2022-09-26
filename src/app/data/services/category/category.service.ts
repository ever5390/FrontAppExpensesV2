import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_BASE_API_V1, URL_BASE_HOST } from 'app/config/global.url';
import { CategoryModel } from 'app/data/models/business/category.model';
import { GroupModel } from 'app/data/models/business/group.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private URLCOMPL: string = URL_BASE_API_V1;
  private httpHeaders =  new HttpHeaders({'Content-type':'application/json'});

  constructor(
    private _http: HttpClient
  ) { }

  getAllCategories(idOwner: number): Observable<CategoryModel[]>  {
    console.log(idOwner);
    return this._http.get(`${this.URLCOMPL}/category/owner/${idOwner}`)
    .pipe(
      map(response => response as CategoryModel[])
    );
  }

  create(categoryObject: CategoryModel) : Observable<any> {
    return this._http.post<CategoryModel>(`${this.URLCOMPL}/category`,categoryObject,{ headers: this.httpHeaders})
  }

  update(categoryObject: CategoryModel, id: number) : Observable<any> {
    return this._http.put<CategoryModel>(`${this.URLCOMPL}/category/${id}`,categoryObject,{ headers: this.httpHeaders})
  }
  
  getAllGroups(): Observable<GroupModel[]>  {
    return this._http.get(`${this.URLCOMPL}/groupcategory`)
    .pipe(
      map(response => response as GroupModel[])
    );
  }

  delete(id: number) : Observable<any> {
    return this._http.delete(`${this.URLCOMPL}/category/${id}`);
  }


}
