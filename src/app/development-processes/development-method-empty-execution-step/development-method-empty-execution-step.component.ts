import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-development-method-empty-execution-step',
  templateUrl: './development-method-empty-execution-step.component.html',
  styleUrls: ['./development-method-empty-execution-step.component.css'],
})
export class DevelopmentMethodEmptyExecutionStepComponent {
  @Input() stepNumber!: number;

  @Output() remove = new EventEmitter<void>();

  constructor(private controlContainer: ControlContainer) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get nameControl(): FormControl {
    return this.formGroup.get('name') as FormControl;
  }
}
