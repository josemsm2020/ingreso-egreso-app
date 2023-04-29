import { CollectionReference, DocumentData, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { IngresoEgreso } from './../models/ingreso-egreso.model';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {
  private ingresoEgresoCollection!: CollectionReference<DocumentData>;
  private listado: any[] = [];
  
  constructor( private firestore: Firestore ) { 
    this.ingresoEgresoCollection = collection(this.firestore, 'ingresos-egresos');     
  } 

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso){        
    const itemRef = collection(this.firestore, `ingresos-egresos`);
    return addDoc( itemRef, {...ingresoEgreso} );                    
  }

  //FUNCIONA,PERO NO DEVUELVE UN OBSERVABLE
  async initIngresosEgresosListener( uid: string ) {      
    const itemRef = collection(this.firestore, `ingresos-egresos`);    
    const q = query(itemRef, where("uidUser", "==", uid));    
    const querySnapshot = await getDocs(q);
    console.log("querySnapshot", querySnapshot);
        
    return querySnapshot.docChanges().map( doc => ({           
      uidDoc: doc.doc.id, ...doc.doc.data()
    }))
        
    return this.listado;
    
  }

  promiseToObservable(uid: string) {
		return from(this.initIngresosEgresosListener(uid));
	}
  
  async borrarIngresoEgreso( uidItem: string){
   return await deleteDoc( doc(this.firestore, `/ingresos-egresos/${ uidItem }`) );  
  }

}