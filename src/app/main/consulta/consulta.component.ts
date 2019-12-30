import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { FuseConfigService } from '@fuse/services/config.service';
import { Recibo } from '../../models/Recibo.model';
import { Subscription } from 'rxjs';
import { ReciboService } from '../../services/recibo.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ConsultaComponent implements OnInit {

  recibos: Recibo[]=[];
  recibosPendientes: Recibo[]=[];
  noHayRecibos:any[]=[{mensaje:'No hay recibos pendientes'}];
  columnaNoHay:string[]=['noHay'];
  columnaRecibos: string[] = ['medidor','periodo', 'metros', 'consumo','cargoFijo', 'hidrante', 'otros', 'total', 'estado'];
  columnaRecibos2: string[] = ['medidor','periodo', 'total', 'estado'];
  estaCargando: boolean = false;
  huboErrorAlcargar: boolean = false;
  error:string;
  primeraCarga:boolean = true;

  desde: number = 0;
  cantidad: number = 10;
  columna: string = 'id';
  orden: string = 'asc';
  total: number = 0;
  idAbonado:string;
  idAbonadoRes:string;

  cedulaAbonado:string;
  subcripciones:Subscription[] = []; 
  widthWindow:number;

  constructor(private _fuseConfigService: FuseConfigService, private _reciboService:ReciboService) { 
    this._fuseConfigService.config = {
      layout: {
          style:'vertical-layout-2',
      }
    };
    
  }

  ngOnInit() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?){
    if (event) {
      this.widthWindow = event.target.innerWidth; 
    }else{
      this.widthWindow = window.innerWidth;
    }
  }

  cargarRecibos(){
    this.estaCargando = true;
    this.subcripciones.push(this._reciboService.cargarRecibosDeUnAbonado(this.desde, this.cantidad, this.columna, this.orden, this.idAbonadoRes)
      .subscribe(responseList => {
        this.recibos           = responseList[0].recibos;
        this.total             = responseList[0].total;
        this.recibosPendientes = responseList[1].recibos;
        this.cedulaAbonado = responseList[0].recibos[0].cedula;
        this.estaCargando = false;
        this.primeraCarga = false;
      }, err=>{
        if (err.status == 403) {
          this.error = err.error.message;
        }else{
          this.error = "Ha ocurrido un error, por favor intentalo más tarde.";
        }
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      })
    )
  }

  calcularOtros(reactivacion:number, reparacion:number, retraso:number, abono:number){
    return (Number(reactivacion) + Number(reparacion) + Number(retraso) + Number(abono));
  }

  consultar(){
    this.idAbonadoRes = this.idAbonado;
    this.huboErrorAlcargar = false;
    this.recibos = [];
    this.recibosPendientes = [];
    this.cargarRecibos();
    this.idAbonado = '';
  }

  ngOnDestroy() {
    this.subcripciones.forEach(sub => sub.unsubscribe());
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
