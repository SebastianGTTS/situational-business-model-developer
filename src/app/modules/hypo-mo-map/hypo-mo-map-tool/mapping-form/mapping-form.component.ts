import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Hypothesis } from '../../hypo-mo-map-meta-artifact/hypothesis';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ExperimentUsed } from '../../hypo-mo-map-meta-artifact/experiment-used';
import { MappingInit } from '../../hypo-mo-map-meta-artifact/mapping';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mapping-form',
  templateUrl: './mapping-form.component.html',
  styleUrls: ['./mapping-form.component.css'],
})
export class MappingFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mapping?: Partial<MappingInit>;

  @Input() experimentList!: { [id: string]: ExperimentUsed };
  @Input() hypothesisList!: Hypothesis[];

  @Output() submitMappingForm = new EventEmitter<UntypedFormGroup>();

  currentSubexperimentsList: ExperimentUsed[] = [];

  mappingForm: UntypedFormGroup = this.fb.group({
    experimentDefinitionId: [null, Validators.required],
    experimentId: [null, Validators.required],
    hypothesisId: [null, Validators.required],
    metric: [null, Validators.required],
  });

  private mappingFormSubscription?: Subscription;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.mappingFormSubscription = this.mappingForm
      .get('experimentDefinitionId')
      ?.valueChanges.subscribe((value) =>
        value
          ? (this.currentSubexperimentsList = this.experimentList[
              value
            ].getExperimentList() as ExperimentUsed[])
          : null
      );
    if (this.mapping == null) {
      this.loadForm();
    } else {
      this.loadForm(this.mapping);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mapping && !changes.mapping.isFirstChange()) {
      this.loadForm(changes.mapping.currentValue);
    }
  }

  ngOnDestroy(): void {
    if (this.mappingFormSubscription != null) {
      this.mappingFormSubscription.unsubscribe();
    }
  }

  get experimentDefinitionList(): ExperimentUsed[] {
    return Object.values(this.experimentList);
  }

  submitForm(): void {
    this.submitMappingForm.emit(this.mappingForm);
  }

  private loadForm(mapping?: Partial<MappingInit>): void {
    this.mappingForm.reset({
      experimentDefinitionId: mapping?.experimentDefinitionId,
      experimentId: mapping?.experimentId,
      hypothesisId: mapping?.hypothesisId,
      metric: mapping?.metric,
    });
  }
}
