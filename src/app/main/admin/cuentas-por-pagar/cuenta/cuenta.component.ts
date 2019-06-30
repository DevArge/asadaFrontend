import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Cuenta } from 'app/models/Cuenta.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CuentaComponent{

  action: string;
  cuenta: Cuenta;
  cuentaForm: FormGroup;
  dialogTitle: string;

  constructor(public matDialogRef: MatDialogRef<CuentaComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) {
    // Set the defaults
    this.action = _data.action;
    if (this.action === 'editar') {
      this.dialogTitle = 'Cuenta';
      this.cuenta = _data.cuenta;
    } else {
      this.dialogTitle = 'Nueva Cuenta';
      this.cuenta = new Cuenta('','','','','');
    }
    this.cuentaForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    return this._formBuilder.group({
      id:[this.cuenta.id],
      codigo: [this.cuenta.codigo, [Validators.required]],
      nombre: [this.cuenta.nombre, [Validators.required]],
      tipo: [this.cuenta.tipo, [Validators.required]],
      presupuesto: [this.cuenta.presupuesto, [Validators.required]],
      descripcion: [this.cuenta.descripcion, [Validators.required]]
    });
  }
}
