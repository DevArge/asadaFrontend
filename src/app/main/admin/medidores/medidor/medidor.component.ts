import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTabChangeEvent, MatTableDataSource } from '@angular/material';
import { TipoDeMedidorService } from '../../../../services/tipo-de-medidor.service';
import { DeudaService } from 'app/services/deuda.service';
import { MedidorService } from '../../../../services/medidor.service';

@Component({
  selector: 'app-medidor',
  templateUrl: './medidor.component.html',
  styleUrls: ['./medidor.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MedidorComponent implements OnInit {

  displayedColumns: string[] = ['costoTotal', 'deuda', 'plazo', 'tipoDeuda', 'estado', 'detalleDeuda', 'created_at'];
  dataSource: MatTableDataSource<any>;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;
  medidorForm: FormGroup;
  detalleBtn:boolean = true;
  medidor:any;
  tiposDeMedidores:any [] = [];
  deudas:any [] = [];

  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'created_at';
  orden:string = 'desc';
  total:number = 0;

  constructor(private _formBuilder: FormBuilder, 
              private router:Router, 
              private _tipoMedidorService:TipoDeMedidorService,
              private _deudaService:DeudaService,
              private _medidorService:MedidorService) { 
    if (localStorage.getItem('medidor')) {
      this.medidor = JSON.parse(localStorage.getItem('medidor'))
      localStorage.removeItem('medidor');
      this.medidorForm = this.createMedidorForm();
      this._tipoMedidorService.obtenerTiposDeMedidor().subscribe((res:any)=>{
        this.tiposDeMedidores = res.tiposDeMedidores;
      })
    }else{
      this.router.navigate(['/admin/medidores']);
    }
  }

  ngOnInit() {
    this.cargarDeudas();
  }

  tabActiva(evento:MatTabChangeEvent){
    if (evento.tab.textLabel == 'Deudas del medidor') {
      this.detalleBtn = false;
    }else{
      this.detalleBtn = true;
    }
  }

  cargarDeudas(){
    this.estaCargando = true;
    this._deudaService.obtenerDeudas(this.medidor.medidor, this.desde, this.cantidad, this.columna, this.orden).subscribe(
      (res:any)=>{
        this.total = res.total;
        this.deudas = res.deudas;
        this.dataSource = new MatTableDataSource(res.deudas);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      }
    )
  }


  guardarDetalle(){
    console.log(this.medidorForm.value);
    this._medidorService.actualizarMedidor(this.medidor.medidor, this.medidorForm.value.idTipoDeMedidor, this.medidorForm.value.detalle).subscribe(res=>{
      console.log('Se actulizo');
      
    })
    
  }

  editarDeuda(deuda:any){
    swal("Deuda pendiente por pagar:", {
      content: {
        element: 'input',
        attributes: {
          type: 'number',
          defaultValue: deuda.deuda,
        }
      },
      buttons:['Cancelar', 'Actualizar'],
    })
    .then((value) => {
      if (value == deuda.deuda || value == '' || value == null) {
        swal('No se ha realizado ningún cambio', '','info');
      }else{
        let valido = this.multiplo(value, deuda);
        if (!valido) {
          swal('Error', 'El nuevo valor de la deuda debe de ser un multiplo de la división del total de la deuda por el plazo o bien cero para cancelar la deuda.','error');          
        }else{
          this._deudaService.actualizarDeuda(deuda.id, value).subscribe(res=>{
            this.cargarDeudas();
          })
        }
      }
    });
  }

  multiplo(valor:any, deuda:any){
    if (valor === 0) {
      return true;
    }
    let abono = deuda.costoTotal / deuda.plazo;
    let suma = 0;
    while (suma <= deuda.costoTotal) {
        if (suma == valor) {
            return true;
        }
        suma = suma + abono;
    }
    return false;
  }

  createMedidorForm(): FormGroup{
    return this._formBuilder.group({
      estado            : [{value: this.medidor.estado, disabled: true }],
      idTipoDeMedidor   : [this.medidor.idTipoDeMedidor, Validators.required],
      detalle           : [this.medidor.detalle],
    });
  }

  ///==================== TABLA ======================//

  ordenarColumna(evento:any){
    if (evento.direction == '') {
      this.columna = 'created_at';
      this.orden = 'desc';
    }else{
      this.columna = evento.active;
      this.orden = evento.direction;
    }
    this.desde = 0;
    this.cargarDeudas();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarDeudas();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarDeudas();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarDeudas();
  }

}
