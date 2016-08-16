import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { CanComponentDeactivate } from "../../routing/can-deactivate.guard";

@Component({
    moduleId: module.id,
    templateUrl: "main-4.component.html",
    styleUrls: ["main-4.component.css"]
})
export class Main4Component implements CanComponentDeactivate {
    canDeactivate(): boolean | Observable<boolean> {
        return confirm("¿Estás seguro de abandonar esta ruta?");
    }
}