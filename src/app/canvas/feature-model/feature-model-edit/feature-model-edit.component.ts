import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';
import { Feature } from '../../../canvas-meta-model/feature';
import { Instance } from '../../../canvas-meta-model/instance';
import { RelationshipType } from '../../../canvas-meta-model/relationships';
import { CanvasModelConsistencyService } from '../../../canvas-meta-model/canvas-model-consistency.service';

@Component({
  selector: 'app-feature-model-edit',
  templateUrl: './feature-model-edit.component.html',
  styleUrls: ['./feature-model-edit.component.css'],
})
/**
 * The FeatureModelDetailComponent shows the feature model and allow the adding/updating/deleting of features and dependencies.
 *
 * @author: Sebastian Gottschalk
 */
export class FeatureModelEditComponent implements OnChanges {
  @Input() featureModel: FeatureModel;
  @Output() updateFeatureModel = new EventEmitter<void>();

  // Variables for the feature model representation
  featureList: { id: string; levelname: string }[] = [];
  // Variables for the modal representation
  modalFeature: Feature;
  modalReference: NgbModalRef;
  modalSubfeatureIds: string[];
  // References for modal children
  @ViewChild('dependencyModal', { static: true }) dependencyModal: any;
  @ViewChild('updateModal', { static: true }) updateModal: any;
  @ViewChild('deleteModal', { static: true }) deleteModal: any;

  // Instantiation check
  problems: string[] = null;
  problemFeatureIds: string[] = null;
  possibleInstance: Instance = null;

  // Supports / Hurts check
  supportsHurtsProblems: string[] = null;
  supportsHurtsProblemFeatureIds: string[] = null;

  /**
   * Creates a new instance of the FeatureModelDetailComponent.
   *
   * @param canvasModelConsistencyService the consistency service for the canvas model
   * @param fb FormBuilder
   * @param modalService NgbModal
   */
  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.featureModel) {
      if (changes.featureModel.currentValue != null) {
        if (this.modalFeature) {
          this.modalFeature = this.featureModel.getFeature(
            this.modalFeature.id
          );
        }
        this.featureList = this.featureModel.getFeatureList();
        if (this.problems !== null) {
          this.checkInstantiationPossible();
        }
      }
    }
  }

  /**
   * Opens the dependency modal of the current feature.
   *
   * @param featureId id of the current feature
   */
  openDependenciesModal(featureId) {
    this.modalFeature = this.featureModel.getFeature(featureId);
    this.modalReference = this.modalService.open(this.dependencyModal, {
      size: 'lg',
    });
  }

  /**
   * Opens the update modal of the current feature.
   *
   * @param featureId id of the current feature
   */
  updateFeatureModal(featureId) {
    const feature = this.featureModel.getFeature(featureId);
    this.modalFeature = feature;
    this.modalSubfeatureIds = feature.getAllSubfeatures().map((f) => f.id);
    this.modalSubfeatureIds.push(feature.id);
    this.modalReference = this.modalService.open(this.updateModal, {
      size: 'lg',
    });
  }

  /**
   * Opens the modal of the current feature.
   *
   * @param featureId id of the current feature
   */
  deleteFeatureModal(featureId) {
    this.modalFeature = this.featureModel.getFeature(featureId);
    this.modalReference = this.modalService.open(this.deleteModal, {
      size: 'lg',
    });
  }

  /**
   * Closes the current modal.
   */
  closeModal() {
    this.modalReference.close();
    this.modalFeature = null;
  }

  /**
   * Delete the relationship between two features.
   *
   * @param relationshipType type of the relationship
   * @param fromFeatureId id of the first feature
   * @param toFeatureId id of the second feature
   */
  removeRelationship(
    relationshipType: RelationshipType,
    fromFeatureId: string,
    toFeatureId: string
  ): void {
    this.featureModel.removeRelationship(
      relationshipType,
      fromFeatureId,
      toFeatureId
    );
    this.updateFeatureModel.emit();
  }

  /**
   * Update the current feature.
   */
  updateFeature(featureForm: FormGroup) {
    this.featureModel.updateFeature(
      this.modalFeature.id,
      featureForm.get('subfeatureOf').value,
      featureForm.value
    );
    this.updateFeatureModel.emit();
    this.closeModal();
  }

  /**
   * Delete the current feature.
   *
   * @param featureId id of the current feature
   */
  deleteFeature(featureId) {
    this.featureModel.removeFeature(featureId);
    this.updateFeatureModel.emit();
    this.closeModal();
  }

  /**
   * Insert a new feature.
   */
  insertFeature(featureForm: FormGroup): void {
    this.featureModel.addFeature(
      featureForm.value,
      featureForm.get('subfeatureOf').value
    );
    this.updateFeatureModel.emit();
  }

  /**
   * Add a new relationship.
   */
  addRelationship(relationshipForm: FormGroup): void {
    this.featureModel.addRelationship(
      relationshipForm.value.relationshipType,
      relationshipForm.value.fromFeatureId,
      relationshipForm.value.toFeatureId
    );
    this.updateFeatureModel.emit();
  }

  checkInstantiationPossible() {
    const result = this.canvasModelConsistencyService.instanceIsPossible(
      this.featureModel
    );
    this.problems = result.problems;
    this.problemFeatureIds = result.problemFeatureIds;
    this.possibleInstance = result.possibleInstance;
    const supportsHurtsResult =
      this.canvasModelConsistencyService.checkHurtsSupports(this.featureModel);
    this.supportsHurtsProblems = supportsHurtsResult.problems;
    this.supportsHurtsProblemFeatureIds = supportsHurtsResult.problemFeatureIds;
  }

  deactivateInstantiationCheck() {
    this.problems = null;
    this.problemFeatureIds = null;
    this.possibleInstance = null;
    this.supportsHurtsProblems = null;
    this.supportsHurtsProblemFeatureIds = null;
  }
}
