import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'periodo'
})
export class PeriodoPipe implements PipeTransform {

  transform(periodo: string): any {
    let meses:string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let arreglo:any = periodo.split('-');
    let mes = meses[arreglo[1]-1];
    return mes + ' de ' + arreglo[0];
  }

}
