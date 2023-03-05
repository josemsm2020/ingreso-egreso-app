export class Usuario {
    //Se puede hacer poniendo las propiedades o utilizando la 
    //forma corta de typescript directamente con el constructor 
    constructor( public uid: string, public nombre: string, public email: string ){}

    static fromFirebase( { uid, nombre, email }: { uid:string, nombre:string, email:string }) { //No importa el orden, pero si los nombres de ellas,
                                                                                                //también se podrian establecer valores por defecto
                                                                                                //en esta línea  
        return new Usuario( uid, nombre, email ); //Aquí si tienen que tener este orden porque si estoy creando mi clase
    }

}