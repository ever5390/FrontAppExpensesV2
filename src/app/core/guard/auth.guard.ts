import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '@data/services/user/user.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private _authService: UserService,
    private _router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._authService.isAuthenticated()) {
        if(this.isTokenExpirado()) {
          this._authService.logoutSession();
          // Swal.fire("","Sessión expirada","info");
          this._router.navigate(["/login"]);
          return false;
        }
        return true;
      }
      // this._authService.logoutSession();
      // Swal.fire("","Sessión expirada","info");
      this._router.navigate(["/login"]);
      return false;
  }

  isTokenExpirado(): boolean {
    let token = this._authService.token
    let payload = this._authService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;
    if(payload.exp < now) {
      return true;
    }
     return false;
  }
  
}
