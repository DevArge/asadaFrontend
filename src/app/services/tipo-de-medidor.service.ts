import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from '../config/config';
import { TipoMedidor } from '../models/TipoMedidor.model';
import swal from 'sweetalert';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoDeMedidorService {

  constructor(private http:HttpClient, private _usuarioService:UsuarioService ) { }

  obtenerTiposDeMedidor(){
    let url = URL_SERVICIOS + `/api/tiposDeMedidores?token=${this._usuarioService.token}`;    
    return this.http.get(url);
  }

  crearTipoMedidor(tipo:TipoMedidor){
    let url = URL_SERVICIOS + `/api/tipoDeMedidor?token=${this._usuarioService.token}`;
    return this.http.post(url, tipo).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Tipo de Medidor creado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', 'No se pudo crear el tipo de medidor', 'error');
          return throwError(err.error.errors);
        }
      })
    )
  } 

  actualizarTipoMedidor(tipo:TipoMedidor, id:any){
    let url = URL_SERVICIOS + `/api/tipoDeMedidor/${id}?token=${this._usuarioService.token}`;
    return this.http.put(url, tipo).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Tipo de Medidor actualizado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', 'No se pudo actualizar el tipo de medidor', 'error');
          return throwError(err.error.errors);
        }
      })
    )
  }

  eliminarTipoMedidor(id:number){
    let url = URL_SERVICIOS + `/api/tipoDeMedidor/${id}?token=${this._usuarioService.token}`;
    return this.http.delete(url).pipe(
      map(res=>{
        swal('Acción realizada!', 'Tipo de Medidor actualizado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', 'no se puedo eliminar el Tipo de Medidor', 'error');
          return throwError(err);
        }
      })
    )
  }
}
