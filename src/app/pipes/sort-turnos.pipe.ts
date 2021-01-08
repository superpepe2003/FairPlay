import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortTurnos'
})
export class SortTurnosPipe implements PipeTransform {

  transform(value: any[]): any[] {
    value.sort( (a, b) => (a.hora > b.hora)? 1 : -1);
    
    return value;
  }

}
