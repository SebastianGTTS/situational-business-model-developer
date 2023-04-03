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
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

@Component({
  selector: 'app-examples-form',
  templateUrl: './examples-form.component.html',
  styleUrls: ['./examples-form.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: ExamplesFormComponent,
    },
  ],
})
export class ExamplesFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() examples!: string[];

  @Output() submitExamplesForm = new EventEmitter<UntypedFormArray>();

  examplesForm: UntypedFormGroup = this.fb.group({
    examples: this.fb.array([]),
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.examples) {
      const oldExamples = changes.examples.previousValue;
      const newExamples = changes.examples.currentValue;
      if (!this.equalExamples(oldExamples, newExamples)) {
        this.loadForm(changes.examples.currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitExamplesForm.emit(this.formArray);
  }

  update(): void {
    if (this.changed && this.examplesForm.valid) {
      this.submitForm();
    }
  }

  private loadForm(examples: string[]): void {
    const formGroups = examples.map((example) =>
      this.fb.control(example, Validators.required)
    );
    this.examplesForm.setControl('examples', this.fb.array(formGroups));
  }

  private equalExamples(examplesA: string[], examplesB: string[]): boolean {
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

  get formArray(): UntypedFormArray {
    return this.examplesForm.get('examples') as UntypedFormArray;
  }
}
