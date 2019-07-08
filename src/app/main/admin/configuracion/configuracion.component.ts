import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '../../../../@fuse/animations/index';
import { TipoDeMedidorService } from '../../../services/tipo-de-medidor.service';
import { MatTabChangeEvent, MatTableDataSource, MatDialog, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { ConfiguracionService } from '../../../services/configuracion.service';
import { TipoMedidor } from '../../../models/TipoMedidor.model';
import { TipoMedidorComponent } from './tipo-medidor/tipo-medidor.component';
import swal from 'sweetalert';
import { AsadaService } from '../../../services/asada.service';
import { MomentDateAdapter,  } from '@angular/material-moment-adapter';
import { Subscription } from 'rxjs';

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
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es_CR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ConfiguracionComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['nombre', 'precio'];
  dataSource: MatTableDataSource<TipoMedidor>;
  dialogRef: any;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;
  minDate:any = new Date();

  preciosForm: FormGroup;
  impuestosForm: FormGroup;
  asadaForm: FormGroup;
  notificacionForm: FormGroup;
  tiposDeMedidores:any [] = [];
  currentTab:string = 'Valor del metro';
  subcripciones:Subscription [] = [];

  constructor(private _formBuilder: FormBuilder, 
              private _matDialog:MatDialog,
              private _tipoMedidorService:TipoDeMedidorService,
              private _asadaService:AsadaService,
              private _configuracionService:ConfiguracionService) {
  }

  ngOnInit() {
    this.cargarPrecios();
    this.cargarImpuestos();
    this.cargarTiposMedidor();
    this.cargarAsada();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe());
  }

  tabActiva(evento:MatTabChangeEvent){
    this.currentTab = evento.tab.textLabel;
  }

  cargarAsada(){
    this.asadaForm = this.createConfAsada();
    this.subcripciones.push( this._asadaService.obtenerAsada().subscribe(
      (res:any)=>{
        this.asadaForm.get('id').setValue(res.asada.id);
        this.asadaForm.get('nombre').setValue(res.asada.nombre);
        this.asadaForm.get('cedulaJuridica').setValue(res.asada.cedulaJuridica);
        this.asadaForm.get('telefono').setValue(res.asada.telefono);
        this.asadaForm.get('direccion').setValue(res.asada.direccion);
      })
    )
  }

  cargarPrecios(){
    this.preciosForm = this.createPreciosForm();
    this.subcripciones.push( this._configuracionService.obtenerPrecios().subscribe(
      (res:any)=>{
        this.preciosForm.get('id').setValue( res.configuracion.id);
        this.preciosForm.get('unoAdiez').setValue( res.configuracion.unoAdiez);
        this.preciosForm.get('onceAtreinta').setValue( res.configuracion.onceAtreinta);
        this.preciosForm.get('treintaYunoAsecenta').setValue( res.configuracion.treintaYunoAsecenta);
        this.preciosForm.get('masDeSecenta').setValue( res.configuracion.masDeSecenta);
        this.impuestosForm.get('id').setValue(res.configuracion.id);
        this.impuestosForm.get('impuestoHidrante').setValue(res.configuracion.impuestoHidrante);
        this.impuestosForm.get('impuestoReactivacion').setValue(res.configuracion.impuestoReactivacion);
      }, err=>{
        alert(err);
      })
    )
  }

  cargarImpuestos(){//recibo
    this.impuestosForm = this.createImpuestosForm();   
    this.notificacionForm = this.createConfRecibo(); 
    this.subcripciones.push( this._configuracionService.obtenerConfiguracion().subscribe(
      (res:any)=>{
        this.impuestosForm.get('impuestoRetraso').setValue(res.configuracion.impuestoRetraso);
        this.notificacionForm.get('id').setValue(res.configuracion.id);
        this.notificacionForm.get('notificacion').setValue(res.configuracion.notificacion);
        this.notificacionForm.get('notificacionDefault').setValue(res.configuracion.notificacionDefault);
        this.notificacionForm.get('fechaInicio').setValue(res.configuracion.fechaInicio);
        this.notificacionForm.get('fechaFin').setValue(res.configuracion.fechaFin);
      }, err=>{
        alert(err);
      })
    )
  }

  cargarTiposMedidor(){
    this.estaCargando = true;
    this.subcripciones.push( this._tipoMedidorService.obtenerTiposDeMedidor().subscribe(
      (res:any)=>{
        this.tiposDeMedidores = res.tiposDeMedidores;  
        this.dataSource = new MatTableDataSource(this.tiposDeMedidores);  
        this.estaCargando = false;    
      },err=>{
        alert(err);
        this.estaCargando = false;
      })
    )
  }

  editarTipo(tipoMedidor:TipoMedidor){
    this.dialogRef = this._matDialog.open(TipoMedidorComponent, {
      panelClass: 'abonado-form-dialog',
      data      : {
          tipoMedidor,
          action : 'editar'
      }
    });
    this.subcripciones.push( this.dialogRef.afterClosed()
      .subscribe(response => {
          if ( !response ){
              return;
          }
          const actionType: string = response[0];
          const formData: FormGroup = response[1];
          switch ( actionType ) {
              case 'guardar':
                let tipo:TipoMedidor = formData.getRawValue();
                this._tipoMedidorService.actualizarTipoMedidor(tipo, tipo.id).subscribe((res)=>{
                  this.cargarTiposMedidor();
                },err=>{
                  console.log(err);
                })
                break;
              case 'eliminar':  
                this.mostrarSWAEliminar(formData.getRawValue().id);
                break;
          }
      })
    )
  }

  AgregarTipoMedidor(){
    this.dialogRef = this._matDialog.open(TipoMedidorComponent, {
      panelClass: 'abonado-form-dialog',
          data: {
          action: 'nuevo'
      }
    });
    this.subcripciones.push( this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
          if ( !response ){
              return;
          }
          let tipo:TipoMedidor = response.getRawValue();
          this._tipoMedidorService.crearTipoMedidor(tipo).subscribe(
            res=>{
              this.cargarTiposMedidor();           
            },err=>{
              console.log(err);
            });
      })
    )
  }

  mostrarSWAEliminar(id:number){
    swal({
      title: "Estas seguro?",
      text: "El Tipo de Medidor sera elimnado de los registros!",
      icon: "warning",
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this._tipoMedidorService.eliminarTipoMedidor(id).subscribe((res)=>{
          this.cargarTiposMedidor();
        })
      } else {
        swal("El registro no sufrio cambios!", "", "info");
      }
    });
  }

  guardarMetros(){
    this.subcripciones.push( this._configuracionService.actualizarPrecios(this.preciosForm.value, this.preciosForm.value.id).subscribe(
      res=>{
        this.cargarPrecios();           
      },err=>{
        console.log(err);
      })
    )
  }

  guardarImpuestos(){
    let precio:any = { 
        impuestoHidrante: this.impuestosForm.get('impuestoHidrante').value, 
        impuestoReactivacion : this.impuestosForm.get('impuestoReactivacion').value};
    this.subcripciones.push( this._configuracionService.actualizarPrecios(precio, this.impuestosForm.get('id').value).subscribe(
      (res:any)=>{
        this.subcripciones.push( this._configuracionService.actualizarImpuestoRetraso(this.notificacionForm.value.id, this.impuestosForm.get('impuestoRetraso').value).subscribe(
          (res)=>{
            console.log(res);
          })
        )
      }, err=>{
        console.log(err);
      })
    )
  }

  guardarAsada(){
    this.subcripciones.push( this._asadaService.actualizarAsada(this.asadaForm.value.nombre, this.asadaForm.value.cedulaJuridica, 
                                       this.asadaForm.value.telefono, this.asadaForm.value.direccion, this.asadaForm.value.id)
        .subscribe(
          (res:any)=>{
            console.log(res);
          },err=>{
            console.log(err);
          })
    )
  }

  guardarNotificaciones(){
    let fechaIn = this.notificacionForm.value.fechaInicio;
    let fechaF = this.notificacionForm.value.fechaFin;
    if (this.notificacionForm.value.fechaInicio._i) {
      let mes = (this.notificacionForm.value.fechaInicio._i.month+1) < 10 ? '0' + (this.notificacionForm.value.fechaInicio._i.month+1) : (this.notificacionForm.value.fechaInicio._i.month+1)
      let dia = this.notificacionForm.value.fechaInicio._i.date < 10 ? '0' + this.notificacionForm.value.fechaInicio._i.date : this.notificacionForm.value.fechaInicio._i.date;
      fechaIn = this.notificacionForm.value.fechaInicio._i.year + '-' + mes + '-' + dia;
    }
    if (this.notificacionForm.value.fechaFin._i) {
      let mes = (this.notificacionForm.value.fechaFin._i.month+1) < 10 ? '0' + (this.notificacionForm.value.fechaFin._i.month+1) : (this.notificacionForm.value.fechaFin._i.month+1)
      let dia = this.notificacionForm.value.fechaFin._i.date < 10 ? '0' + this.notificacionForm.value.fechaFin._i.date : this.notificacionForm.value.fechaFin._i.date;
      fechaF = this.notificacionForm.value.fechaFin._i.year + '-' + mes + '-' + dia;
    }    
    if (fechaIn > fechaF) {
      swal('Error','La fecha de inicio no puede ser mayor a la fecha fin','error');
      return;
    }
    this.subcripciones.push( this._configuracionService.actualizarConfiguracion(this.notificacionForm.value.id, this.notificacionForm.value.notificacion, this.notificacionForm.value.notificacionDefault,fechaIn , fechaF)
        .subscribe(
          (res:any)=>{

          },err=>{
            console.log(err);
            
          })
    )
  }

  createPreciosForm(): FormGroup{
    return this._formBuilder.group({
        id                    : [''],
        unoAdiez              : ['', [Validators.required]],
        onceAtreinta          : ['', [Validators.required, Validators.min(1)]],
        treintaYunoAsecenta   : ['', [Validators.required, Validators.min(1)]],
        masDeSecenta          : ['', [Validators.required, Validators.min(1)]]
    });
  }

  createImpuestosForm(): FormGroup{
    return this._formBuilder.group({
        id                    : [''],
        impuestoHidrante      : ['', [Validators.required, Validators.min(1)]],
        impuestoReactivacion  : ['', [Validators.required, Validators.min(1)]],
        impuestoRetraso       : ['', [Validators.required, Validators.min(1)]],
    });
  }

  createConfAsada():FormGroup{
    return this._formBuilder.group({
      id              : [''],
      nombre          : ['', [Validators.required]],
      cedulaJuridica  : ['', [Validators.required]],
      telefono        : ['', [Validators.required]],
      direccion       : ['', [Validators.required]]
    });
  }

  createConfRecibo():FormGroup{
    return this._formBuilder.group({
      id                  : [''],
      notificacion        : [''],
      notificacionDefault : ['', [Validators.required]],
      fechaInicio         : ['', [Validators.required]],
      fechaFin            : ['', [Validators.required]]
    });
  }

}
