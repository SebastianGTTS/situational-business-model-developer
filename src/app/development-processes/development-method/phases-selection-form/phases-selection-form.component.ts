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
import { Phase } from '../../../development-process-registry/phase/phase';
import { equalsList } from '../../../shared/utils';
import { debounceTime, tap } from 'rxjs/operators';
import { PhaseListService } from '../../../development-process-registry/phase/phase-list.service';
import { UPDATABLE, Updatable } from '../../../shared/updatable';

@Component({
  selector: 'app-phases-selection-form',
  templateUrl: './phases-selection-form.component.html',
  styleUrls: ['./phases-selection-form.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: PhasesSelectionFormComponent,
    },
  ],
})
export class PhasesSelectionFormComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() phases!: Phase[];

  @Output() submitPhasesForm = new EventEmitter<UntypedFormArray>();

  phasesForm: UntypedFormGroup = this.fb.group({
    phases: this.fb.array([]),
  });
  changed = false;

  allPhases: Phase[] = [];

  private changeSubscription?: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private phaseListService: PhaseListService
  ) {}

  ngOnInit(): void {
    void this.loadPhases();
    this.changeSubscription = this.phasesForm.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => (this.changed = !equalsList(this.phases, value.phases)))
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.phases) {
      const oldPhases: Phase[] = changes.phases.previousValue;
      const newPhases: Phase[] = changes.phases.currentValue;
      if (!equalsList(oldPhases, newPhases)) {
        this.loadForm(newPhases);
      }
    }
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  submitForm(): void {
    this.submitPhasesForm.emit(this.phasesControl);
  }

  update(): void {
    if (this.changed && this.phasesForm.valid) {
      this.submitForm();
    }
  }

  add(): void {
    this.phasesControl.push(this.fb.control('', Validators.required));
  }

  remove(index: number): void {
    this.phasesControl.removeAt(index);
  }

  private loadForm(phases: Phase[]): void {
    const formGroups = phases.map((phase) =>
      this.fb.control(phase, Validators.required)
    );
    this.phasesForm.setControl('phases', this.fb.array(formGroups));
  }

  private async loadPhases(): Promise<void> {
    this.allPhases = (await this.phaseListService.get()).phases;
  }

  get phasesControl(): UntypedFormArray {
    return this.phasesForm.get('phases') as UntypedFormArray;
  }
}
