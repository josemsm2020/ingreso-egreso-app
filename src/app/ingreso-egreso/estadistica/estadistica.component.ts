import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
//import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';
import { ChartData, ChartType, ChartConfiguration } from 'chart.js';


@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [ ] },      
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  //constructor( private store: Store<AppState>){}
  constructor( private store: Store<AppStateWithIngreso>){}

  ngOnInit(): void {
    this.store.select('ingresosEgresos')
      .subscribe( ({ items }) => this.generarEstadistica( items ));
  }

  generarEstadistica( items: IngresoEgreso[] ){

    this.ingresos = 0;
    this.egresos = 0;

    this.totalIngresos = 0;
    this.totalEgresos = 0;

   for (const item of items){
    if( item.tipo === 'ingreso'){
      this.totalIngresos += parseInt(item.monto);
      this.ingresos ++;
    }
    else{
      this.totalEgresos += parseInt(item.monto);
      this.egresos ++;
    }
   } 

   this.doughnutChartData.datasets = [{
    data: [this.totalIngresos, this.totalEgresos]
  }]      

  }
}
