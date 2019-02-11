import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from '../config/config';
import { Observable, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class LecturaService {

  constructor(private http:HttpClient, private _usuarioService:UsuarioService) { }

  obtenerInsertarLecturas(desde:number, cantidad:number, columna:string, orden:string, periodo:string){
    let url = URL_SERVICIOS + `/api/insertar-lecturas?periodo=${periodo}&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  obtenerLecturas(desde:number, cantidad:number, columna:string, orden:string, periodo:string){
    let url = URL_SERVICIOS + `/api/lecturas?periodo=${periodo}&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  obtenerLecturasDeUnMedidor(desde:number, cantidad:number, columna:string, orden:string, id:string){
    let url = URL_SERVICIOS + `/api/lecturas/medidor/${id}?&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  buscarLecturas(desde:number, cantidad:number, columna:string, orden:string, termino: Observable<string>,  tipo:string, funcion:string, periodo:string = null, idMedidor:string = null){
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
        let url = URL_SERVICIOS + `/api/lecturas/buscar/${tipo}/${term}?${params}&tipo=${funcion}&desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
        return this.http.get(url)
      })
    )
  }

  guardarLectura(idMedidor:string, lectura:number, periodo:string, nota:string = ''){
    let url = URL_SERVICIOS + `/api/lectura?token=${this._usuarioService.token}`;
    let objeto ={
      idMedidor, lectura, periodo, nota
    }
    return this.http.post(url, objeto).pipe(
      map((resp:any)=>{
        this.mostrarSWA('Guardada', 'La lectura se guardo correctamente!', 3000, 'success');
        return true;
      }),
      catchError(err=>{
        if (!err.error.ok) {
          this.mostrarSWA('Error', err.error.message, 4000, 'error');
        }else{
          swal('Ah ocurrido un error interno!', '', 'error');
        }
        return throwError(err.error.message);
      })
    )
  }

  mostrarSWA(titulo:string, msj:string, tiempo:number, tipo:string){
    let opciones = null;
    if (tipo == 'error') {
      opciones = {
        title: titulo,
        text: msj,
        icon: tipo,
      }
    }else{
      opciones = {
        title: titulo,
        text: msj,
        timer: tiempo,
        icon: tipo,
        button: false,
      }
    }
    swal(opciones);
  }


}
