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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { UPDATABLE, Updatable } from 'src/app/shared/updatable';
import { Phase } from '../../../../development-process-registry/phase/phase';

@Component({
  selector: 'app-phase-form',
  templateUrl: './phase-form.component.html',
  styleUrls: ['./phase-form.component.css'],
  providers: [{ provide: UPDATABLE, useExisting: PhaseFormComponent }],
})
export class PhaseFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() phase?: Phase;

  @Output() submitPhaseForm = new EventEmitter<FormGroup>();

  phaseForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changeSubscription = this.phaseForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed =
              this.phase != null && !this.equals(this.phase, value))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.phase) {
      const oldPhase: Phase = changes.phase.previousValue;
      const newPhase: Phase = changes.phase.currentValue;
      if (!this.equals(newPhase, oldPhase)) {
        this.loadForm(newPhase);
      }
    }
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  private loadForm(phase: Phase): void {
    this.phaseForm.patchValue(phase);
  }

  // noinspection JSMethodCanBeStatic
  private equals(
    phaseA: Phase,
    phaseB: Phase | Partial<{ name: string | null; description: string | null }>
  ): boolean {
    if (phaseA == null && phaseB == null) {
      return true;
    }
    if (phaseA == null || phaseB == null) {
      return false;
    }
    return (
      phaseA.name === phaseB.name && phaseA.description === phaseB.description
    );
  }

  submitForm(): void {
    this.submitPhaseForm.emit(this.phaseForm);
    if (this.phase == null) {
      this.phaseForm.reset();
    }
  }

  update(): void {
    if (this.changed && this.phaseForm.valid) {
      this.submitForm();
    }
  }
}
