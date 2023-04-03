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
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SituationalFactorDefinition } from '../../../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import {
  equalsListString,
  getTypeaheadInputPipe,
} from '../../../../shared/utils';
import { Updatable, UPDATABLE } from 'src/app/shared/updatable';

@Component({
  selector: 'app-situational-factor-form',
  templateUrl: './situational-factor-form.component.html',
  styleUrls: ['./situational-factor-form.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: SituationalFactorFormComponent },
  ],
})
export class SituationalFactorFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() situationalFactor!: SituationalFactorDefinition;
  @Input() listNames!: string[];

  @Output() submitSituationalFactorForm = new EventEmitter<UntypedFormGroup>();

  form: UntypedFormGroup = this.fb.group({
    list: ['', Validators.required],
    description: [''],
    ordered: [false, Validators.required],
    values: this.fb.array([]),
  });
  changed = false;

  openListInput = new Subject<string>();

  private changeSubscription?: Subscription;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !this.equals(this.situationalFactor, value))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.situationalFactor) {
      const oldSituationalFactor: SituationalFactorDefinition =
        changes.situationalFactor.previousValue;
      const newSituationalFactor: SituationalFactorDefinition =
        changes.situationalFactor.currentValue;
      if (!this.equals(newSituationalFactor, oldSituationalFactor)) {
        this.loadForm(newSituationalFactor);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
    this.openListInput.complete();
  }

  searchLists = (input: Observable<string>): Observable<string[]> => {
    return merge(getTypeaheadInputPipe(input), this.openListInput).pipe(
      map((term) =>
        this.listNames
          .filter((listItem) =>
            listItem.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 10)
      )
    );
  };

  // noinspection JSMethodCanBeStatic
  private equals(
    situationalFactorA: SituationalFactorDefinition,
    situationalFactorB: SituationalFactorDefinition
  ): boolean {
    if (situationalFactorA == null && situationalFactorB == null) {
      return true;
    }
    if (situationalFactorA == null || situationalFactorB == null) {
      return false;
    }
    return (
      situationalFactorA.list === situationalFactorB.list &&
      situationalFactorA.description === situationalFactorB.description &&
      situationalFactorA.ordered === situationalFactorB.ordered &&
      equalsListString(situationalFactorA.values, situationalFactorB.values)
    );
  }

  private loadForm(situationalFactor: SituationalFactorDefinition): void {
    this.form.patchValue(situationalFactor);
    this.valuesFormArray.clear();
    situationalFactor.values.forEach((value, index) =>
      this.valuesFormArray.setControl(
        index,
        this.fb.control(value, Validators.required)
      )
    );
  }

  submitForm(): void {
    this.submitSituationalFactorForm.emit(this.form);
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.submitForm();
    }
  }

  get valuesFormArray(): UntypedFormArray {
    return this.form.get('values') as UntypedFormArray;
  }

  get ordered(): boolean {
    return this.form.get('ordered')?.value;
  }
}
