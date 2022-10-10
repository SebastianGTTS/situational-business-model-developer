import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Domain,
  DomainEntry,
} from '../../development-process-registry/knowledge/domain';
import { merge, Observable, Subject } from 'rxjs';
import { getTypeaheadInputPipe } from '../utils';
import { map } from 'rxjs/operators';
import { ControlContainer, FormControl } from '@angular/forms';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-domain-selection-form',
  templateUrl: './domain-selection-form.component.html',
  styleUrls: ['./domain-selection-form.component.css'],
})
export class DomainSelectionFormComponent {
  @Input() domainDefinitions: DomainEntry[] = [];
  @Input() index!: number;

  @Output() remove = new EventEmitter<void>();

  openDomainInput = new Subject<string>();

  constructor(private controlContainer: ControlContainer) {}

  searchDomains = (input: Observable<string>): Observable<DomainEntry[]> => {
    return merge(getTypeaheadInputPipe(input), this.openDomainInput).pipe(
      map((term) =>
        this.domainDefinitions
          .filter((domain) =>
            domain.name.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 7)
      )
    );
  };

  formatter(x: { name: string }): string {
    return x.name;
  }

  selectItem(event: NgbTypeaheadSelectItemEvent<DomainEntry>): void {
    event.preventDefault();
    this.formControl.setValue(new Domain(event.item, undefined));
  }

  get formControl(): FormControl {
    return this.controlContainer.control as FormControl;
  }
}
