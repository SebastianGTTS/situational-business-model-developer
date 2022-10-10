import { Component } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feature-model-subform',
  templateUrl: './feature-model-subform.component.html',
  styleUrls: ['./feature-model-subform.component.css'],
})
export class FeatureModelSubformComponent {
  constructor(private controlContainer: ControlContainer) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get nameControl(): FormControl {
    return this.formGroup.get('name') as FormControl;
  }
}
