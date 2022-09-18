import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { skipApiKey } from '@core/usuarios/context/skip.token.context';
import { OwnerDaoModel, OwnerModel } from '@data/models/business/owner.model';
import { URL_BASE_API_V1, URL_BASE_HOST } from 'app/config/global.url';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
    private httpHeaders = new HttpHeaders({'Content-type':'application/json'});

    private _usuario: OwnerModel | undefined;
    private _token: string | undefined;
  
    //private httpHeaders = new HttpHeaders({'Content-type':'application/json','Accept':'application/json'})
  
    constructor(private _http: HttpClient) { }
  
    public get usuario(): OwnerModel {
        if(this._usuario != null) {
          return this._usuario;
        } else if (this._usuario == null && localStorage.getItem("usuario") != null) {
          this._usuario = JSON.parse(localStorage.getItem("usuario")!) as OwnerModel;
          return this._usuario;
        }
  
        return new OwnerModel();
    }
  
    public get token() : string {
        if(this._token != null) {
          return this._token;
        } else if (this._token == null && localStorage.getItem("usuario") != null) {
          this._token = localStorage.getItem("token")!;
          return this._token;
        }
  
        return '';
    }
    
    login(usuario: OwnerModel): Observable<any> {
      const urlEndPointAuth = URL_BASE_HOST + "/oauth/token";
      const credentialsApplications = btoa("angularapp" + ":" + "1234567");
      const httpHeadersLogin = new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded",
                                        "Authorization":"Basic " + credentialsApplications});
      
      let params = new URLSearchParams();
      
      params.set("username",usuario.username);
      params.set("password",usuario.password);
      params.set("grant_type","password");
      return  this._http.post(urlEndPointAuth, params.toString(), {headers: httpHeadersLogin});
    }
  
  
    guardarUsuario(access_token: string): void {
        let payLoad = this.obtenerDatosToken(access_token);
        this._usuario = new OwnerModel();
        this._usuario.id = payLoad.idUser;
        this._usuario.name = payLoad.name;
        this._usuario.username = payLoad.username;
        this._usuario.email = payLoad.email;
        this._usuario.image = payLoad.image;
        this._usuario.createAt = payLoad.createAt;
        this._usuario.roles = payLoad.authorities;
        this._usuario.enabled = payLoad.enabled;
        
        localStorage.setItem("lcstrg_owner",JSON.stringify(this._usuario));
    }
  
    guardarToken(access_token: string) : void {
      this._token = access_token;
      localStorage.setItem("token", this._token);
    }
  
    obtenerDatosToken(accesToken :string) :any {

        if(accesToken != null && accesToken != '') {
          return JSON.parse(atob(accesToken.split(".")[1]));
        } else {

          let accesTokenLCSTG = localStorage.getItem("token");
          if(accesTokenLCSTG != null && accesTokenLCSTG != '') {
            return JSON.parse(atob(accesTokenLCSTG.split(".")[1]));
          }
        }

        return null;
    }

    isAuthenticated() : boolean {

        let payload = this.obtenerDatosToken(this.token); //Hace uso del método get token líneas arriba
        if(payload != null && payload.username && payload.username.length > 0) {
            return true;
        }
       
      return false;
    }

    isTokenExpirado(): boolean {
      let tokenp = this._token!;
      let payload = this.obtenerDatosToken(tokenp);
      if(payload == null) return true;
      let now = new Date().getTime() / 1000;
      if(payload.exp < now) {
        return true;
      }
       return false;
    }


    getToken(): string{
      return localStorage.getItem("token")!;
    }
  
    logoutSession() {
      this._token = undefined;
      this._usuario = undefined;
      localStorage.clear();
      // localStorage.removeItem("usuario");
      // localStorage.removeItem("token" );
    }
  
    hasRole(role: string): boolean {
      if(this.usuario.roles.includes(role)) {
        return true;
      }
      return false;
    }

    create(owner: OwnerModel) : Observable<any> {
      return this._http.post<OwnerModel>(`${URL_BASE_API_V1}/owner`,owner);
      //return this._http.post<OwnerModel>(`${URL_BASE_API_V1}/owner`,owner,{ headers: this.httpHeaders})

     // return this._http.post<OwnerModel>(`${this.URLCOMPL}/owner`,owner, { context: skipApiKey() });

    }

    getAllPayersDistictToSelect(idWorkspace: number) : Observable<String[]> {
      return this._http.get<String[]>(`${URL_BASE_API_V1}/workspace/${idWorkspace}/expense/payers`);
    }
}