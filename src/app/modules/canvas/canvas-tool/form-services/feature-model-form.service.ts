import { Injectable } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FeatureModel } from '../../canvas-meta-artifact/feature-model';

export interface FeatureModelFormValue {
  name: string;
  description: string;
  copyright: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeatureModelFormService {
  constructor(private fb: UntypedFormBuilder) {}

  createForm(featureModel?: FeatureModel): UntypedFormGroup {
    const form = this.fb.group({
      name: ['', Validators.required],
      description: '',
      copyright: '',
    });
    if (featureModel) {
      form.patchValue(featureModel);
    }
    return form;
  }

  get(formValue: FeatureModelFormValue): FeatureModelFormValue {
    return {
      name: formValue.name,
      description: formValue.description,
      copyright: formValue.copyright,
    };
  }
}
