import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import swal from 'sweetalert';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Usuario } from '../../../models/Usuario.model';
import { Subject, Subscription } from 'rxjs';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioComponent } from './usuario/usuario.component';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '../../../../@fuse/animations/index';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class UsuariosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'nombre', 'email', 'role'];
  dataSource: MatTableDataSource<Usuario>;
  dialogRef: any;
  estaCargando:boolean = true;
  huboErrorAlcargar:boolean = false;

  desde:number = 0;
  cantidad:number = 10;
  columna:string = 'id';
  orden:string = 'asc';
  usuarios:Usuario[] = [];
  total:number = 0;
  termino = new Subject<string>();
  subcripciones:Subscription [] = [];

  constructor( public _matDialog:MatDialog, private _usuarioService:UsuarioService) {
    this.buscarUsuario();
  }
  
  ngOnInit() {
    this.cargarUsuarios();
  }

  ngOnDestroy(){
    this.subcripciones.forEach(sub => sub.unsubscribe())
  }

  cargarUsuarios(){
    this.estaCargando = true;
    this.subcripciones.push( this._usuarioService.obtenerUsuarios(this.desde, this.cantidad, this.columna, this.orden)
      .subscribe((resp:any) =>{
        this.total = resp.total;
        this.usuarios =resp.usuarios;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.estaCargando = false;
      }, err=>{
        this.huboErrorAlcargar = true;
        this.estaCargando = false;
      })
    )
  }

  editarUsuario(usuario:Usuario){
    this.dialogRef = this._matDialog.open(UsuarioComponent, {
      panelClass: 'abonado-form-dialog',
      data      : {
          usuario,
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
                let usuario:Usuario = formData.getRawValue();
                this._usuarioService.actualizarUsuario(usuario, usuario.id).subscribe((res)=>{
                  this.cargarUsuarios();
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

  AgregarUsuario(){
    this.dialogRef = this._matDialog.open(UsuarioComponent, {
      panelClass: 'abonado-form-dialog',
      data      : {
          action: 'nuevo'
      }
    });
    this.subcripciones.push( this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
          if ( !response ){
              return;
          }
          let usuario:Usuario = response.getRawValue();
          this._usuarioService.crearUsuario(usuario).subscribe(
            res=>{
              this.cargarUsuarios();           
            },err=>{
              console.log(err);
            });
      })
    )
  }

  eliminarAbonado(usuario:any){
    console.log(usuario);
  }

  mostrarSWAEliminar(id:number){
    swal({
      title: "Estas seguro?",
      text: "El usuario sera elimnado de los registros!",
      icon: "warning",
      buttons:['Cancelar', 'Aceptar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.subcripciones.push( this._usuarioService.eliminarUsuario(id).subscribe((res)=>{
            this.cargarUsuarios();
          })
        )
      } else {
        swal("El registro no sufrio cambios!", "", "info");
      }
    });
  }

  ///==================== TABLA =================//

  buscarUsuario(){
    this.desde = 0;
    this.estaCargando = true;
    this.subcripciones.push( this._usuarioService.buscarUsuarios(this.desde, this.cantidad, this.columna, this.orden, this.termino)
      .subscribe((resp:any) =>{
        console.log(resp); 
        this.total = resp.total;
        this.usuarios = resp.usuarios;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.estaCargando = false;
      })
    )  
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
    this.cargarUsuarios();
  }

  paginaSiguiente(){
    this.desde = this.desde + this.cantidad;
    this.cargarUsuarios();
  }

  paginaAnterior(){
    this.desde = ( this.desde - this.cantidad) < 0 ? 0 : ( this.desde - this.cantidad);
    this.cargarUsuarios();
  }

  tamanioPagina(valor:any){
    this.desde = 0;
    this.cantidad = valor._value;
    this.cargarUsuarios();
  }

}
