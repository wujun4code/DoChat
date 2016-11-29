import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strEquals'
})
export class StrEqualsPipe implements PipeTransform {
  transform(value: string, campare: string): boolean {
    console.log('StrEqualsPipe');
    console.log('value', value);
    console.log('campare', campare);
    console.log('p1', value == campare);
    console.log('p2', value === campare);
    return value === campare;
  }
}

