import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ControlContainer,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-feature-model-instance-subform',
  templateUrl: './feature-model-instance-subform.component.html',
  styleUrls: ['./feature-model-instance-subform.component.css'],
})
export class FeatureModelInstanceSubformComponent implements OnChanges {
  @Input() hasDefaultName = false;
  @Input() defaultName?: string;

  constructor(private controlContainer: ControlContainer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.defaultName) {
      if (this.nameControl.value === '') {
        this.setDefaultName();
      }
    }
  }

  setDefaultName(): void {
    if (this.defaultName != null) {
      this.nameControl.setValue(this.defaultName);
    }
  }

  get formGroup(): UntypedFormGroup {
    return this.controlContainer.control as UntypedFormGroup;
  }

  get nameControl(): UntypedFormControl {
    return this.formGroup.get('name') as UntypedFormControl;
  }
}
