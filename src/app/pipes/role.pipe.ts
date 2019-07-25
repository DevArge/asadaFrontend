import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == 'ADMIN_ROLE') {
      return 'ADMINISTRADOR';
    }else if (value == 'SECRETARIA_ROLE') {
      return 'SECRETARIA'
    }else{
      return 'FONTANERO';
    }
  }

}
