import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ControlContainer,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-development-method-empty-execution-step',
  templateUrl: './development-method-empty-execution-step.component.html',
  styleUrls: ['./development-method-empty-execution-step.component.css'],
})
export class DevelopmentMethodEmptyExecutionStepComponent {
  @Input() stepNumber!: number;

  @Output() remove = new EventEmitter<void>();

  constructor(private controlContainer: ControlContainer) {}

  get formGroup(): UntypedFormGroup {
    return this.controlContainer.control as UntypedFormGroup;
  }

  get nameControl(): UntypedFormControl {
    return this.formGroup.get('name') as UntypedFormControl;
  }
}
