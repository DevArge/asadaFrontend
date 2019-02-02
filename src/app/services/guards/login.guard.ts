import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
 
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
 
  constructor(public _usuarioService:UsuarioService, public route:Router){}

  canActivate() {
    if (this._usuarioService.estaLogeado()) {
      return true;
    }else{
      console.log('bloqueado por el guard');
      this.route.navigate(['login'])
      return false;
    }    
  }
}
