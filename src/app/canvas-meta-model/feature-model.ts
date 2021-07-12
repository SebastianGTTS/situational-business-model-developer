import { PouchdbModel } from '../database/pouchdb-model';
import { Author } from '../model/author';
import { Feature } from './feature';
import { Instance } from './instance';
import { RelationshipType } from './relationships';
import { getId } from '../model/utils';
import { CanvasDefinition } from './canvas-definition';

export class FeatureModel extends PouchdbModel {

  // JSON Schema (stored)
  name: string;
  description: string;
  copyright: string;
  author: Author;
  features: { [id: string]: Feature };
  instances: Instance[];

  nextInstanceId: number;

  $definition: CanvasDefinition;

  constructor(featureModel: Partial<FeatureModel>, type: string) {
    super(type);
    this.init();
    this.nextInstanceId = featureModel.instances ? featureModel.instances.length : 0;
    Object.assign(this, featureModel);
    this.author = new Author(this.author);
    Object.entries(this.features).forEach(([id, feature]) => this.features[id] = new Feature(id, null, feature));
    this.instances = this.instances.map((instance, index) => new Instance(index, instance));
    this.$definition = this.$definition ? new CanvasDefinition(this.$definition) : null;
  }

  protected init() {
    this.features = {};
    this.instances = [];
  }

  set definition(definition: CanvasDefinition) {
    this.$definition = definition;
    this.features = {};
    this.instances = [];
    this.$definition.rootFeatures.forEach((feature) => this.features[feature.id] = new Feature(feature.id, null, feature));
  }

  get definition() {
    return this.$definition;
  }

  update(featureModel: Partial<FeatureModel>) {
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
  updateAuthor(author: Partial<Author>) {
    this.author.update(author);
  }

  /**
   * Add a feature to the feature model
   *
   * @param feature the feature to add to the feature model (values will be copied to a new object)
   * @param featureId the feature id of the parent model
   * @return the added feature
   */
  addFeature(feature: Partial<Feature>, featureId: string): Feature {
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
  private getFeatureId(featureName: string) {
    return getId(featureName, this.getFeatureList().map((f) => f.id));
  }

  /**
   * Remove a feature from the feature model
   *
   * @param featureId the feature of the feature
   */
  removeFeature(featureId: string) {
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

  protected cleanReferences(featureIdList: string[], featureList: Feature[]) {
    // ** Relationships
    const removeRelationships = (f: Feature) => {
      f.removeRelationships(featureIdList);
      return false;
    };
    this.iterateFeatures(removeRelationships);

    // ** Instances
    this.instances.forEach((instance) => instance.removeFeatures(featureIdList));
  }

  /**
   * Update a feature of this feature model
   *
   * @param featureId the feature of the feature
   * @param parentFeatureId the feature id of the parent feature
   * @param feature the new values of the feature (values will be copied to the current object)
   */
  updateFeature(featureId: string, parentFeatureId: string, feature: Partial<Feature>) {
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
  getFeatureList(): { id: string, levelname: string }[] {
    const featureList: { id: string, levelname: string }[] = [];
    const addToFeatureList = (feature: Feature) => {
      featureList.push({id: feature.id, levelname: feature.getLevelname()});
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
    const addToFeatureMap = (feature: Feature) => {
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
  getFeature(featureId: string) {
    let feature: Feature = null;
    const isFeature = (f: Feature) => {
      if (f.id === featureId) {
        feature = f;
        return true;
      }
      return false;
    };
    this.iterateFeatures(isFeature);
    if (feature === null) {
      throw new Error('Feature with id ' + featureId + ' does not exist on feature model ' + this.name);
    }
    return feature;
  }

  // Relationships between features

  addRelationship(relationshipType: RelationshipType, fromFeatureId: string, toFeatureId: string) {
    const fromFeature = this.getFeature(fromFeatureId);
    this.getFeature(toFeatureId); // to check whether the feature really exists
    fromFeature.addRelationship(relationshipType, toFeatureId);
  }

  removeRelationship(relationshipType: RelationshipType, fromFeatureId: string, toFeatureId: string) {
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
  addInstance(instance: Partial<Instance>): Instance {
    const addedInstance = new Instance(this.nextInstanceId++, instance);
    if (!this.definition.rootFeatures.every((rootFeature) => addedInstance.usedFeatures.includes(rootFeature.id))) {
      this.definition.rootFeatures.forEach((feature) => addedInstance.addFeature(feature.id));
    }
    this.instances.push(addedInstance);
    return addedInstance;
  }

  /**
   * Get an instance of this feature model
   *
   * @param instanceId the id of the instance
   */
  getInstance(instanceId: number) {
    return this.instances.find((instance) => instance.id === instanceId);
  }

  /**
   * Remove an instance from this feature model
   *
   * @param instanceId the id of the instance
   */
  removeInstance(instanceId: number) {
    this.instances = this.instances.filter((instance) => instance.id !== instanceId);
  }

  /**
   * Update an instance of this feature model
   *
   * @param instanceId the id of the instance
   * @param instance the new values of the instance (values will be copied to the current object)
   */
  updateInstance(instanceId: number, instance: Partial<Instance>) {
    const currentInstance = this.instances.find((i) => i.id === instanceId);
    currentInstance.update(instance);
  }

  /**
   * Adapts an instance by copy it and add it as a new instance with a new name
   *
   * @param instanceId the id of the instance
   * @param adaptationName the new name of the instance
   */
  adaptInstance(instanceId: number, adaptationName: string) {
    const instance = this.instances.find((i) => i.id === instanceId);
    const addedInstance = this.addInstance(instance);
    addedInstance.update({id: this.nextInstanceId - 1, name: adaptationName});
  }

  /**
   * Add a feature to an instance
   *
   * @param instanceId the id of the instance
   * @param featureId the feature id of the feature to add to the instance
   */
  addFeatureToInstance(instanceId: number, featureId: string) {
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
  removeFeatureFromInstance(instanceId: number, featureId: string) {
    const instance = this.getInstance(instanceId);
    const feature = this.getFeature(featureId);
    const featureIds = feature.getAllSubfeatures().map((f) => f.id);
    instance.removeFeature(feature.id);
    instance.removeFeatures(featureIds);
  }

  // Export

  toPouchDb(): any {
    const features = {};
    Object.entries(this.features).forEach(([id, feature]) => features[id] = feature.toPouchDb());
    return {
      ...super.toPouchDb(),
      name: this.name,
      description: this.description,
      copyright: this.copyright,
      author: this.author.toPouchDb(),
      features,
      instances: this.instances.map((instance) => instance.toPouchDb()),
      nextInstanceId: this.nextInstanceId,
      $definition: this.$definition ? this.$definition.toPouchDb() : null,
    };
  }

  toJSON() {
    return {
      $definition: this.$definition,
      name: this.name,
      description: this.description ? this.description : undefined,
      copyright: this.copyright,
      author: this.author,
      features: this.features,
      instances: this.instances
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
  iterateFeatures(func: (feature: Feature) => boolean, filter: (feature: Feature) => boolean = () => true) {
    const featureStack: Feature[] = [];

    featureStack.push(...Object.values(this.features).reverse().filter(filter));

    while (featureStack.length > 0) {
      const current = featureStack.pop();

      if (func(current)) {
        return;
      }

      featureStack.push(...Object.values(current.subfeatures).reverse().filter(filter));
    }
  }

}
