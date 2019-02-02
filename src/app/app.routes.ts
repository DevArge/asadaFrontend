import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './main/login/login.component';
import { ConsultaComponent } from './main/consulta/consulta.component';
import { LoginGuard } from './services/guards/login.guard';
import { RedirectGuard } from './services/guards/redirect.guard';

const appRoutes:Routes = [
    { path      : 'admin', canActivate:[LoginGuard], loadChildren:'./main/admin/admin.module#AdminModule' },
    { path      : '', component: HomeComponent },
    { path      : 'login', canActivate:[RedirectGuard], component: LoginComponent },
    { path      : 'consulta', component: ConsultaComponent },
    { path      : '**', component: HomeComponent, redirectTo:'' },
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash:true});