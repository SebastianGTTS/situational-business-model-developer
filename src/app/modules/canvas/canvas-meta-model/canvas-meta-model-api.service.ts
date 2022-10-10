import { Injectable, Type } from '@angular/core';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { CompanyModel } from './company-model';
import { CompanyModelService } from './company-model.service';
import {
  MetaModelApi,
  Reference,
} from '../../../development-process-registry/meta-model-definition';
import { Router } from '@angular/router';
import { DbId } from '../../../database/database-entry';
import { ConfigurationFormComponent } from '../../../development-process-registry/module-api/configuration-form-component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectCanvasDefinitionComponent } from './select-canvas-definition/select-canvas-definition.component';
import { CanvasMetaModelData } from './canvas-meta-model-data';

@Injectable()
export class CanvasMetaModelApiService implements MetaModelApi {
  createMethod?: MetaModelApi['create'];
  editMethod?: MetaModelApi['edit'];
  viewMethod?: MetaModelApi['view'];

  constructor(
    private companyModelService: CompanyModelService,
    private fb: FormBuilder
  ) {}

  create(router: Router, reference: Reference, artifactId: DbId): void {
    if (this.createMethod == null) {
      console.warn('No module for the creation of canvas models added');
    } else {
      this.createMethod(router, reference, artifactId);
    }
  }

  edit(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void {
    if (this.editMethod == null) {
      console.warn('No module for editing of canvas models added');
    } else {
      this.editMethod(model, router, reference);
    }
  }

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

  getMetaModelDataComponent(): Type<ConfigurationFormComponent> {
    return SelectCanvasDefinitionComponent;
  }

  createMetaModelDataForm(
    metaModelData: CanvasMetaModelData | undefined
  ): FormGroup {
    return this.fb.group({
      definitionId: [
        metaModelData ? metaModelData.definitionId : null,
        Validators.required,
      ],
    });
  }

  equalMetaModelData(
    metaModelDataA: CanvasMetaModelData | undefined,
    metaModelDataB: CanvasMetaModelData | undefined
  ): boolean {
    if (metaModelDataA == null && metaModelDataB == null) {
      return true;
    }
    if (metaModelDataA == null || metaModelDataB == null) {
      return false;
    }
    return metaModelDataA.definitionId === metaModelDataB.definitionId;
  }

  compatibleMetaModelData(
    metaModelDataA: CanvasMetaModelData | undefined,
    metaModelDataB: CanvasMetaModelData | undefined
  ): boolean {
    // compatible if they are equal
    return this.equalMetaModelData(metaModelDataA, metaModelDataB);
  }
}
