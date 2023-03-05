import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from './../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor ( private fb: FormBuilder, private autService: AuthService, 
                private router: Router, private store: Store<AppState>) {} 

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    //this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading );
    this.uiSubscription = this.store.select('ui')
                              .subscribe( ui => { 
                                this.cargando = ui.isLoading  
                                console.log('cargando subs');
                              });
  }

  ngOnDestroy(): void {
    //Se ejecuta cuando la página es destruida 
    //y este es el lugar para hacer limpieza
    this.uiSubscription.unsubscribe();
  }

  login() {
    if ( this.loginForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() );
    
    // Swal.fire({
    //   title: 'Espere por favor',            
    //   didOpen: () => {
    //     Swal.showLoading()    
    //   }            
    // });

    //Usamos la desestructuración de objetos
    const { email, password } = this.loginForm.value;
    this.autService.loginUsario( email, password )
      .then( credenciales => {
        console.log( credenciales );
        //Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      } )
      //.catch( err => console.error(err) );
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
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
