import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PeriodoComponent implements OnInit {

  mes:string [] =["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  anio:any[] = [];
  periodoForm:FormGroup;
  ruta:string;
  subscribe:Subscription;

  constructor(private _formBuilder: FormBuilder, private route:ActivatedRoute, private router:Router) { 
    this.periodoForm = this.createForm();
    this.obtenerAnios();
    this.subscribe = this.route.params.subscribe( params => this.ruta = params.ruta );
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();    
  }

  createForm():FormGroup{
    return this._formBuilder.group({
      mes:['', [Validators.required]],
      anio:['', [Validators.required]]
    });
  }

  obtenerAnios(){
    let anioFin = new Date().getFullYear()
    for (let i = 2018; i <= anioFin; i++) {
      this.anio.push(i);
    }
  }

  enviarPeriodo(){
    let periodo = this.periodoForm.value.anio + '-' + this.periodoForm.value.mes;
    if (this.ruta == 'lecturas') {
      this.router.navigate(['admin/lecturas/ingresar/' + periodo])
    }else if (this.ruta == 'lecturas-todas') {
      this.router.navigate(['admin/lecturas/' + periodo]); 
    }else if (this.ruta == 'recibos') {
      this.router.navigate(['admin/recibos/' + periodo]);       
    }else if(this.ruta == 'cuentas'){
      this.router.navigate(['admin/cuentas-por-cobrar/' + periodo]);
    }else{
      this.router.navigate(['admin/']); 
    }
  }

}
