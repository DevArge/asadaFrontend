import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { Router } from '@angular/router';
import { Recibo } from '../../../../models/Recibo.model';
import { ReciboService } from '../../../../services/recibo.service';
import { AsadaService } from '../../../../services/asada.service';
import { ConfiguracionService } from '../../../../services/configuracion.service';
import swal from 'sweetalert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ReciboComponent implements OnInit, OnDestroy {

  recibo: Recibo;
  ruta: string;
  estado:string = 'PENDIENTE';
  subscripcion:Subscription;

  constructor(private router: Router,
              private _reciboService: ReciboService,
              public _asadaService: AsadaService,
              public _confService: ConfiguracionService) {
    if (localStorage.getItem('recibo')) {
      this.recibo = JSON.parse(localStorage.getItem('recibo'));
      if (localStorage.getItem('abonado')) {
        this.ruta = '/admin/recibos/medidor/' + this.recibo.medidor;
      }else{
        this.ruta = '/admin/recibos/' + this.recibo.periodo;
      }
      localStorage.removeItem('recibo');
    } else {
      this.router.navigate(['admin/seleccionar-periodo/recibos']);
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }

  pagarRecibo() {
    swal({
      title: "Estas seguro?",
      text: "Esta seguro de realizar el pago del recibo?",
      icon: "warning",
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.subscripcion = this._reciboService.pagarRecibo(this.recibo.id).subscribe(() => {
            this.router.navigate([this.ruta]);
          }, err => {
            console.log(err);
          })
        } else {
          swal("Aviso", "El registro no sufrio cambios!", "info");
        }
      });

  }

}
