import { Routes, RouterModule } from "@angular/router";

import { LazyLoadedComponent } from "./lazy-loaded.component";
// import { DummyComponent } from "./components/dummy/dummy.component";

const routes: Routes = [
    { path: "", component: LazyLoadedComponent }
];

export const routing = RouterModule.forChild(routes);