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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';

@Component({
  selector: 'app-process-pattern-form',
  templateUrl: './process-pattern-form.component.html',
  styleUrls: ['./process-pattern-form.component.css'],
})
export class ProcessPatternFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() processPattern!: ProcessPattern;

  @Output() submitProcessPatternForm = new EventEmitter<FormGroup>();

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.nameControl.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = value !== this.processPattern.name))
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.processPattern) {
      const oldProcessPattern: ProcessPattern =
        changes.processPattern.previousValue;
      const newProcessPattern: ProcessPattern =
        changes.processPattern.currentValue;
      if (
        changes.processPattern.firstChange ||
        oldProcessPattern.name !== newProcessPattern.name
      ) {
        this.nameControl.setValue(newProcessPattern.name);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitProcessPatternForm.emit(this.form);
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }
}
