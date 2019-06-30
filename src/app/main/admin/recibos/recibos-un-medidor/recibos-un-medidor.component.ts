import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { MatTableDataSource } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReciboService } from '../../../../services/recibo.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-recibos-un-medidor',
  templateUrl: './recibos-un-medidor.component.html',
  styleUrls: ['./recibos-un-medidor.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RecibosUnMedidorComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['detalle',  'medidor', 'periodo', 'total', 'estado','acciones'];
  dataSource: MatTableDataSource<any>;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;
  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'periodo';
  orden:string = 'desc';
  recibos:any[] = [];
  total:number = 0;
  sinRegistrar:number = 0;
  termino = new Subject<string>();
  abonado:any;
  fechaVencimiento:Date = null;
  subcripciones:Subscription [] = [];

  constructor(private route:ActivatedRoute, private router:Router, private _reciboService:ReciboService) { 
    if (!localStorage.getItem('abonado')) {
      this.router.navigate(['admin/seleccionar-medidor/recibos']);
    }else{
      this.abonado = JSON.parse(localStorage.getItem('abonado'));
      localStorage.removeItem('abonado');
    }
  }

  ngOnInit() {
    this.cargarRecibos();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }

  cargarRecibos(){
    this.estaCargando = true;
    this.subcripciones.push( this._reciboService.cargarRecibosUnMedidor(this.desde, this.cantidad, this.columna, this.orden, this.abonado.medidor)
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
    localStorage.setItem('abonado', JSON.stringify(this.abonado));
    this.router.navigate(['/admin/recibos/detalle/'+ recibo.id]);
  }

  generarPdf(recibo:any){
    this._reciboService.generarPDF(recibo.id);
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

  ///==================== TABLA =================//

  ordenarColumna(evento:any){
    if (evento.direction == '') {
      this.columna = 'periodo';
      this.orden = 'desc';
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
