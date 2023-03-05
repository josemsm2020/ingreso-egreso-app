import { AppState } from './../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import * as ui from './../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor( private fb: FormBuilder, private autService: AuthService, 
               private router: Router, private store: Store<AppState>){}

  ngOnInit(){
    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required ],
      correo:   ['', [ Validators.required, Validators.email ] ],
      password: ['', Validators.required ]
    })

    //this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading );
    this.uiSubscription = this.store.select('ui')
                              .subscribe( ui =>  this.cargando = ui.isLoading );
  }

  ngOnDestroy(): void {
    //Se ejecuta cuando la página es destruida   
    //y este es el lugar para hacer limpieza
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){

    if ( this.registroForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',            
    //   didOpen: () => {
    //     Swal.showLoading()   
    //   }            
    // });

    //Usamos la desestructuración de objetos
    const { nombre, correo, password } = this.registroForm.value;
    this.autService.crearUsuario( nombre, correo, password )
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
