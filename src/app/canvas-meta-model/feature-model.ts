import { DatabaseModel } from '../database/database-model';
import { Author, AuthorEntry, AuthorInit } from '../model/author';
import { Feature, FeatureEntry, FeatureInit } from './feature';
import { Instance, InstanceEntry, InstanceInit } from './instance';
import { RelationshipType } from './relationships';
import { getId } from '../model/utils';
import {
  CanvasDefinition,
  CanvasDefinitionEntry,
  CanvasDefinitionInit,
} from './canvas-definition';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../database/database-entry';

export interface FeatureModelInit extends DatabaseRootInit {
  name: string;
  $definition: CanvasDefinitionInit;

  description?: string;
  copyright?: string;
  author?: AuthorInit;
  features?: { [id: string]: FeatureInit };
  instances?: InstanceInit[];
}

export interface FeatureModelEntry extends DatabaseRootEntry {
  name: string;
  description: string;
  copyright: string;
  author: AuthorEntry;
  features: { [id: string]: FeatureEntry };
  instances: InstanceEntry[];

  nextInstanceId: number;

  $definition: CanvasDefinitionEntry;
}

export interface FeatureModelJsonSchema {
  $definition: CanvasDefinition;
  name: string;
  description: string;
  copyright: string;
  author: Author;
  features: { [id: string]: Feature };
  instances: Instance[];
}

export class FeatureModel extends DatabaseModel implements FeatureModelInit {
  // JSON Schema (stored)
  name: string;
  description: string;
  copyright: string;
  author: Author;
  features: { [id: string]: Feature } = {};
  instances: Instance[] = [];

  nextInstanceId: number;

  $definition: CanvasDefinition;

  constructor(
    entry: FeatureModelEntry | undefined,
    init: FeatureModelInit | undefined,
    type: string
  ) {
    super(entry, init, type);
    const element = entry ?? init;
    this.nextInstanceId = element.instances ? element.instances.length : 0;
    this.name = element.name;
    this.description = element.description;
    this.copyright = element.copyright;

    if (entry != null) {
      this.author = new Author(entry.author, undefined);
      if (entry.features != null) {
        Object.entries(entry.features).forEach(
          ([id, feature]) =>
            (this.features[id] = new Feature(feature, undefined, id, null))
        );
      }
      this.instances =
        entry.instances?.map((instance) => new Instance(instance, undefined)) ??
        this.instances;
      this.$definition = new CanvasDefinition(entry.$definition, undefined);
    } else if (init != null) {
      this.author = new Author(undefined, init.author ?? {});
      if (init.features != null) {
        Object.entries(init.features).forEach(
          ([id, feature]) =>
            (this.features[id] = new Feature(undefined, feature, id, null))
        );
      }
      this.instances =
        init.instances?.map((instance) => new Instance(undefined, instance)) ??
        this.instances;
      this.$definition = new CanvasDefinition(undefined, init.$definition);
    }
  }

  set definition(definition: CanvasDefinition) {
    this.$definition = definition;
    this.features = {};
    this.instances = [];
    this.$definition.rootFeatures.forEach(
      (feature) =>
        (this.features[feature.id] = new Feature(
          undefined,
          feature,
          feature.id,
          null
        ))
    );
  }

  get definition(): CanvasDefinition {
    return this.$definition;
  }

  update(featureModel: Partial<FeatureModel>): void {
    if (featureModel.name !== undefined) {
      this.name = featureModel.name;
    }
    if (featureModel.description !== undefined) {
      this.description = featureModel.description;
    }
    if (featureModel.copyright !== undefined) {
      this.copyright = featureModel.copyright;
    }
  }

  /**
   * Update the author of this feature model with new values
   *
   * @param author the new values of the author (values will be copied to the current object)
   */
  updateAuthor(author: Partial<Author>): void {
    this.author.update(author);
  }

  /**
   * Add a feature to the feature model
   *
   * @param feature the feature to add to the feature model (values will be copied to a new object)
   * @param featureId the feature id of the parent model
   * @return the added feature
   */
  addFeature(feature: FeatureInit, featureId: string): Feature {
    const parent = this.getFeature(featureId);
    if (!feature.id) {
      feature.id = this.getFeatureId(feature.name);
    }
    return parent.addSubfeature(feature);
  }

  /**
   * Get the next unique feature id by name
   *
   * @param featureName the name of the feature
   */
  private getFeatureId(featureName: string): string {
    return getId(
      featureName,
      this.getFeatureList().map((f) => f.id)
    );
  }

  /**
   * Remove a feature from the feature model
   *
   * @param featureId the feature of the feature
   */
  removeFeature(featureId: string): void {
    const feature = this.getFeature(featureId);
    const parent = feature.parent;
    if (parent === null) {
      throw new Error('Can not remove root features');
    }
    parent.removeSubfeature(featureId);

    // * Clean up references
    const featureList = feature.getAllSubfeatures();
    featureList.push(feature);
    const featureIdList = featureList.map((f) => f.id);
    this.cleanReferences(featureIdList, featureList);
  }

  protected cleanReferences(
    featureIdList: string[],
    featureList: Feature[]
  ): void {
    // ** Relationships
    const removeRelationships = (f: Feature): boolean => {
      f.removeRelationships(featureIdList);
      return false;
    };
    this.iterateFeatures(removeRelationships);

    // ** Instances
    this.instances.forEach((instance) =>
      instance.removeFeatures(featureIdList)
    );
  }

  /**
   * Update a feature of this feature model
   *
   * @param featureId the feature of the feature
   * @param parentFeatureId the feature id of the parent feature
   * @param feature the new values of the feature (values will be copied to the current object)
   */
  updateFeature(
    featureId: string,
    parentFeatureId: string,
    feature: Partial<Feature>
  ): void {
    const currentFeature = this.getFeature(featureId);
    currentFeature.update(feature);
    const currentParent = currentFeature.parent;
    if (currentParent === null && parentFeatureId !== null) {
      throw new Error('Can not move root features');
    }
    if (currentParent !== null && parentFeatureId === null) {
      throw new Error('Can not move to root features');
    }
    if (currentParent !== null && currentParent.id !== parentFeatureId) {
      const newParent = this.getFeature(parentFeatureId);
      currentParent.removeSubfeature(featureId);
      newParent.addSubfeature(currentFeature);
    }
  }

  /**
   * Get a list of all features with their id and their levelname
   */
  getFeatureList(): { id: string; levelname: string }[] {
    const featureList: { id: string; levelname: string }[] = [];
    const addToFeatureList = (feature: Feature): boolean => {
      featureList.push({ id: feature.id, levelname: feature.getLevelname() });
      return false;
    };
    this.iterateFeatures(addToFeatureList);
    return featureList;
  }

  /**
   * Get feature map that maps id of feature to the feature
   *
   * @return the feature map
   */
  getFeatureMap(): { [id: string]: Feature } {
    const featureMap: { [id: string]: Feature } = {};
    const addToFeatureMap = (feature: Feature): boolean => {
      featureMap[feature.id] = feature;
      return false;
    };
    this.iterateFeatures(addToFeatureMap);
    return featureMap;
  }

  /**
   * Get a feature of this feature model by its id
   *
   * @param featureId the feature id of the feature to get
   */
  getFeature(featureId: string): Feature {
    let feature: Feature = null;
    const isFeature = (f: Feature): boolean => {
      if (f.id === featureId) {
        feature = f;
        return true;
      }
      return false;
    };
    this.iterateFeatures(isFeature);
    if (feature === null) {
      throw new Error(
        'Feature with id ' +
          featureId +
          ' does not exist on feature model ' +
          this.name
      );
    }
    return feature;
  }

  // Relationships between features

  addRelationship(
    relationshipType: RelationshipType,
    fromFeatureId: string,
    toFeatureId: string
  ): void {
    if (!this.definition.relationshipTypes.includes(relationshipType)) {
      throw new Error(
        'Relationship type ' +
          relationshipType +
          ' is not defined for this feature model.'
      );
    }
    const fromFeature = this.getFeature(fromFeatureId);
    this.getFeature(toFeatureId); // to check whether the feature really exists
    fromFeature.addRelationship(relationshipType, toFeatureId);
  }

  removeRelationship(
    relationshipType: RelationshipType,
    fromFeatureId: string,
    toFeatureId: string
  ): void {
    if (!this.definition.relationshipTypes.includes(relationshipType)) {
      throw new Error(
        'Relationship type ' +
          relationshipType +
          ' is not defined for this feature model.'
      );
    }
    const fromFeature = this.getFeature(fromFeatureId);
    fromFeature.removeRelationship(relationshipType, toFeatureId);
  }

  // Instances

  /**
   * Add an instance to this feature model
   *
   * @param instance the instance to add to this feature model (values will be copied to a new object)
   * @return the new instance
   */
  addInstance(instance: InstanceInit): Instance {
    const addedInstance = new Instance(undefined, {
      ...instance,
      id: this.nextInstanceId++,
    });
    if (
      !this.definition.rootFeatures.every((rootFeature) =>
        addedInstance.usedFeatures.includes(rootFeature.id)
      )
    ) {
      this.definition.rootFeatures.forEach((feature) =>
        addedInstance.addFeature(feature.id)
      );
    }
    this.instances.push(addedInstance);
    return addedInstance;
  }

  /**
   * Get an instance of this feature model
   *
   * @param instanceId the id of the instance
   */
  getInstance(instanceId: number): Instance {
    return this.instances.find((instance) => instance.id === instanceId);
  }

  /**
   * Remove an instance from this feature model
   *
   * @param instanceId the id of the instance
   */
  removeInstance(instanceId: number): void {
    this.instances = this.instances.filter(
      (instance) => instance.id !== instanceId
    );
  }

  /**
   * Update an instance of this feature model
   *
   * @param instanceId the id of the instance
   * @param instance the new values of the instance (values will be copied to the current object)
   */
  updateInstance(instanceId: number, instance: Partial<Instance>): void {
    const currentInstance = this.instances.find((i) => i.id === instanceId);
    currentInstance.update(instance);
  }

  /**
   * Adapts an instance by copy it and add it as a new instance with a new name
   *
   * @param instanceId the id of the instance
   * @param adaptationName the new name of the instance
   */
  adaptInstance(instanceId: number, adaptationName: string): void {
    const instance = this.instances.find((i) => i.id === instanceId);
    const addedInstance = this.addInstance(instance);
    addedInstance.update({ id: this.nextInstanceId - 1, name: adaptationName });
  }

  /**
   * Add a feature to an instance
   *
   * @param instanceId the id of the instance
   * @param featureId the feature id of the feature to add to the instance
   */
  addFeatureToInstance(instanceId: number, featureId: string): void {
    this.getFeature(featureId); // to check whether the feature really exists
    const instance = this.instances.find((i) => i.id === instanceId);
    instance.addFeature(featureId);
  }

  /**
   * Remove a feature and its subfeatures from an instance
   *
   * @param instanceId the id of the instance
   * @param featureId the feature id of the feature to remove from the instance
   */
  removeFeatureFromInstance(instanceId: number, featureId: string): void {
    const instance = this.getInstance(instanceId);
    const feature = this.getFeature(featureId);
    const featureIds = feature.getAllSubfeatures().map((f) => f.id);
    instance.removeFeature(feature.id);
    instance.removeFeatures(featureIds);
  }

  // Export

  toDb(): FeatureModelEntry {
    const features = {};
    Object.entries(this.features).forEach(
      ([id, feature]) => (features[id] = feature.toDb())
    );
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
      copyright: this.copyright,
      author: this.author.toDb(),
      features,
      instances: this.instances.map((instance) => instance.toDb()),
      nextInstanceId: this.nextInstanceId,
      $definition: this.$definition ? this.$definition.toDb() : null,
    };
  }

  toJSON(): FeatureModelJsonSchema {
    return {
      $definition: this.$definition,
      name: this.name,
      description: this.description ? this.description : undefined,
      copyright: this.copyright,
      author: this.author,
      features: this.features,
      instances: this.instances,
    };
  }

  // Helper Functions

  /**
   * Iterates over all features until the function returns true.
   * Iterates from top to bottom with all nested features
   *
   * @param func function to use on the features
   * @param filter function to decide whether to walk through this part of the tree
   */
  iterateFeatures(
    func: (feature: Feature) => boolean,
    filter: (feature: Feature) => boolean = (): boolean => true
  ): void {
    const featureStack: Feature[] = [];

    featureStack.push(...Object.values(this.features).reverse().filter(filter));

    while (featureStack.length > 0) {
      const current = featureStack.pop();

      if (func(current)) {
        return;
      }

      featureStack.push(
        ...Object.values(current.subfeatures).reverse().filter(filter)
      );
    }
  }
}
