export enum InstanceType {
  PATTERN = 'pattern', EXAMPLE = 'example'
}

export class Instance {

  // JSON Schema (stored)
  name: string;
  type: InstanceType;
  description: string;
  usedFeatures: string[] = [];

  // stored
  id: number;

  constructor(id: number, instance: Partial<Instance>) {
    this.id = id;
    Object.assign(this, instance);
  }

  /**
   * Update this instance with new values
   *
   * @param instance the new values of this instance (values will be copied to the current object)
   */
  update(instance: Partial<Instance>) {
    Object.assign(this, instance);
  }

  /**
   * Add a feature to this instance
   *
   * @param featureId the feature id of the feature to add
   */
  addFeature(featureId: string) {
    if (this.usedFeatures.includes(featureId)) {
      throw new Error('Feature with id ' + featureId + ' is already used in instance ' + this.name);
    }
    this.usedFeatures.push(featureId);
  }

  /**
   * Remove a feature from this instance
   *
   * @param featureId the feature id of the feature to remove
   */
  removeFeature(featureId: string) {
    if (!this.usedFeatures.includes(featureId)) {
      throw new Error('Feature with id ' + featureId + ' is not used in instance ' + this.name);
    }
    this.usedFeatures = this.usedFeatures.filter((id) => id !== featureId);
  }

  /**
   * Remove features from this instance
   *
   * @param featureIds the feature ids of the features to remove
   */
  removeFeatures(featureIds: string[]) {
    this.usedFeatures = this.usedFeatures.filter((id) => !featureIds.includes(id));
  }

  // Export

  toPouchDb(): any {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      description: this.description,
      usedFeatures: this.usedFeatures
    };
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      usedFeatures: this.usedFeatures
    };
  }

}
