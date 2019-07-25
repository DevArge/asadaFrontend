import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { UsuarioService } from './usuario.service';
import { Observable, throwError, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class ReciboService {

  constructor(private http:HttpClient, private _usuarioService:UsuarioService) { 

  }

  public cargarRecibosDeUnAbonado(desde:number, cantidad:number, columna:string, orden:string, idAbonado:string): Observable<any[]> {
    let url = URL_SERVICIOS + `/api/recibos/abonado/${idAbonado}?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    let url2 = URL_SERVICIOS + `/api/recibos/abonadoPendiente/${idAbonado}?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    let response1 = this.http.get(url);
    let response2 = this.http.get(url2);
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([response1, response2]);
  }

  cargarRecibos(desde:number, cantidad:number, columna:string, orden:string, periodo:string){
    let url = URL_SERVICIOS + `/api/recibos?periodo=${periodo}&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  cargarRecibosUnMedidor(desde:number, cantidad:number, columna:string, orden:string, idMedidor:string){
    let url = URL_SERVICIOS + `/api/recibos/medidor/${idMedidor}?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  buscarRecibos(desde:number, cantidad:number, columna:string, orden:string, termino: Observable<string>,  tipo:string, periodo:string = null, idMedidor:string = null){
    let params = '';
    if (periodo == null) {
      params = 'idMedidor=' + idMedidor;
    }else{
      params = 'periodo=' + periodo;
    }
    return termino.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term =>{
        let url = URL_SERVICIOS + `/api/recibos/buscar/${tipo}/${term}?${params}&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
        return this.http.get(url)
      })
    )
  }

  pagarRecibo(id:String){
    let url = URL_SERVICIOS + `/api/recibo/${id}?token=${this._usuarioService.token}`;
    return this.http.put(url, {}).pipe(
      map(res=>{
        swal('Acción realizada!', 'Recibo pagado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', 'no se puedo pagar el recibo', 'error');
          return throwError(err);
        }
      })
    )
  }

  eliminarRecibo(id:string){
    let url = URL_SERVICIOS + '/api/recibo/' + id + '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map((res:any)=>{
        if (!res.ok) {
          swal('Ah ocurrido un error!', res.message, 'error');    
          return false;      
        }else{
          swal('Acción realizada!', 'Recibo eliminado correctamente', 'success');
          return true;
        }
      }),
      catchError(err=>{
        if (err.status ===  401){
          swal('Ah ocurrido un error!', 'no se puedo eliminar el recibo', 'error');
          return throwError(err);
        }
      })
    )
  }

  actualizarFecha(periodo:string, vence:Date){
    let url = URL_SERVICIOS + `/api/fecha-vencimiento?token=${this._usuarioService.token}`;
    return this.http.put(url, {periodo, vence}).pipe(
      map(res=>{
        swal('Acción realizada!', 'Fecha actualizada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        if (err.status ===  401){
        }else{
          swal('Ah ocurrido un error!', 'no se puedo actualizar la fecha', 'error');
          return throwError(err);
        }
      })
    )
  }

  generarPDF(id:string){
    window.open(URL_SERVICIOS + '/recibo/pdf/'+ id + '?token=' + this._usuarioService.token);
  }

  exportarExcel(periodo:string){
    window.open(URL_SERVICIOS + '/reporte/excel/'+ periodo + '?token=' + this._usuarioService.token);
  }

}