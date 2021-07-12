import { Injectable } from '@angular/core';
import { ModuleService } from '../development-process-registry/module-api/module.service';
import { Module } from '../development-process-registry/module-api/module';
import { CompanyModel } from '../canvas-meta-model/company-model';
import { CompanyModelService } from '../canvas-meta-model/company-model.service';
import { CanvasApiService } from './canvas-api.service';
import { ExpertModelService } from '../canvas-meta-model/expert-model.service';
import { CreateCanvasConfigurationComponent } from './api/create-canvas-configuration/create-canvas-configuration.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SelectCanvasDefinitionConfigurationComponent
} from './api/select-canvas-definition-configuration/select-canvas-definition-configuration.component';
import { CanvasMetaModelService } from '../canvas-meta-model/canvas-meta-model.service';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { InstanceArtifactData } from '../canvas-meta-model/instance-artifact-data';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor(
    private canvasApiService: CanvasApiService,
    private canvasMetaModelService: CanvasMetaModelService,
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService,
    private fb: FormBuilder,
    private moduleService: ModuleService,
  ) {
  }

  init() {
    const module = new Module();
    module.name = 'Canvas Module';
    this.addMethods(module);
    module.service = this.canvasApiService;
    this.moduleService.registerModule(module);
    console.log('Registered Canvas Module');
    this.canvasMetaModelService.registerViewMethod(this.viewModel);
    console.log('Registered Canvas Module as view method for canvas models');
  }

  viewModel(model: ArtifactDataReference, router: Router, runningProcessId: string, executionId?: string) {
    const reference: InstanceArtifactData = model as InstanceArtifactData;
    router.navigate(
      ['canvas', reference.id, 'instance', reference.instanceId, 'view'],
      {
        queryParams: {runningProcessId, executionId}
      }
    ).then();
  }

  private addMethods(module: Module) {
    const self = this;
    module.addMethod({
      name: 'createCanvas',
      description: 'Creates a canvas',
      input: [],
      output: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
      configurationFormComponent: SelectCanvasDefinitionConfigurationComponent,
      createConfigurationForm(predefinedInput: any): FormGroup {
        return self.fb.group({
          definitionId: [predefinedInput ? predefinedInput.definitionId : null, Validators.required],
        });
      },
      decisionConfigurationFormComponent: CreateCanvasConfigurationComponent,
      createDecisionConfigurationForm(predefinedInput: any): FormGroup {
        if (predefinedInput == null) {
          predefinedInput = {
            companyModelId: null,
          };
        }
        return self.fb.group({
          companyModelId: [predefinedInput.companyModelId, Validators.required],
        });
      }
    });
    module.addMethod({
      name: 'editCanvas',
      description: 'Edit a canvas',
      input: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
      output: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
    });
    module.addMethod({
      name: 'refineCanvas',
      description: 'Refine canvas through hints and patterns',
      input: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
      output: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
    });
    module.addMethod({
      name: 'compareCompetitors',
      description: 'Compare competitors with the business model canvas',
      input: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
      output: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
    });
    module.addMethod({
      name: 'createCompetitors',
      description: 'Add competitors to the model',
      input: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
      output: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
    });
    module.addMethod({
      name: 'manageCompetitors',
      description: 'Edit and remove competitors of the model',
      input: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
      output: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
    });
    module.addMethod({
      name: 'viewCanvas',
      description: 'View the canvas',
      input: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
      output: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
    });
    module.addMethod({
      name: 'editModel',
      description: 'Edit the company model',
      input: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
      output: [{name: 'Canvas', metaModelType: CompanyModel.typeName}],
    });
  }
}
