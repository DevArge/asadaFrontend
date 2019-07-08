import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CuentasService } from '../../../services/cuentas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations/index';
import { ReciboService } from 'app/services/recibo.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-cuentas-por-cobrar',
  templateUrl: './cuentas-por-cobrar.component.html',
  styleUrls: ['./cuentas-por-cobrar.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CuentasPorCobrarComponent implements OnInit, OnDestroy {

  columnasCuentas: string[] = [
    'abonoMedidor',
    'cargoFijo',
    'consumo',
    'hidrante',
    'reactivacionMedidor',
    'reparacion',
    'retrasoPago',
    'total'
  ];
  columnaRecibos: string[] =[
    'abonado',
    'medidor',
    'cargo',
    'consumo',
    'hidrante',
    'otros',
    'total'
  ];
  recibos:any[]=[];
  cuentas:string [];
  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  total:number = 0;
  periodo:string;
  estaCargando:boolean = true;
  termino = new Subject<string>();
  subcripciones:Subscription [] =[];

  constructor(private _cuentasService:CuentasService, private router:Router, private route:ActivatedRoute, 
              private _reciboService:ReciboService) { 
    this.route.params.subscribe(params => this.periodo = params.periodo);
    if (!this.periodo) {
      this.router.navigate(['admin/seleccionar-periodo/cuentas']);
    }
    this.buscar();
  }
  
  ngOnInit() {
    this.obtenerCuentas();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }

  obtenerCuentas(){
    this.estaCargando = true;
    this.subcripciones.push( this._cuentasService.cuentasPorCobrar(this.desde,this.cantidad, this.columna, this.orden, this.periodo).subscribe((res:any)=>{
        this.cuentas = res.cuentas;
        this.recibos = res.recibos;
        this.total = res.total;
        this.estaCargando = false;
      })
    )
  }

  calcularOtros(reactivacion:number, reparacion:number, retraso:number, abono:number){
    return (Number(reactivacion) + Number(reparacion) + Number(retraso) + Number(abono));
  }

  exportarExcel(){
    this._cuentasService.exportarExcel(this.periodo);
  }

  
  ///==================== TABLA =================//

  buscar(){
    this.desde = 0;
    this.estaCargando = true;
    this.subcripciones.push( this._reciboService.buscarRecibos(this.desde, this.cantidad, this.columna, this.orden, this.termino,'periodo', this.periodo)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.recibos = resp.recibos;
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
    this.obtenerCuentas();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.obtenerCuentas();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.obtenerCuentas();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.obtenerCuentas();
  }

}
