import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { SecurityService } from "../services/security.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _securityService: SecurityService, private _router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._securityService.isLoggedIn) {
            return true;
        } else {
            this._router.navigate(["/login"]);
            return false;
        }
    }
}