import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, FormGroupDirective } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { Phase } from '../../../development-process-registry/phase/phase';
import { getTypeaheadInputPipe } from '../../../shared/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-phase-selection-form',
  templateUrl: './phase-selection-form.component.html',
  styleUrls: ['./phase-selection-form.component.css'],
})
export class PhaseSelectionFormComponent {
  @Input() phases: Phase[] = [];

  @Output() remove = new EventEmitter<void>();

  openPhaseInput = new Subject<string>();

  constructor(private formGroupDirective: FormGroupDirective) {}

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

  get formControl(): UntypedFormControl {
    return this.formGroupDirective.control as unknown as UntypedFormControl;
  }
}
