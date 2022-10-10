import { DatabaseModelPart } from '../../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';

export enum InstanceType {
  PATTERN = 'pattern',
  EXAMPLE = 'example',
}

export interface InstanceInit extends DatabaseInit {
  name: string;
  type: InstanceType;
  description?: string;
  usedFeatures?: string[];
  id: number;
}

export interface InstanceEntry extends DatabaseEntry {
  name: string;
  type: InstanceType;
  description: string;
  usedFeatures: string[];
  id: number;
}

interface InstanceJsonSchema {
  name: string;
  type: InstanceType;
  description: string;
  usedFeatures: string[];
}

export class Instance implements InstanceInit, DatabaseModelPart {
  // JSON Schema (stored)
  name: string;
  type: InstanceType;
  description = '';
  usedFeatures: string[] = [];

  // stored
  id: number;

  constructor(
    entry: InstanceEntry | undefined,
    init: InstanceInit | undefined
  ) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.id = element.id;
    this.name = element.name;
    this.type = element.type;
    this.description = element.description ?? this.description;
    this.usedFeatures = element.usedFeatures ?? this.usedFeatures;
  }

  /**
   * Update this instance with new values
   *
   * @param instance the new values of this instance (values will be copied to the current object)
   */
  update(instance: Partial<Instance>): void {
    Object.assign(this, instance);
  }

  /**
   * Add a feature to this instance
   *
   * @param featureId the feature id of the feature to add
   */
  addFeature(featureId: string): void {
    if (this.usedFeatures.includes(featureId)) {
      throw new Error(
        'Feature with id ' +
          featureId +
          ' is already used in instance ' +
          this.name
      );
    }
    this.usedFeatures.push(featureId);
  }

  /**
   * Remove a feature from this instance
   *
   * @param featureId the feature id of the feature to remove
   */
  removeFeature(featureId: string): void {
    if (!this.usedFeatures.includes(featureId)) {
      throw new Error(
        'Feature with id ' + featureId + ' is not used in instance ' + this.name
      );
    }
    this.usedFeatures = this.usedFeatures.filter((id) => id !== featureId);
  }

  /**
   * Remove features from this instance
   *
   * @param featureIds the feature ids of the features to remove
   */
  removeFeatures(featureIds: string[]): void {
    this.usedFeatures = this.usedFeatures.filter(
      (id) => !featureIds.includes(id)
    );
  }

  // Export

  toDb(): InstanceEntry {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      description: this.description,
      usedFeatures: this.usedFeatures,
    };
  }

  toJSON(): InstanceJsonSchema {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      usedFeatures: this.usedFeatures,
    };
  }
}
