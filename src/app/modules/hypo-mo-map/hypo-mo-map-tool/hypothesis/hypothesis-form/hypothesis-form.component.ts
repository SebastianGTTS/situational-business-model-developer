import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  Hypothesis,
  SubhypothesesConnections,
} from '../../../hypo-mo-map-meta-artifact/hypothesis';

@Component({
  selector: 'app-hypothesis-form',
  templateUrl: './hypothesis-form.component.html',
  styleUrls: ['./hypothesis-form.component.css'],
})
export class HypothesisFormComponent implements OnInit, OnChanges {
  @Input() hypothesis?: Hypothesis;
  @Input() hypothesisList!: Hypothesis[];
  @Input() submitButtonText = 'Update Hypothesis';

  @Output() submitHypothesisForm = new EventEmitter<UntypedFormGroup>();

  disabledSubhypotheses: string[] = [];
  hypothesisForm: UntypedFormGroup = this.fb.group({
    name: ['', Validators.required],
    priority: 1,
    subhypothesesConnections: [
      SubhypothesesConnections.OR,
      Validators.required,
    ],
    subhypothesisOf: null,
  });

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    if (this.hypothesis == null) {
      this.loadForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hypothesis) {
      this.loadForm(changes.hypothesis.currentValue);
    }
  }

  submitForm(): void {
    this.submitHypothesisForm.emit(this.hypothesisForm);
    this.loadForm();
  }

  private loadForm(hypothesis?: Hypothesis): void {
    this.disabledSubhypotheses =
      hypothesis
        ?.getHypothesisList()
        .map((h) => h.id)
        .filter((id) => id) ?? [];
    this.hypothesisForm = this.fb.group({
      name: [hypothesis?.name ?? '', Validators.required],
      priority: hypothesis?.priority ?? 1,
      subhypothesesConnections: [
        hypothesis?.subhypothesesConnections ?? SubhypothesesConnections.OR,
        Validators.required,
      ],
      subhypothesisOf: hypothesis?.parent ? hypothesis.parent.id : null,
    });
  }
}
