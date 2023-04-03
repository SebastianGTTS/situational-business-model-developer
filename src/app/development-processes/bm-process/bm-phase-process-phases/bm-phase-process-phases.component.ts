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
import { PhaseListService } from '../../../development-process-registry/phase/phase-list.service';
import { Phase } from '../../../development-process-registry/phase/phase';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { PhaseDecision } from '../../../development-process-registry/bm-process/phase-decision';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsList } from '../../../shared/utils';
import { UPDATABLE, Updatable } from '../../../shared/updatable';

@Component({
  selector: 'app-bm-phase-process-phases',
  templateUrl: './bm-phase-process-phases.component.html',
  styleUrls: ['./bm-phase-process-phases.component.css'],
  providers: [
    { provide: UPDATABLE, useExisting: BmPhaseProcessPhasesComponent },
  ],
})
export class BmPhaseProcessPhasesComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() phaseDecisions!: PhaseDecision[];

  @Output() dismiss = new EventEmitter<void>();
  @Output() submitPhasesForm = new EventEmitter<string[]>();

  form: UntypedFormGroup = this.fb.group({
    phases: this.fb.array([]),
  });
  changed = false;

  phases?: Phase[];
  selectedPhases?: Phase[];

  private changeSubscription?: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private phaseListService: PhaseListService
  ) {}

  ngOnInit(): void {
    void this.loadPhases();
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !equalsList(
              this.selectedPhases ?? [],
              this.phases?.filter((phase, index) => value.phases[index]) ?? []
            ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.phaseDecisions) {
      const oldSelectedPhases = this.selectedPhases;
      const newSelectedPhases = this.phaseDecisions.map(
        (decision) => decision.phase
      );
      this.selectedPhases = newSelectedPhases;
      if (!equalsList(oldSelectedPhases, newSelectedPhases)) {
        this.loadForm();
      }
    }
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  loadForm(): void {
    if (this.phases != null) {
      const phaseIdSet = new Set<string>(
        this.selectedPhases?.map((phase) => phase.id)
      );
      const formGroups = this.phases.map((phase) =>
        this.fb.control(phaseIdSet.has(phase.id), Validators.required)
      );
      this.form.setControl('phases', this.fb.array(formGroups));
    }
  }

  submitForm(): void {
    const formValue: boolean[] = this.form.value.phases;
    const selectedPhases = this.phases
      ?.filter((phase, index) => formValue[index])
      .map((phase) => phase.id);
    this.submitPhasesForm.emit(selectedPhases);
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.submitForm();
    }
  }

  private async loadPhases(): Promise<void> {
    this.phases = (await this.phaseListService.get()).phases;
    this.loadForm();
  }
}
