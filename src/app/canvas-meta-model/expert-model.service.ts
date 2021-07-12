import { Injectable } from '@angular/core';
import { PouchdbService } from '../database/pouchdb.service';
import PouchDB from 'pouchdb-browser';
import { ExpertModel } from './expert-model';
import { CanvasDefinition } from './canvas-definition';

@Injectable({
  providedIn: 'root'
})
export class ExpertModelService {

  constructor(
    private pouchdbService: PouchdbService,
  ) {
  }

  async createExpertModel(model: Partial<ExpertModel>, definition: CanvasDefinition) {
    const {id} = await this.add(model);
    const expertModel = await this.get(id);
    expertModel.definition = definition;
    await this.save(expertModel);
    return this.get(id);
  }

  add(expertModel: Partial<ExpertModel>) {
    return this.pouchdbService.post(new ExpertModel(expertModel));
  }

  async remove(id: string) {
    const result = await this.pouchdbService.get(id);
    return this.pouchdbService.remove(result);
  }

  getList(selector = {}) {
    return this.pouchdbService.find<ExpertModel>(ExpertModel.typeName, {selector});
  }

  get(id: string) {
    return this.pouchdbService.get(id).then((f) => new ExpertModel(f));
  }

  save(expertModel: ExpertModel): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(expertModel);
  }
}
