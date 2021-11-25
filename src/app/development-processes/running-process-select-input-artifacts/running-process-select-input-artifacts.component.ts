import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { Decision } from '../../development-process-registry/bm-process/decision';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-running-process-select-input-artifacts',
  templateUrl: './running-process-select-input-artifacts.component.html',
  styleUrls: ['./running-process-select-input-artifacts.component.css'],
})
export class RunningProcessSelectInputArtifactsComponent implements OnChanges {
  @Input() runningProcess: RunningProcess;
  @Input() decision: Decision;

  @Output() selectInputArtifacts = new EventEmitter<FormArray>();

  inputArtifacts: Artifact[];

  form = this.fb.group({
    inputArtifacts: this.fb.array([]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.decision) {
      const decision: Decision = changes.decision.currentValue;
      const artifacts = [];
      decision.inputArtifacts
        .getList(decision.method.inputArtifacts)
        .elements.forEach((element) => artifacts.push(...element.elements));
      this.inputArtifacts = artifacts;
      this.loadForm(artifacts);
    }
  }

  loadForm(artifacts: Artifact[]): void {
    const formGroups = artifacts.map(() =>
      this.fb.group({
        artifact: this.fb.control(null, Validators.required),
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
