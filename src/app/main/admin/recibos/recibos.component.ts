import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { fuseAnimations } from '@fuse/animations/index';
import { ActivatedRoute, Router } from '@angular/router';
import { ReciboService } from '../../../services/recibo.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RecibosComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['nombre', 'apellido1', 'apellido2','detalle', 'medidor', 'total', 'estado','acciones'];
  dataSource: MatTableDataSource<any>;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;
  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  recibos:any[] = [];
  total:number = 0;
  sinRegistrar:number = 0;
  termino = new Subject<string>();
  periodo:string;
  fechaVencimiento:Date = null;
  subcripciones:Subscription [] = [];

  constructor(private route:ActivatedRoute, private router:Router, private _reciboService:ReciboService) { 
    this.subcripciones.push( this.route.params.subscribe(params => this.periodo = params.periodo))
    if (!this.periodo) {
      this.router.navigate(['admin/seleccionar-periodo/recibos']);
    }
    this.buscarLectura();
  }

  ngOnInit() {
    this.cargarRecibos();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }

  cargarRecibos(){
    this.estaCargando = true;
    this.subcripciones.push( this._reciboService.cargarRecibos(this.desde, this.cantidad, this.columna, this.orden, this.periodo)
      .subscribe((resp:any) =>{
        this.sinRegistrar = resp.sinRegistrar;
        this.total = resp.total;
        this.recibos = resp.recibos;
        if (this.recibos[0]) {
          this.fechaVencimiento = this.recibos[0].vence;
        }
        this.dataSource = new MatTableDataSource(this.recibos);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      })
    )
  }

  verDetalle(recibo:any){
    localStorage.setItem('recibo', JSON.stringify(recibo));
    this.router.navigate(['/admin/recibos/detalle/'+ recibo.id]);
  }

  generarPdf(recibo:any){
    this._reciboService.generarPDF(recibo.id);
  }

  exportarExcel(){
    this._reciboService.exportarExcel(this.periodo);
  }

  eliminarRecibo(recibo:any){
    swal({
      title: "Estas seguro?",
      text: "Al eliminar el recibo deberá volver a ingresar la lectura para volver a generar el recibo",
      icon: "warning",
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.subcripciones.push( this._reciboService.eliminarRecibo(recibo.id).subscribe((res)=>{
              if (res) {
                this.cargarRecibos();
              }
            }, err=>{
              console.log(err);
            })
          )
        } else {
          swal("Aviso", "El registro no sufrio cambios!", "info");
        }
      });
  }

  cambiarFechaVencimiento(){
    console.log(this.fechaVencimiento);
    swal("Fecha de vencimiento actual:", {
      content: {
        element: 'input',
        attributes: {
          type: 'date',
          defaultValue: this.fechaVencimiento,
        }
      },
      buttons:['Cancelar', 'Actualizar'],
    })
    .then((value) => {
      if (value == '' || value == null) {
        swal('Aviso', 'No se ha realizado ningún cambio','info');
      }else{
        console.log(value);
        this.subcripciones.push( this._reciboService.actualizarFecha(this.periodo, value).subscribe(res=>{
            this.cargarRecibos();
          },err=>{
            console.log(err);
          })
        )
      }
    });
  }

  ///==================== TABLA =================//

  buscarLectura(){
    this.desde = 0;
    this.estaCargando = true;
    this.subcripciones.push( this._reciboService.buscarRecibos(this.desde, this.cantidad, this.columna, this.orden, this.termino,'periodo', this.periodo)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.recibos = resp.recibos;
        this.dataSource = new MatTableDataSource(this.recibos);
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
    this.cargarRecibos();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarRecibos();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarRecibos();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarRecibos();
  }


}
