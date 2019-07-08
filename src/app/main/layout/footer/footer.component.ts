import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  contactForm:FormGroup;

  constructor(private _formBuilder: FormBuilder) { 
    this.contactForm = this.createContactForm();
  }

  ngOnInit() {
  }

  createContactForm(): FormGroup {
    return this._formBuilder.group({
      idAbonado:['', [Validators.required]],
      asunto: ['', [Validators.required]],
      mensaje: ['', [Validators.required]]
    });
  }

}
