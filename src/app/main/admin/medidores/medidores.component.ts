import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations/index';
import { Abonado } from '../../../models/Abonado.model';
import { Medidor } from '../../../models/Medidor.model';
import { MedidorService } from '../../../services/medidor.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AnadirReparacionComponent } from './anadir-reparacion/anadir-reparacion.component';
import swal from 'sweetalert';
import { DeudaService } from '../../../services/deuda.service';

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.component.html',
  styleUrls: ['./medidores.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MedidoresComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'apellido1', 'apellido2', 'detalle', 'medidor', 'estado', 'editar'];
  dataSource: MatTableDataSource<Medidor>;
  dialogRef: any;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;

  medidores:Medidor[] = [];
  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  total:number = 0;
  termino = new Subject<string>();
  todos:boolean = false;

  constructor(private _medidorService:MedidorService, private router:Router, 
              public _matDialog:MatDialog, private _deudaService:DeudaService) { 
    this.buscarMedidor();
  }

  ngOnInit() {
    this.cargarMedidores();
  }

  cargarMedidores(){
    this.estaCargando = true;
    this._medidorService.obtenerMedidores(this.desde, this.cantidad, this.columna, this.orden, this.todos)
      .subscribe((resp:any) =>{
        console.log(resp);
        this.total = resp.total;
        this.medidores = resp.medidores;
        this.dataSource = new MatTableDataSource(this.medidores);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      });
  }

  inhabilitarMedidor(medidor:any){
    let mensaje = 'Esta seguro de querer inhabilitar el medidor: '+medidor.medidor+'?\n si lo hace no podra registrar mas lecturas en este medidor ';
    this.mostrarSWA(this._medidorService.inhabilitarMedidor(medidor.medidor), mensaje);
  }

  habilitarMedidor(medidor:any){
    let mensaje = 'Esta seguro de querer habilitar el medidor: '+medidor.medidor+'?\n si lo hace se le cobrará una multa de reactivación';
    this.mostrarSWA(this._medidorService.habilitarMedidor(medidor.medidor), mensaje);
  }

  anadirReparacion(medidor:any){
    this.dialogRef = this._matDialog.open(AnadirReparacionComponent, {
      panelClass: 'abonado-form-dialog'
    });
    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
          if ( !response ){
              return;
          }
          console.log(response.getRawValue());
          this._deudaService.anadirReparacion(medidor.medidor, response.getRawValue()).subscribe(
            res=>{

            },err=>{
              console.log(err);
            });
      });
  }

  cambiarMedidor(medidor:any){
    let mensaje = 'Al hacer el cambio de medidor se procederá a inhabilitar el medidor actual para luego crear uno nuevo';
    swal({
      title: "Estas seguro?",
      text: mensaje,
      icon: "warning",
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this._medidorService.inhabilitarMedidor(medidor.medidor).subscribe((res)=>{
          localStorage.setItem('abonado', JSON.stringify(medidor));
          this.router.navigate(['admin/asignar-medidor']);
        })
      } else {
        swal("La acción no se realizo!", "", "info");
      }
    });
  }

  editarMedidor(medidor:any){
    console.log(medidor);
    localStorage.setItem('medidor', JSON.stringify(medidor));
    this.router.navigate(['admin/medidor/' + medidor.medidor]);
  }

  mostrarSWA(funcion:any, mensaje:string){
    swal({
      title: "Estas seguro?",
      text: mensaje,
      icon: "warning",
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        funcion.subscribe((res)=>{
          this.cargarMedidores();
        })
      } else {
        swal("El registro no sufrio cambios!", "", "info");
      }
    });
  }

  mostarTodos(){
    if (this.todos) {
      this.todos = false;
    }else{
      this.todos = true;
    }
    this.cargarMedidores();
  }

  ///==================== TABLA ======================//

  buscarMedidor(){
    this.desde = 0;
    this.estaCargando = true;
    this._medidorService.buscarMedidores(this.desde, this.cantidad, this.columna, this.orden, this.termino, this.todos)
      .subscribe((resp:any) =>{
        console.log(resp); 
        this.total = resp.total;
        this.medidores = resp.medidores;
        this.dataSource = new MatTableDataSource(this.medidores);
        this.estaCargando = false;
      });   
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
    this.cargarMedidores();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarMedidores();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarMedidores();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarMedidores();
  }

}
