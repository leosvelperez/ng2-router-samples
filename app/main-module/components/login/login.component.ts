import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { SecurityService } from "../../services/security.service";

@Component({
    moduleId: module.id,
    templateUrl: "login.component.html",
    styleUrls: ["login.component.css"]
})
export class LoginComponent {
    constructor(private _securityService: SecurityService, private _router: Router) { }

    login() {
        this._securityService.login();
        this._router.navigate(["main-3"]);
    }
}