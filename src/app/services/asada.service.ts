import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from '../config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsadaService {

  nombre:string;
  cedulaJuridica:string;
  telefono:string;
  direccion:string

  constructor(private http:HttpClient, private _usuarioService:UsuarioService) { 
    this.obtenerAsada().subscribe((res:any)=>{
      this.nombre = res.asada.nombre;
      this.cedulaJuridica = res.asada.cedulaJuridica;
      this.telefono = res.asada.telefono;
      this.direccion = res.asada.direccion;
    })
  }

  obtenerAsada(){
    let url = URL_SERVICIOS + '/api/asada?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  actualizarAsada(nombre:string, cedulaJuridica:string,  telefono:string, direccion:string, id:string){
    let url = URL_SERVICIOS + `/api/asada/${id}?token=` + this._usuarioService.token;
    return this.http.put(url, {nombre, cedulaJuridica, telefono, direccion}).pipe(
      map(res=>{
        swal('Acción realizada!', 'ASADA actualizada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', 'no se puedo actualizar la ASADA', 'error');
        return throwError(err);
      })
    )
  }
}
