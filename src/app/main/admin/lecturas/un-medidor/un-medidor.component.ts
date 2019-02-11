import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs';
import { LecturaService } from '../../../../services/lectura.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-un-medidor',
  templateUrl: './un-medidor.component.html',
  styleUrls: ['./un-medidor.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class UnMedidorComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'apellido1', 'apellido2','detalle', 'lectura', 'metros', 'periodo'];
  dataSource: MatTableDataSource<any>;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;
  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'periodo';
  orden:string = 'desc';
  lecturas:any[] = [];
  total:number = 0;
  sinRegistrar:number = 0;
  termino = new Subject<string>();
  idMedidor:string;
  lectura:number;
  nombre:string;
  apellido1:string;
  apellido2:string;

  constructor(private _lecturaService:LecturaService, private route:ActivatedRoute, private router:Router) { 
    this.route.params.subscribe(params => this.idMedidor = params.id)
    if (!this.idMedidor) {
      this.router.navigate(['admin/seleccionar-medidor/lecturas']);
    }else{
      this.buscarLectura();
    }
  }

  ngOnInit() {
    this.cargarLecturas();
  }

  cargarLecturas(){
    this.estaCargando = true;
    this._lecturaService.obtenerLecturasDeUnMedidor(this.desde, this.cantidad, this.columna, this.orden, this.idMedidor)
      .subscribe((resp:any) =>{
        this.sinRegistrar = resp.sinRegistrar;
        this.total = resp.total;
        this.lecturas = resp.lecturas;
        this.dataSource = new MatTableDataSource(this.lecturas);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      });
  }


  ///==================== TABLA =================//

  buscarLectura(){
    this.desde = 0;
    this.estaCargando = true;
    this._lecturaService.buscarLecturas(this.desde, this.cantidad, this.columna, this.orden, this.termino,'idMedidor', 'ver', null, this.idMedidor)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.lecturas = resp.lecturas;
        this.dataSource = new MatTableDataSource(this.lecturas);
        this.estaCargando = false;
      });   
  }

  ordenarColumna(evento:any){
    if (evento.direction == '') {
      this.columna = 'periodo';
      this.orden = 'desc';
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
