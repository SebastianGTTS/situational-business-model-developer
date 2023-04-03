import { Injectable } from '@angular/core';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { Module } from '../../../development-process-registry/module-api/module';
import { CompanyModel } from '../canvas-meta-artifact/company-model';
import { CompanyModelService } from '../canvas-meta-artifact/company-model.service';
import { CanvasToolApiService } from './canvas-tool-api.service';
import { ExpertModelService } from '../canvas-meta-artifact/expert-model.service';
import { CreateCanvasConfigurationComponent } from './api/create-canvas-configuration/create-canvas-configuration.component';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SelectCanvasDefinitionConfigurationComponent } from './api/select-canvas-definition-configuration/select-canvas-definition-configuration.component';
import { CanvasMetaArtifactService } from '../canvas-meta-artifact/canvas-meta-artifact.service';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { InstanceArtifactData } from '../canvas-meta-artifact/instance-artifact-data';
import { Reference } from '../../../development-process-registry/meta-artifact-definition';
import { CanvasApiPredefinedInput } from './api/canvas-api-predefined-input';
import { CanvasApiStepDecision } from './api/canvas-api-step-decision';
import { referenceToApiQueryParams } from '../../../development-process-registry/module-api/api-query-params';
import { DbId } from '../../../database/database-entry';
import {
  ModuleMethod,
  PredefinedInput,
} from '../../../development-process-registry/module-api/module-method';
import { InternalRoles } from '../../../role/user.service';
import { ArtifactMapping } from '../../../development-process-registry/development-method/artifact-mapping';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { CanvasMetaArtifactData } from '../canvas-meta-artifact/canvas-meta-artifact-data';
import { CanvasMetaArtifactApiService } from '../canvas-meta-artifact/canvas-meta-artifact-api.service';
import { MetaArtifactData } from '../../../development-process-registry/method-elements/artifact/artifact';
import { checkMappings } from '../../../development-process-registry/module-api/helpers';

@Injectable({
  providedIn: 'root',
})
export class CanvasToolService {
  static readonly moduleName = 'Canvas Module';

  constructor(
    private canvasApiService: CanvasToolApiService,
    private canvasMetaArtifactApiService: CanvasMetaArtifactApiService,
    private canvasMetaArtifactService: CanvasMetaArtifactService,
    private companyModelService: CompanyModelService,
    private expertModelService: ExpertModelService,
    private fb: UntypedFormBuilder,
    private moduleService: ModuleService
  ) {}

  init(): void {
    const module = new Module(
      'Canvas Tools',
      CanvasToolService.moduleName,
      this.getMethods(),
      this.canvasApiService,
      [
        {
          name: 'Model Composition',
          route: ['companyModels'],
          roles: [InternalRoles.METHOD_ENGINEER],
        },
        {
          name: 'Canvas Model Repository',
          submenu: [
            {
              name: 'Canvas Models',
              route: ['canvas', 'definitions'],
              roles: [InternalRoles.DOMAIN_EXPERT],
            },
            {
              name: 'Canvas Building Blocks',
              route: ['expertModels'],
              roles: [InternalRoles.DOMAIN_EXPERT],
            },
            {
              name: 'Canvas Elements',
              route: ['canvasElements'],
              roles: [InternalRoles.DOMAIN_EXPERT],
            },
          ],
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
      ]
    );
    this.moduleService.registerModule(module);
    console.log('Registered Canvas Module');
    this.canvasMetaArtifactService.registerCreateMethod(this.createModel);
    console.log('Registered Canvas Module as create method for canvas models');
    this.canvasMetaArtifactService.registerEditMethod(this.editModel);
    console.log('Registered Canvas Module as edit method for canvas models');
    this.canvasMetaArtifactService.registerViewMethod(this.viewModel);
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
        ): UntypedFormGroup {
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
        ): UntypedFormGroup {
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
   * Only check that meta artifact data fits predefined input or meta artifact data
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
   * Only check that meta artifact data fits predefined input or meta artifact data
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
   * Only check that meta artifact data fits predefined input or meta artifact data
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
   * Only check that meta artifact data fits predefined input or meta artifact data
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
          if (inputArtifact.element?.metaArtifactData == null) {
            return true;
          }
          return this.checkMappings(
            developmentMethod,
            outputMappings[0],
            inputArtifact.element.metaArtifactData as CanvasMetaArtifactData
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
   * @param metaArtifactData
   */
  private checkMappings(
    developmentMethod: DevelopmentMethod,
    outputMappings: ArtifactMapping[],
    metaArtifactData: CanvasMetaArtifactData
  ): boolean {
    const compatible: (otherData: MetaArtifactData) => boolean = (
      otherData: MetaArtifactData
    ) => {
      return this.canvasMetaArtifactApiService.compatibleMetaArtifactData(
        metaArtifactData,
        otherData as CanvasMetaArtifactData
      );
    };
    return checkMappings(
      developmentMethod,
      outputMappings,
      compatible,
      CanvasToolService.moduleName
    );
  }
}
