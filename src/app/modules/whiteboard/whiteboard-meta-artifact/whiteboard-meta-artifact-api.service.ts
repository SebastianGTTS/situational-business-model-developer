import { Injectable, Type } from '@angular/core';
import {
  MetaArtifactApi,
  Reference,
} from '../../../development-process-registry/meta-artifact-definition';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { WhiteboardInstanceService } from './whiteboard-instance.service';
import { WhiteboardInstance } from './whiteboard-instance';
import { DbId } from '../../../database/database-entry';
import { ConfigurationFormComponent } from '../../../development-process-registry/module-api/configuration-form-component';
import { SelectWhiteboardTemplateComponent } from './select-whiteboard-template/select-whiteboard-template.component';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { WhiteboardMetaArtifactData } from './whiteboard-meta-artifact-data';

@Injectable()
export class WhiteboardMetaArtifactApiService implements MetaArtifactApi {
  createMethod?: MetaArtifactApi['create'];
  editMethod?: MetaArtifactApi['edit'];
  viewMethod?: MetaArtifactApi['view'];

  constructor(
    private fb: FormBuilder,
    private whiteboardInstanceService: WhiteboardInstanceService
  ) {}

  create(router: Router, reference: Reference, artifactId: DbId): void {
    if (this.createMethod == null) {
      console.warn('No module to create whiteboards added');
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
      console.warn('No module to edit whiteboards added');
    } else {
      this.editMethod(model, router, reference);
    }
  }

  async copy(model: ArtifactDataReference): Promise<ArtifactDataReference> {
    const instance = await this.whiteboardInstanceService.get(model.id);
    instance.resetDatabaseState();
    await this.whiteboardInstanceService.add(instance);
    return {
      id: instance._id,
      type: WhiteboardInstance.typeName,
    };
  }

  async getName(model: ArtifactDataReference): Promise<string | undefined> {
    const instance = await this.whiteboardInstanceService.get(model.id);
    return instance.name;
  }

  async remove(model: ArtifactDataReference): Promise<void> {
    await this.whiteboardInstanceService.delete(model.id);
  }

  view(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void {
    if (this.viewMethod == null) {
      console.warn('No module to view whiteboards added');
    } else {
      this.viewMethod(model, router, reference);
    }
  }

  getMetaArtifactDataComponent(): Type<ConfigurationFormComponent> {
    return SelectWhiteboardTemplateComponent;
  }

  createMetaArtifactDataForm(
    metaArtifactData: WhiteboardMetaArtifactData | undefined
  ): UntypedFormGroup {
    return this.fb.group({
      templateId: [
        metaArtifactData ? metaArtifactData.templateId : null,
        Validators.required,
      ],
    });
  }

  equalMetaArtifactData(
    metaArtifactDataA: WhiteboardMetaArtifactData | undefined,
    metaArtifactDataB: WhiteboardMetaArtifactData | undefined
  ): boolean {
    if (metaArtifactDataA == null && metaArtifactDataB == null) {
      return true;
    }
    if (metaArtifactDataA == null || metaArtifactDataB == null) {
      return false;
    }
    return metaArtifactDataA.templateId === metaArtifactDataB.templateId;
  }

  compatibleMetaArtifactData(
    metaArtifactDataA: WhiteboardMetaArtifactData | undefined,
    metaArtifactDataB: WhiteboardMetaArtifactData | undefined
  ): boolean {
    // compatible if they are equal
    return this.equalMetaArtifactData(metaArtifactDataA, metaArtifactDataB);
  }
}
