import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { AbonadoService } from '../../../../services/abonado.service';
import { MatTableDataSource } from '@angular/material';
import { Abonado } from '../../../../models/Abonado.model';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-medidor',
  templateUrl: './buscar-medidor.component.html',
  styleUrls: ['./buscar-medidor.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class BuscarMedidorComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellido1', 'apellido2'];  
  searchInput: any;
  dataSource:MatTableDataSource<Abonado>;
  sinResultados:boolean = false;
  termino = new Subject<string>();
  longitudTermino:string = '';
  subcripciones:Subscription [] = [];

  constructor(private _abonadoService:AbonadoService, private router:Router) { 
    this.buscarAbonado();
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }


  asignarMedidor(abonado:any){
    localStorage.setItem('abonado', JSON.stringify(abonado));
    this.router.navigate(['admin/asignar-medidor']);
  }

  buscarAbonado(){
    this.subcripciones.push( this._abonadoService.buscarAbonados(0, 10, 'id', 'asc', this.termino)
    .subscribe((resp:any) =>{
        if (this.termino.observers[0]['destination'].key.length > 0) {
          this.longitudTermino = this.termino.observers[0]['destination'].key;
          this.dataSource = new MatTableDataSource(resp.abonados);
          if (resp.total == 0) {
            this.sinResultados = true;
            this.longitudTermino = '';
          }
        }else{
          this.sinResultados = false;
          this.dataSource = new MatTableDataSource([]);
          this.longitudTermino = '';
        }
      })
    )
  }

}
