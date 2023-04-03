import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-evidence-costs-form',
  templateUrl: './evidence-costs-form.component.html',
  styleUrls: ['./evidence-costs-form.component.css'],
})
export class EvidenceCostsFormComponent implements OnInit, OnChanges {
  @Input() experiment?: ExperimentUsed;

  @Output() submitEvidenceCostsForm = new EventEmitter<UntypedFormGroup>();

  evidenceCostsForm: UntypedFormGroup = this.fb.group({
    maxEvidence: [undefined, Validators.required],
    costs: [undefined, Validators.required],
  });

  constructor(private fb: UntypedFormBuilder) {}

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
    this.submitEvidenceCostsForm.emit(this.evidenceCostsForm);
    this.loadForm();
  }

  private loadForm(experiment?: ExperimentUsed): void {
    this.evidenceCostsForm = this.fb.group({
      maxEvidence: [experiment?.maxEvidence, Validators.required],
      costs: [experiment?.costs, Validators.required],
    });
  }
}
