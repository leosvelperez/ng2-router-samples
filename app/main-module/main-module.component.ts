import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { SecurityService } from "./services/security.service";

@Component({
    moduleId: module.id,
    selector: "a2rs-main-module",
    templateUrl: "main-module.component.html",
    styleUrls: ["main-module.component.css"]
})
export class MainModuleComponent {
    constructor(private router: Router, private securityService: SecurityService) { }

    get isLoggedIn() {
        return this.securityService.isLoggedIn;
    }

    logout() {
        this.securityService.logout();
        this.router.navigate(["main/main-1"]);
    }
}