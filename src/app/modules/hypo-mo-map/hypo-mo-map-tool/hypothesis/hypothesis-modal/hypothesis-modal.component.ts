import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Hypothesis } from '../../../hypo-mo-map-meta-artifact/hypothesis';
import { UntypedFormGroup } from '@angular/forms';
import { HypothesisModal } from './hypothesis-modal';

@Component({
  selector: 'app-hypothesis-modal',
  templateUrl: './hypothesis-modal.component.html',
  styleUrls: ['./hypothesis-modal.component.css'],
})
export class HypothesisModalComponent implements OnDestroy, HypothesisModal {
  @Input() add!: boolean;
  @Input() hypothesis?: Hypothesis;
  @Input() hypothesisList?: Hypothesis[];

  @Output() updateHypothesis = new EventEmitter<UntypedFormGroup>();

  constructor(private activeModal: NgbActiveModal) {}

  ngOnDestroy(): void {
    // call complete as its modal component
    this.updateHypothesis.complete();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
