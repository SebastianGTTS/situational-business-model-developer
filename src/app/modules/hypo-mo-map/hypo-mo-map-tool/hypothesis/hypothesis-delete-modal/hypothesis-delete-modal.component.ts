import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hypothesis-delete-modal',
  templateUrl: './hypothesis-delete-modal.component.html',
  styleUrls: ['./hypothesis-delete-modal.component.css'],
})
export class HypothesisDeleteModalComponent implements OnDestroy {
  @Input() hypothesis?: Hypothesis;

  @Output() removeHypothesis = new EventEmitter<string>();

  constructor(private activeModal: NgbActiveModal) {}

  ngOnDestroy(): void {
    // call complete as its modal component
    this.removeHypothesis.complete();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
