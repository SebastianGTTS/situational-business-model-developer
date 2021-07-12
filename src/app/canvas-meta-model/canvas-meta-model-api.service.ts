import { Injectable } from '@angular/core';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';
import { CompanyModel } from './company-model';
import { CompanyModelService } from './company-model.service';
import { MetaModelApi } from '../development-process-registry/meta-model-definition';
import { Router } from '@angular/router';

@Injectable()
export class CanvasMetaModelApiService implements MetaModelApi {

  viewMethod: (model: ArtifactDataReference, router: Router, runningProcessId: string, executionId?: string) => void;

  constructor(
    private companyModelService: CompanyModelService,
  ) {
  }

  view(model: ArtifactDataReference, router: Router, runningProcessId: string, executionId?: string) {
    if (this.viewMethod == null) {
      console.warn('No module for viewing of canvas models added');
    } else {
      this.viewMethod(model, router, runningProcessId, executionId);
    }
  }

  async copy(model: ArtifactDataReference): Promise<ArtifactDataReference> {
    const companyModel = await this.companyModelService.get(model.id);
    companyModel.resetDatabaseState();
    companyModel.createdByMethod = true;
    const {id} = await this.companyModelService.save(companyModel);
    return {
      ...model,
      id,
      type: CompanyModel.typeName,
    };
  }

  async remove(model: ArtifactDataReference) {
    await this.companyModelService.delete(model.id);
  }

}
