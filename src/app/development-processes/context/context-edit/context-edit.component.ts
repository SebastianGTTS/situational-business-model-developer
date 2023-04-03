import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import {
  Selection,
  SelectionInit,
} from '../../../development-process-registry/development-method/selection';
import { UPDATABLE, Updatable } from '../../../shared/updatable';

@Component({
  selector: 'app-context-edit',
  templateUrl: './context-edit.component.html',
  styleUrls: ['./context-edit.component.css'],
  providers: [{ provide: UPDATABLE, useExisting: ContextEditComponent }],
})
export class ContextEditComponent implements Updatable {
  @Input() domains!: Domain[];
  @Input() situationalFactors!: Selection<SituationalFactor>[];

  @Output() updateDomains = new EventEmitter<Domain[]>();
  @Output() updateSituationalFactors = new EventEmitter<
    SelectionInit<SituationalFactorInit>[]
  >();

  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }
}
