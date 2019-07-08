import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

@Injectable({ 
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(public _usuarioService:UsuarioService, public router:Router){}

  canActivate(): boolean {
    let token = this._usuarioService.token;
    if (token.length > 0) {
      let payload = JSON.parse(atob(token.split('.')[1]))
      let expirado = this.expirado(payload.exp);
      if (expirado) {
        return true;
      }else{
        this.router.navigate(['/admin/dashboard']);
        return false;
      }
    }else{
      return true;
    }
  }

  expirado(fechadeExp:number){
    let hora = new Date().getTime() / 1000;// esto esta en milisegundo no en segundos por eso se divide por 1000
    if (fechadeExp < hora) {
      return true;
    }else{
      return false;
    }
  }

}
