import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Factura } from '../../../../../models/Factura.model';
import { FacturaService } from '../../../../../services/factura.service';
import { CuentasService } from '../../../../../services/cuentas.service';
import { Cuenta } from '../../../../../models/Cuenta.model';
import { MomentDateAdapter,  } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Productos } from '../../../../../models/Productos.model';
import { Router, ActivatedRoute } from '@angular/router';

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
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es_CR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class FacturaComponent implements OnInit, OnDestroy {

  facturaForm: FormGroup;
  factura:Factura;
  precio:number;
  cantidad:number;
  totalProduto:number;
  cuentas:Cuenta[]=[];

  subParam:any;
  subCuenta:any;
  subCargarFact:any;
  subFacturaService:any;

  constructor(private _formBuilder: FormBuilder, 
              private _facturaService:FacturaService, 
              public _cuentaService:CuentasService,
              private router:Router,
              private route:ActivatedRoute) {
    this.subParam = this.route.params.subscribe(params => {
      if (params['id']) {
        this.cargarFactura(params['id']);
      }else{
        this.factura = new Factura('','','',null,0,0,0,0,'',[new Productos('',0,1,0)]);
        this.facturaForm = this.createFacturaForm();
      }
    });
    this.subCuenta = this._cuentaService.obtenerCuentas(0,200,'id','asc').subscribe((res:any)=>{
       this.cuentas = res.cuentas;
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.subParam){ this.subParam.unsubscribe(); }
    if(this.subCuenta){ this.subCuenta.unsubscribe(); }
    if(this.subCargarFact){ this.subCargarFact.unsubscribe(); }
    if (this.subFacturaService){ this.subFacturaService.unsubscribe(); }
  }

  cargarFactura(id:any){
    this.subCargarFact = this._facturaService.obtenerFactura(id).subscribe(
      (res:any)=>{
        this.factura = res.factura;
        this.facturaForm = this.createFacturaForm();        
      }
    )
  }

  agregarLinea(){
    this.factura.productos.push(new Productos('',0,1,0));
  }

  eliminarProducto(i:number){
    this.factura.productos.splice(i, 1);
  }

  calcularSubtotal(){
    let total:number = 0;
    for (let i = 0; i < this.factura.productos.length; i++) {
      this.factura.productos[i].total = this.factura.productos[i].precio * this.factura.productos[i].cantidad;
      total = total + this.factura.productos[i].total;
    }
    return this.factura.sub_total =  total;
  }

  calcularTotal(){
    return this.factura.grand_total = this.calcularSubtotal() - this.factura.descuento;
  }

  guardarFactura(){
    this.factura.idCuenta = this.facturaForm.get('idCuenta').value;
    this.factura.descripcion = this.facturaForm.get('descripcion').value;
    this.factura.fecha = this.formatearFecha();
    this.factura.numero = this.facturaForm.get('numero').value;
    this.factura.grand_total = this.calcularTotal();
    this.subFacturaService = this._facturaService.crearFactura(this.factura).subscribe(
      (res:any)=>{
        this.router.navigate(['/admin/facturas-de-cuentas']);
      },err=>{
        console.log(err);
      }
    )
  }

  actualizarFactura(){
    this.factura.idCuenta = this.facturaForm.get('idCuenta').value;
    this.factura.descripcion = this.facturaForm.get('descripcion').value;
    this.factura.fecha = this.formatearFecha();
    this.factura.numero = this.facturaForm.get('numero').value;
    this.factura.grand_total = this.calcularTotal();
    this.subFacturaService = this._facturaService.actualizarFactura(this.factura, this.factura.id).subscribe(
      (res:any)=>{
        this.router.navigate(['/admin/facturas-de-cuentas']);
      },err=>{
        console.log(err);
      }
    )
  }

  formatearFecha(){
    if (typeof this.facturaForm.value.fecha._i === 'string') {
      return this.facturaForm.value.fecha._i;
    }
    if (typeof this.facturaForm.value.fecha === 'string') {
      return this.facturaForm.value.fecha;
    }
    let mes = (this.facturaForm.value.fecha._i.month+1) < 10 ? '0' + (this.facturaForm.value.fecha._i.month+1) : (this.facturaForm.value.fecha._i.month+1)
    let dia = this.facturaForm.value.fecha._i.date < 10 ? '0' + this.facturaForm.value.fecha._i.date : this.facturaForm.value.fecha._i.date;
    return this.facturaForm.value.fecha._i.year + '-' + mes + '-' + dia;
  }

  validar(){
    let invalido = false;
    for (let i = 0; i < this.factura.productos.length; i++) {
      this.factura.productos[i];
      if (!this.factura.productos[i].nombre || !this.factura.productos[i].precio || !this.factura.productos[i].cantidad) {
        invalido = true;
        break;
      }
      
    }
    return invalido
  }

  createFacturaForm(): FormGroup {
    return this._formBuilder.group({
      // id:[this.factura.id],
      idCuenta: [this.factura.idCuenta, [Validators.required]],
      descripcion: [this.factura.descripcion, [Validators.required]],
      fecha: [this.factura.fecha, [Validators.required]],
      numero: [this.factura.numero, [Validators.required]]
    });
  }

}
