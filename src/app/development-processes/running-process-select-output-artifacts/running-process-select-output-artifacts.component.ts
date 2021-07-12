import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { Decision } from '../../development-process-registry/bm-process/decision';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { OutputArtifactMappingFormService } from '../shared/output-artifact-mapping-form.service';

@Component({
  selector: 'app-running-process-select-output-artifacts',
  templateUrl: './running-process-select-output-artifacts.component.html',
  styleUrls: ['./running-process-select-output-artifacts.component.css']
})
export class RunningProcessSelectOutputArtifactsComponent implements OnChanges {

  @Input() runningProcess: RunningProcess;
  @Input() decision: Decision;

  @Output() selectOutputArtifacts = new EventEmitter<FormArray>();

  outputArtifacts: Artifact[];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private outputArtifactMappingFormService: OutputArtifactMappingFormService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.decision) {
      const decision: Decision = changes.decision.currentValue;
      const artifacts = [];
      decision.outputArtifacts.getList(decision.method.outputArtifacts).elements.forEach((element) => artifacts.push(...element.elements));
      this.outputArtifacts = artifacts;
      this.loadForm(artifacts);
    }
  }

  loadForm(artifacts: Artifact[]) {
    this.form = this.outputArtifactMappingFormService.createForm(artifacts);
  }

  submitForm() {
    this.selectOutputArtifacts.emit(this.formArray);
  }

  nextStep() {
    this.selectOutputArtifacts.emit(this.fb.array([]));
  }

  get formArray() {
    return this.form.get('outputArtifacts') as FormArray;
  }

}
