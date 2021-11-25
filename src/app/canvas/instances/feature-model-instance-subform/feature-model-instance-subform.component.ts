import { Component } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feature-model-instance-subform',
  templateUrl: './feature-model-instance-subform.component.html',
  styleUrls: ['./feature-model-instance-subform.component.css'],
})
export class FeatureModelInstanceSubformComponent {
  constructor(private controlContainer: ControlContainer) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get nameControl(): FormControl {
    return this.formGroup.get('name') as FormControl;
  }
}
