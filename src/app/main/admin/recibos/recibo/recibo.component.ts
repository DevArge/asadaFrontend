import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { Router } from '@angular/router';
import { Recibo } from '../../../../models/Recibo.model';
import { ReciboService } from '../../../../services/recibo.service';
import { AsadaService } from '../../../../services/asada.service';
import { ConfiguracionService } from '../../../../services/configuracion.service';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ReciboComponent implements OnInit {

  recibo: Recibo;
  ruta: string;

  constructor(private router: Router,
              private _reciboService: ReciboService,
              public _asadaService: AsadaService,
              public _confService: ConfiguracionService) {
    if (localStorage.getItem('recibo')) {
      this.recibo = JSON.parse(localStorage.getItem('recibo'));
      this.ruta = '/admin/recibos/' + this.recibo.periodo;
      localStorage.removeItem('recibo');
    } else {
      this.router.navigate(['admin/seleccionar-periodo/recibos']);
    }
  }

  ngOnInit() {
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
          this._reciboService.pagarRecibo(this.recibo.id).subscribe(() => {
            this.router.navigate(['admin/recibos/' + this.recibo.periodo]);
          }, err => {
            console.log(err);
          })
        } else {
          swal("Aviso", "El registro no sufrio cambios!", "info");
        }
      });

  }

}
