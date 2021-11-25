import { Injectable } from '@angular/core';
import { ExpertModel } from './expert-model';
import { Domain } from '../development-process-registry/knowledge/domain';
import { Instance } from './instance';
import { FeatureModelService } from './feature-model.service';

@Injectable({
  providedIn: 'root',
})
export class ExpertModelService extends FeatureModelService<ExpertModel> {
  protected get typeName(): string {
    return ExpertModel.typeName;
  }

  async getList(selector = {}): Promise<ExpertModel[]> {
    return this.pouchdbService.find<ExpertModel>(ExpertModel.typeName, {
      selector,
    });
  }

  async updateDomains(id: string, domains: Partial<Domain>[]): Promise<void> {
    const expertModel = await this.get(id);
    expertModel.updateDomains(domains);
    await this.save(expertModel);
  }

  async addInstance(id: string, instance: Partial<Instance>): Promise<void> {
    const expertModel = await this.get(id);
    expertModel.addInstance(instance);
    await this.save(expertModel);
  }

  async removeInstance(id: string, instanceId: number): Promise<void> {
    const expertModel = await this.get(id);
    expertModel.removeInstance(instanceId);
    await this.save(expertModel);
  }

  async save(expertModel: ExpertModel): Promise<void> {
    await this.pouchdbService.put(expertModel);
  }

  protected createElement(element: Partial<ExpertModel>): ExpertModel {
    return new ExpertModel(element);
  }
}
