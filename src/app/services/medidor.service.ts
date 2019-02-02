import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { UsuarioService } from './usuario.service';
import { Medidor } from '../models/Medidor.model';
import { Abonado } from '../models/Abonado.model';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class MedidorService {

  constructor(private http:HttpClient, private _usuarioService:UsuarioService) { }

  crearMedidor(medidor:Medidor, abonado:Abonado){
    let url = URL_SERVICIOS + "/api/medidor?token=" + this._usuarioService.token;
    return this.http.post(url, medidor).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Al abonado '+ abonado.nombre +' '+ abonado.apellido1 +' se le ha asignado el medidor de numero: '+ resp.medidor.id +' correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', '', 'error');
        return throwError(err);
      })
    )
  }

  obtenerMedidores(desde:number, cantidad:number, columna:string, orden:string, todos:boolean){
    let todos2 = todos ? 1 : 0;
    let url = URL_SERVICIOS + `/api/medidores?todos=${todos2}&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  buscarMedidores(desde:number, cantidad:number, columna:string, orden:string, termino: Observable<string>, todos:boolean){
    let todos2 = todos ? 1 : 0;
    return termino.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term =>{
        let url = URL_SERVICIOS + `/api/medidores/buscar/${term}?todos=${todos2}&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
        return this.http.get(url)
      })
    )
  }

  actualizarMedidor(id:string, tipo:string, detalle:string){
    let url = URL_SERVICIOS + `/api/medidor/${id}?token=${this._usuarioService.token}`;
    return this.http.put(url, {idTipoDeMedidor: tipo, detalle}).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'El medidor se ha actualizado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', '', 'error');
        return throwError(err);
      })
    )
  }

  inhabilitarMedidor(id:string){
    let url = URL_SERVICIOS + `/api/medidor/${id}?token=${this._usuarioService.token}`;
    return this.http.delete(url).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'El medidor con el numero: '+ id +' ha sido inhabilitado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', '', 'error');
        return throwError(err);
      })
    )
  }

  habilitarMedidor(id:string){
    let url = URL_SERVICIOS + `/api/medidor/habilitar/${id}?token=${this._usuarioService.token}`;
    return this.http.post(url, {}).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'El medidor con el numero: '+ id +' ha sido habilitado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', '', 'error');
        return throwError(err);
      })
    )
  }

}