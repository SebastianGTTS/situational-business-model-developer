import { Injectable } from '@angular/core';
import { PouchdbService } from '../database/pouchdb.service';
import { CompanyModel } from './company-model';
import PouchDB from 'pouchdb-browser';
import { CanvasDefinition } from './canvas-definition';

@Injectable({
  providedIn: 'root'
})
export class CompanyModelService {

  constructor(
    private pouchdbService: PouchdbService,
  ) {
  }

  async createCompanyModel(model: Partial<CompanyModel>, definition: CanvasDefinition) {
    const {id} = await this.add(model);
    const companyModel = await this.get(id);
    companyModel.definition = definition;
    await this.save(companyModel);
    return this.get(id);
  }

  add(companyModel: Partial<CompanyModel>) {
    return this.pouchdbService.post(new CompanyModel(companyModel));
  }

  getAll() {
    return this.pouchdbService.find<CompanyModel>(CompanyModel.typeName, {selector: {}});
  }

  async getList(definitionId: string = null) {
    const results = await this.pouchdbService.find<CompanyModel>(CompanyModel.typeName, {
      selector: {
        createdByMethod: false,
      },
    });
    if (definitionId != null) {
      results.docs = results.docs.filter((companyModel) => companyModel.$definition._id === definitionId);
    }
    return results;
  }

  get(id: string) {
    return this.pouchdbService.get(id).then((f) => new CompanyModel(f));
  }

  delete(id: string) {
    return this.pouchdbService.get(id).then(result => this.pouchdbService.remove(result));
  }

  save(companyModel: CompanyModel): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(companyModel);
  }
}
