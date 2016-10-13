import { Routes, RouterModule } from "@angular/router";

import { MainModuleComponent } from "../main-module.component";
import { Main1Component } from "../components/main-1/main-1.component";
import { Main2Component } from "../components/main-2/main-2.component";
import { Main3Component } from "../components/main-3/main-3.component";
import { Main4Component } from "../components/main-4/main-4.component";
import { Aside1Component } from "../components/aside-1/aside-1.component";
import { Aside2Component } from "../components/aside-2/aside-2.component";
import { Child1Component } from "../components/child-1/child-1.component";
import { Child2Component } from "../components/child-2/child-2.component";
import { Child3Component } from "../components/child-3/child-3.component";
import { LoginComponent } from "../components/login/login.component";
import { Main2Resolver } from "./main-2.resolver";
import { AuthGuard } from "./auth.guard";
import { CanDeactivateGuard } from "./can-deactivate.guard";

const routes: Routes = [
    { path: "login", component: LoginComponent },
    {
        path: "main",
        component: MainModuleComponent,
        children: [
            { path: "", redirectTo: "main-1", pathMatch: "full" },
            {
                path: "main-1",
                component: Main1Component,
                children: [
                    { path: "" },
                    { path: "child-1", component: Child1Component }
                ]
            },
            {
                path: "main-2/:id",
                component: Main2Component,
                resolve: {
                    resolvedData: Main2Resolver
                }
            },
            {
                path: "main-3",
                component: Main3Component,
                canActivate: [AuthGuard]
            },
            {
                path: "main-4",
                component: Main4Component,
                canDeactivate: [CanDeactivateGuard]
            },
            { path: "aside-1", component: Aside1Component, outlet: "aside" },
            {
                path: "aside-2",
                component: Aside2Component,
                outlet: "aside",
                children: [
                    { path: "", redirectTo: "child-2", pathMatch: "full" },
                    { path: "child-2", component: Child2Component },
                    { path: "child-3", component: Child3Component }
                ]
            }
        ]
    }
];

export const routing = RouterModule.forChild(routes);