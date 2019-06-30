export class Cuenta{
    
    constructor(
                public id:String,
                public codigo:String,
                public nombre: String,
                public descripcion: String,
                public tipo: String,
                public presupuesto?: String,
                ){ }
}