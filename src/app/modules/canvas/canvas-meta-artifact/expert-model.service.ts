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
    try {
      const expertModel = await this.getWrite(id);
      expertModel.updateDomains(domains);
      await this.save(expertModel);
    } finally {
      this.freeWrite(id);
    }
  }

  async addInstance(
    id: string,
    instance: Omit<InstanceInit, 'id'>
  ): Promise<void> {
    try {
      const expertModel = await this.getWrite(id);
      expertModel.addInstance(instance);
      await this.save(expertModel);
    } finally {
      this.freeWrite(id);
    }
  }

  async removeInstance(id: string, instanceId: number): Promise<void> {
    try {
      const expertModel = await this.getWrite(id);
      expertModel.removeInstance(instanceId);
      await this.save(expertModel);
    } finally {
      this.freeWrite(id);
    }
  }

  async save(expertModel: ExpertModel): Promise<void> {
    await this.pouchdbService.put(expertModel);
  }
}
