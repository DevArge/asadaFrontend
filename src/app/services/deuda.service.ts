import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { UsuarioService } from './usuario.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  constructor(private http:HttpClient, private _usuarioService:UsuarioService) { }
  
  obtenerDeudas(idMedidor:string, desde:number, cantidad:number, columna:string, orden:string){
    let url = URL_SERVICIOS + `/api/medidor/deudas/${idMedidor}?&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url);
  }

  anadirReparacion(idMedidor:string, deuda:any){
    let url = URL_SERVICIOS + `/api/medidor/deuda/${idMedidor}?token=${this._usuarioService.token}`;
    return this.http.post(url, deuda).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', `Se ha añadido una reparación al medidor: ${idMedidor}`, 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', '', 'error');
          return throwError(err);
        }
      })
    )
  }

  actualizarDeuda(idDeuda:string, deuda:number){
    let url = URL_SERVICIOS + `/api/medidor/deuda/${idDeuda}?token=${this._usuarioService.token}`;
    return this.http.put(url, {deuda}).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', `La deuda se ha actualizado correctamente`, 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', '', 'error');
          return throwError(err);
        }
      })
    )
  }

}
