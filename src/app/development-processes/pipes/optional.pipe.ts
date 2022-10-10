import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optional',
})
export class OptionalPipe implements PipeTransform {
  transform(value: string, optional: boolean): string {
    if (optional) {
      return value + ' (optional)';
    } else {
      return value;
    }
  }
}
