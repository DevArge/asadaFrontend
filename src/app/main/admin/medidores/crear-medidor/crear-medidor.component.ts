import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Abonado } from '../../../../models/Abonado.model';
import { Medidor } from '../../../../models/Medidor.model';
import { TipoDeMedidorService } from '../../../../services/tipo-de-medidor.service';
import { MedidorService } from '../../../../services/medidor.service';

@Component({
  selector: 'app-crear-medidor',
  templateUrl: './crear-medidor.component.html',
  styleUrls: ['./crear-medidor.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CrearMedidorComponent implements OnInit {

  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellido1', 'apellido2'];  
  searchInput: any;
  dataSource:any [] = [];
  abonado:Abonado;
  medidor:Medidor;
  medidorForm: FormGroup;
  tiposDeMedidores:any [] = [];

  constructor(private router:Router, 
              private _formBuilder: FormBuilder, 
              private _tipoMedidorService:TipoDeMedidorService, 
              private _medidorService:MedidorService) { 
    if (localStorage.getItem('abonado')) {
      this.abonado = JSON.parse(localStorage.getItem('abonado'));
      this.medidorForm = this.createProductForm();
      localStorage.removeItem('abonado');
      this._tipoMedidorService.obtenerTiposDeMedidor().subscribe((res:any)=>{
        this.tiposDeMedidores = res.tiposDeMedidores;
      })
    }else{
      router.navigate(['admin/buscar-medidor']);
    }
  }

  ngOnInit() {
  }

  asignarMedidor(){
    console.log(this.medidorForm.value);
    this._medidorService.crearMedidor(this.medidorForm.value, this.abonado).subscribe(()=>{
      	this.router.navigate(['admin/medidores']);
    })
  }

  createProductForm(): FormGroup{
      return this._formBuilder.group({
          idAbonado         : [this.abonado.id],
          idTipoDeMedidor   : ['', Validators.required],
          costoTotal        : ['', [Validators.required, Validators.min(0)]],
          plazo             : ['', [Validators.required, Validators.min(1)]],
          tipoDeuda         : ['ABONO'],
          detalle           : [''],
      });
  }

}
