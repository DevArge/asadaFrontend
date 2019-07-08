import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-anadir-reparacion',
  templateUrl: './anadir-reparacion.component.html',
  styleUrls: ['./anadir-reparacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnadirReparacionComponent implements OnInit {

  reparacion: any;
  reparacionForm: FormGroup;
  dialogTitle: string;

  constructor(public matDialogRef: MatDialogRef<AnadirReparacionComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) { 
      this.reparacionForm = this.createReparaForm();
    }

  ngOnInit() {
  }

  createReparaForm(): FormGroup {
    return this._formBuilder.group({
      tipoDeuda:['REPARACION'],
      costoTotal: ['', [Validators.required, Validators.min(0)]],
      detalleDeuda: ['']
    });
  }

}
