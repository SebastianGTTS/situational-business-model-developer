import { Injectable } from '@angular/core';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { Module } from '../../../development-process-registry/module-api/module';
import { CompanyModel } from '../canvas-meta-model/company-model';
import { CompanyModelService } from '../canvas-meta-model/company-model.service';
import { CanvasApiService } from './canvas-api.service';
import { ExpertModelService } from '../canvas-meta-model/expert-model.service';
import { CreateCanvasConfigurationComponent } from './api/create-canvas-configuration/create-canvas-configuration.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectCanvasDefinitionConfigurationComponent } from './api/select-canvas-definition-configuration/select-canvas-definition-configuration.component';
import { CanvasMetaModelService } from '../canvas-meta-model/canvas-meta-model.service';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { InstanceArtifactData } from '../canvas-meta-model/instance-artifact-data';
import { Reference } from '../../../development-process-registry/meta-model-definition';
import { CanvasApiPredefinedInput } from './api/canvas-api-predefined-input';
import { CanvasApiStepDecision } from './api/canvas-api-step-decision';
import { referenceToApiQueryParams } from '../../../development-process-registry/module-api/api-query-params';
import { DbId } from '../../../database/database-entry';
import {
  ModuleMethod,
  PredefinedInput,
} from '../../../development-process-registry/module-api/module-method';
import { InternalRoles } from '../../../user.service';
import { ArtifactMapping } from '../../../development-process-registry/development-method/artifact-mapping';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { CanvasMetaModelData } from '../canvas-meta-model/canvas-meta-model-data';
import { CanvasMetaModelApiService } from '../canvas-meta-model/canvas-meta-model-api.service';
import { isMethodExecutionStep } from '../../../development-process-registry/development-method/execution-step';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  constructor(
    private canvasApiService: CanvasApiService,
    private canvasMetaModelApiService: CanvasMetaModelApiService,
    private canvasMetaModelService: CanvasMetaModelService,
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService,
    private fb: FormBuilder,
    private moduleService: ModuleService
  ) {}

  init(): void {
    const module = new Module(
      'Canvas Tools',
      'Canvas Module',
      this.getMethods(),
      this.canvasApiService,
      [
        {
          name: 'Model Composition',
          route: ['companyModels'],
          roles: [InternalRoles.EXPERT],
        },
        {
          name: 'Canvas Model Repository',
          submenu: [
            {
              name: 'Canvas Building Blocks',
              route: ['expertModels'],
              roles: [InternalRoles.EXPERT],
            },
            {
              name: 'Canvas Models',
              route: ['canvas', 'definitions'],
              roles: [InternalRoles.EXPERT],
            },
            {
              name: 'Canvas Elements',
              route: ['canvasElements'],
              roles: [InternalRoles.EXPERT],
            },
          ],
          roles: [InternalRoles.EXPERT],
        },
      ]
    );
    this.moduleService.registerModule(module);
    console.log('Registered Canvas Module');
    this.canvasMetaModelService.registerCreateMethod(this.createModel);
    console.log('Registered Canvas Module as create method for canvas models');
    this.canvasMetaModelService.registerEditMethod(this.editModel);
    console.log('Registered Canvas Module as edit method for canvas models');
    this.canvasMetaModelService.registerViewMethod(this.viewModel);
    console.log('Registered Canvas Module as view method for canvas models');
  }

  async createModel(
    router: Router,
    reference: Reference,
    artifactId: DbId
  ): Promise<void> {
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(['canvas', 'artifact', artifactId, 'create'], {
      queryParams,
    });
  }

  async editModel(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    const modelReference: InstanceArtifactData = model as InstanceArtifactData;
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(
      [
        'canvas',
        modelReference.id,
        'instance',
        modelReference.instanceId,
        'edit',
      ],
      {
        queryParams,
      }
    );
  }

  async viewModel(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): Promise<void> {
    const modelReference: InstanceArtifactData = model as InstanceArtifactData;
    const queryParams = referenceToApiQueryParams(reference);
    await router.navigate(
      [
        'canvas',
        modelReference.id,
        'instance',
        modelReference.instanceId,
        'view',
      ],
      {
        queryParams,
      }
    );
  }

  private getMethods(): ModuleMethod[] {
    const formBuilder = this.fb;
    return [
      {
        name: 'createCanvas',
        description: 'Creates a canvas',
        input: [],
        output: [{ name: 'Canvas', type: CompanyModel.typeName }],
        isMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedCreate.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedCreateHelpText.bind(this),
        configurationFormComponent:
          SelectCanvasDefinitionConfigurationComponent,
        createConfigurationForm(
          predefinedInput: CanvasApiPredefinedInput | undefined
        ): FormGroup {
          return formBuilder.group({
            definitionId: [
              predefinedInput ? predefinedInput.definitionId : null,
              Validators.required,
            ],
          });
        },
        equalPredefinedInput(
          predefinedInputA: CanvasApiPredefinedInput | undefined,
          predefinedInputB: CanvasApiPredefinedInput | undefined
        ): boolean {
          if (predefinedInputA == null && predefinedInputB == null) {
            return true;
          }
          if (predefinedInputA == null || predefinedInputB == null) {
            return false;
          }
          return (
            predefinedInputA.definitionId === predefinedInputB.definitionId
          );
        },
        decisionConfigurationFormComponent: CreateCanvasConfigurationComponent,
        createDecisionConfigurationForm(
          stepDecision: CanvasApiStepDecision | undefined
        ): FormGroup {
          return formBuilder.group({
            companyModelId: [stepDecision?.companyModelId, Validators.required],
          });
        },
        equalStepDecision(
          stepDecisionA: CanvasApiStepDecision | undefined,
          stepDecisionB: CanvasApiStepDecision | undefined
        ): boolean {
          if (stepDecisionA == null && stepDecisionB == null) {
            return true;
          }
          if (stepDecisionA == null || stepDecisionB == null) {
            return false;
          }
          return stepDecisionA.companyModelId === stepDecisionB.companyModelId;
        },
      },
      {
        name: 'editCanvas',
        description: 'Edit a canvas',
        input: [{ name: 'Canvas', type: CompanyModel.typeName }],
        output: [{ name: 'Canvas', type: CompanyModel.typeName }],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
      },
      {
        name: 'refineCanvas',
        description: 'Refine canvas through hints and patterns',
        input: [{ name: 'Canvas', type: CompanyModel.typeName }],
        output: [{ name: 'Canvas', type: CompanyModel.typeName }],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
      },
      {
        name: 'compareCompetitors',
        description: 'Compare competitors with the business model canvas',
        input: [{ name: 'Canvas', type: CompanyModel.typeName }],
        output: [{ name: 'Canvas', type: CompanyModel.typeName }],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
      },
      {
        name: 'createCompetitors',
        description: 'Add competitors to the model',
        input: [{ name: 'Canvas', type: CompanyModel.typeName }],
        output: [{ name: 'Canvas', type: CompanyModel.typeName }],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
      },
      {
        name: 'manageCompetitors',
        description: 'Edit and remove competitors of the model',
        input: [{ name: 'Canvas', type: CompanyModel.typeName }],
        output: [{ name: 'Canvas', type: CompanyModel.typeName }],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
      },
      {
        name: 'viewCanvas',
        description: 'View the canvas',
        input: [{ name: 'Canvas', type: CompanyModel.typeName }],
        output: [{ name: 'Canvas', type: CompanyModel.typeName }],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
      },
      {
        name: 'editModel',
        description: 'Edit the company model',
        input: [{ name: 'Canvas', type: CompanyModel.typeName }],
        output: [{ name: 'Canvas', type: CompanyModel.typeName }],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
      },
    ];
  }

  /**
   * Only check that metamodel data fits predefined input or metamodel data
   * of output artifact.
   *
   * Assumption the method using this is createCanvas.
   *
   * @param developmentMethod
   * @param inputs
   * @param predefinedInput
   * @param outputMappings
   */
  private isMethodCorrectlyDefinedCreate(
    developmentMethod: DevelopmentMethod,
    inputs: { isStep: boolean; index: number; artifact: number }[][],
    predefinedInput: CanvasApiPredefinedInput | undefined,
    outputMappings: ArtifactMapping[][]
  ): boolean {
    return (
      this.isMethodCorrectlyDefinedCreateHelpText(
        developmentMethod,
        inputs,
        predefinedInput,
        outputMappings
      ) == null
    );
  }

  /**
   * Only check that metamodel data fits predefined input or metamodel data
   * of output artifact.
   *
   * Assumption the method using this is createCanvas.
   *
   * @param developmentMethod
   * @param inputs
   * @param predefinedInput
   * @param outputMappings
   */
  private isMethodCorrectlyDefinedCreateHelpText(
    developmentMethod: DevelopmentMethod,
    inputs: { isStep: boolean; index: number; artifact: number }[][],
    predefinedInput: CanvasApiPredefinedInput | undefined,
    outputMappings: ArtifactMapping[][]
  ): string | undefined {
    if (
      this.checkMappings(developmentMethod, outputMappings[0], {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        definitionId: predefinedInput!.definitionId,
      })
    ) {
      return undefined;
    } else {
      return (
        'This method creates a canvas with a canvas model that is ' +
        'not compatible with an output ' +
        'artifact and there is a flow that leads to that output artifact.'
      );
    }
  }

  /**
   * Only check that metamodel data fits predefined input or metamodel data
   * of output artifact.
   *
   * Assumption a method that uses this method has exactly one input and one
   * output.
   *
   * @param developmentMethod
   * @param inputs
   * @param predefinedInput
   * @param outputMappings
   */
  private isMethodCorrectlyDefined(
    developmentMethod: DevelopmentMethod,
    inputs: { isStep: boolean; index: number; artifact: number }[][],
    predefinedInput: PredefinedInput | undefined,
    outputMappings: ArtifactMapping[][]
  ): boolean {
    return (
      this.isMethodCorrectlyDefinedHelpText(
        developmentMethod,
        inputs,
        predefinedInput,
        outputMappings
      ) == null
    );
  }

  /**
   * Only check that metamodel data fits predefined input or metamodel data
   * of output artifact.
   *
   * Assumption a method that uses this method has exactly one input and one
   * output.
   *
   * @param developmentMethod
   * @param inputs
   * @param predefinedInput
   * @param outputMappings
   */
  private isMethodCorrectlyDefinedHelpText(
    developmentMethod: DevelopmentMethod,
    inputs: { isStep: boolean; index: number; artifact: number }[][],
    predefinedInput: PredefinedInput | undefined,
    outputMappings: ArtifactMapping[][]
  ): string | undefined {
    if (inputs.length !== 1 || outputMappings.length !== 1) {
      throw new Error('Method has not exactly one input and one output');
    }
    if (inputs.flat().length === 0) {
      return undefined;
    }
    if (
      inputs[0]
        .filter((input) => !input.isStep)
        .every((input) => {
          const inputArtifact =
            developmentMethod.inputArtifacts.groups[input.index].items[
              input.artifact
            ];
          if (inputArtifact.element?.metaModelData == null) {
            return true;
          }
          return this.checkMappings(
            developmentMethod,
            outputMappings[0],
            inputArtifact.element.metaModelData as CanvasMetaModelData
          );
        })
    ) {
      return undefined;
    } else {
      return (
        'This method has an input artifact that ' +
        'has a non compatible canvas model to an output ' +
        'artifact and there is a flow that leads to that output artifact.'
      );
    }
  }

  /**
   * Checks whether all mappings only go to the correct output artifacts.
   *
   * @param developmentMethod
   * @param outputMappings
   * @param metaModelData
   */
  private checkMappings(
    developmentMethod: DevelopmentMethod,
    outputMappings: ArtifactMapping[],
    metaModelData: CanvasMetaModelData
  ): boolean {
    if (outputMappings.length === 0) {
      return true;
    }
    return outputMappings.every((mapping) => {
      if (mapping.isOutputMapping()) {
        if (
          developmentMethod.outputArtifacts.groups.length <= mapping.group ||
          developmentMethod.outputArtifacts.groups[mapping.group].items
            .length <= mapping.artifact
        ) {
          return true;
        }
        const output =
          developmentMethod.outputArtifacts.groups[mapping.group].items[
            mapping.artifact
          ];
        if (output == null || output.element?.metaModelData == null) {
          return true;
        }
        return this.canvasMetaModelApiService.compatibleMetaModelData(
          metaModelData,
          output.element?.metaModelData as CanvasMetaModelData | undefined
        );
      }
      if (mapping.isStepMapping()) {
        const step = developmentMethod.executionSteps[mapping.step];
        if (!isMethodExecutionStep(step)) {
          return false;
        }
        return this.checkMappings(
          developmentMethod,
          step.outputMappings[0],
          metaModelData
        );
      }
      return false;
    });
  }
}
