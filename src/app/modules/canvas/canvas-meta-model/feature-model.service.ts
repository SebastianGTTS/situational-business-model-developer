import { Injectable } from '@angular/core';
import { DefaultElementService } from '../../../database/default-element.service';
import { FeatureModel, FeatureModelInit } from './feature-model';
import { Author } from '../../../model/author';
import { CanvasDefinition } from './canvas-definition';

@Injectable()
export abstract class FeatureModelService<
  T extends FeatureModel,
  S extends FeatureModelInit
> extends DefaultElementService<T, S> {
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
    const featureModel = await this.get(id);
    featureModel.update(element);
    await this.save(featureModel);
  }

  async updateAuthor(id: string, author: Partial<Author>): Promise<void> {
    const featureModel = await this.get(id);
    featureModel.updateAuthor(author);
    await this.save(featureModel);
  }
}
