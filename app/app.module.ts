import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { MainModule } from "./main-module/main.module";

@NgModule({
    imports: [BrowserModule, MainModule, routing],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }