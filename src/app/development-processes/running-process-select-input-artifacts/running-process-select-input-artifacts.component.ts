import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MethodDecision } from '../../development-process-registry/bm-process/method-decision';
import { SelectedElementOptional } from '../../development-process-registry/bm-process/element-decision';

@Component({
  selector: 'app-running-process-select-input-artifacts',
  templateUrl: './running-process-select-input-artifacts.component.html',
  styleUrls: ['./running-process-select-input-artifacts.component.css'],
})
export class RunningProcessSelectInputArtifactsComponent implements OnChanges {
  @Input() runningProcess!: RunningProcess;
  @Input() decision!: MethodDecision;

  @Output() selectInputArtifacts = new EventEmitter<FormArray>();

  inputArtifacts?: SelectedElementOptional<Artifact>[];

  form = this.fb.group({
    inputArtifacts: this.fb.array([]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.decision) {
      const decision: MethodDecision = changes.decision.currentValue;
      this.inputArtifacts =
        decision.inputArtifacts.getSelectedElementsOptional();
      this.loadForm(this.inputArtifacts);
    }
  }

  loadForm(artifacts: SelectedElementOptional<Artifact>[]): void {
    const formGroups = artifacts.map((selectedElement) =>
      this.fb.group({
        artifact: this.fb.control(
          null,
          selectedElement.optional ? undefined : Validators.required
        ),
      })
    );
    this.form.setControl('inputArtifacts', this.fb.array(formGroups));
  }

  submitForm(): void {
    this.selectInputArtifacts.emit(this.formArray);
  }

  nextStep(): void {
    this.selectInputArtifacts.emit(this.fb.array([]));
  }

  get formArray(): FormArray {
    return this.form.get('inputArtifacts') as FormArray;
  }
}
