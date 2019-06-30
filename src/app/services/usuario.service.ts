import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Usuario } from '../models/Usuario.model';
import * as jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  token:string;
 
  constructor(private http?:HttpClient, private router?:Router) { 
    this.cargarStorage();
  }


  obtenerUsuarios(desde:number, cantidad:number, columna:string, orden:string){
    let url = URL_SERVICIOS + `/api/usuarios?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this.token}`;
    return this.http.get(url); 
  }

  obtenerUsuario(){
    let url = URL_SERVICIOS + `/api/usuario/${this.usuario.id}?token=${this.token}`;
    return this.http.get(url); 
  }

  buscarUsuarios(desde:number, cantidad:number, columna:string, orden:string, termino: Observable<string>){
    return termino.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term =>{
        let url = URL_SERVICIOS + `/api/usuarios/buscar/${term}?desde=${desde}&cantidad=${cantidad}&columna=${columna}&orden=${orden}&token=${this.token}`;
        return this.http.get(url)
      })
    )
  }

  crearUsuario(usuario:Usuario){
    let url = URL_SERVICIOS + `/api/usuario?token=${this.token}`;
    return this.http.post(url, usuario).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Usuario creado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        let mensaje = '';
        for (const prop in err.error.errors) {
          mensaje +=`* ${err.error.errors[prop]}\n`;
        }
        swal('Ah ocurrido un error!', mensaje, 'error');
        return throwError(err.error.errors);
      })
    )
  } 

  actualizarUsuario(usuario:any, id:any){
    let url = URL_SERVICIOS + `/api/usuario/${id}?token=${this.token}`;
    return this.http.put(url, usuario).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Usuario actualizado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        let mensaje = '';
        for (const prop in err.error.errors) {
          mensaje +=`* ${err.error.errors[prop]}\n`;
        }
        swal('Ah ocurrido un error!', mensaje, 'error');
        return throwError(err.error.errors);
      })
    )
  }

  actualizarPassword(password:any, id:any){
    let url = URL_SERVICIOS + `/api/actualizarPassword/${id}?token=${this.token}`;
    return this.http.put(url, password).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Contraseña actualizada correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        return throwError(err);
      })
    )
  }

  actualizarPerfil(usuario:Usuario, id:any){
    let url = URL_SERVICIOS + `/api/actualizarPerfil/${id}?token=${this.token}`;
    return this.http.put(url, usuario).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Usuario actualizado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        return throwError(err);
      })
    )
  }

  eliminarUsuario(id:number){
    let url = URL_SERVICIOS + `/api/usuario/${id}?token=${this.token}`;
    return this.http.delete(url).pipe(
      map(res=>{
        swal('Acción realizada!', 'Usuario eliminado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        swal('Ah ocurrido un error!', 'no se puedo eliminar el usuario', 'error');
        return throwError(err);
      })
    )
  }


  // ============ SESION DE USUARIO ==============

  compararPasswords(password:string){
    let url = URL_SERVICIOS + `/api/compararpassword/${this.usuario.id}?token=${this.token}`;
    return this.http.post(url, {password}).pipe(
      map((resp:any)=>{
        return true;
      }),
      catchError(err=>{
        return throwError(err);
      })
    )
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
