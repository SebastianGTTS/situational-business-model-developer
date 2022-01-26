import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Feature, FeatureInit } from '../../../canvas-meta-model/feature';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { Instance } from '../../../canvas-meta-model/instance';
import { InstanceService } from '../instance.service';
import { ConformanceReport } from '../../../canvas-meta-model/conformance-report';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.css'],
})
export class InstanceComponent {
  @Input() featureModel: FeatureModel;
  @Input() instance: Instance;

  @Input() editable = true;
  @Input() adaptable = true;
  @Input() updatable = true;

  @Input() conformanceIsChecked = false;
  @Input() conformance: ConformanceReport = new ConformanceReport();
  @Input() conformanceOptions: {
    showWarnings: boolean;
    showStrengths: boolean;
    showHints: boolean;
    showPatternHints: boolean;
  } = {
    showHints: false,
    showPatternHints: false,
    showStrengths: false,
    showWarnings: false,
  };

  @Input() patternInstance: Instance;

  @Input() compareInstance: Instance;
  @Input() percentages: { [id: string]: number } = null;

  @Output() updateFeatureModel = new EventEmitter<void>();
  @Output() createAdaptation = new EventEmitter<void>();

  private modalReference: NgbModalRef;
  modalFeature: Feature;

  @ViewChild('addModal', { static: true }) addModal: unknown;
  @ViewChild('deleteModal', { static: true }) deleteModal: unknown;

  constructor(
    private instanceService: InstanceService,
    private modalService: NgbModal
  ) {}

  /**
   * Opens the add modal to add a decision.
   *
   * @param featureId id of the parent feature
   */
  openAddDecisionModal(featureId: string): void {
    this.modalFeature = this.featureModel.getFeature(featureId);
    this.modalReference = this.modalService.open(this.addModal, { size: 'lg' });
  }

  /**
   * Add feature and add as decision
   *
   * @param feature the feature to add (values will be copied to a new object)
   */
  addFeature(feature: FeatureInit): void {
    const addedFeature = this.featureModel.addFeature(
      feature,
      this.modalFeature.id
    );
    this.featureModel.addFeatureToInstance(this.instance.id, addedFeature.id);
    this.updateFeatureModel.emit();
  }

  /**
   * Add a decision
   *
   * @param featureId id of the feature to add
   */
  addDecision(featureId: string): void {
    this.featureModel.addFeatureToInstance(this.instance.id, featureId);
    this.updateFeatureModel.emit();
  }

  /**
   * Opens the delete modal to delete a decision.
   *
   * @param featureId id of the feature to delete
   */
  openDeleteDecisionModal(featureId: string): void {
    this.modalFeature = this.featureModel.getFeature(featureId);
    this.modalReference = this.modalService.open(this.deleteModal, {
      size: 'lg',
    });
  }

  /**
   * Delete a decision
   *
   * @param featureId id of the feature to delete
   */
  deleteDecision(featureId: string): void {
    this.featureModel.removeFeatureFromInstance(this.instance.id, featureId);
    this.updateFeatureModel.emit();
    this.closeModal();
  }

  update(patternInfo: Partial<Instance>): void {
    this.featureModel.updateInstance(this.instance.id, patternInfo);
    this.updateFeatureModel.emit();
  }

  closeModal(): void {
    this.modalReference.close();
    this.modalFeature = null;
    this.modalReference = null;
  }
}
