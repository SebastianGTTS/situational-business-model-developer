import { Injectable } from '@angular/core';
import { DefaultElementService } from '../../../database/default-element.service';
import { FeatureModel, FeatureModelInit } from './feature-model';
import { Author } from '../../../model/author';
import { CanvasDefinition } from './canvas-definition';
import { IconInit } from '../../../model/icon';
import { DbId } from '../../../database/database-entry';
import { PouchdbService } from '../../../database/pouchdb.service';
import { InstanceService } from '../canvas-tool/instances/instance.service';
import { Instance } from './instance';
import { FeatureInit } from './feature';

@Injectable()
export abstract class FeatureModelService<
  T extends FeatureModel,
  S extends FeatureModelInit
> extends DefaultElementService<T, S> {
  constructor(
    private instanceService: InstanceService,
    pouchdbService: PouchdbService
  ) {
    super(pouchdbService);
  }

  createFeatureModel(model: S, definition: CanvasDefinition): T {
    const expertModel = new this.elementConstructor(undefined, model);
    expertModel.definition = definition;
    return expertModel;
  }

  /**
   * Update a feature model
   *
   * @param id the id of the feature model to update
   * @param element the new data of the feature model
   */
  async update(id: string, element: Partial<T>): Promise<void> {
    try {
      const featureModel = await this.getWrite(id);
      featureModel.update(element);
      await this.save(featureModel);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the icon of a feature model
   *
   * @param id
   * @param icon
   */
  async updateIcon(id: string, icon: IconInit): Promise<void> {
    try {
      const featureModel = await this.getWrite(id);
      featureModel.updateIcon(icon);
      await this.save(featureModel);
    } finally {
      this.freeWrite(id);
    }
  }

  async updateAuthor(id: string, author: Partial<Author>): Promise<void> {
    try {
      const featureModel = await this.getWrite(id);
      featureModel.updateAuthor(author);
      await this.save(featureModel);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the info of an instance
   *
   * @param id FeatureModel's id
   * @param instanceId
   * @param name
   * @param description
   */
  async updateInstanceInfo(
    id: DbId,
    instanceId: number,
    name: string,
    description: string
  ): Promise<void> {
    try {
      const featureModel = await this.getWrite(id);
      featureModel.updateInstance(instanceId, {
        name: name,
        description: description,
      });
      await this.save(featureModel);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the icon of an instance
   *
   * @param id FeatureModel's id
   * @param instanceId
   * @param icon
   */
  async updateInstanceIcon(
    id: DbId,
    instanceId: number,
    icon: IconInit
  ): Promise<void> {
    try {
      const featureModel = await this.getWrite(id);
      const instance = featureModel.getInstance(instanceId);
      if (instance == null) {
        throw new Error('Instance does not exist');
      }
      instance.updateIcon(icon);
      await this.save(featureModel);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Create an instance adaptation
   *
   * @param id
   * @param instanceId
   * @return the adapted instance
   */
  async createAdaptation(id: DbId, instanceId: number): Promise<Instance> {
    try {
      const featureModel = await this.getWrite(id);
      const instance = featureModel.getInstance(instanceId);
      if (instance == null) {
        throw new Error('Instance does not exist');
      }
      const adaptationName = this.instanceService.getAdaptionName(
        instance.name
      );
      featureModel.adaptInstance(instanceId, adaptationName);
      const adaptedInstance =
        featureModel.instances[featureModel.instances.length - 1];
      await this.save(featureModel);
      return adaptedInstance;
    } finally {
      this.freeWrite(id);
    }
  }

  async addFeatureToInstance(
    id: DbId,
    instanceId: number,
    parentFeatureId: string,
    feature: FeatureInit
  ): Promise<void> {
    try {
      const featureModel = await this.getWrite(id);
      const addedFeature = featureModel.addFeature(feature, parentFeatureId);
      featureModel.addFeatureToInstance(instanceId, addedFeature.id);
      await this.save(featureModel);
    } finally {
      this.freeWrite(id);
    }
  }

  async addDecisionToInstance(
    id: DbId,
    instanceId: number,
    featureId: string
  ): Promise<void> {
    try {
      const featureModel = await this.getWrite(id);
      featureModel.addFeatureToInstance(instanceId, featureId);
      await this.save(featureModel);
    } finally {
      this.freeWrite(id);
    }
  }

  async removeDecisionFromInstance(
    id: DbId,
    instanceId: number,
    featureId: string
  ): Promise<void> {
    try {
      const featureModel = await this.getWrite(id);
      featureModel.removeFeatureFromInstance(instanceId, featureId);
      await this.save(featureModel);
    } finally {
      this.freeWrite(id);
    }
  }
}
