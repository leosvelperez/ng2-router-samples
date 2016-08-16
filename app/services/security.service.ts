import { Injectable } from "@angular/core";

@Injectable()
export class SecurityService {
    get isLoggedIn() {
        return sessionStorage.getItem("loggedIn") === "true";
    }

    login() {
        sessionStorage.setItem("loggedIn", "true");
    }

    logout() {
        sessionStorage.removeItem("loggedIn");
    }
}