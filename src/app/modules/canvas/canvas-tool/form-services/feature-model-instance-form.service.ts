import { Injectable } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  Instance,
  InstanceInit,
  InstanceType,
} from '../../canvas-meta-artifact/instance';

export interface InstanceFormValue {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeatureModelInstanceFormService {
  constructor(private fb: UntypedFormBuilder) {}

  createForm(instance?: Instance): UntypedFormGroup {
    const form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    if (instance) {
      form.patchValue(instance);
    }
    return form;
  }

  get(formValue: InstanceFormValue): Omit<InstanceInit, 'id'> {
    return {
      name: formValue.name,
      description: formValue.description,
      type: InstanceType.EXAMPLE,
    };
  }
}
