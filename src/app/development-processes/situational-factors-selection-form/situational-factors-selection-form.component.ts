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
import { SituationalFactorDefinitionEntry } from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { SituationalFactorService } from '../../development-process-registry/method-elements/situational-factor/situational-factor.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Selection } from '../../development-process-registry/development-method/selection';
import { equalsList } from '../../shared/utils';
import { UPDATABLE, Updatable } from '../../shared/updatable';

@Component({
  selector: 'app-situational-factors-selection-form',
  templateUrl: './situational-factors-selection-form.component.html',
  styleUrls: ['./situational-factors-selection-form.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: SituationalFactorsSelectionFormComponent,
    },
  ],
})
export class SituationalFactorsSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() situationalFactors!: Selection<SituationalFactor>[];

  @Output() submitSituationalFactorsForm = new EventEmitter<FormArray>();

  situationalFactorsForm: FormGroup = this.fb.group({
    situationalFactors: this.fb.array([]),
  });
  changed = false;

  methodElements: SituationalFactorDefinitionEntry[] = [];
  listNames: string[] = [];

  private changeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private situationalFactorService: SituationalFactorService
  ) {}

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
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

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitSituationalFactorsForm.emit(
      this.situationalFactorsForm.get('situationalFactors') as FormArray
    );
  }

  update(): void {
    if (this.changed && this.situationalFactorsForm.valid) {
      this.submitForm();
    }
  }

  private loadForm(situationalFactors: Selection<SituationalFactor>[]): void {
    const formGroups = situationalFactors.map((factor) =>
      this.fb.group({
        list: [factor.list, Validators.required],
        element: this.fb.group({
          factor: [factor.element?.factor, Validators.required],
          value: [factor.element?.value, Validators.required],
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

  createFormGroupFactory = (): FormGroup =>
    this.fb.group({
      list: ['', Validators.required],
      element: this.fb.group({
        factor: [null, Validators.required],
        value: [null, Validators.required],
      }),
    });
}
