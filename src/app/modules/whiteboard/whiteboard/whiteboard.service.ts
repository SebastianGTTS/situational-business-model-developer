import { Injectable } from '@angular/core';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { Module } from '../../../development-process-registry/module-api/module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhiteboardApiService } from './whiteboard-api.service';
import { WhiteboardMetaModelService } from '../whiteboard-meta-model/whiteboard-meta-model.service';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { Reference } from '../../../development-process-registry/meta-model-definition';
import {
  CreateWhiteboardPredefinedInput,
  SelectWhiteboardTemplateConfigurationComponent,
} from './api/select-whiteboard-template-configuration/select-whiteboard-template-configuration.component';
import { referenceToApiQueryParams } from '../../../development-process-registry/module-api/api-query-params';
import { DbId } from '../../../database/database-entry';
import { ModuleMethod } from '../../../development-process-registry/module-api/module-method';
import { InternalRoles } from '../../../user.service';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardService {
  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private whiteboardApiService: WhiteboardApiService,
    private whiteboardMetaModelService: WhiteboardMetaModelService
  ) {}

  init(): void {
    const module = new Module(
      'Whiteboard Tools',
      'Whiteboard Module',
      this.getMethods(),
      this.whiteboardApiService,
      [
        {
          name: 'Templates',
          route: ['whiteboard', 'templates'],
          roles: [InternalRoles.EXPERT],
        },
      ]
    );
    this.moduleService.registerModule(module);
    console.log('Registered Whiteboard Module');
    this.whiteboardMetaModelService.registerCreateMethod(
      this.createWhiteboardInstance
    );
    console.log(
      'Registered Whiteboard Module as create method for whiteboard instances'
    );
    this.whiteboardMetaModelService.registerEditMethod(
      this.editWhiteboardInstance
    );
    console.log(
      'Registered Whiteboard Module as edit method for whiteboard instances'
    );
    this.whiteboardMetaModelService.registerViewMethod(
      this.viewWhiteboardInstance
    );
    console.log(
      'Registered Whiteboard Module as view method for whiteboard instances'
    );
  }

  private getMethods(): ModuleMethod[] {
    // noinspection UnnecessaryLocalVariableJS // variable is not unnecessary as accessing from inner function
    const formBuilder = this.fb;
    return [
      {
        name: 'createWhiteboard',
        description: 'Creates a whiteboard instance',
        input: [],
        output: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
        configurationFormComponent:
          SelectWhiteboardTemplateConfigurationComponent,
        createConfigurationForm(
          predefinedInput: CreateWhiteboardPredefinedInput | undefined
        ): FormGroup {
          if (predefinedInput == null) {
            predefinedInput = {
              templateId: undefined,
            };
          }
          return formBuilder.group({
            templateId: [predefinedInput.templateId, Validators.required],
          });
        },
        equalPredefinedInput(
          predefinedInputA: CreateWhiteboardPredefinedInput | undefined,
          predefinedInputB: CreateWhiteboardPredefinedInput | undefined
        ): boolean {
          if (predefinedInputA == null && predefinedInputB == null) {
            return true;
          }
          if (predefinedInputA == null || predefinedInputB == null) {
            return false;
          }
          return predefinedInputA.templateId === predefinedInputB.templateId;
        },
      },
      {
        name: 'editWhiteboard',
        description: 'Edit a Whiteboard',
        input: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
        output: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
      },
      {
        name: 'viewWhiteboard',
        description: 'View a Whiteboard',
        input: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
        output: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
      },
    ];
  }

  async createWhiteboardInstance(
    router: Router,
    reference: Reference,
    artifactId: DbId
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(['whiteboard', 'artifact', artifactId, 'create'], {
      queryParams,
    });
  }

  async viewWhiteboardInstance(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(['whiteboard', 'instance', model.id, 'view'], {
      queryParams,
    });
  }

  async editWhiteboardInstance(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(['whiteboard', 'instance', model.id, 'edit'], {
      queryParams,
    });
  }
}
