import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    moduleId: module.id,
    templateUrl: "main-2.component.html",
    styleUrls: ["main-2.component.css"]
})
export class Main2Component {
    id: number;
    message: string;

    constructor(route: ActivatedRoute) {
        let data = route.snapshot.data["resolvedData"];
        this.id = data.id;
        this.message = data.message;
    }
}