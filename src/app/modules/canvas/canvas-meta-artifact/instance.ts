import { DatabaseModelPart } from '../../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';
import { Icon, IconEntry, IconInit } from '../../../model/icon';

export enum InstanceType {
  PATTERN = 'pattern',
  EXAMPLE = 'example',
}

export interface InstanceInit extends DatabaseInit {
  name: string;
  type: InstanceType;
  description?: string;
  icon?: IconInit;
  usedFeatures?: string[];
  id: number;
}

export interface InstanceEntry extends DatabaseEntry {
  name: string;
  type: InstanceType;
  description: string;
  icon: IconEntry;
  usedFeatures: string[];
  id: number;
}

interface InstanceJsonSchema {
  name: string;
  type: InstanceType;
  description: string;
  icon: IconEntry;
  usedFeatures: string[];
}

export class Instance implements InstanceInit, DatabaseModelPart {
  // JSON Schema (stored)
  name: string;
  type: InstanceType;
  description = '';
  icon: Icon;
  usedFeatures: string[] = [];

  // stored
  id: number;

  constructor(
    entry: InstanceEntry | undefined,
    init: InstanceInit | undefined
  ) {
    let element;
    if (entry != null) {
      element = entry;
      this.icon = new Icon(entry.icon ?? {}, undefined);
    } else if (init != null) {
      element = init;
      this.icon = new Icon(undefined, init.icon ?? {});
    } else {
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
   * Update the icon of this instance
   *
   * @param icon
   */
  updateIcon(icon: IconInit): void {
    this.icon.update(icon);
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
      icon: this.icon.toDb(),
      usedFeatures: this.usedFeatures,
    };
  }

  toJSON(): InstanceJsonSchema {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      icon: this.icon.toDb(),
      usedFeatures: this.usedFeatures,
    };
  }
}
