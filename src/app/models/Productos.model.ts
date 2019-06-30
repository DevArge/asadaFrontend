export class Productos{
    
    constructor(
        public nombre: String,
        public precio: number,
        public cantidad: number,
        public total: number,
        public facturas_id?:String,
                ){ }
}