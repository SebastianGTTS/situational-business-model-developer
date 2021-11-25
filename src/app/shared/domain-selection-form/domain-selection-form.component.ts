import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { merge, Observable, Subject } from 'rxjs';
import { getTypeaheadInputPipe } from '../utils';
import { map } from 'rxjs/operators';
import { ControlContainer, FormControl } from '@angular/forms';

@Component({
  selector: 'app-domain-selection-form',
  templateUrl: './domain-selection-form.component.html',
  styleUrls: ['./domain-selection-form.component.css'],
})
export class DomainSelectionFormComponent {
  @Input() domainDefinitions: Domain[] = [];
  @Input() index: number;

  @Output() remove = new EventEmitter<void>();

  openDomainInput = new Subject<string>();

  constructor(private controlContainer: ControlContainer) {}

  searchDomains = (input: Observable<string>) => {
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

  formatter(x: { name: string }) {
    return x.name;
  }

  get formControl() {
    return this.controlContainer.control as FormControl;
  }
}
