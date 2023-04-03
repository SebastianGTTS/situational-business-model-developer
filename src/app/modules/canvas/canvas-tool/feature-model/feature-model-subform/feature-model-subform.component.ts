import { Component } from '@angular/core';
import {
  ControlContainer,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-feature-model-subform',
  templateUrl: './feature-model-subform.component.html',
  styleUrls: ['./feature-model-subform.component.css'],
})
export class FeatureModelSubformComponent {
  constructor(private controlContainer: ControlContainer) {}

  get formGroup(): UntypedFormGroup {
    return this.controlContainer.control as UntypedFormGroup;
  }

  get nameControl(): UntypedFormControl {
    return this.formGroup.get('name') as UntypedFormControl;
  }
}
