import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';
import { RelationshipType } from '../../../canvas-meta-model/relationships';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';

@Component({
  selector: 'app-cross-tree-relationship-modal',
  templateUrl: './cross-tree-relationship-modal.component.html',
  styleUrls: ['./cross-tree-relationship-modal.component.css'],
})
export class CrossTreeRelationshipModalComponent implements OnChanges {
  @Input() featureModel!: FeatureModel;
  @Input() feature!: Feature;
  @Input() companyModel?: CompanyModel;

  @Output() closeModal = new EventEmitter<null>();
  @Output() addRelationshipOnCompanyModel = new EventEmitter<{
    type: RelationshipType;
    fromFeatureId: string;
    toFeatureId: string;
  }>();
  @Output() removeRelationship = new EventEmitter<{
    type: RelationshipType;
    fromFeatureId: string;
    toFeatureId: string;
  }>();

  relationships: {
    name: string;
    type: RelationshipType;
    features: Feature[];
  }[] = [];
  tracedFeature?: Feature;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.feature) {
      this.load(changes.feature.currentValue);
    }
  }

  add(type: RelationshipType, toExpertFeatureId: string): void {
    if (this.companyModel != null) {
      const toCompanyFeatureId =
        this.companyModel.expertModelTraces[this.featureModel._id]
          .expertFeatureIdMap[toExpertFeatureId];
      this.addRelationshipOnCompanyModel.emit({
        type,
        fromFeatureId: this.feature.id,
        toFeatureId: toCompanyFeatureId,
      });
    }
  }

  remove(type: RelationshipType, toFeatureId: string): void {
    this.removeRelationship.emit({
      type,
      fromFeatureId: this.feature.id,
      toFeatureId,
    });
  }

  private load(feature: Feature): void {
    this.relationships = [];
    this.tracedFeature = undefined;
    const featureMap = this.featureModel.getFeatureMap();
    const relationshipTypes = this.featureModel.definition.relationshipTypes;
    relationshipTypes.forEach((type) =>
      this.loadRelationship(
        type,
        type,
        feature.relationships.getRelationships(type),
        featureMap
      )
    );
    if (this.companyModel) {
      const tracedFeatureId =
        this.companyModel.expertModelTraces[this.featureModel._id]
          .expertFeatureIdMap[this.feature.id];
      if (tracedFeatureId) {
        this.tracedFeature = this.companyModel.getFeature(tracedFeatureId);
      }
    }
  }

  private loadRelationship(
    name: string,
    type: RelationshipType,
    features: string[],
    featureMap: { [p: string]: Feature }
  ): void {
    this.relationships.push({
      name,
      type,
      features: features.map((featureId) => featureMap[featureId]),
    });
  }

  relationshipDoesNotExistInCompanyModel(
    type: RelationshipType,
    toExpertFeatureId: string
  ): boolean {
    if (this.companyModel != null && this.tracedFeature != null) {
      const toCompanyFeatureId =
        this.companyModel.expertModelTraces[this.featureModel._id]
          .expertFeatureIdMap[toExpertFeatureId];
      if (toCompanyFeatureId) {
        return !this.tracedFeature.relationships.hasRelationship(
          type,
          toCompanyFeatureId
        );
      }
    }
    return false;
  }
}
