import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { URL_SERVICIOS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient, private _usuarioService:UsuarioService) { }

  obtenerMetrosPorPeriodo(){
    let url = URL_SERVICIOS + '/api/dashboard?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

}
