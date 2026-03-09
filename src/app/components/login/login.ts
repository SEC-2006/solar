import { JsonPipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supaservice } from '../../services/supaservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, JsonPipe, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  supaservice: Supaservice = inject(Supaservice);
  formulario: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder)
  logguedData = signal<any>('');
  errorMessage = signal('');
  router: Router = inject(Router);

  constructor() {
    this.formulario =  this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  /*get emailNotValid() {
    return this.formulario.controls['email'].invalid && this.formulario.get('email')!.touched;
  }

  get emailValid() {
    return this.formulario.controls['email'].valid && this.formulario.get('email')!.touched;
  }*/

  get emailValidation() {
    if (this.formulario.controls['email'].invalid && this.formulario.get('email')!.touched) {
      return 'is-invalid'
    }
    if (this.formulario.controls['email'].valid && this.formulario.get('email')!.touched) {
      return 'is-valid'
    }
    return ''
  }

  login() {
    if(this.formulario.valid)
    {
      const loginData = this.formulario.value;
      this.supaservice
        .login(loginData)
        .then(data => {
          console.log(data);
  
          this.logguedData.set(data);
          this.errorMessage.set('');
          this.router.navigate(['/home']);
      }).catch((error:Error) => {
        this.errorMessage.set(error.message);
      });
    }
    else
    {
      this.errorMessage.set("Formulario no válido")
    }
  }
}
