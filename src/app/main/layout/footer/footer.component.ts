import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsadaService } from '../../../services/asada.service';
import { Subscription } from 'rxjs';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  asada:any;
  subcripcion:Subscription[]=[];
  nombre:string = "";
  contacto:string = "";
  mensaje:string = "";
  estaCargando:boolean = false;

  constructor(private _asadaService:AsadaService, private _emailService:EmailService) { 
    this.cargarAsada();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subcripcion.forEach(sub => sub.unsubscribe());
  }

  enviar(){
    this.estaCargando = true;
    this.subcripcion.push(this._emailService.enviarReporte(this.nombre, this.contacto, this.mensaje).subscribe(
      res=>{
        this.estaCargando = false;
        this.nombre = ""
        this.contacto = ""
        this.mensaje = ""
      },err =>{
        this.estaCargando = false;
        this.nombre = ""
        this.contacto = ""
        this.mensaje = ""
        console.log(err);
      }
    ))
  }

  validar(){
    if (this.nombre.length && this.contacto.length && this.mensaje.length) {
      return true;
    }else{
      return false;
    }
  }

  cargarAsada(){
    this.subcripcion.push( this._asadaService.obtenerAsada().subscribe(
      (res:any)=>{
        this.asada = res.asada;
      },err=>{
        console.log(err);
      }
    ))
  }

}
