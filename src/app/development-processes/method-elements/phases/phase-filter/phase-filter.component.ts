import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  Phase,
  PhaseEntry,
} from '../../../../development-process-registry/phase/phase';
import { PhaseListService } from '../../../../development-process-registry/phase/phase-list.service';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { getTypeaheadInputPipe } from '../../../../shared/utils';
import { map } from 'rxjs/operators';
import { FilterService } from '../../../../shared/filter.service';

@Component({
  selector: 'app-phase-filter',
  templateUrl: './phase-filter.component.html',
  styleUrls: ['./phase-filter.component.scss'],
})
export class PhaseFilterComponent<T extends { phases: PhaseEntry[] }>
  implements OnInit, OnDestroy
{
  private static readonly filterId = 'phase';

  phases: Phase[] = [];

  form = this.fb.group({
    phase: this.fb.control<Phase | null>(null),
  });
  openPhaseInput = new Subject<string>();

  private formChangeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService<T>,
    private phaseListService: PhaseListService
  ) {}

  ngOnInit(): void {
    this.formChangeSubscription = this.form.valueChanges.subscribe((value) => {
      if (value.phase != null) {
        const selectedPhase = value.phase;
        this.filterService.addFilterFunction(
          PhaseFilterComponent.filterId,
          (item) => item.phases?.some((phase) => phase.id === selectedPhase.id)
        );
      } else {
        this.filterService.removeFilterFunction(PhaseFilterComponent.filterId);
      }
    });
    void this.loadPhases();
  }

  ngOnDestroy(): void {
    this.openPhaseInput.complete();
    this.formChangeSubscription?.unsubscribe();
    this.filterService.removeFilterFunction(PhaseFilterComponent.filterId);
  }

  private async loadPhases(): Promise<void> {
    const phaseList = await this.phaseListService.get();
    this.phases = phaseList.phases;
  }

  searchPhases = (input: Observable<string>): Observable<Phase[]> => {
    return merge(getTypeaheadInputPipe(input), this.openPhaseInput).pipe(
      map((term) =>
        this.phases
          .filter((phase) =>
            phase.name.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 7)
      )
    );
  };

  formatter(x: Phase): string {
    return x.name;
  }

  get isValid(): boolean {
    return this.form.value.phase != null;
  }
}
