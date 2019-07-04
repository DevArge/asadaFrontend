import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from '../config/config';
import { Abonado } from '../models/Abonado.model';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class AbonadoService {

  constructor(public http:HttpClient, private _usuarioService:UsuarioService) { }

  obtenerAbonados(desde:number, cantidad:number, columna:string, orden:string){
    let url = URL_SERVICIOS + `/api/abonados?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  buscarAbonados(desde:number, cantidad:number, columna:string, orden:string, termino: Observable<string>){
    return termino.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term =>{
        let url = URL_SERVICIOS + `/api/abonados/buscar/${term}?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
        return this.http.get(url)
      })
    )
  }

  crearAbonado(abonado:Abonado){
    let url = URL_SERVICIOS + `/api/abonado?token=${this._usuarioService.token}`;
    return this.http.post(url, abonado).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Abonado creado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          let mensaje = '';
          for (const prop in err.error.errors) {
            mensaje +=`* ${err.error.errors[prop]}\n`;
          }
          swal('Ah ocurrido un error!', mensaje, 'error');
          return throwError(err.error.errors);
        }
      })
    )
  } 

  actualizarAbonado(abonado:Abonado, id:any){
    let url = URL_SERVICIOS + `/api/abonado/${id}?token=${this._usuarioService.token}`;
    return this.http.put(url, abonado).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Abonado actualizado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          let mensaje = '';
          for (const prop in err.error.errors) {
            mensaje +=`* ${err.error.errors[prop]}\n`;
          }
          swal('Ah ocurrido un error!', mensaje, 'error');
          return throwError(err.error.errors);
        }
      })
    )
  }

  eliminarAbonado(id:number){
    let url = URL_SERVICIOS + `/api/abonado/${id}?token=${this._usuarioService.token}`;
    return this.http.delete(url).pipe(
      map(res=>{
        swal('Acción realizada!', 'Abonado actualizado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', 'no se puedo eliminar el abonado', 'error');
          return throwError(err);
        }
      })
    )
  }

}
