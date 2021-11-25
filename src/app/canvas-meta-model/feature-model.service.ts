import { Injectable } from '@angular/core';
import { DefaultElementService } from '../database/default-element.service';
import { FeatureModel } from './feature-model';
import { Author } from '../model/author';
import { CanvasDefinition } from './canvas-definition';

@Injectable()
export abstract class FeatureModelService<
  T extends FeatureModel
> extends DefaultElementService<T> {
  createFeatureModel(model: Partial<T>, definition: CanvasDefinition): T {
    const expertModel = this.createElement(model);
    expertModel.definition = definition;
    return expertModel;
  }

  /**
   * Update an feature model
   *
   * @param id the id of the feature model to update
   * @param element the new data of the feature model
   */
  async update(id: string, element: Partial<T>) {
    const featureModel = await this.get(id);
    featureModel.update(element);
    return this.save(featureModel);
  }

  async updateAuthor(id: string, author: Partial<Author>) {
    const featureModel = await this.get(id);
    featureModel.updateAuthor(author);
    return this.save(featureModel);
  }
}
