import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '@data/services/user/user.service';
import { Observable } from 'rxjs';

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
        if(this._authService.isTokenExpirado()) {
          this._authService.logoutSession();
          this._router.navigate(["/login"]);
          return false;
        }
        return true;
      }
      this._authService.logoutSession();
      this._router.navigate(["/login"]);
      return false;
  }

  
  
}
