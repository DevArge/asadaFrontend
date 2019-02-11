import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { URL_SERVICIOS } from '../config/config';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  idConfiguracionRecibo:string;
  impuestoRetraso:number;
  notificacion:string;
  notificacionDefault:string;
  fechaInicio:Date;
  fechaFin:Date;

  constructor(private http:HttpClient, private _usuarioService:UsuarioService) { 
    this.obtenerConfiguracion().subscribe((res:any)=>{
      this.idConfiguracionRecibo = res.configuracion.id;
      this.impuestoRetraso = res.configuracion.impuestoRetraso;
      this.notificacion = res.configuracion.notificacion;
      this.notificacionDefault = res.configuracion.notificacionDefault;
      this.fechaInicio = res.configuracion.fechaInicio;
      this.fechaFin = res.configuracion.fechaFin;
    })
  }

  ////// RECIBOS ////
  obtenerConfiguracion(){
    let url = URL_SERVICIOS + '/api/configuracion-recibos?token=' + this._usuarioService.token;
    return this.http.get(url); 
  }

  actualizarConfiguracion(impuestoRetraso:number, notificacion:string, notificacionDefault:string, fechaInicio:Date,fechaFin:Date){
    let url = URL_SERVICIOS + `/api/configuracion-recibos/${this.idConfiguracionRecibo}?token=${this._usuarioService.token}`;
    return this.http.put(url, {impuestoRetraso,notificacion,notificacionDefault,fechaInicio,fechaFin}).pipe(
      map((res:any)=>{
        swal('Acción realizada!', 'Configuracion actualizada correctamente', 'success');
        this.idConfiguracionRecibo = res.configuracion.id;
        this.impuestoRetraso = res.configuracion.impuestoRetraso;
        this.notificacion = res.configuracion.notificacion;
        this.notificacionDefault = res.configuracion.notificacionDefault;
        this.fechaInicio = res.configuracion.fechaInicio;
        this.fechaFin = res.configuracion.fechaFin;
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', 'no se puedo actualizar la configuración', 'error');
        return throwError(err);
      })
    )
  }
}
