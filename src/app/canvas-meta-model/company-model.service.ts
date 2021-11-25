import { Injectable } from '@angular/core';
import { CompanyModel } from './company-model';
import { FeatureModelService } from './feature-model.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyModelService extends FeatureModelService<CompanyModel> {
  protected get typeName(): string {
    return CompanyModel.typeName;
  }

  async getAll(): Promise<CompanyModel[]> {
    return super.getList();
  }

  async getList(definitionId: string = null): Promise<CompanyModel[]> {
    let results = await this.pouchdbService.find<CompanyModel>(
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

  protected createElement(element: Partial<CompanyModel>): CompanyModel {
    return new CompanyModel(element);
  }
}
