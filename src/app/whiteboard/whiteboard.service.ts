import { Injectable } from '@angular/core';
import { ModuleService } from '../development-process-registry/module-api/module.service';
import { Module } from '../development-process-registry/module-api/module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhiteboardApiService } from './whiteboard-api.service';
import { WhiteboardMetaModelService } from '../whiteboard-meta-model/whiteboard-meta-model.service';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { Reference } from '../development-process-registry/meta-model-definition';
import {
  CreateWhiteboardPredefinedInput,
  SelectWhiteboardTemplateConfigurationComponent,
} from './api/select-whiteboard-template-configuration/select-whiteboard-template-configuration.component';

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
    const module = new Module();
    module.list = 'Whiteboard Tools';
    module.name = 'Whiteboard Module';
    this.addMethods(module);
    module.service = this.whiteboardApiService;
    this.moduleService.registerModule(module);
    console.log('Registered Whiteboard Module');
    this.whiteboardMetaModelService.registerViewMethod(
      this.viewWhiteboardInstance
    );
    console.log(
      'Registered Whiteboard Module as view method for whiteboard instances'
    );
  }

  private addMethods(module: Module): void {
    const self = this;
    module.addMethod({
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
        return self.fb.group({
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
    });
    module.addMethod({
      name: 'editWhiteboard',
      description: 'Edit a Whiteboard',
      input: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
      output: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
    });
    module.addMethod({
      name: 'viewWhiteboard',
      description: 'View a Whiteboard',
      input: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
      output: [this.whiteboardMetaModelService.whiteboardMetaModelIdentifier],
    });
  }

  async viewWhiteboardInstance(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    let queryParams: {
      runningProcessId?: string;
      executionId?: string;
      artifactId?: string;
      versionId?: number;
    };
    switch (reference.referenceType) {
      case 'Process':
        queryParams = {
          runningProcessId: reference.runningProcessId,
        };
        break;
      case 'Method':
        queryParams = {
          runningProcessId: reference.runningProcessId,
          executionId: reference.executionId,
        };
        break;
      case 'Artifact':
        queryParams = {
          artifactId: reference.artifactId,
          versionId: reference.versionId,
        };
        break;
    }
    await router.navigate(['whiteboard', 'instance', model.id, 'view'], {
      queryParams,
    });
  }
}
