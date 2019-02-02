import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class TipoDeMedidorService {

  constructor(private http:HttpClient, private _usuarioService:UsuarioService ) { }

  obtenerTiposDeMedidor(){
    let url = URL_SERVICIOS + `/api/tiposDeMedidores?token=${this._usuarioService.token}`;    
    return this.http.get(url);
  }

}
