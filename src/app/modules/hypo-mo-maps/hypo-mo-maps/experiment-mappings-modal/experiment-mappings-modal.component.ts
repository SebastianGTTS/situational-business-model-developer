import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';
import { ExperimentUsed } from '../../hypo-mo-map-meta-model/experiment-used';
import { ExperimentMappingsModal } from './experiment-mappings-modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-experiment-mappings-modal',
  templateUrl: './experiment-mappings-modal.component.html',
  styleUrls: ['./experiment-mappings-modal.component.css'],
})
export class ExperimentMappingsModalComponent
  implements OnDestroy, ExperimentMappingsModal
{
  @Input() experiment?: ExperimentUsed;
  @Input() mappings?: { hypothesis: Hypothesis; metric: string }[];

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
