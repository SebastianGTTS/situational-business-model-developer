import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExperimentUsed } from '../../../hypo-mo-map-meta-artifact/experiment-used';

@Component({
  selector: 'app-experiment-delete-modal',
  templateUrl: './experiment-delete-modal.component.html',
  styleUrls: ['./experiment-delete-modal.component.css'],
})
export class ExperimentDeleteModalComponent implements OnDestroy {
  @Input() experiment?: ExperimentUsed;

  @Output() removeExperiment = new EventEmitter<string>();

  constructor(private activeModal: NgbActiveModal) {}

  ngOnDestroy(): void {
    // call complete as its modal component
    this.removeExperiment.complete();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
