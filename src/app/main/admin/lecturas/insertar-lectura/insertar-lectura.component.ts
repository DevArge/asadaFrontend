import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs';
import { LecturaService } from '../../../../services/lectura.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-insertar-lectura',
  templateUrl: './insertar-lectura.component.html',
  styleUrls: ['./insertar-lectura.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class InsertarLecturaComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'apellido1', 'apellido2','detalle', 'medidor', 'lecturaAnt', 'lectura'];
  dataSource: MatTableDataSource<any>;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;
  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  lecturas:any[] = [];
  total:number = 0;
  sinRegistrar:number = 0;
  termino = new Subject<string>();
  periodo:string;
  lectura:number;

  constructor(private _lecturaService:LecturaService, private route:ActivatedRoute, private router:Router) { 
    this.route.params.subscribe(params => this.periodo = params.periodo)
    if (!this.periodo) {
      this.router.navigate(['admin/seleccionar-periodo/lecturas']);
    }
    this.buscarLectura();
  }

  ngOnInit() {
    this.cargarLecturas();
  }

  cargarLecturas(){
    this.estaCargando = true;
    this._lecturaService.obtenerInsertarLecturas(this.desde, this.cantidad, this.columna, this.orden, this.periodo)
      .subscribe((resp:any) =>{
        this.sinRegistrar = resp.sinRegistrar;
        this.total = resp.total;
        this.lecturas = resp.lecturas;
        this.dataSource = new MatTableDataSource(this.lecturas);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      });
  }

  agregarNota(row:any){
    if (!row.idLectura) {
      swal('Aviso', 'Primero tienes que guardar la lectura para proceder a agregar una nota', 'info');
      return;
    }
    let defecto = (row.nota) ? (row.nota) : ''; 
    swal("Esta nota se verá reflejada en el recibo de este periodo:", {
      title:'Añadir nota',
      content: {
        element: 'input',
        attributes: {
          type: 'text',
          defaultValue: defecto,
        }
      },
      buttons:['Cancelar', 'Guardar'],
    })
    .then((value) => {
      if (value == row.nota || value == '' || value == null) {
        swal('Aviso', 'No se ha realizado ningún cambio','info');
      }else{
        this._lecturaService.guardarLectura(row.medidor, row.lectura, this.periodo, value).subscribe(res=>{
          this.cargarLecturas();
          },err=>{

          })
      }
    });
    
  }

  setLectura(lect:number){
    this.lectura = lect;
  }

  guardarLectura(lectura:any, row:any){
    if (this.lectura == lectura.value) {
      return;
    }else if(this.lectura && lectura.value == null){
      return;
    }else if (lectura < 0) {
      return;
    }else{
      this._lecturaService.guardarLectura(row.medidor, lectura.value, this.periodo, row.nota).subscribe(res=>{
      this.cargarLecturas(); 
      },err=>{
        if (!this.lectura) {
          lectura.value = '';
        }else{
          lectura.value = this.lectura;
        }
      })
    }
  }

   ///==================== TABLA =================//

   buscarLectura(){
    this.desde = 0;
    this.estaCargando = true;
    this._lecturaService.buscarLecturas(this.desde, this.cantidad, this.columna, this.orden, this.termino,'periodo', 'insertar',this.periodo)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.lecturas = resp.lecturas;
        this.dataSource = new MatTableDataSource(this.lecturas);
        this.estaCargando = false;
      });   
  }

  ordenarColumna(evento:any){
    if (evento.direction == '') {
      this.columna = 'id';
      this.orden = 'asc';
    }else{
      this.columna = evento.active;
      this.orden = evento.direction;
    }
    this.desde = 0;
    this.cargarLecturas();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarLecturas();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarLecturas();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarLecturas();
  }

}
