import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(public http:HttpClient, private _usuarioService:UsuarioService) { }

  enviarReporte(nombre:string, contacto:string, mensaje:string){
    let url = URL_SERVICIOS + `/api/correo?token=${this._usuarioService.token}`;
    return this.http.post(url, {nombre, contacto, mensaje}).pipe(
      map((resp:any)=>{
        swal('Acción realizada!', 'Mensaje enviado correctamente', 'success');
        return true;
      }),
      catchError(err=>{
        return throwError(err);
      })
    )
  } 
}
