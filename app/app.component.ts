import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { SecurityService } from "./services/security.service";

@Component({
    moduleId: module.id,
    selector: "a2rs-app",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.css"]
})
export class AppComponent {
    constructor(private _router: Router, private _securityService: SecurityService) { }

    get isLoggedIn() {
        return this._securityService.isLoggedIn;
    }

    aside1() {
        this._router.navigate([{outlets: {aside: ["aside-1"]}}]);
    }

    aside2() {
        // this is just to show navigateByUrl
        this._router.navigateByUrl(`${this._router.url.split("(")[0]}(aside:aside-2)`);
    }

    logout() {
        this._securityService.logout();
        this._router.navigate(["main-1"]);
    }
}