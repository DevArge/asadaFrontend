import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '../../../../@fuse/animations/index';
import { MatTableDataSource } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { HistorialesService } from '../../../services/historiales.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-historiales',
  templateUrl: './historiales.component.html',
  styleUrls: ['./historiales.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class HistorialesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['nombre', 'actividad', 'created_at'];
  dataSource: MatTableDataSource<any>;
  dialogRef: any;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;

  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'created_at';
  orden:string = 'desc';
  historiales:any[] = [];
  total:number = 0;
  termino = new Subject<string>();
  subcripciones:Subscription [] = [];

  constructor(private _historialService:HistorialesService) {
    // this.buscarHistorial();
  }
  
  ngOnInit() {
    this.cargarHistoriales();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }

  cargarHistoriales(){
    this.estaCargando = true;
    this.subcripciones.push( this._historialService.cargarHistorial(this.desde, this.cantidad, this.columna, this.orden)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.historiales = resp.historiales;
        this.dataSource = new MatTableDataSource(this.historiales);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      })
    )
  }

  verDetalle(detalle:string){
    swal('Detalle', detalle, 'info');
  }

  ///==================== TABLA =================//

  // buscarHistorial(){
  //   this.desde = 0;
  //   this.estaCargando = true;
  //   this._historialService.buscarUsuarios(this.desde, this.cantidad, this.columna, this.orden, this.termino)
  //     .subscribe((resp:any) =>{
  //       console.log(resp); 
  //       this.total = resp.total;
  //       this.historiales = resp.historiales;
  //       this.dataSource = new MatTableDataSource(this.historiales);
  //       this.estaCargando = false;
  //     });   
  // }

  ordenarColumna(evento:any){
    if (evento.direction == '') {
      this.columna = 'id';
      this.orden = 'asc';
    }else{
      this.columna = evento.active;
      this.orden = evento.direction;
    }
    this.desde = 0;
    this.cargarHistoriales();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarHistoriales();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarHistoriales();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarHistoriales();
  }


}
