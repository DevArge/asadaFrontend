import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Usuario } from '../../../../models/Usuario.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsuarioComponent {

  action: string;
  usuario: Usuario;
  usuarioForm: FormGroup;
  dialogTitle: string;
  roles:string[] = ['FONTANERO_ROLE', 'SECRETARIA_ROLE', 'ADMIN_ROLE'];

  constructor(public matDialogRef: MatDialogRef<UsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) {
    // Set the defaults
    this.action = _data.action;
    if (this.action === 'editar') {
      this.dialogTitle = 'Usuario';
      this.usuario = _data.usuario;
      
    } else {
      this.dialogTitle = 'Nuevo Usuario';
      this.usuario = new Usuario('','','','');
    }
    this.usuarioForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    let disab = this.usuario.id ? true : false;
    return this._formBuilder.group({
      id:[this.usuario.id],
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      role: [this.usuario.role, [Validators.required]],
      password: [{value:'', disabled:disab}, [Validators.required]],
    });
  }

}
