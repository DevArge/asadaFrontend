import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Usuario } from '../models/Usuario.model';
import * as jwt_decode from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  token:string;
 
  constructor(private http:HttpClient, private router:Router) { 
    this.cargarStorage();
  }

  login(usuario:Usuario, recuerdame:boolean= false){
    let url = URL_SERVICIOS + '/api/login';
    if (recuerdame) {
      localStorage.setItem('email', `${usuario.email}`)
    }else{
      localStorage.removeItem('email')
    } 
    return this.http.post(url, usuario)
        .pipe(
          map((resp:any)=>{
            let payload = this.getDecodedAccessToken(resp.token);
            this.usuario.nombre = payload.nombre;
            this.usuario.email = payload.email;
            this.usuario.role = payload.role;
            this.usuario.id = payload.sub;
            this.token = resp.token;
            this.guardarStorage(payload.sub, resp.token, this.usuario);
            return true;
          }),
          catchError(err =>{
            // console.log(err.error.mensaje);
            // swal('Error en el login', err.error.mensaje, 'error')
            console.log('error:', err);
            return throwError(err)
          })
        );
  }

  logout(){
    this.usuario = {
      nombre: '',
      email: '',
      role: '',
      password:''
    };
    let url = URL_SERVICIOS + '/api/logout';
    return this.http.post(url,{token: this.token})
    .pipe(
      map((resp:any)=>{
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.router.navigate(['/login']);
        this.token = '';
        return true;
        })
      )
  }


  guardarStorage(id:string, token:string, usuario:Usuario){
    localStorage.setItem('id', id);
    localStorage.setItem('usuario',JSON.stringify(usuario));
    localStorage.setItem('token', token);
  }

  cargarStorage(){
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = {
        nombre: '',
        email: '',
        role: '',
        password:''
      };
    }
  }

  estaLogeado(){
    return (this.token.length > 5) ? true :false;
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  renuevaToken(){
    let url = URL_SERVICIOS + '/api/renuevatoken';
    url += '?token=' + this.token;
    return this.http.get(url)
        .pipe(
          map((resp:any)=>{
            this.token = resp.token;
            localStorage.setItem('token', this.token);  
            return true;
          }),
          catchError(err =>{
            this.router.navigate(['/login'])
            console.log('ERROR:', err);
            // swal('No se pudo renovar token','No es posible renovar token', 'error')
            return throwError(err)
          })
        );
  }
}
