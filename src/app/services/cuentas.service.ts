import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { Observable, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { Cuenta } from '../models/Cuenta.model';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {

 

  constructor(private _usuarioService:UsuarioService, private http:HttpClient) { 
    
  }
  
  cuentasPorCobrar(desde:number, cantidad:number, columna:string, orden:string, periodo:string){
    let url = URL_SERVICIOS + `/api/recibos/cuentas?periodo=${periodo}&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  obtenerCuentas(desde:number, cantidad:number, columna:string, orden:string){
    let url = URL_SERVICIOS + `/api/cuentas?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url);
  }

  crearCuenta(cuenta:Cuenta){
    let url = URL_SERVICIOS + `/api/cuenta?token=${this._usuarioService.token}`;
    return this.http.post(url, cuenta).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Cuenta creada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', err, 'error');
        return throwError(err);
      })
    )
  }

  actualizarCuenta(cuenta:any, id:any){
    let url = URL_SERVICIOS + `/api/cuenta/${id}?token=${this._usuarioService.token}`;
    return this.http.put(url, cuenta).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Cuenta actualizada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', err, 'error');
        return throwError(err);
      })
    )
  }

  eliminarCuenta(id:number){
    let url = URL_SERVICIOS + `/api/cuenta/${id}?token=${this._usuarioService.token}`;
    return this.http.delete(url).pipe(
      map(res=>{
        swal('Acción realizada!', 'Cuenta actualizada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', 'no se puedo eliminar la cuenta', 'error');
        return throwError(err);
      })
    )
  }

  buscarCuentas(desde:number, cantidad:number, columna:string, orden:string, termino: Observable<string>){
    return termino.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term =>{
        let url = URL_SERVICIOS + `/api/abonados/buscar/${term}?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
        return this.http.get(url)
      })
    )
  }


}
