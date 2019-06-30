import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { FacturaService } from '../../../../services/factura.service';
import swal from 'sweetalert';
import { fuseAnimations } from '../../../../../@fuse/animations/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facturas-de-cuentas',
  templateUrl: './facturas-de-cuentas.component.html',
  styleUrls: ['./facturas-de-cuentas.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class FacturasDeCuentasComponent implements OnInit, OnDestroy {


  displayedColumns: string[] = ['cuenta', 'numero', 'fecha', 'grand_total', 'editar'];
  dataSource: MatTableDataSource<any>;
  dialogRef: any;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;

  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  facturas:any[] = [];
  total:number = 0;
  termino = new Subject<string>();
  subcripciones:Subscription [] = [];

  constructor( private _facturaService:FacturaService, private router:Router) {
    this.buscarFactura();
  }
  
  ngOnInit() {
    this.cargarFacturas();
  }


  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }

  cargarFacturas(){
    this.estaCargando = true;
    this.subcripciones.push( this._facturaService.obtenerFacturas(this.desde, this.cantidad, this.columna, this.orden)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.facturas =resp.facturas;
        this.dataSource = new MatTableDataSource(this.facturas);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      })
    )
  }

  AgregarFactura(){
    this.router.navigate(['/admin/factura']);
  }

  eliminarFactura(id:any){
    this.mostrarSWAEliminar(id);
  }

  mostrarSWAEliminar(id:number){
    swal({
      title: "Estas seguro?",
      text: "La factura será eliminada de los registros!",
      icon: "warning",
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.subcripciones.push( this._facturaService.eliminarFactura(id).subscribe((res)=>{
            this.cargarFacturas();
          })
        )
      } else {
        swal("El registro no sufrio cambios!", "", "info");
      }
    });
  }

  ///==================== TABLA =================//

  buscarFactura(){
    this.desde = 0;
    this.estaCargando = true;
    this.subcripciones.push( this._facturaService.buscarFactura(this.desde, this.cantidad, this.columna, this.orden, this.termino)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.facturas = resp.cuentas;
        this.dataSource = new MatTableDataSource(this.facturas);
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
    this.cargarFacturas();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarFacturas();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarFacturas();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarFacturas();
  }
}
