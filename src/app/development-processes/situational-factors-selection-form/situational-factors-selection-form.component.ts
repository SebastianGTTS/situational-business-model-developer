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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SituationalFactor } from '../../development-process-registry/method-elements/situational-factor/situational-factor';
import { SituationalFactorDefinition } from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Selection } from '../../development-process-registry/development-method/selection';
import { equalsList } from '../../shared/utils';

@Component({
  selector: 'app-situational-factors-selection-form',
  templateUrl: './situational-factors-selection-form.component.html',
  styleUrls: ['./situational-factors-selection-form.component.css'],
})
export class SituationalFactorsSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() situationalFactors: Selection<SituationalFactor>[];

  @Output() submitSituationalFactorsForm = new EventEmitter<FormArray>();

  situationalFactorsForm: FormGroup = this.fb.group({
    situationalFactors: this.fb.array([]),
  });
  changed = false;

  methodElements: SituationalFactorDefinition[] = [];
  listNames: string[] = [];

  private changeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private situationalFactorService: SituationalFactorService
  ) {}

  ngOnInit() {
    void this.loadFactors();
    this.changeSubscription = this.situationalFactorsForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !equalsList(
              this.situationalFactors,
              value.situationalFactors
            ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.situationalFactors) {
      const oldFactors: Selection<SituationalFactor>[] =
        changes.situationalFactors.previousValue;
      const newFactors: Selection<SituationalFactor>[] =
        changes.situationalFactors.currentValue;
      if (!equalsList(oldFactors, newFactors)) {
        this.loadForm(newFactors);
      }
    }
  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm() {
    this.submitSituationalFactorsForm.emit(
      this.situationalFactorsForm.get('situationalFactors') as FormArray
    );
  }

  private loadForm(situationalFactors: Selection<SituationalFactor>[]) {
    const formGroups = situationalFactors.map((factor) =>
      this.fb.group({
        list: [factor.list, Validators.required],
        element: this.fb.group({
          factor: [factor.element.factor, Validators.required],
          value: [factor.element.value, Validators.required],
        }),
      })
    );
    this.situationalFactorsForm.setControl(
      'situationalFactors',
      this.fb.array(formGroups)
    );
  }

  private async loadFactors(): Promise<void> {
    this.methodElements = await this.situationalFactorService.getList();
    this.listNames = [
      ...new Set(this.methodElements.map((element) => element.list)),
    ];
  }

  createFormGroupFactory = () =>
    this.fb.group({
      list: ['', Validators.required],
      element: this.fb.group({
        factor: [null, Validators.required],
        value: [null, Validators.required],
      }),
    });
}
