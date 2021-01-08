import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortFecha'
})
export class SortFechaPipe implements PipeTransform {

  transform(value: any[]): any[] {
    value.sort( (a, b) => (a.fecha > b.fecha)? 1 : -1);
    
    return value;
  }

}
