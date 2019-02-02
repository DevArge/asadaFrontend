import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { AbonadoComponent } from './abonado/abonado.component';
import { Abonado } from '../../../models/Abonado.model';
import { AbonadoService } from '../../../services/abonado.service';
import swal from 'sweetalert';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-abonados',
  templateUrl: './abonados.component.html',
  styleUrls: ['./abonados.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AbonadosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellido1', 'apellido2', 'telefono', 'plano'];
  dataSource: MatTableDataSource<Abonado>;
  dialogRef: any;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;

  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  abonados:Abonado[] = [];
  total:number = 0;
  termino = new Subject<string>();

  constructor( public _matDialog:MatDialog, private _abonadoService:AbonadoService) {
    this.buscarAbonado();
  }
  
  ngOnInit() {
    this.cargarAbonados();
  }

  cargarAbonados(){
    this.estaCargando = true;
    this._abonadoService.obtenerAbonados(this.desde, this.cantidad, this.columna, this.orden)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.abonados =resp.abonados;
        this.dataSource = new MatTableDataSource(this.abonados);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      });
  }

  editarAbonado(abonado:Abonado){
    this.dialogRef = this._matDialog.open(AbonadoComponent, {
      panelClass: 'abonado-form-dialog',
      data      : {
          abonado,
          action : 'editar'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
          if ( !response ){
              return;
          }
          const actionType: string = response[0];
          const formData: FormGroup = response[1];
          switch ( actionType ) {
              case 'guardar':
                let abonado:Abonado = formData.getRawValue();
                this._abonadoService.actualizarAbonado(abonado, abonado.id).subscribe((res)=>{
                  this.cargarAbonados();
                },err=>{
                  console.log(err);
                })
                break;
              case 'eliminar':  
                this.mostrarSWAEliminar(formData.getRawValue().id);
                break;
          }
      });
  }

  AgregarAbonado(){
    this.dialogRef = this._matDialog.open(AbonadoComponent, {
      panelClass: 'abonado-form-dialog',
      data      : {
          action: 'nuevo'
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
          if ( !response ){
              return;
          }
          let abonado:Abonado = response.getRawValue();
          this._abonadoService.crearAbonado(abonado).subscribe(
            res=>{
              this.cargarAbonados();           
            },err=>{
              console.log(err);
            });
      });
  }

  eliminarAbonado(abonado:any){
    console.log(abonado);
  }

  mostrarSWAEliminar(id:number){
    swal({
      title: "Estas seguro?",
      text: "El abonado sera elimnado de los registros!",
      icon: "warning",
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this._abonadoService.eliminarAbonado(id).subscribe((res)=>{
          this.cargarAbonados();
        })
      } else {
        swal("El registro no sufrio cambios!", "", "info");
      }
    });
  }

  ///==================== TABLA =================//

  buscarAbonado(){
    this.desde = 0;
    this.estaCargando = true;
    this._abonadoService.buscarAbonados(this.desde, this.cantidad, this.columna, this.orden, this.termino)
      .subscribe((resp:any) =>{
        console.log(resp); 
        this.total = resp.total;
        this.abonados = resp.abonados;
        this.dataSource = new MatTableDataSource(this.abonados);
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
    this.cargarAbonados();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarAbonados();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarAbonados();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarAbonados();
  }
}
