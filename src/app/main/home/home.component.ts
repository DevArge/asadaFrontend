import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations/index';
import { IImage } from 'intouch-screensaver';
import { ConfiguracionService } from '../../services/configuracion.service';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class HomeComponent implements OnInit, OnDestroy {

  imageUrls: (string | IImage)[] = [
    { url: 'assets/images/slider/1.jpg', type: 'image' },
    { url: 'assets/images/slider/2.jpg', type: 'image' },
    { url: 'assets/images/slider/3.jpg', type: 'image' },
    // { url: 'assets/redbull.mp4', type: 'video' }
  ];
  subscripcion:Subscription;
  precios:any;
  usuario:String;;

  constructor(private _fuseConfigService: FuseConfigService, private _configuracion:ConfiguracionService) { 
    this._fuseConfigService.config = {
      layout: {
          style:'vertical-layout-2',
      }
    };
  }

  ngOnInit() {
    this.cargarPrecios();
  }

  ngOnDestroy(){
    this.subscripcion.unsubscribe();
  }

  cargarPrecios(){
    this.subscripcion = this._configuracion.obtenerPrecios().subscribe(
      (res:any)=>{
        this.precios = res.configuracion;
      }, err=>{
        console.log(err);
      }
    )
  }

}
