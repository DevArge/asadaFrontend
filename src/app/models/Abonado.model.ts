export class Abonado{
    
    constructor(
                public id:String,
                public cedula: String,
                public nombre: String,
                public apellido1: String,
                public apellido2: String,
                public telefono: String,
                public plano?: String,
                public email?: String,
                public direccion?: String,
                ){ }
}