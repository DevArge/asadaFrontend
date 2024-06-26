import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations/index';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  estaCargando:boolean = false;
  hayError:boolean = false;

  constructor(private _fuseConfigService: FuseConfigService, 
              private _formBuilder: FormBuilder,
              private _usuario:UsuarioService,
              public route:Router) { 
    this._fuseConfigService.config = {
      layout: {
        style:'vertical-layout-2',
      }
    };

  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      email   : ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recuerdame: [false]
    });
    if (localStorage.getItem('email')) {
      this.loginForm.patchValue({email: localStorage.getItem('email')})
    }
  }

  login(){
    this.estaCargando = true;
    this._usuario.login(this.loginForm.value, this.loginForm.value.recuerdame).subscribe(
      resp=>{
      window.location.reload();
      setTimeout(function(){
        this.route.navigate(['/admin/dashboard']);
        this.estaCargando = false;
      },3000)
      }, err =>{
        this.hayError = true;
        this.estaCargando = false;
        console.log('ERROR: ', err);
      }
    );
  }

}
