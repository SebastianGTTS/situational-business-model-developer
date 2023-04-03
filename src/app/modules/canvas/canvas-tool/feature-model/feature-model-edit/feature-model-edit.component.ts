import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FeatureModel } from '../../../canvas-meta-artifact/feature-model';
import { Feature } from '../../../canvas-meta-artifact/feature';
import { Instance } from '../../../canvas-meta-artifact/instance';
import { RelationshipType } from '../../../canvas-meta-artifact/relationships';
import { CanvasModelConsistencyService } from '../../../canvas-meta-artifact/canvas-model-consistency.service';
import { FeatureTreeComponent } from '../feature-tree/feature-tree.component';
import { FeatureTree } from '../feature-tree/feature-tree';

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
  @Input() featureModel!: FeatureModel;
  @Output() updateFeatureModel = new EventEmitter<void>();

  // Variables for the feature model representation
  featureList: { id: string; levelname: string }[] = [];
  // Variables for the modal representation
  modalFeature?: Feature;
  modalReference?: NgbModalRef;
  modalSubfeatureIds?: string[];
  // References for modal children
  @ViewChild('dependencyModal', { static: true }) dependencyModal: unknown;
  @ViewChild('updateModal', { static: true }) updateModal: unknown;
  @ViewChild('deleteModal', { static: true }) deleteModal: unknown;
  @ViewChild(FeatureTreeComponent) featureTree?: FeatureTree;

  // Instantiation check
  problems?: string[];
  problemFeatureIds?: string[];
  possibleInstance?: Instance;

  // Supports / Hurts check
  supportsHurtsProblems?: string[];
  supportsHurtsProblemFeatureIds?: string[];

  /**
   * Creates a new instance of the FeatureModelDetailComponent.
   *
   * @param canvasModelConsistencyService the consistency service for the canvas model
   * @param fb FormBuilder
   * @param modalService NgbModal
   */
  constructor(
    private canvasModelConsistencyService: CanvasModelConsistencyService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.featureModel) {
      if (changes.featureModel.currentValue != null) {
        if (this.modalFeature) {
          this.modalFeature = this.featureModel.getFeature(
            this.modalFeature.id
          );
        }
        this.featureList = this.featureModel.getFeatureList();
        if (this.problems != null) {
          this.checkInstantiationPossible();
        }
      }
    }
  }

  expandFeatureTree(): void {
    this.featureTree?.expandAll();
  }

  collapseFeatureTree(): void {
    this.featureTree?.collapseAll();
  }

  /**
   * Opens the dependency modal of the current feature.
   *
   * @param featureId id of the current feature
   */
  openDependenciesModal(featureId: string): void {
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
  updateFeatureModal(featureId: string): void {
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
  deleteFeatureModal(featureId: string): void {
    this.modalFeature = this.featureModel.getFeature(featureId);
    this.modalReference = this.modalService.open(this.deleteModal, {
      size: 'lg',
    });
  }

  /**
   * Closes the current modal.
   */
  closeModal(): void {
    if (this.modalReference != null) {
      this.modalReference.close();
      this.modalReference = undefined;
    }
    this.modalFeature = undefined;
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
  updateFeature(featureForm: UntypedFormGroup): void {
    if (this.modalFeature != null) {
      this.featureModel.updateFeature(
        this.modalFeature.id,
        this.modalFeature.parent != null
          ? featureForm.get('subfeatureOf')?.value
          : undefined,
        featureForm.value
      );
      this.updateFeatureModel.emit();
      this.closeModal();
    }
  }

  /**
   * Delete the current feature.
   *
   * @param featureId id of the current feature
   */
  deleteFeature(featureId: string): void {
    this.featureModel.removeFeature(featureId);
    this.updateFeatureModel.emit();
    this.closeModal();
  }

  /**
   * Insert a new feature.
   */
  insertFeature(featureForm: UntypedFormGroup): void {
    this.featureModel.addFeature(
      featureForm.value,
      featureForm.get('subfeatureOf')?.value
    );
    this.updateFeatureModel.emit();
  }

  /**
   * Add a new relationship.
   */
  addRelationship(relationshipForm: UntypedFormGroup): void {
    this.featureModel.addRelationship(
      relationshipForm.value.relationshipType,
      relationshipForm.value.fromFeatureId,
      relationshipForm.value.toFeatureId
    );
    this.updateFeatureModel.emit();
  }

  checkInstantiationPossible(): void {
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

  deactivateInstantiationCheck(): void {
    this.problems = undefined;
    this.problemFeatureIds = undefined;
    this.possibleInstance = undefined;
    this.supportsHurtsProblems = undefined;
    this.supportsHurtsProblemFeatureIds = undefined;
  }
}
