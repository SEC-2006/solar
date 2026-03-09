import { JsonPipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Supaservice } from '../../services/supaservice';
import { Router } from '@angular/router';

const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('password2');
  return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordValidator: true };
};


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
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
      password2: ['', [Validators.required, Validators.minLength(8)]],
    }, {
      validators: passwordValidator
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

  passwordNotValid(name: string) {
    return (this.formulario.controls[name].invalid && this.formulario.get(name)!.touched || this.formulario.hasError('passwordValidator'));
  }

  passwordValid(name: string) {
    return (this.formulario.get(name)!.valid && this.formulario.get(name)!.touched || !this.formulario.hasError('passwordValidator'));
  }

  get passwordCrossValidation() {
    if (this.formulario.hasError('passwordValidator') && 
    this.formulario.get('password2')!.touched && 
    this.formulario.get('password')!.touched) {
      return true
    } else {
      return false
    }
  }

  register() {
    if(this.formulario.valid)
    {
      const registerData = this.formulario.value;
      this.supaservice.register(registerData).then(data => {
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
