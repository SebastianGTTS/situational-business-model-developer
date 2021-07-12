import { AbstractControl } from '@angular/forms';

export function onlyLowercase(control: AbstractControl): { [key: string]: any } | null {
  return /^[a-z]*$/.test(control.value) ? null : {lowercase: {value: control.value}};
}
