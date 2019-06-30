import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { DashboardService } from '../../../services/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DashboardComponent implements OnInit, OnDestroy {

  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;
  recibos:number;
  abonados:number;
  ganancias:number;
  medidores:number;

  private subcripciones:Subscription [] = [];
 
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      text: 'Consumo de agua del presente año',
      display: true
    }
  };
  public barChartLabels:string[] = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public barChartData:any[] = [];
  public chartColors: Array<any> = [
    { // first color
      backgroundColor: '#039be5',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }];

  constructor(private _fuseConfigService: FuseConfigService, private _dashboardService:DashboardService) { 
    this.ngOnInit();
    this.cargarDatos();
  }

  ngOnInit() {
    this._fuseConfigService.config = {
      layout: {
          style:'vertical-layout-1',
      }
    };
  }

  cargarDatos(){
    let object = {
      data:[0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0],
      label: 'Metros consumidos'
    }
    this.subcripciones.push( this._dashboardService.obtenerMetrosPorPeriodo().subscribe(
      (res:any)=>{
        for (let i = 0; i < 12; i++) {
          if (res.periodos[i]) {
            let arreglo = res.periodos[i].periodo.split('-');
            let mes = parseInt(arreglo[1], 10);
            object.data.push()
            object.data[mes-1] = parseInt(res.periodos[i].metros, 10);
          }else{
            break;
          }
        }
        this.abonados = res.abonados;
        this.medidores = res.medidores;
        this.ganancias = res.ganancias;
        this.recibos = res.recibos;
        this.estaCargando = false;
        this.barChartData.push(object);
      },err=>{
        this.huboErrorAlcargar = true;
        console.log(err);
      })
    )
  }

  ngOnDestroy() {
    this.subcripciones.forEach(subcripcion => subcripcion.unsubscribe())
  }

}
