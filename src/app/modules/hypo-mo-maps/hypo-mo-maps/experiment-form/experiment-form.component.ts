import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Experiment } from '../../hypo-mo-map-meta-model/experiment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-experiment-form',
  templateUrl: './experiment-form.component.html',
  styleUrls: ['./experiment-form.component.css'],
})
export class ExperimentFormComponent implements OnInit, OnChanges {
  @Input() experiment?: Experiment;
  @Input() experimentList!: Experiment[];
  @Input() submitButtonText = 'Update Experiment';

  @Output() submitExperimentForm = new EventEmitter<FormGroup>();

  disabledSubexperiments: string[] = [];
  experimentForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: '',
    subexperimentOf: [undefined],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.experiment == null) {
      this.loadForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.experiment) {
      this.loadForm(changes.experiment.currentValue);
    }
  }

  submitForm(): void {
    this.submitExperimentForm.emit(this.experimentForm);
    this.loadForm();
  }

  private loadForm(experiment?: Experiment): void {
    this.disabledSubexperiments =
      experiment
        ?.getExperimentList()
        .map((subexperiment) => subexperiment.id)
        .filter((id) => id) ?? [];
    this.experimentForm = this.fb.group({
      name: [experiment?.name ?? '', Validators.required],
      description: experiment?.description ?? '',
      subexperimentOf: experiment?.parent ? experiment.parent.id : undefined,
    });
  }
}
