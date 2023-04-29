import * as authActions from './../auth/auth.actions';
import { AppState } from './../app.reducer';
import { Usuario } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Firestore, collection, addDoc, getFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Auth, authState } from '@angular/fire/auth';
import { DocumentData, getDocsFromServer } from 'firebase/firestore'; //SOLUCIÓN 1 initAuthListener
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
//import { doc, getDoc } from 'firebase/firestore'; //SOLUCIÓN 2 initAuthListener

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //userId!: string;//Se utiliza en la SOLUCION 2
  private _userId!: string | undefined; //Sólo se usa para lectura. si se quisiera grabar, se necesitarían acciones

  get userId(){     
    return this._userId; 
  }

  constructor(public auth: AngularFireAuth, private firestore: Firestore, private store: Store<AppState>, private auth2: Auth) {}

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
    //  console.log( fuser ); 
    //  console.log( fuser?.uid ); 
    //  console.log( fuser?.email ); 
    
    //SOLUCIÓN 1
    //Esto no da problemas, pero no es lo que refleja el video 91 "Auth Actions y Reducer"
    //La siguiente línea 
    return authState(this.auth2).subscribe(async (res) => {           
      //console.log("initAuthListener");
      
      let userInfo!: DocumentData[]; //userInfo es quien tiene la información del usuario
      //console.log("userInfo ", userInfo);
      const db = getFirestore();
      //console.log("1");
      //const userId = res?.uid; //Modificado para la clase 99
      this._userId = res?.uid;
      //console.log("userId", userId);
      //console.log("2");
      if (this._userId != undefined){
        const docRef = collection(db, 'user');
        //console.log("3");
        //console.log("docRef", docRef);
        //const preds = await (await getDocsFromServer(docRef));
        const preds = await getDocsFromServer(docRef);
        //console.log("4");
        //const preds = await getDocsFromServer(docRef);
        //console.log("preds", preds);
        const predList = preds.docs.map((doc) => doc.data());
        //console.log("5");
        //console.log("predList", predList);  
        var elemento: number = -1; //Variable para saber cual es la posición del documento
        //console.log("6");
        userInfo = predList.filter((res) => {     
          //console.log("7");
          elemento++ ;
          //console.log("elemento", elemento);
          //console.log("res['uid']", res['uid']);
          //console.log("8");
          return res['uid'] ===this._userId;        
        });
        //console.log("elemento final", elemento-1); //esta es ka posición del documento
        //console.log("documento", preds.docs[elemento-1].id);
        const idDoc: string = preds.docs[elemento-1].id;
        //console.log("userInfo valores", userInfo[0]['uid']);

        //Insertamos los valores al store y así se pueden ver por REDUX
        if (userInfo != null && idDoc != null){
          //console.log("SetUser");
          const user = Usuario.fromFirebase({ uid: userInfo[0]['uid'], email: userInfo[0]['email'], nombre: userInfo[0]['nombre']});
          this.store.dispatch(authActions.setUser({ user }));                  
        }
        //console.log("userInfo", userInfo);
      }
      else{
        //console.log("unSetUser");
        this._userId = undefined;
        this.store.dispatch(authActions.unSetUser());        
        this.store.dispatch( ingresoEgresoActions.unSetItems() );
      }
      //console.log("userInfo", userInfo);
    });

    //SOLUCIÓN 2 Funciona si se tiene la estructura de la base de datos en firebase del video 91
    //Esto no da errores de compilación, pero no consigue los valores del usuario
    //El problema es que yo no sé cual es el id del documento, porque en mi caso 
    //en firebase los miembros de la colección no son cada uno de los usuarios 
    //sino la propia colección "user", sin embargo en el video de la clase han 
    //hecho que cada usuario sea una colección y el documento sea "usuario" 
    //haciendo que el id del documento sea el mismo que el uid del dato de dentro
    //del documento
    // return authState(this.auth2).subscribe( async (fuser:any) => {

    //   //const docRef = doc(this.firestore, `${ fuser.uid }/usuario`);
    //   console.log("fuser", fuser);
    //   //const docRef = doc(this.firestore, `user/${ fuser.uid }`);
    //   //Poniendo esta línea con el id del documento en REDUX si se pinta el usuario
    //   const docRef = doc(this.firestore, `/user/JM4R1UrK4YIUbZ0U2lEm`); //8GX30AAPmmQ3JAkXKuB6P944sdp1 
    //   console.log('docRef');
    //   console.log(docRef);
    //   const docSnap = await getDoc(docRef);
    //   console.log('docSnap');
    //   console.log(docSnap);
    //   const docData = docSnap.data()!;
    //   console.log('docData');
    //   console.log(docData);
      
    //   if(docSnap.exists()){        
    //     this.userId = docData['uid']; 
    //     const user = Usuario.fromFirebase({ uid: docData['uid'], email: docData['email'], nombre: docData['nombre']});
    //     this.store.dispatch(authActions.setUser({ user }));        
    //   }
    //   else{
    //     this.store.dispatch(authActions.unSetUser());        
    //   }
    // });   
  }

  //Nos dice si un usuario esta authenticado o no 
  isAuth() {
    return this.auth.authState.pipe( 
      map( fbUser => fbUser != null )
    ); //Nos devuekve un observable, pero no de un boolean
  }
}
