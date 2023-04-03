import {
  Relationships,
  RelationshipsEntry,
  RelationshipsInit,
  RelationshipType,
} from './relationships';
import { DatabaseModelPart } from '../../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';

export enum FeatureType {
  OPTIONAL = 'optional',
  MANDATORY = 'mandatory',
}

export enum SubfeatureConnectionsType {
  OR = 'or',
  XOR = 'xor',
}

export interface FeatureInit extends DatabaseInit {
  id?: string;
  name: string;
  description?: string;
  type?: FeatureType;
  subfeatures?: { [id: string]: FeatureInit };
  subfeatureConnections?: SubfeatureConnectionsType;
  relationships?: RelationshipsInit;
  expertModelTrace?: { [expertModel: string]: string };
  guidingQuestions?: string[];
  examples?: string[];
}

export interface FeatureEntry extends DatabaseEntry {
  name: string;
  description: string;
  type: FeatureType;
  subfeatures: { [id: string]: FeatureEntry };
  subfeatureConnections?: SubfeatureConnectionsType;
  relationships: RelationshipsEntry;
  expertModelTrace: { [expertModel: string]: string };
  guidingQuestions: string[];
  examples: string[];
}

interface FeatureJsonSchema {
  name: string;
  description: string;
  type: FeatureType;
  subfeatures: { [id: string]: Feature };
  subfeatureConnections?: SubfeatureConnectionsType;
  relationships: Relationships;
  guidingQuestions: string[];
  examples: string[];
}

export class Feature implements FeatureInit, DatabaseModelPart {
  // JSON Schema (stored)
  name: string;
  description = '';
  type: FeatureType = FeatureType.OPTIONAL;
  subfeatures: { [id: string]: Feature } = {};
  subfeatureConnections?: SubfeatureConnectionsType;
  relationships: Relationships;

  // stored
  expertModelTrace: { [expertModel: string]: string } = {};
  guidingQuestions: string[] = [];
  examples: string[] = [];

  // non stored
  id: string;
  parent?: Feature;
  level: number;

  // Fix the id for ng bootstrap
  _fixId?: string;

  get fixId(): string {
    if (this._fixId == null) {
      this._fixId = this.getFixId();
    }
    return this._fixId;
  }

  private getFixId(): string {
    return '_' + this.id.replace(/[&/]/, '');
  }

  constructor(
    entry: FeatureEntry | undefined,
    init: FeatureInit | undefined,
    id: string,
    parent: Feature | undefined
  ) {
    this.id = id;
    this.parent = parent;
    this.level = this.parent != null ? this.parent.level + 1 : 1;
    let element;
    if (entry != null) {
      element = entry;
      this.relationships = new Relationships(entry.relationships, undefined);
      if (entry.subfeatures != null) {
        Object.entries(entry.subfeatures).forEach(
          ([subId, innerFeature]) =>
            (this.subfeatures[subId] = new Feature(
              innerFeature,
              undefined,
              subId,
              this
            ))
        );
      }
    } else if (init != null) {
      element = init;
      this.relationships = new Relationships(
        undefined,
        init.relationships ?? {}
      );
      if (init.subfeatures != null) {
        Object.entries(init.subfeatures).forEach(
          ([subId, innerFeature]) =>
            (this.subfeatures[subId] = new Feature(
              undefined,
              innerFeature,
              subId,
              this
            ))
        );
      }
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.name = element.name;
    this.description = element.description ?? this.description;
    this.type = element.type ?? this.type;
    this.expertModelTrace = element.expertModelTrace ?? this.expertModelTrace;
    this.subfeatureConnections =
      element.subfeatureConnections ?? this.subfeatureConnections;
    this.guidingQuestions = element.guidingQuestions ?? this.guidingQuestions;
    this.examples = element.examples ?? this.examples;
  }

  /**
   * Update this feature with new values
   *
   * @param feature the new values of this feature (values will be copied to the current object)
   */
  update(feature: Partial<Feature>): void {
    Object.assign(this, feature);
  }

  /**
   * Add a new subfeature to this feature
   *
   * @param feature the feature to add to the feature (values will be copied to a new object)
   * @return the added feature
   */
  addSubfeature(feature: FeatureInit & { id: string }): Feature {
    const id = feature.id;
    this.subfeatures[id] = new Feature(undefined, feature, id, this);
    return this.subfeatures[id];
  }

  /**
   * Remove a subfeature of this feature
   *
   * @param featureId the featureId of the feature to remove
   */
  removeSubfeature(featureId: string): void {
    if (!(featureId in this.subfeatures)) {
      throw new Error(
        'Feature ' + this.name + ' has no subfeature with id ' + featureId
      );
    }
    delete this.subfeatures[featureId];
  }

  /**
   * Get a list of all subfeatures and nested subfeatures
   *
   * @return the list of features
   */
  getAllSubfeatures(): Feature[] {
    const featureList: Feature[] = [];
    const addFeature = (feature: Feature): boolean => {
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

  hasSubfeatures(): boolean {
    return Object.keys(this.subfeatures).length > 0;
  }

  // Relationships

  /**
   * Add a relationship to a another feature
   *
   * @param relationshipType the relationship type
   * @param toFeatureId the id of the other feature
   */
  addRelationship(
    relationshipType: RelationshipType,
    toFeatureId: string
  ): void {
    this.relationships.addRelationship(relationshipType, toFeatureId);
  }

  /**
   * Remove a relationship to a another feature
   *
   * @param relationshipType the relationship type
   * @param toFeatureId the id of the other feature
   */
  removeRelationship(
    relationshipType: RelationshipType,
    toFeatureId: string
  ): void {
    this.relationships.removeRelationship(relationshipType, toFeatureId);
  }

  /**
   * Remove relationships to all features in featureIds array
   *
   * @param featureIds the feature ids
   */
  removeRelationships(featureIds: string[]): void {
    this.relationships.removeRelationships(featureIds);
  }

  // Traces

  /**
   * Add a trace to a feature of an expert model
   *
   * @param expertModelId the expert model id
   * @param expertFeatureId the id of the feature of the expert model
   */
  addTrace(expertModelId: string, expertFeatureId: string): void {
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
  removeTrace(expertModelId: string): void {
    delete this.expertModelTrace[expertModelId];
  }

  // Export

  toDb(): FeatureEntry {
    const subfeatures: { [id: string]: FeatureEntry } = {};
    Object.entries(this.subfeatures).forEach(
      ([id, feature]) => (subfeatures[id] = feature.toDb())
    );
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      subfeatures,
      subfeatureConnections: this.subfeatureConnections,
      relationships: this.relationships.toDb(),
      expertModelTrace: this.expertModelTrace,
      guidingQuestions: this.guidingQuestions,
      examples: this.examples,
    };
  }

  // noinspection JSUnusedGlobalSymbols
  toJSON(): FeatureJsonSchema {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      subfeatures: this.subfeatures,
      subfeatureConnections: this.subfeatureConnections,
      relationships: this.relationships,
      guidingQuestions: this.guidingQuestions,
      examples: this.examples,
    };
  }

  // Helper Functions

  /**
   * Iterates over all features until the function returns true.
   * Iterates from top to bottom with all nested features
   *
   * @param func function to use on the features
   */
  private iterateFeatures(func: (feature: Feature) => boolean): void {
    const featureStack: Feature[] = [];

    featureStack.push(...Object.values(this.subfeatures).reverse());

    while (featureStack.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const current = featureStack.pop()!;

      if (func(current)) {
        return;
      }

      featureStack.push(...Object.values(current.subfeatures).reverse());
    }
  }
}
