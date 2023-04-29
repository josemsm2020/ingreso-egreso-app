import { IngresoEgresoService } from './../../services/ingreso-egreso.service';
import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnDestroy{

  ingresoEgresos: any[] = [];
  ingresoEgresosSubs: Subscription;

  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService){
    this.ingresoEgresosSubs = this.store.select('ingresosEgresos').subscribe( ({items}) => this.ingresoEgresos = items );        
  }

  borrar( uid: string ){
   this.ingresoEgresoService.borrarIngresoEgreso( uid )
     .then( () => Swal.fire('Borrado', 'Item borrado', 'success'))
     .catch( err => Swal.fire('Error', err.message, 'error'));
  }

  ngOnDestroy(): void {
    this.ingresoEgresosSubs.unsubscribe();
  }

}
