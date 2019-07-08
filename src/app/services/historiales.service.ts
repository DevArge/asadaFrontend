import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from '../config/config';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistorialesService {

  constructor(private http:HttpClient, private _usuarioService:UsuarioService) { 

  }

  cargarHistorial(desde:number, cantidad:number, columna:string, orden:string){
    let url = URL_SERVICIOS + `/api/historial?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
    return this.http.get(url); 
  }

  // buscarRecibos(desde:number, cantidad:number, columna:string, orden:string, termino: Observable<string>){
  //   return termino.pipe(
  //     debounceTime(400),
  //     distinctUntilChanged(),
  //     switchMap(term =>{
  //       let url = URL_SERVICIOS + `/api/recibos/buscar/desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this._usuarioService.token}`;
  //       return this.http.get(url)
  //     })
  //   )
  // }
}
