import { Injectable } from '@angular/core';
import { ExpertModel, ExpertModelEntry, ExpertModelInit } from './expert-model';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { InstanceInit } from './instance';
import { FeatureModelService } from './feature-model.service';

@Injectable({
  providedIn: 'root',
})
export class ExpertModelService extends FeatureModelService<
  ExpertModel,
  ExpertModelInit
> {
  protected readonly typeName = ExpertModel.typeName;

  protected readonly elementConstructor = ExpertModel;

  async getList(selector = {}): Promise<ExpertModelEntry[]> {
    return this.pouchdbService.find<ExpertModelEntry>(ExpertModel.typeName, {
      selector,
    });
  }

  async updateDomains(id: string, domains: Domain[]): Promise<void> {
    const expertModel = await this.get(id);
    expertModel.updateDomains(domains);
    await this.save(expertModel);
  }

  async addInstance(
    id: string,
    instance: Omit<InstanceInit, 'id'>
  ): Promise<void> {
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
}
