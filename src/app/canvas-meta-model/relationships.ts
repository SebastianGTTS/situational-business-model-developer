import { DatabaseModelPart } from '../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../database/database-entry';

export type RelationshipType = string;

export interface RelationshipsInit extends DatabaseInit {
  relationships?: { [type: string]: string[] };
}

export interface RelationshipsEntry extends DatabaseEntry {
  relationships: { [type: string]: string[] };
}

export class Relationships implements RelationshipsInit, DatabaseModelPart {
  // JSON Schema (stored)
  relationships: { [type: string]: string[] } = {};

  constructor(
    entry: RelationshipsEntry | undefined,
    init: RelationshipsInit | undefined
  ) {
    const element = entry ?? init;
    this.relationships = element.relationships ?? this.relationships;
  }

  /**
   * Add a relationship to a feature
   *
   * @param relationshipType the relationship type
   * @param featureId the id of the feature
   */
  addRelationship(relationshipType: RelationshipType, featureId: string): void {
    if (!(relationshipType in this.relationships)) {
      this.relationships[relationshipType] = [];
    }
    const list: string[] = this.relationships[relationshipType];
    if (list.includes(featureId)) {
      return;
    }
    list.push(featureId);
  }

  /**
   * Remove a relationship to a feature
   *
   * @param relationshipType the relationship type
   * @param featureId the id of the feature
   */
  removeRelationship(
    relationshipType: RelationshipType,
    featureId: string
  ): void {
    const list: string[] = this.relationships[relationshipType];
    if (list == null) {
      return;
    }
    this.relationships[relationshipType] = list.filter(
      (id) => id !== featureId
    );
    if (this.relationships[relationshipType].length === 0) {
      delete this.relationships[relationshipType];
    }
  }

  /**
   * Remove relationships to all features in featureIds array
   *
   * @param featureIds the feature ids
   */
  removeRelationships(featureIds: string[]): void {
    const relationshipTypes = Object.keys(this.relationships);
    relationshipTypes.forEach((type) => {
      this.relationships[type] = this.relationships[type].filter(
        (id) => !featureIds.includes(id)
      );
      if (this.relationships[type].length === 0) {
        delete this.relationships[type];
      }
    });
  }

  /**
   * Returns true, if it has no relationships, otherwise false
   *
   * @return true if it has no relationships
   */
  hasNoRelationships(): boolean {
    const relationshipLists = Object.values(this.relationships);
    const relationshipCount = relationshipLists
      .map((list) => list.length)
      .reduce((acc, current) => acc + current, 0);
    return relationshipCount === 0;
  }

  /**
   * Get an array of all referenced feature ids
   *
   * @return the array with all feature ids
   */
  getAllReferencedFeatureIds(): string[] {
    const relationshipLists = Object.values(this.relationships);
    return relationshipLists.reduce((acc, current) => acc.concat(current), []);
  }

  /**
   * Get the relationships of a specific type
   *
   * @param relationshipType the type of the relationship
   * @return the array with all feature ids
   */
  getRelationships(relationshipType: RelationshipType): string[] {
    const list: string[] = this.relationships[relationshipType];
    if (list == null) {
      return [];
    }
    return list;
  }

  /**
   * Checks whether the relationship of a specific type to a specific feature
   * is included
   *
   * @param relationshipType the relationship type
   * @param featureId the id of the feature
   * @return true if the relationship exists
   */
  hasRelationship(
    relationshipType: RelationshipType,
    featureId: string
  ): boolean {
    const relationships = this.getRelationships(relationshipType);
    return relationships.includes(featureId);
  }

  /**
   * Get all used relationship types in this relationship class
   *
   * @return an array of relationship types
   */
  getRelationshipTypes(): RelationshipType[] {
    return Object.keys(this.relationships);
  }

  // Export

  toDb(): RelationshipsEntry {
    return {
      relationships: this.relationships,
    };
  }
}
