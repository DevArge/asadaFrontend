import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MedidoresComponent } from './medidores/medidores.component';
import { MedidorComponent } from './medidores/medidor/medidor.component';
import { AbonadosComponent } from './abonados/abonados.component';
import { LecturasComponent } from './lecturas/lecturas.component';
import { RecibosComponent } from './recibos/recibos.component';
import { GastosComponent } from './gastos/gastos.component';
import { VerificaTokenGuard } from '../../services/guards/verifica-token.guard';
import { BuscarMedidorComponent } from './medidores/buscar-medidor/buscar-medidor.component';
import { CrearMedidorComponent } from './medidores/crear-medidor/crear-medidor.component';
  

const appRoutes:Routes = [
    { path: 'dashboard',                canActivate: [VerificaTokenGuard], component: DashboardComponent}, 
    { path: 'abonados',                 canActivate: [VerificaTokenGuard], component: AbonadosComponent},
    { path: 'medidores',                canActivate: [VerificaTokenGuard], component: MedidoresComponent},
    { path: 'medidor/:id',              canActivate: [VerificaTokenGuard], component: MedidorComponent},
    { path: 'buscar-medidor',           canActivate: [VerificaTokenGuard], component: BuscarMedidorComponent},
    { path: 'asignar-medidor',          canActivate: [VerificaTokenGuard], component: CrearMedidorComponent},
    { path: 'lecturas',                 component: LecturasComponent},
    { path: 'lecturas/ingresar',        component: LecturasComponent},
    { path: 'lecturas/medidor/:id',     component: LecturasComponent},
    { path: 'recibos',                  component: RecibosComponent},
    { path: 'recibos/abonado/:id',      component: RecibosComponent},
    { path: 'recaudacion',              component: RecibosComponent},
    { path: 'gastos',                   component: GastosComponent},
    { path: '**',                       component: DashboardComponent, redirectTo:'dashboard'},

    // {path: '', component:PagesComponent, canActivate:[LoginGuardGuard], loadChildren:'./pages/pages.module#PagesModule'},
    // {path: 'dash', component: DashboardComponent},
];

export const ADMIN_ROUTES = RouterModule.forChild(appRoutes);