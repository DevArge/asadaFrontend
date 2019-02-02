import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Abonado } from '../../../../models/Abonado.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-abonado',
  templateUrl: './abonado.component.html',
  styleUrls: ['./abonado.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AbonadoComponent {

  action: string;
  abonado: Abonado;
  abonadoForm: FormGroup;
  dialogTitle: string;

  constructor(public matDialogRef: MatDialogRef<AbonadoComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
    // Set the defaults
    this.action = _data.action;
    if (this.action === 'editar') {
      this.dialogTitle = 'Abonado';
      this.abonado = _data.abonado;
    } else {
      this.dialogTitle = 'Nuevo Abonado';
      this.abonado = new Abonado('','','','','', '');
    }
    this.abonadoForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    return this._formBuilder.group({
      id:[this.abonado.id],
      cedula: [this.abonado.cedula, [Validators.required]],
      nombre: [this.abonado.nombre, [Validators.required]],
      apellido1: [this.abonado.apellido1, [Validators.required]],
      apellido2: [this.abonado.apellido2, [Validators.required]],
      telefono: [this.abonado.telefono, [Validators.required]],
      email: [this.abonado.email, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      plano: [this.abonado.plano],
      direccion: [this.abonado.direccion]
    });
  }

}
