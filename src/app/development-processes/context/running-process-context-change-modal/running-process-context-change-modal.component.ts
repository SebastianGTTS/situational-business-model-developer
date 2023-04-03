import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import {
  Selection,
  SelectionInit,
} from '../../../development-process-registry/development-method/selection';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../../../development-process-registry/method-elements/situational-factor/situational-factor';
import { UPDATABLE, Updatable } from '../../../shared/updatable';

@Component({
  selector: 'app-running-process-context-change-modal',
  templateUrl: './running-process-context-change-modal.component.html',
  styleUrls: ['./running-process-context-change-modal.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: RunningProcessContextChangeModalComponent,
    },
  ],
})
export class RunningProcessContextChangeModalComponent
  implements OnInit, OnDestroy, Updatable
{
  @Input() domains!: Domain[];
  @Input() situationalFactors!: Selection<SituationalFactor>[];

  @Output() requestContextChange = new EventEmitter<{
    comment: string;
    domains: Domain[];
    situationalFactors: Selection<SituationalFactor>[];
  }>();

  contextChangeSuggestions?: {
    comment: string;
    domains: Domain[];
    situationalFactors: Selection<SituationalFactor>[];
  };

  @ViewChildren(UPDATABLE) updatable!: QueryList<Updatable>;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.contextChangeSuggestions = {
      comment: '',
      domains: this.domains,
      situationalFactors: this.situationalFactors,
    };
  }

  ngOnDestroy(): void {
    // call complete as its modal component
    this.requestContextChange.complete();
  }

  submit(): void {
    this.update();
    this.requestContextChange.emit(this.contextChangeSuggestions);
  }

  update(): void {
    for (const updatable of this.updatable) {
      updatable.update();
    }
  }

  updateComment(comment: string): void {
    if (this.contextChangeSuggestions != null) {
      this.contextChangeSuggestions.comment = comment;
    }
  }

  updateSuggestedDomains(domains: Domain[]): void {
    if (this.contextChangeSuggestions != null) {
      this.contextChangeSuggestions.domains = domains;
    }
  }

  updateSuggestedSituationalFactors(
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): void {
    if (this.contextChangeSuggestions != null) {
      this.contextChangeSuggestions.situationalFactors = situationalFactors.map(
        (selection) =>
          new Selection<SituationalFactor>(
            undefined,
            selection,
            SituationalFactor
          )
      );
    }
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
