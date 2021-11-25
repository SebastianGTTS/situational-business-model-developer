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
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-examples-form',
  templateUrl: './examples-form.component.html',
  styleUrls: ['./examples-form.component.css'],
})
export class ExamplesFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() examples: string[];

  @Output() submitExamplesForm = new EventEmitter<FormArray>();

  examplesForm: FormGroup = this.fb.group({
    examples: this.fb.array([]),
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.changeSubscription = this.examplesForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !this.equalExamples(this.examples, value.examples))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.examples) {
      const oldExamples = changes.examples.previousValue;
      const newExamples = changes.examples.currentValue;
      if (!this.equalExamples(oldExamples, newExamples)) {
        this.loadForm(changes.examples.currentValue);
      }
    }
  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm() {
    this.submitExamplesForm.emit(this.formArray);
  }

  private loadForm(examples: string[]) {
    const formGroups = examples.map((example) =>
      this.fb.control(example, Validators.required)
    );
    this.examplesForm.setControl('examples', this.fb.array(formGroups));
  }

  private equalExamples(examplesA: string[], examplesB: string[]) {
    if (examplesA == null && examplesB == null) {
      return true;
    }
    if (examplesA == null || examplesB == null) {
      return false;
    }
    return (
      examplesA.length === examplesB.length &&
      examplesA.every((exampleA, index) => examplesB[index] === exampleA)
    );
  }

  get formArray(): FormArray {
    return this.examplesForm.get('examples') as FormArray;
  }
}
