import { Injectable } from '@angular/core';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';
import { CompanyModel } from './company-model';
import { CompanyModelService } from './company-model.service';
import {
  MetaModelApi,
  Reference,
} from '../development-process-registry/meta-model-definition';
import { Router } from '@angular/router';

@Injectable()
export class CanvasMetaModelApiService implements MetaModelApi {
  viewMethod: (
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ) => void;

  constructor(private companyModelService: CompanyModelService) {}

  view(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void {
    if (this.viewMethod == null) {
      console.warn('No module for viewing of canvas models added');
    } else {
      this.viewMethod(model, router, reference);
    }
  }

  async getName(model: ArtifactDataReference): Promise<string | undefined> {
    const companyModel = await this.companyModelService.get(model.id);
    if (companyModel.instances.length > 0) {
      return companyModel.instances[0].name;
    }
    return undefined;
  }

  async copy(model: ArtifactDataReference): Promise<ArtifactDataReference> {
    const companyModel = await this.companyModelService.get(model.id);
    companyModel.resetDatabaseState();
    companyModel.createdByMethod = true;
    await this.companyModelService.save(companyModel);
    return {
      ...model,
      id: companyModel._id,
      type: CompanyModel.typeName,
    };
  }

  async remove(model: ArtifactDataReference): Promise<void> {
    await this.companyModelService.delete(model.id);
  }
}
