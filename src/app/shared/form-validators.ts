import { AbstractControl } from '@angular/forms';

export function onlyLowercase(
  control: AbstractControl
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { [key: string]: any } | null {
  return /^[a-z]*$/.test(control.value)
    ? null
    : { lowercase: { value: control.value } };
}
