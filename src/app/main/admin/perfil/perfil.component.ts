import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { fuseAnimations } from '../../../../@fuse/animations/index';
import { UsuarioService } from '../../../services/usuario.service';
import swal from 'sweetalert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class PerfilComponent implements OnInit, OnDestroy {

  private subscripciones:Subscription[] = [];

  currentTab:string = 'Información del perfil';
  informacionForm: FormGroup;
  passwordForm: FormGroup;
  usuario:any = {nombre:'', email:'', id:''};
  

  constructor(private _formBuilder: FormBuilder, private _usuarioService:UsuarioService) { }

  ngOnInit() {
    this.cargarUsuario();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnDestroy(){
    this.subscripciones.forEach(subscripcion => subscripcion.unsubscribe());
  }

  guardarInformacion(){
    this.usuario.nombre = this.informacionForm.get('nombre').value;
    this.usuario.email = this.informacionForm.get('email').value;
    this.subscripciones.push(this._usuarioService.actualizarPerfil(this.usuario, this.usuario.id).subscribe(
        (res:any)=>{
          this._usuarioService.usuario.nombre = this.usuario.nombre;
          this._usuarioService.usuario.email = this.usuario.email;
        },err=>{
          console.log(err);
        }
      )
    )
  }

  guardarPassword(){
    this.subscripciones.push(this._usuarioService.compararPasswords(this.passwordForm.value.oldPassword).subscribe(
        (res:any)=>{
          if (this.passwordForm.value.newPassword === this.passwordForm.value.newPassword2) {
            this._usuarioService.actualizarPassword({password:this.passwordForm.value.newPassword}, this.usuario.id).subscribe(
              (res:any)=>{
                this.passwordForm = this.createPasswordForm();
              },err=> console.log(err)
            )
          }else{
            swal('Error!', 'La nueva contraseña no coincide, vuelva a repetir la contraseña', 'error');
            this.passwordForm.get('newPassword2').setValue('');
          }
        },(err:any)=>{
          this.passwordForm = this.createPasswordForm();
          swal('Error!', err.error.message, 'error');
        }
      )
    )

  }

  cargarUsuario(){
    this.informacionForm = this.createInformacionForm();
    this.subscripciones.push(this._usuarioService.obtenerUsuario().subscribe(
        (res:any)=>{
          this.usuario.id = res.usuario.id;
          this.informacionForm.get('nombre').setValue(res.usuario.nombre);
          this.informacionForm.get('email').setValue(res.usuario.email);
        },err =>{
          console.log(err);
        }
      )
    )
  }

  tabActiva(evento:MatTabChangeEvent){
    this.currentTab = evento.tab.textLabel;
  }

  createInformacionForm(): FormGroup {
    return this._formBuilder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.required]],
    });
  }

  createPasswordForm(): FormGroup {
    return this._formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      newPassword2: ['', [Validators.required]],
    });
  }

}
