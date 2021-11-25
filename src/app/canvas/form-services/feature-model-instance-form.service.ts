import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Instance } from '../../canvas-meta-model/instance';

export interface InstanceFormValue {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeatureModelInstanceFormService {
  constructor(private fb: FormBuilder) {}

  createForm(instance: Instance = null): FormGroup {
    const form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    if (instance) {
      form.patchValue(instance);
    }
    return form;
  }

  get(formValue: InstanceFormValue): Partial<Instance> {
    return {
      name: formValue.name,
      description: formValue.description,
    };
  }
}
