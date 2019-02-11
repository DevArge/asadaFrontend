import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations/index';
import { MedidorService } from '../../../services/medidor.service';

@Component({
  selector: 'app-selec-medidor',
  templateUrl: './seleccionar-medidor.component.html',
  styleUrls: ['./seleccionar-medidor.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SeleccionarMedidorComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'apellido1', 'apellido2','detalle', 'medidor'];  
  searchInput: any;
  dataSource:MatTableDataSource<any>;
  sinResultados:boolean = false;
  termino = new Subject<string>();
  longitudTermino:string = '';
  ruta:string;

  constructor(private _medidorService:MedidorService, private router:Router, private route:ActivatedRoute) { 
    this.buscarMedidor();
    this.route.params.subscribe( params => this.ruta = params.ruta );
  }

  ngOnInit() {
  }


  seleccionarMedidor(abonado:any){
    if (this.ruta == 'lecturas') {
      this.router.navigate(['admin/lecturas/medidor/' + abonado.medidor]);
    }else if (this.ruta == 'recibos') {
      this.router.navigate(['admin/recibos/medidor/' + abonado.medidor]);      
    }else{
      this.router.navigate(['admin/dashboard']);
    }
  }

  buscarMedidor(){
    this._medidorService.buscarMedidores(0, 10, 'medidor', 'asc', this.termino, false)
    .subscribe((resp:any) =>{
      if (this.termino.observers[0]['destination'].key.length > 0) {
        this.longitudTermino = this.termino.observers[0]['destination'].key;
        this.dataSource = new MatTableDataSource(resp.medidores);
        if (resp.total == 0) {
          this.sinResultados = true;
          this.longitudTermino = '';
        }
      }else{
        this.sinResultados = false;
        this.dataSource = new MatTableDataSource([]);
        this.longitudTermino = '';
      }
    });
  }

}
