import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Experiment } from '../../../hypo-mo-map-meta-artifact/experiment';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-manage-artifacts-form',
  templateUrl: './manage-artifacts-form.component.html',
  styleUrls: ['./manage-artifacts-form.component.css'],
})
export class ManageArtifactsFormComponent implements OnChanges {
  @Input() experiment?: Experiment;

  @Output() submitManageArtifactsForm = new EventEmitter<UntypedFormGroup>();

  manageArtifactsForm: UntypedFormGroup = this.fb.group({
    artifacts: this.fb.array([]),
  });

  constructor(private fb: UntypedFormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.experiment) {
      this.loadForm(changes.experiment.currentValue);
    }
  }

  submitForm(): void {
    this.submitManageArtifactsForm.emit(this.manageArtifactsForm);
  }

  get artifacts(): UntypedFormArray {
    return this.manageArtifactsForm.get('artifacts') as UntypedFormArray;
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
