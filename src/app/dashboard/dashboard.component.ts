import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from './../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  userSubs!: Subscription;
  ingresoEgresoSubs!: Subscription;
   
  constructor( private store: Store<AppState>, public ingresoEgresoService: IngresoEgresoService){
    console.log("constructor dashboard");
  }

  ngOnInit(): void {
    console.log("ngoninit dashboard");
    this.userSubs = this.store.select('user').pipe( filter( auth => auth.user != null )).subscribe( ({user}) => {             
      this.ingresoEgresoSubs = this.ingresoEgresoService.promiseToObservable(user!.uid)
        .subscribe( ingresosEgresosFB => {
          console.log(ingresosEgresosFB);
          this.store.dispatch( ingresoEgresoActions.setItems({ items: ingresosEgresosFB }) )
        })
    })        
  }

  ngOnDestroy(): void {
    this.ingresoEgresoSubs?.unsubscribe();
    this.userSubs?.unsubscribe();//Para evitar fugas de memoria y cuando ya no me interese estar escuchando ese observable o esta subscripción hay cancelo        
    console.log("ngondestroy dashboard");
  }
}
