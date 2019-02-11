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
import { PeriodoComponent } from './periodo/periodo.component';
import { InsertarLecturaComponent } from './lecturas/insertar-lectura/insertar-lectura.component';
import { SeleccionarMedidorComponent } from './seleccionar-medidor/seleccionar-medidor.component';
import { UnMedidorComponent } from './lecturas/un-medidor/un-medidor.component';
import { RecibosUnMedidorComponent } from './recibos/recibos-un-medidor/recibos-un-medidor.component';
import { ReciboComponent } from './recibos/recibo/recibo.component';
  

const appRoutes:Routes = [
    { path: 'dashboard',                    canActivate: [VerificaTokenGuard], component: DashboardComponent}, 
    { path: 'abonados',                     canActivate: [VerificaTokenGuard], component: AbonadosComponent},
    { path: 'medidores',                    canActivate: [VerificaTokenGuard], component: MedidoresComponent},
    { path: 'medidor/:id',                  canActivate: [VerificaTokenGuard], component: MedidorComponent},
    { path: 'buscar-medidor',               canActivate: [VerificaTokenGuard], component: BuscarMedidorComponent},
    { path: 'asignar-medidor',              canActivate: [VerificaTokenGuard], component: CrearMedidorComponent},
    { path: 'seleccionar-periodo/:ruta',    canActivate: [VerificaTokenGuard], component: PeriodoComponent},
    { path: 'lecturas/ingresar/:periodo',   canActivate: [VerificaTokenGuard], component: InsertarLecturaComponent},
    { path: 'lecturas/:periodo',            canActivate: [VerificaTokenGuard], component: LecturasComponent},
    { path: 'seleccionar-medidor/:ruta',    canActivate: [VerificaTokenGuard], component: SeleccionarMedidorComponent},
    { path: 'lecturas/medidor/:id',         canActivate: [VerificaTokenGuard], component: UnMedidorComponent},
    { path: 'recibos/:periodo',             canActivate: [VerificaTokenGuard], component: RecibosComponent},
    { path: 'recibos/medidor/:id',          canActivate: [VerificaTokenGuard], component: RecibosUnMedidorComponent},
    { path: 'recibos/detalle/:id',          canActivate: [VerificaTokenGuard], component: ReciboComponent},

    { path: 'recaudacion',                  component: RecibosComponent},
    { path: 'gastos',                       component: GastosComponent},
    { path: '**',                           component: DashboardComponent, redirectTo:'dashboard'},

    // {path: '', component:PagesComponent, canActivate:[LoginGuardGuard], loadChildren:'./pages/pages.module#PagesModule'},
    // {path: 'dash', component: DashboardComponent},
];

export const ADMIN_ROUTES = RouterModule.forChild(appRoutes);