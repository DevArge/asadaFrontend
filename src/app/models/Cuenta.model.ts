export class Cuenta{
    
    constructor(
                public id:String,
                public codigo:String,
                public nombre: String,
                public description: String,
                public tipo: String,
                public presupuesto?: String,
                ){ }
}