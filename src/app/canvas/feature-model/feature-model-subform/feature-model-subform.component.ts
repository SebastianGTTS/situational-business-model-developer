import { Component } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feature-model-subform',
  templateUrl: './feature-model-subform.component.html',
  styleUrls: ['./feature-model-subform.component.css'],
})
export class FeatureModelSubformComponent {
  constructor(private controlContainer: ControlContainer) {}

  get formGroup() {
    return this.controlContainer.control as FormGroup;
  }

  get nameControl() {
    return this.formGroup.get('name');
  }
}
