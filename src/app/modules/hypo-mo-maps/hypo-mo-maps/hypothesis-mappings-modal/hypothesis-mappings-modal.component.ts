import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';
import { ExperimentUsed } from '../../hypo-mo-map-meta-model/experiment-used';
import { HypothesisMappingsModal } from './hypothesis-mappings-modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hypothesis-mappings-modal',
  templateUrl: './hypothesis-mappings-modal.component.html',
  styleUrls: ['./hypothesis-mappings-modal.component.css'],
})
export class HypothesisMappingsModalComponent
  implements OnDestroy, HypothesisMappingsModal
{
  @Input() hypothesis?: Hypothesis;
  @Input() mappings?: { experiment: ExperimentUsed; metric: string }[];

  @Output() removeMapping = new EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
    hypothesisId: string;
  }>();

  constructor(private activeModal: NgbActiveModal) {}

  ngOnDestroy(): void {
    // call complete as its modal component
    this.removeMapping.complete();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
