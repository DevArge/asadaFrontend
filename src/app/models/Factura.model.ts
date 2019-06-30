import { Productos } from './Productos.model';


export class Factura{
    
    constructor(
        public idCuenta: string,
        public cuenta: string,
        public descripcion: string,
        public fecha: string,
        public numero: number,
        public descuento: number,
        public sub_total:number,
        public grand_total: number,
        public created_at: string,
        public productos:Productos[],
        public id?:string,
                ){ }
}