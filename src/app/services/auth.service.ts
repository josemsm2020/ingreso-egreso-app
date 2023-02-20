import { Usuario } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private firestore: Firestore) { }

  crearUsuario (nombre:string, email:string, password:string) {
    //console.log({ nombre, email, password });
    return this.auth.createUserWithEmailAndPassword(email, password)
            .then( ({ user }) => {
                const newUser = new Usuario( user!.uid, nombre, email );
                const userRef = collection(this.firestore, `user`);

                return addDoc( userRef, {...newUser} );                
            })      
  }

  loginUsario (email:string, password:string) {
    //console.log({ email, password });
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  //Se encarga de avisarnos cuando suceda algún cambio con la authetication
  //cuando tengamos el usuario o cerremos sesión
  //También cuando un usuario quiera entrar en una ruta y no este authenticada 
  //la puede ver o la sacamos de ahí
  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
         console.log( fuser ); 
         console.log( fuser?.uid ); 
         console.log( fuser?.email ); 
    })    
  }

  //Nos dice si un usuario esta authenticado o no 
  isAuth() {
    return this.auth.authState.pipe( 
      map( fbUser => fbUser != null )
    ); //Nos devuekve un observable, pero no de un boolean
  }
}
