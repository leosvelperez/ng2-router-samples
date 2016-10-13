import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    { path: "", redirectTo: "main", pathMatch: "full" },
    { path: "lazy-loaded", loadChildren: "./app/lazy-loaded-module/lazy-loaded.module#LazyLoadedModule" },
    { path: "**", redirectTo: "main" }
];

export const routing = RouterModule.forRoot(routes);