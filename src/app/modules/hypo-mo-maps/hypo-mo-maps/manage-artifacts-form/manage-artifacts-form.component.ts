import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Experiment } from '../../hypo-mo-map-meta-model/experiment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-artifacts-form',
  templateUrl: './manage-artifacts-form.component.html',
  styleUrls: ['./manage-artifacts-form.component.css'],
})
export class ManageArtifactsFormComponent implements OnChanges {
  @Input() experiment?: Experiment;

  @Output() submitManageArtifactsForm = new EventEmitter<FormGroup>();

  manageArtifactsForm: FormGroup = this.fb.group({
    artifacts: this.fb.array([]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.experiment) {
      this.loadForm(changes.experiment.currentValue);
    }
  }

  submitForm(): void {
    this.submitManageArtifactsForm.emit(this.manageArtifactsForm);
  }

  get artifacts(): FormArray {
    return this.manageArtifactsForm.get('artifacts') as FormArray;
  }

  private loadForm(experiment?: Experiment): void {
    this.manageArtifactsForm.setControl(
      'artifacts',
      this.fb.array(
        experiment?.artifacts.map((artifact) =>
          this.fb.control(artifact, Validators.required)
        ) ?? []
      )
    );
  }
}
