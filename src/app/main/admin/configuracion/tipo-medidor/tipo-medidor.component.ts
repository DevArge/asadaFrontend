import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TipoMedidor } from 'app/models/TipoMedidor.model';

@Component({
  selector: 'app-tipo-medidor',
  templateUrl: './tipo-medidor.component.html',
  styleUrls: ['./tipo-medidor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TipoMedidorComponent {

  action: string;
  tipoMedidor: TipoMedidor;
  tipoForm: FormGroup;
  dialogTitle: string;

  constructor(public matDialogRef: MatDialogRef<TipoMedidorComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
    // Set the defaults
    this.action = _data.action;
    if (this.action === 'editar') {
      this.dialogTitle = 'Tipo de Medidor';
      this.tipoMedidor = _data.tipoMedidor;
    } else {
      this.dialogTitle = 'Nuevo tipo';
      this.tipoMedidor = new TipoMedidor('','','',null);
    }
    this.tipoForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    return this._formBuilder.group({
      id:[this.tipoMedidor.id],
      nombre: [this.tipoMedidor.nombre, [Validators.required]],
      precio: [this.tipoMedidor.precio, [Validators.required, Validators.min(1)]]
    });
  }


}
