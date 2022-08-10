import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workspace } from '@data/models/business/workspace.model';
import { URL_BASE_API_V1 } from 'app/config/global.url';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {

  constructor(private _http: HttpClient) { }

  getAllWorkspaceByOwnerId(idOwner: number): Observable<Workspace[]> {
    return this._http.get<any>(URL_BASE_API_V1 + '/workspace/owner/' + idOwner)
    .pipe(
      map(response => response as Workspace[])
    );
  }
}
