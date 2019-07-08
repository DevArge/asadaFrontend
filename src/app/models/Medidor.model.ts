export class Medidor{
    
    constructor(
                public id:String,
                public idAbonado: String,
                public idTipoDeMedidor: String,
                public costoTotal: String,
                public plazo: String,
                public tipoDeuda: String,
                public estado: String,
                public detalle?: String
                ){ }
}