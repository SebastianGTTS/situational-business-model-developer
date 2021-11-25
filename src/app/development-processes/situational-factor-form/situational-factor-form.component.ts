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
import { SituationalFactorDefinition } from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { equalsListString, getTypeaheadInputPipe } from '../../shared/utils';

@Component({
  selector: 'app-situational-factor-form',
  templateUrl: './situational-factor-form.component.html',
  styleUrls: ['./situational-factor-form.component.css'],
})
export class SituationalFactorFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() situationalFactor: SituationalFactorDefinition;
  @Input() listNames: string[];

  @Output() submitSituationalFactorForm = new EventEmitter<FormGroup>();

  form: FormGroup = this.fb.group({
    list: ['', Validators.required],
    values: this.fb.array([]),
  });
  changed = false;

  openListInput = new Subject<string>();

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
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

  ngOnChanges(changes: SimpleChanges) {
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

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
    this.openListInput.complete();
  }

  searchLists = (input: Observable<string>) => {
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

  private equals(
    situationalFactorA: SituationalFactorDefinition,
    situationalFactorB: SituationalFactorDefinition
  ) {
    if (situationalFactorA == null && situationalFactorB == null) {
      return true;
    }
    if (situationalFactorA == null || situationalFactorB == null) {
      return false;
    }
    return (
      situationalFactorA.list === situationalFactorB.list &&
      equalsListString(situationalFactorA.values, situationalFactorB.values)
    );
  }

  private loadForm(situationalFactor: SituationalFactorDefinition) {
    this.form.patchValue(situationalFactor);
    this.valuesFormArray.clear();
    situationalFactor.values.forEach((value, index) =>
      this.valuesFormArray.setControl(
        index,
        this.fb.control(value, Validators.required)
      )
    );
  }

  submitForm() {
    this.submitSituationalFactorForm.emit(this.form);
  }

  get valuesFormArray() {
    return this.form.get('values') as FormArray;
  }
}
