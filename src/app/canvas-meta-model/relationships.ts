export enum RelationshipType {
  REQUIRES = 'requires', EXCLUDES = 'excludes', SUPPORTS = 'supports', HURTS = 'hurts'
}

export class Relationships {

  // JSON Schema (stored)
  requires: string[] = [];
  excludes: string[] = [];
  supports: string[] = [];
  hurts: string[] = [];

  constructor(relationships: Partial<Relationships>) {
    Object.assign(this, relationships);
  }

  /**
   * Add a relationship to a feature
   *
   * @param relationshipType the relationship type
   * @param featureId the id of the feature
   */
  addRelationship(relationshipType: RelationshipType, featureId: string) {
    let list: string[];
    switch (relationshipType) {
      case RelationshipType.REQUIRES:
        list = this.requires;
        break;
      case RelationshipType.EXCLUDES:
        list = this.excludes;
        break;
      case RelationshipType.SUPPORTS:
        list = this.supports;
        break;
      case RelationshipType.HURTS:
        list = this.hurts;
        break;
    }
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
  removeRelationship(relationshipType: RelationshipType, featureId: string) {
    switch (relationshipType) {
      case RelationshipType.REQUIRES:
        this.requires = this.requires.filter((id) => id !== featureId);
        break;
      case RelationshipType.EXCLUDES:
        this.excludes = this.excludes.filter((id) => id !== featureId);
        break;
      case RelationshipType.SUPPORTS:
        this.supports = this.supports.filter((id) => id !== featureId);
        break;
      case RelationshipType.HURTS:
        this.hurts = this.hurts.filter((id) => id !== featureId);
        break;
    }
  }

  /**
   * Remove relationships to all features in featureIds array
   *
   * @param featureIds the feature ids
   */
  removeRelationships(featureIds: string[]) {
    this.requires = this.requires.filter((id) => !featureIds.includes(id));
    this.excludes = this.excludes.filter((id) => !featureIds.includes(id));
    this.supports = this.supports.filter((id) => !featureIds.includes(id));
    this.hurts = this.hurts.filter((id) => !featureIds.includes(id));
  }

  /**
   * Returns true, if it has no relationships, otherwise false
   *
   * @return true if it has no relationships
   */
  hasNoRelationships(): boolean {
    return this.requires.length + this.excludes.length + this.supports.length + this.hurts.length === 0;
  }

  /**
   * Get an array of all referenced feature ids
   *
   * @return the array with all feature ids
   */
  getAllReferencedFeatureIds(): string[] {
    return [
      ...this.requires,
      ...this.excludes,
      ...this.supports,
      ...this.hurts
    ];
  }

  // Export

  toPouchDb(): any {
    return {
      requires: this.requires,
      excludes: this.excludes,
      supports: this.supports,
      hurts: this.hurts
    };
  }

}
