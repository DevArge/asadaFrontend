import { NgModule } from '@angular/core';
import { PeriodoPipe } from './periodo.pipe';
import { RolePipe } from './role.pipe';

@NgModule({
  declarations: [
    PeriodoPipe,
    RolePipe
  ],
  imports: [
    
  ],
  exports:[
    PeriodoPipe,
    RolePipe
  ]
})
export class PipeModule { }
