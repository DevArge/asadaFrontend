import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//RUTAS
import { ADMIN_ROUTES } from './admin.routes';

// COMPONENTES
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, 
  MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatSlideToggleModule,
  MatTableModule, MatTabsModule, MatMenuModule, MatRippleModule, MatDialogModule, MatToolbarModule, MatSelectModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { MedidoresComponent } from './medidores/medidores.component';
import { MedidorComponent } from './medidores/medidor/medidor.component';
import { AbonadosComponent } from './abonados/abonados.component';
import { LecturasComponent } from './lecturas/lecturas.component';
import { RecibosComponent } from './recibos/recibos.component';
import { GastosComponent } from './gastos/gastos.component';
import { AbonadoComponent } from './abonados/abonado/abonado.component';
import { CrearMedidorComponent } from './medidores/crear-medidor/crear-medidor.component';
import { BuscarMedidorComponent } from './medidores/buscar-medidor/buscar-medidor.component';
import { AnadirReparacionComponent } from './medidores/anadir-reparacion/anadir-reparacion.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MedidoresComponent,
    MedidorComponent,
    AbonadosComponent,
    LecturasComponent,
    RecibosComponent,
    GastosComponent,
    AbonadoComponent,
    CrearMedidorComponent,
    BuscarMedidorComponent,
    AnadirReparacionComponent,
  ],
  imports: [
    CommonModule,
    ADMIN_ROUTES,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatRippleModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    FuseSharedModule
  ],
  entryComponents:[
    AbonadoComponent,
    AnadirReparacionComponent
  ]

})
export class AdminModule { }
