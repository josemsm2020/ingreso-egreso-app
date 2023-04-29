export class IngresoEgreso {
    constructor(         
        public uidUser: string,
        public descripcion: string,
        public monto: string, //Cantidad
        public tipo: string, //Para saber si es un ingreso o egreso             
        //public uidDoc?: string | undefined  //Este parámetro se debería haber definido en el documento desde el principio
                                              //porque sino luego toca averiguarlo y no forma parte del modelo       
    ){}
}
    
