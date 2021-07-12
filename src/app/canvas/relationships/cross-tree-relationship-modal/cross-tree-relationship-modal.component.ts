import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Feature } from '../../../canvas-meta-model/feature';
import { RelationshipType } from '../../../canvas-meta-model/relationships';
import { CompanyModel } from '../../../canvas-meta-model/company-model';
import { FeatureModel } from '../../../canvas-meta-model/feature-model';

@Component({
  selector: 'app-cross-tree-relationship-modal',
  templateUrl: './cross-tree-relationship-modal.component.html',
  styleUrls: ['./cross-tree-relationship-modal.component.css']
})
export class CrossTreeRelationshipModalComponent implements OnChanges {

  @Input() featureModel: FeatureModel;
  @Input() feature: Feature;
  @Input() companyModel: CompanyModel = null;

  @Output() closeModal = new EventEmitter<null>();
  @Output() addRelationshipOnCompanyModel = new EventEmitter<{ type: RelationshipType, fromFeatureId: string, toFeatureId: string }>();
  @Output() removeRelationship = new EventEmitter<{ type: RelationshipType, fromFeatureId: string, toFeatureId: string }>();

  relationships: { name: string, type: RelationshipType, features: Feature[] }[];
  tracedFeature: Feature;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.feature) {
      this.load(changes.feature.currentValue);
    }
  }

  add(type: RelationshipType, toExpertFeatureId: string) {
    const toCompanyFeatureId = this.companyModel.expertModelTraces[this.featureModel._id].expertFeatureIdMap[toExpertFeatureId];
    this.addRelationshipOnCompanyModel.emit({type, fromFeatureId: this.feature.id, toFeatureId: toCompanyFeatureId});
  }

  remove(type: RelationshipType, toFeatureId: string) {
    this.removeRelationship.emit({type, fromFeatureId: this.feature.id, toFeatureId});
  }

  private load(feature: Feature) {
    this.relationships = [];
    this.tracedFeature = null;
    const featureMap = this.featureModel.getFeatureMap();
    this.loadRelationship('Requires', RelationshipType.REQUIRES, feature.relationships.requires, featureMap);
    this.loadRelationship('Excludes', RelationshipType.EXCLUDES, feature.relationships.excludes, featureMap);
    this.loadRelationship('Supports', RelationshipType.SUPPORTS, feature.relationships.supports, featureMap);
    this.loadRelationship('Hurts', RelationshipType.HURTS, feature.relationships.hurts, featureMap);
    if (this.companyModel) {
      const tracedFeatureId = this.companyModel.expertModelTraces[this.featureModel._id].expertFeatureIdMap[this.feature.id];
      if (tracedFeatureId) {
        this.tracedFeature = this.companyModel.getFeature(tracedFeatureId);
      }
    }
  }

  private loadRelationship(name: string, type: RelationshipType, features: string[], featureMap: { [p: string]: Feature }) {
    this.relationships.push({
      name,
      type,
      features: features.map((featureId) => featureMap[featureId]),
    });
  }

  relationshipDoesNotExistInCompanyModel(type: RelationshipType, toExpertFeatureId: string): boolean {
    const toCompanyFeatureId = this.companyModel.expertModelTraces[this.featureModel._id].expertFeatureIdMap[toExpertFeatureId];
    if (toCompanyFeatureId) {
      switch (type) {
        case RelationshipType.REQUIRES:
          return !this.tracedFeature.relationships.requires.includes(toCompanyFeatureId);
        case RelationshipType.EXCLUDES:
          return !this.tracedFeature.relationships.excludes.includes(toCompanyFeatureId);
        case RelationshipType.SUPPORTS:
          return !this.tracedFeature.relationships.supports.includes(toCompanyFeatureId);
        case RelationshipType.HURTS:
          return !this.tracedFeature.relationships.hurts.includes(toCompanyFeatureId);
      }
    }
  }

}
