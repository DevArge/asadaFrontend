import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MedidoresComponent } from './medidores/medidores.component';
import { MedidorComponent } from './medidores/medidor/medidor.component';
import { AbonadosComponent } from './abonados/abonados.component';
import { LecturasComponent } from './lecturas/lecturas.component';
import { RecibosComponent } from './recibos/recibos.component';
import { VerificaTokenGuard } from '../../services/guards/verifica-token.guard';
import { BuscarMedidorComponent } from './medidores/buscar-medidor/buscar-medidor.component';
import { CrearMedidorComponent } from './medidores/crear-medidor/crear-medidor.component';
import { PeriodoComponent } from './periodo/periodo.component';
import { InsertarLecturaComponent } from './lecturas/insertar-lectura/insertar-lectura.component';
import { SeleccionarMedidorComponent } from './seleccionar-medidor/seleccionar-medidor.component';
import { UnMedidorComponent } from './lecturas/un-medidor/un-medidor.component';
import { RecibosUnMedidorComponent } from './recibos/recibos-un-medidor/recibos-un-medidor.component';
import { ReciboComponent } from './recibos/recibo/recibo.component';
import { CuentasPorCobrarComponent } from './cuentas-por-cobrar/cuentas-por-cobrar.component';
import { CuentasPorPagarComponent } from './cuentas-por-pagar/cuentas-por-pagar.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HistorialesComponent } from './historiales/historiales.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PerfilComponent } from './perfil/perfil.component';
import { FacturasDeCuentasComponent } from './cuentas-por-pagar/facturas-de-cuentas/facturas-de-cuentas.component';
import { FacturaComponent } from './cuentas-por-pagar/facturas-de-cuentas/factura/factura.component';
  

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
    { path: 'cuentas-por-cobrar/:periodo',  canActivate: [VerificaTokenGuard], component: CuentasPorCobrarComponent},
    { path: 'cuentas-por-pagar',            canActivate: [VerificaTokenGuard], component: CuentasPorPagarComponent},    
    { path: 'usuarios',                     canActivate: [VerificaTokenGuard], component: UsuariosComponent},    
    { path: 'historial',                    canActivate: [VerificaTokenGuard], component: HistorialesComponent},    
    { path: 'configuracion',                canActivate: [VerificaTokenGuard], component: ConfiguracionComponent},    
    { path: 'perfil',                       canActivate: [VerificaTokenGuard], component: PerfilComponent},    
    { path: 'facturas-de-cuentas',          canActivate: [VerificaTokenGuard], component: FacturasDeCuentasComponent},    
    { path: 'factura',                      canActivate: [VerificaTokenGuard], component: FacturaComponent},    
    { path: 'factura/:id',                  canActivate: [VerificaTokenGuard], component: FacturaComponent},    
    { path: '**',                           component: DashboardComponent, redirectTo:'dashboard'},

    // {path: '', component:PagesComponent, canActivate:[LoginGuardGuard], loadChildren:'./pages/pages.module#PagesModule'},
    // {path: 'dash', component: DashboardComponent},
];

export const ADMIN_ROUTES = RouterModule.forChild(appRoutes);