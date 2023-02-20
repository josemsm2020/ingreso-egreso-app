import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;

  constructor ( private fb: FormBuilder, private autService: AuthService, private router: Router) {} 

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if ( this.loginForm.invalid ) { return; }
    
    Swal.fire({
      title: 'Espere por favor',            
      didOpen: () => {
        Swal.showLoading()   
      }            
    });

    //Usamos la desestructuración de objetos
    const { email, password } = this.loginForm.value;
    this.autService.loginUsario( email, password )
      .then( credenciales => {
        console.log( credenciales );
        Swal.close();
        this.router.navigate(['/']);
      } )
      //.catch( err => console.error(err) );
      .catch( err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message         
        } );                
      })
    // console.log( this.registroForm);
    // console.log( this.registroForm.valid);
    // console.log( this.registroForm.value);
  }
}
