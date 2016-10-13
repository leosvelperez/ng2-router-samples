import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LazyLoadedComponent } from "./lazy-loaded.component";
import { routing } from "./lazy-loaded.routing";

@NgModule({
    imports: [CommonModule, routing],
    declarations: [LazyLoadedComponent]
})
export class LazyLoadedModule { }