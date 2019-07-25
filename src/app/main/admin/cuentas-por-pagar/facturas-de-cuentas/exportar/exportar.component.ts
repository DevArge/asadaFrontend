import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { CuentasService } from '../../../../../services/cuentas.service';
import { Subscription } from 'rxjs';
import { Cuenta } from '../../../../../models/Cuenta.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import swal from 'sweetalert';

const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es_CR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ExportarComponent implements OnDestroy {

  action: string;
  abonado: any;
  exportarForm: FormGroup;
  dialogTitle: string = 'Selecciona la cuenta y define el rango';
  subcripciones:Subscription[]=[];
  cuentas:Cuenta[] = [];

  constructor(public matDialogRef: MatDialogRef<ExportarComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _cuentasService:CuentasService
  ) {
    this.exportarForm = this.createContactForm();
    this.cargarCuentas();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe());
  }

  cargarCuentas(){
    this.subcripciones.push(this._cuentasService.obtenerCuentas(0,100,'nombre', 'ASC').subscribe(
      (res:any)=>{
        this.cuentas = res.cuentas;
      }, err=>{
        console.log(err);
      }
    ))
  }

  exportar(){
    let fechaIni = this.exportarForm.value.fechaInicio._i.year + '-' + (this.exportarForm.value.fechaInicio._i.month +1) + '-' + this.exportarForm.value.fechaInicio._i.date;
    let fechaF = this.exportarForm.value.fechaFin._i.year + '-' + (this.exportarForm.value.fechaFin._i.month+1) + '-' + this.exportarForm.value.fechaFin._i.date;
    this._cuentasService.generarReporte(this.exportarForm.value.cuenta, fechaIni, fechaF);
    swal('Generando Reporte', 'El reporte se descargará en breve', 'info');
    this.matDialogRef.close();
  }

  createContactForm(): FormGroup {
    return this._formBuilder.group({
      cuenta:['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
    });
  }

}
