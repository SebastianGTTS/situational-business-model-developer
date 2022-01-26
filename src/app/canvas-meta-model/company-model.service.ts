import { Injectable } from '@angular/core';
import {
  CompanyModel,
  CompanyModelEntry,
  CompanyModelInit,
} from './company-model';
import { FeatureModelService } from './feature-model.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyModelService extends FeatureModelService<
  CompanyModel,
  CompanyModelInit
> {
  protected readonly typeName = CompanyModel.typeName;

  protected readonly elementConstructor = CompanyModel;

  async getAll(): Promise<CompanyModelEntry[]> {
    return super.getList();
  }

  async getList(definitionId: string = null): Promise<CompanyModelEntry[]> {
    let results = await this.pouchdbService.find<CompanyModelEntry>(
      CompanyModel.typeName,
      {
        selector: {
          createdByMethod: false,
        },
      }
    );
    if (definitionId != null) {
      results = results.filter(
        (companyModel) => companyModel.$definition._id === definitionId
      );
    }
    return results;
  }

  async save(companyModel: CompanyModel): Promise<void> {
    await this.pouchdbService.put(companyModel);
  }
}
