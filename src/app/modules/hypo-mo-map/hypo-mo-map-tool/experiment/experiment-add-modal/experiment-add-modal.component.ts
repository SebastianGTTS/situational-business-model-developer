import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ExperimentAddModal } from './experiment-add-modal';
import { ExperimentDefinitionEntry } from '../../../hypo-mo-map-meta-artifact/experiment-definition';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-experiment-add-modal',
  templateUrl: './experiment-add-modal.component.html',
  styleUrls: ['./experiment-add-modal.component.css'],
})
export class ExperimentAddModalComponent
  implements OnDestroy, ExperimentAddModal
{
  @Input() experiments?: ExperimentDefinitionEntry[];

  @Output() addExperiment = new EventEmitter<ExperimentDefinitionEntry>();

  formGroup = this.fb.group({
    experiment: [null, Validators.required],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder
  ) {}

  ngOnDestroy(): void {
    // call complete as its modal component
    this.addExperiment.complete();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  get experimentControl(): UntypedFormControl {
    return this.formGroup.get('experiment') as UntypedFormControl;
  }

  get selectedExperiment(): ExperimentDefinitionEntry | undefined {
    return this.experimentControl.value ?? undefined;
  }
}
