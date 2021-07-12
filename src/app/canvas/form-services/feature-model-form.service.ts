import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeatureModel } from '../../canvas-meta-model/feature-model';

export interface FeatureModelFormValue {
  name: string;
  description: string;
  copyright: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureModelFormService {

  constructor(
    private fb: FormBuilder,
  ) {
  }

  createForm(featureModel: FeatureModel = null): FormGroup {
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

  get(formValue: FeatureModelFormValue): Partial<FeatureModel> {
    return {
      name: formValue.name,
      description: formValue.description,
      copyright: formValue.copyright,
    };
  }

}
