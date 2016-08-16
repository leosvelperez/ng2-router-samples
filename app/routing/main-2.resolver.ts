import { Injectable } from "@angular/core";
import { Router, Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Injectable()
export class Main2Resolver implements Resolve<{message: string, id: number}> {
    constructor(private _router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        let id = +route.params["id"];

        return new Promise((resolve: any, reject: any) => {
            if (id < 1) {
                this._router.navigate(["main-1"]);
                return resolve(false);
            }

            setTimeout(() => {
                return resolve({ id, message: "Data resolved!" });
            }, 3000);
        });
    }
}