import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Cuenta } from 'app/models/Cuenta.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { CuentasService } from 'app/services/cuentas.service';
import { fuseAnimations } from '@fuse/animations';
import { Subject, Subscription } from 'rxjs';
import { CuentaComponent } from './cuenta/cuenta.component';
import { FormGroup } from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-cuentas-por-pagar',
  templateUrl: './cuentas-por-pagar.component.html',
  styleUrls: ['./cuentas-por-pagar.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CuentasPorPagarComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['codigo', 'nombre', 'tipo', 'presupuesto'];
  dataSource: MatTableDataSource<Cuenta>;
  dialogRef: any;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;

  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  cuentas:Cuenta[] = [];
  total:number = 0;
  termino = new Subject<string>();
  subcripciones:Subscription [] = [];

  constructor(public _matDialog:MatDialog, private _cuentasService:CuentasService) { 
    this.buscarCuenta();
  }

  ngOnInit() {
    this.cargarCuentas();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }

  cargarCuentas(){
    this.estaCargando = true;
    this.subcripciones.push( this._cuentasService.obtenerCuentas(this.desde, this.cantidad, this.columna, this.orden)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.cuentas =resp.cuentas;
        this.dataSource = new MatTableDataSource(this.cuentas);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      })
    )
  }

  editarCuenta(cuenta:Cuenta){
    this.dialogRef = this._matDialog.open(CuentaComponent, {
      panelClass: 'abonado-form-dialog',
      data      : {
          cuenta,
          action : 'editar'
      }
    });
    this.subcripciones.push( this.dialogRef.afterClosed()
      .subscribe(response => {
          if ( !response ){
              return;
          }
          const actionType: string = response[0];
          const formData: FormGroup = response[1];
          switch ( actionType ) {
              case 'guardar':
                let cuenta:Cuenta = formData.getRawValue();
                this.subcripciones.push( this._cuentasService.actualizarCuenta(cuenta, cuenta.id).subscribe((res)=>{
                    this.cargarCuentas();
                  },err=>{
                    console.log(err);
                  })
                )
                break;
              case 'eliminar':  
                this.mostrarSWAEliminar(formData.getRawValue().id);
                break;
          }
      })
    )
  }

  AgregarCuenta(){
    this.dialogRef = this._matDialog.open(CuentaComponent, {
      panelClass: 'abonado-form-dialog',
      data      : {
          action: 'nuevo'
      }
    });
    this.subcripciones.push( this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
          if ( !response ){
              return;
          }
          let cuenta:Cuenta = response.getRawValue();
          this.subcripciones.push( this._cuentasService.crearCuenta(cuenta).subscribe(
            res=>{
              this.cargarCuentas();           
            },err=>{
              console.log(err);
            })
          )
      })
    )
  }

  eliminarCuenta(cuenta:any){
    console.log(cuenta);
  }

  mostrarSWAEliminar(id:number){
    swal({
      title: "Estas seguro?",
      text: "La cuenta sera eliminada de los registros!",
      icon: "warning",
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.subcripciones.push( this._cuentasService.eliminarCuenta(id).subscribe((res)=>{
            this.cargarCuentas();
          })
        )
      } else {
        swal("El registro no sufrio cambios!", "", "info");
      }
    });
  }

  ///==================== TABLA =================//

  buscarCuenta(){
    this.desde = 0;
    this.estaCargando = true;
    this.subcripciones.push( this._cuentasService.buscarCuentas(this.desde, this.cantidad, this.columna, this.orden, this.termino)
      .subscribe((resp:any) =>{
        console.log(resp); 
        this.total = resp.total;
        this.cuentas = resp.cuentas;
        this.dataSource = new MatTableDataSource(this.cuentas);
        this.estaCargando = false;
      })
    )

  }

  ordenarColumna(evento:any){
    if (evento.direction == '') {
      this.columna = 'id';
      this.orden = 'asc';
    }else{
      this.columna = evento.active;
      this.orden = evento.direction;
    }
    this.desde = 0;
    this.cargarCuentas();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarCuentas();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarCuentas();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarCuentas();
  }

}
