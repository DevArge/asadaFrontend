import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { URL_SERVICIOS } from '../config/config';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import swal from 'sweetalert';
import { Precio } from '../models/Precio.model';
import { isObject } from 'util';

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

  ///// PRECIOS ////
  obtenerPrecios(){
    let url = URL_SERVICIOS + '/api/configuracion-medidores?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  actualizarPrecios(precio:Precio, id:string){
      let url = URL_SERVICIOS + `/api/configuracion-medidores/${id}?token=` + this._usuarioService.token;
      return this.http.put(url, precio).pipe(
        map(res=>{
          swal('Acción realizada!', 'Datos actualizados correctamente', 'success');
          return true;
        }),
        catchError(err=>{
          if (err.status ===  401){
          }else{
            swal('Ah ocurrido un error!', 'No se ha podido actualizar los precios', 'error');
            return throwError(err);
          }
        })
      )
  }

  ////// RECIBOS ////
  obtenerConfiguracion(){
    let url = URL_SERVICIOS + '/api/configuracion-recibos?token=' + this._usuarioService.token;
    return this.http.get(url); 
  }

  actualizarConfiguracion(idConfig:number, notificacion:string, notificacionDefault:string, fechaInicio:any,fechaFin:any){

    let url = URL_SERVICIOS + `/api/configuracion-recibos/${idConfig}?token=${this._usuarioService.token}`;
    return this.http.put(url,  {
      notificacion,
      notificacionDefault,
      fechaInicio,
      fechaFin
    }).pipe(
      map((res:any)=>{
        swal('Acción realizada!', 'Datos actualizados correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', 'No se puedo actualizar la configuración', 'error');
          return throwError(err);
        }
      })
    )
  }

  actualizarImpuestoRetraso(id:number, impuestoRetraso:number){
    let url = URL_SERVICIOS + `/api/configuracion-recibos/${id}?token=${this._usuarioService.token}`;
    return this.http.put(url, {impuestoRetraso}).pipe(
      map((res:any)=>{
        swal('Acción realizada!', 'Datos actualizados correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', 'no se puedo actualizar la configuración', 'error');
          return throwError(err);
        }
      })
    )
  }
}
