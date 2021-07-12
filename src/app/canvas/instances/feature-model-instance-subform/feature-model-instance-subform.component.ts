import { Component } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feature-model-instance-subform',
  templateUrl: './feature-model-instance-subform.component.html',
  styleUrls: ['./feature-model-instance-subform.component.css']
})
export class FeatureModelInstanceSubformComponent {

  constructor(
    private controlContainer: ControlContainer,
  ) {
  }

  get formGroup() {
    return this.controlContainer.control as FormGroup;
  }

  get nameControl() {
    return this.formGroup.get('name');
  }

}
