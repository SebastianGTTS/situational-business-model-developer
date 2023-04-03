import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup } from '@angular/forms';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';
import { ExperimentEvidenceCostsModal } from './experiment-evidence-costs-modal';

@Component({
  selector: 'app-experiment-evidence-costs-modal',
  templateUrl: './experiment-evidence-costs-modal.component.html',
  styleUrls: ['./experiment-evidence-costs-modal.component.css'],
})
export class ExperimentEvidenceCostsModalComponent
  implements OnDestroy, ExperimentEvidenceCostsModal
{
  @Input() experiment?: ExperimentUsed;

  @Output() setEvidenceCosts = new EventEmitter<{
    experimentDefinitionId: string;
    experimentId: string;
    experiment: UntypedFormGroup;
  }>();

  constructor(private activeModal: NgbActiveModal) {}

  ngOnDestroy(): void {
    // call complete as its modal component
    this.setEvidenceCosts.complete();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  _setEvidenceCosts(formGroup: UntypedFormGroup): void {
    if (this.experiment != null) {
      this.setEvidenceCosts.emit({
        experimentDefinitionId: this.experiment.getExperimentDefinitionId(),
        experimentId: this.experiment.id,
        experiment: formGroup,
      });
    }
  }
}
