import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortTurnosPipe } from './sort-turnos.pipe';
import { SortFechaPipe } from './sort-fecha.pipe';



@NgModule({
  declarations: [
    SortTurnosPipe,
    SortFechaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SortTurnosPipe,
    SortFechaPipe
  ]
})
export class PipesModule { }
