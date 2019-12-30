import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { fuseAnimations } from '@fuse/animations/index';
import { LecturaService } from '../../../services/lectura.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lecturas',
  templateUrl: './lecturas.component.html',
  styleUrls: ['./lecturas.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class LecturasComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['nombre', 'apellido1', 'apellido2','detalle', 'medidor', 'lecturaAnt', 'lectura', 'metros', 'promedio'];
  dataSource: MatTableDataSource<any>;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;
  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  lecturas:any[] = [];
  total:number = 0;
  sinRegistrar:number = 0;
  termino = new Subject<string>();
  periodo:string;
  lectura:number;
  subcripciones:Subscription [] = [];

  constructor(private _lecturaService:LecturaService, private route:ActivatedRoute, private router:Router) { 
    this.route.params.subscribe(params => this.periodo = params.periodo)
    if (!this.periodo) {
      this.router.navigate(['admin/seleccionar-periodo/lecturas']);
    }
    this.buscarLectura();
  }

  ngOnInit() {
    this.cargarLecturas();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }

  cargarLecturas(){
    this.estaCargando = true;
    this.subcripciones.push(this._lecturaService.obtenerLecturas(this.desde, this.cantidad, this.columna, this.orden, this.periodo)
      .subscribe((resp:any) =>{
        this.sinRegistrar = resp.sinRegistrar;
        this.total = resp.total;
        this.lecturas = resp.lecturas;
        this.dataSource = new MatTableDataSource(this.lecturas);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      })
    )
  }

  ///==================== TABLA =================//

  buscarLectura(){
    this.desde = 0;
    this.estaCargando = true;
    this.subcripciones.push( this._lecturaService.buscarLecturas(this.desde, this.cantidad, this.columna, this.orden, this.termino,'periodo', 'lecturas', this.periodo)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.lecturas = resp.lecturas;
        this.dataSource = new MatTableDataSource(this.lecturas);
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
    this.cargarLecturas();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarLecturas();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarLecturas();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarLecturas();
  }


}
