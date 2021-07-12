import { Relationships, RelationshipType } from './relationships';

export enum FeatureType {
  OPTIONAL = 'optional', MANDATORY = 'mandatory'
}

export enum SubfeatureConnectionsType {
  OR = 'or', XOR = 'xor'
}

export class Feature {

  // JSON Schema (stored)
  name: string;
  description: string;
  type: FeatureType = FeatureType.OPTIONAL;
  subfeatures: { [id: string]: Feature } = {};
  subfeatureConnections: SubfeatureConnectionsType = null;
  relationships: Relationships;

  // stored
  expertModelTrace: { [expertModel: string]: string } = {};

  // non stored
  id: string;
  parent: Feature = null;
  level: number;

  constructor(id: string, parent: Feature, feature: Partial<Feature>) {
    Object.assign(this, feature);
    this.id = id;
    this.parent = parent;
    this.level = this.parent ? this.parent.level + 1 : 1;
    Object.entries(this.subfeatures).forEach(
      ([subId, innerFeature]) => this.subfeatures[subId] = new Feature(subId, this, innerFeature)
    );
    this.relationships = new Relationships(this.relationships);
  }

  /**
   * Update this feature with new values
   *
   * @param feature the new values of this feature (values will be copied to the current object)
   */
  update(feature: Partial<Feature>) {
    Object.assign(this, feature);
  }

  /**
   * Add a new subfeature to this feature
   *
   * @param feature the feature to add to the feature (values will be copied to a new object)
   * @return the added feature
   */
  addSubfeature(feature: Partial<Feature>): Feature {
    const id = feature.id;
    this.subfeatures[id] = new Feature(id, this, feature);
    return this.subfeatures[id];
  }

  /**
   * Remove a subfeature of this feature
   *
   * @param featureId the featureId of the feature to remove
   */
  removeSubfeature(featureId: string) {
    if (!(featureId in this.subfeatures)) {
      throw new Error('Feature ' + this.name + ' has no subfeature with id ' + featureId);
    }
    delete this.subfeatures[featureId];
  }

  /**
   * Get a list of all subfeatures and nested subfeatures
   *
   * @return the list of features
   */
  getAllSubfeatures(): Feature[] {
    const featureList = [];
    const addFeature = (feature: Feature) => {
      featureList.push(feature);
      return false;
    };
    this.iterateFeatures(addFeature);
    return featureList;
  }

  /**
   * Get the levelname of this feature for level level
   */
  getLevelname(): string {
    return '-'.repeat(this.level) + ' ' + this.name;
  }

  // Relationships

  /**
   * Add a relationship to a another feature
   *
   * @param relationshipType the relationship type
   * @param toFeatureId the id of the other feature
   */
  addRelationship(relationshipType: RelationshipType, toFeatureId: string) {
    this.relationships.addRelationship(relationshipType, toFeatureId);
  }

  /**
   * Remove a relationship to a another feature
   *
   * @param relationshipType the relationship type
   * @param toFeatureId the id of the other feature
   */
  removeRelationship(relationshipType: RelationshipType, toFeatureId: string) {
    this.relationships.removeRelationship(relationshipType, toFeatureId);
  }

  /**
   * Remove relationships to all features in featureIds array
   *
   * @param featureIds the feature ids
   */
  removeRelationships(featureIds: string[]) {
    this.relationships.removeRelationships(featureIds);
  }

  // Traces

  /**
   * Add a trace to a feature of an expert model
   *
   * @param expertModelId the expert model id
   * @param expertFeatureId the id of the feature of the expert model
   */
  addTrace(expertModelId: string, expertFeatureId: string) {
    if (this.expertModelTrace[expertModelId]) {
      throw new Error('Trace for this feature is already defined');
    }
    this.expertModelTrace[expertModelId] = expertFeatureId;
  }

  /**
   * Remove a trace to a feature of an expert model
   *
   * @param expertModelId the expert model id
   */
  removeTrace(expertModelId: string) {
    delete this.expertModelTrace[expertModelId];
  }

  // Export

  toPouchDb(): any {
    const subfeatures = {};
    Object.entries(this.subfeatures).forEach(([id, feature]) => subfeatures[id] = feature.toPouchDb());
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      subfeatures,
      subfeatureConnections: this.subfeatureConnections,
      relationships: this.relationships.toPouchDb(),
      expertModelTrace: this.expertModelTrace
    };
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description ? this.description : undefined,
      type: this.type,
      subfeatures: this.subfeatures,
      subfeatureConnections: this.subfeatureConnections,
      relationships: this.relationships
    };
  }

  // Helper Functions

  /**
   * Iterates over all features until the function returns true.
   * Iterates from top to bottom with all nested features
   *
   * @param func function to use on the features
   */
  private iterateFeatures(func: (feature: Feature) => boolean) {
    const featureStack: Feature[] = [];

    featureStack.push(...Object.values(this.subfeatures).reverse());

    while (featureStack.length > 0) {
      const current = featureStack.pop();

      if (func(current)) {
        return;
      }

      featureStack.push(...Object.values(current.subfeatures).reverse());
    }
  }

}
