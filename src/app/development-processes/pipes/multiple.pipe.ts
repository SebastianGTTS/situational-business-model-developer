import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiple',
})
export class MultiplePipe implements PipeTransform {
  transform(value: string, multiple: boolean): string {
    if (multiple) {
      return value + ' (multiple)';
    } else {
      return value;
    }
  }
}
