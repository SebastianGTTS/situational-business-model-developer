import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MappingAddModal } from './mapping-add-modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MappingInit } from '../../hypo-mo-map-meta-model/mapping';
import { HypoMoMap } from '../../hypo-mo-map-meta-model/hypo-mo-map';
import { Hypothesis } from '../../hypo-mo-map-meta-model/hypothesis';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mapping-add-modal',
  templateUrl: './mapping-add-modal.component.html',
  styleUrls: ['./mapping-add-modal.component.css'],
})
export class MappingAddModalComponent implements OnDestroy, MappingAddModal {
  @Input() hypoMoMap?: HypoMoMap;
  @Input() hypothesisList?: Hypothesis[];
  @Input() mapping?: Partial<MappingInit>;

  @Output() addMapping = new EventEmitter<FormGroup>();

  constructor(private activeModal: NgbActiveModal) {}

  ngOnDestroy(): void {
    // call complete as its modal component
    this.addMapping.complete();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
