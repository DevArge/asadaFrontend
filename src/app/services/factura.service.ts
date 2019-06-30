import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private _usuarioService:UsuarioService, private http:HttpClient) { }

  obtenerFacturas(desde:number, cantidad:number, columna:string, orden:string){
    let url = URL_SERVICIOS + `/api/facturas?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  buscarFactura(desde:number, cantidad:number, columna:string, orden:string, termino: Observable<string>){
    return termino.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term =>{
        let url = URL_SERVICIOS + `/api/facturas/buscar/${term}?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
        return this.http.get(url)
      })
    )
  }
  
  crearFactura(factura:any){
    let url = URL_SERVICIOS + `/api/factura?token=${this._usuarioService.token}`;
    return this.http.post(url, factura).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Factura creada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        console.log(err);
        return throwError(err);
      })
    )
  }
  
  obtenerFactura(id:any){
    let url = URL_SERVICIOS + `/api/factura/${id}?token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  actualizarFactura(factura:any, id:any){
    let url = URL_SERVICIOS + `/api/factura/${id}?token=${this._usuarioService.token}`;
    return this.http.put(url, factura).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Factura actualizada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        console.log(err);
        return throwError(err);
      })
    )
  }

  eliminarFactura(id:number){
    let url = URL_SERVICIOS + `/api/factura/${id}?token=${this._usuarioService.token}`;
    return this.http.delete(url).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Factura eliminada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        console.log(err);
        return throwError(err);
      })
    )
  }

}
