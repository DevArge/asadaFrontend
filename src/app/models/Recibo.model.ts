export class Recibo{
    
    constructor(
                public id:String,
                public abonado: String,
                public nombre: String,
                public cedula: String,
                public apellido1: String,
                public apellido2: String,
                public direccion: String,
                public medidor: String,
                public detalle: String,
                public abonoMedidor: number,
                public cargoFijo: number,
                public estado: String,
                public hidrante: number,
                public lectura: number,
                public metros: number,
                public nota: String,
                public periodo: String,
                public personalizado: String,
                public reactivacionMedidor: number,
                public reparacion: number,
                public retrasoPago: number,
                public tipo: String,
                public total: number,
                public valorMetro: number,
                public vence: Date,
                public created_at: String
                ){ }
}