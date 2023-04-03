import { Injectable, Type } from '@angular/core';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { CompanyModel } from './company-model';
import { CompanyModelService } from './company-model.service';
import {
  MetaArtifactApi,
  Reference,
} from '../../../development-process-registry/meta-artifact-definition';
import { Router } from '@angular/router';
import { DbId } from '../../../database/database-entry';
import { ConfigurationFormComponent } from '../../../development-process-registry/module-api/configuration-form-component';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SelectCanvasDefinitionComponent } from './select-canvas-definition/select-canvas-definition.component';
import { CanvasMetaArtifactData } from './canvas-meta-artifact-data';

@Injectable()
export class CanvasMetaArtifactApiService implements MetaArtifactApi {
  createMethod?: MetaArtifactApi['create'];
  editMethod?: MetaArtifactApi['edit'];
  viewMethod?: MetaArtifactApi['view'];

  constructor(
    private companyModelService: CompanyModelService,
    private fb: UntypedFormBuilder
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

  getMetaArtifactDataComponent(): Type<ConfigurationFormComponent> {
    return SelectCanvasDefinitionComponent;
  }

  createMetaArtifactDataForm(
    metaArtifactData: CanvasMetaArtifactData | undefined
  ): UntypedFormGroup {
    return this.fb.group({
      definitionId: [
        metaArtifactData ? metaArtifactData.definitionId : null,
        Validators.required,
      ],
    });
  }

  equalMetaArtifactData(
    metaArtifactDataA: CanvasMetaArtifactData | undefined,
    metaArtifactDataB: CanvasMetaArtifactData | undefined
  ): boolean {
    if (metaArtifactDataA == null && metaArtifactDataB == null) {
      return true;
    }
    if (metaArtifactDataA == null || metaArtifactDataB == null) {
      return false;
    }
    return metaArtifactDataA.definitionId === metaArtifactDataB.definitionId;
  }

  compatibleMetaArtifactData(
    metaArtifactDataA: CanvasMetaArtifactData | undefined,
    metaArtifactDataB: CanvasMetaArtifactData | undefined
  ): boolean {
    // compatible if they are equal
    return this.equalMetaArtifactData(metaArtifactDataA, metaArtifactDataB);
  }
}
