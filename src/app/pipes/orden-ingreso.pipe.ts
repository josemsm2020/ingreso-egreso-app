import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  //transform(items: IngresoEgreso[]): IngresoEgreso[] { //No puedo utilizar esta línea porque la porpiedad uidDoc 
    transform(items: any[]): any[] {                     //no existe en el modelo "IngresoEgreso"
    return items.slice().sort( (a,b) => {
      if( a.tipo === 'ingreso'){           
        return -1;
      }
      else{        
        return 1;
      }
    });
  }

}
