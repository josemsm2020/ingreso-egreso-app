import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {
  registroForm!: FormGroup;

  constructor( private fb: FormBuilder, private autService: AuthService, private router: Router){}

  ngOnInit(){
    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required ],
      correo:   ['', [ Validators.required, Validators.email ] ],
      password: ['', Validators.required ]
    })
  }

  crearUsuario(){

    if ( this.registroForm.invalid ) { return; }

    Swal.fire({
      title: 'Espere por favor',            
      didOpen: () => {
        Swal.showLoading()   
      }            
    });

    //Usamos la desestructuración de objetos
    const { nombre, correo, password } = this.registroForm.value;
    this.autService.crearUsuario( nombre, correo, password )
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
