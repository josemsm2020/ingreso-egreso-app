import { AuthService } from './../services/auth.service';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { IngresoEgreso } from './../models/ingreso-egreso.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from './../app.reducer';
import * as ui from './../shared/ui.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  
  ingresoForm!: FormGroup; //Se pone porque lo voy a manejar con formularios reactivos
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs!: Subscription;

  constructor( private fb: FormBuilder, private ingresoEgresoService: IngresoEgresoService, private authService: AuthService, private store:Store<AppState> ){ }

  ngOnInit(): void {
    //this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading );  //esto es una manera corta de hacerlo
    this.loadingSubs = this.store.select('ui').subscribe( ({ isLoading}) => this.cargando = isLoading ); //es lo mismo, pero usando desestructuración

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]      
    })    
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();//Para evitar fugas de memoria y cuando ya no me interese estar escuchando ese observable o esta subscripción hay cancelo    
  }

  guardar(){
        
    if ( this.ingresoForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() );
    //console.log( this.ingresoForm.value);
    //console.log( this.tipo);

    const { descripcion, monto } = this.ingresoForm.value; 
    const ingresoEgreso = new IngresoEgreso( this.authService.userId!,  descripcion, monto, this.tipo );
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
        .then(() => {   
          this.ingresoForm.reset(); //Con esta línea se limpia el formulario       
          this.store.dispatch( ui.stopLoading() );
          Swal.fire({
            icon: 'success',
            title: 'Registro creado',
            text: descripcion         
          } );          
        })
        .catch( err => { 
          this.store.dispatch( ui.stopLoading() );
          Swal.fire({ icon: 'error', title: 'Error', text: err.message })          
        });    
  }

}
