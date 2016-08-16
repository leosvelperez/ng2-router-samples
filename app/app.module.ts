import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { routing } from "./routing/app.routing";
import { Main1Component } from "./components/main-1/main-1.component";
import { Main2Component } from "./components/main-2/main-2.component";
import { Main3Component } from "./components/main-3/main-3.component";
import { Main4Component } from "./components/main-4/main-4.component";
import { LoginComponent } from "./components/login/login.component";
import { Aside1Component } from "./components/aside-1/aside-1.component";
import { Aside2Component } from "./components/aside-2/aside-2.component";
import { Child1Component } from "./components/child-1/child-1.component";
import { Child2Component } from "./components/child-2/child-2.component";
import { Child3Component } from "./components/child-3/child-3.component";
import { Main2Resolver } from "./routing/main-2.resolver";
import { AuthGuard } from "./routing/auth.guard";
import { CanDeactivateGuard } from "./routing/can-deactivate.guard";
import { SecurityService } from "./services/security.service";

@NgModule({
    imports: [BrowserModule, routing],
    declarations: [
        AppComponent,
        Main1Component,
        Main2Component,
        Main3Component,
        Main4Component,
        LoginComponent,
        Aside1Component,
        Aside2Component,
        Child1Component,
        Child2Component,
        Child3Component
    ],
    providers: [Main2Resolver, SecurityService, AuthGuard, CanDeactivateGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }