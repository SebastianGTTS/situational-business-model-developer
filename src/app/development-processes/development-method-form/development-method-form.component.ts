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
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { UPDATABLE, Updatable } from '../../shared/updatable';

@Component({
  selector: 'app-development-method-form',
  templateUrl: './development-method-form.component.html',
  styleUrls: ['./development-method-form.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: DevelopmentMethodFormComponent },
  ],
})
export class DevelopmentMethodFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() developmentMethod!: DevelopmentMethod;

  @Output() submitDevelopmentMethodForm = new EventEmitter<FormGroup>();

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.nameControl.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = value !== this.developmentMethod.name))
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.developmentMethod) {
      const oldDevelopmentMethod: DevelopmentMethod =
        changes.developmentMethod.previousValue;
      const newDevelopmentMethod: DevelopmentMethod =
        changes.developmentMethod.currentValue;
      if (
        changes.developmentMethod.firstChange ||
        oldDevelopmentMethod.name !== newDevelopmentMethod.name
      ) {
        this.nameControl.setValue(newDevelopmentMethod.name);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitDevelopmentMethodForm.emit(this.form);
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.submitForm();
    }
  }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }
}
