import { Injectable } from '@angular/core';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { Module } from '../../../development-process-registry/module-api/module';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { WhiteboardToolApiService } from './whiteboard-tool-api.service';
import { WhiteboardMetaArtifactService } from '../whiteboard-meta-artifact/whiteboard-meta-artifact.service';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';
import { Reference } from '../../../development-process-registry/meta-artifact-definition';
import {
  CreateWhiteboardPredefinedInput,
  SelectWhiteboardTemplateConfigurationComponent,
} from './api/select-whiteboard-template-configuration/select-whiteboard-template-configuration.component';
import { referenceToApiQueryParams } from '../../../development-process-registry/module-api/api-query-params';
import { DbId } from '../../../database/database-entry';
import {
  ModuleMethod,
  PredefinedInput,
} from '../../../development-process-registry/module-api/module-method';
import { InternalRoles } from '../../../role/user.service';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { ArtifactMapping } from '../../../development-process-registry/development-method/artifact-mapping';
import { WhiteboardMetaArtifactData } from '../whiteboard-meta-artifact/whiteboard-meta-artifact-data';
import { WhiteboardMetaArtifactApiService } from '../whiteboard-meta-artifact/whiteboard-meta-artifact-api.service';
import { MetaArtifactData } from '../../../development-process-registry/method-elements/artifact/artifact';
import { checkMappings } from '../../../development-process-registry/module-api/helpers';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardToolService {
  static readonly moduleName = 'Whiteboard Module';

  constructor(
    private fb: UntypedFormBuilder,
    private moduleService: ModuleService,
    private whiteboardToolApiService: WhiteboardToolApiService,
    private whiteboardMetaArtifactApiService: WhiteboardMetaArtifactApiService,
    private whiteboardMetaArtifactService: WhiteboardMetaArtifactService
  ) {}

  init(): void {
    const module = new Module(
      'Whiteboard Tools',
      WhiteboardToolService.moduleName,
      this.getMethods(),
      this.whiteboardToolApiService,
      [
        {
          name: 'Templates',
          route: ['whiteboard', 'templates'],
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
      ]
    );
    this.moduleService.registerModule(module);
    console.log('Registered Whiteboard Module');
    this.whiteboardMetaArtifactService.registerCreateMethod(
      this.createWhiteboardInstance
    );
    console.log(
      'Registered Whiteboard Module as create method for whiteboard instances'
    );
    this.whiteboardMetaArtifactService.registerEditMethod(
      this.editWhiteboardInstance
    );
    console.log(
      'Registered Whiteboard Module as edit method for whiteboard instances'
    );
    this.whiteboardMetaArtifactService.registerViewMethod(
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
        output: [
          this.whiteboardMetaArtifactService.whiteboardMetaArtifactIdentifier,
        ],
        isMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedCreate.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedCreateHelpText.bind(this),
        configurationFormComponent:
          SelectWhiteboardTemplateConfigurationComponent,
        createConfigurationForm(
          predefinedInput: CreateWhiteboardPredefinedInput | undefined
        ): UntypedFormGroup {
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
        input: [
          this.whiteboardMetaArtifactService.whiteboardMetaArtifactIdentifier,
        ],
        output: [
          this.whiteboardMetaArtifactService.whiteboardMetaArtifactIdentifier,
        ],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
      },
      {
        name: 'viewWhiteboard',
        description: 'View a Whiteboard',
        input: [
          this.whiteboardMetaArtifactService.whiteboardMetaArtifactIdentifier,
        ],
        output: [
          this.whiteboardMetaArtifactService.whiteboardMetaArtifactIdentifier,
        ],
        isMethodCorrectlyDefined: this.isMethodCorrectlyDefined.bind(this),
        getHelpTextForMethodCorrectlyDefined:
          this.isMethodCorrectlyDefinedHelpText.bind(this),
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
    predefinedInput: CreateWhiteboardPredefinedInput | undefined,
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
    predefinedInput: CreateWhiteboardPredefinedInput | undefined,
    outputMappings: ArtifactMapping[][]
  ): string | undefined {
    if (
      this.checkMappings(developmentMethod, outputMappings[0], {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        templateId: predefinedInput!.templateId!,
      })
    ) {
      return undefined;
    } else {
      return (
        'This method creates a whiteboard with a template that is ' +
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
            inputArtifact.element.metaArtifactData as WhiteboardMetaArtifactData
          );
        })
    ) {
      return undefined;
    } else {
      return (
        'This method has an input artifact that ' +
        'has a non compatible whiteboard template to an output ' +
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
    metaArtifactData: WhiteboardMetaArtifactData
  ): boolean {
    const compatible: (otherData: MetaArtifactData) => boolean = (
      otherData: MetaArtifactData
    ) => {
      return this.whiteboardMetaArtifactApiService.compatibleMetaArtifactData(
        metaArtifactData,
        otherData as WhiteboardMetaArtifactData
      );
    };
    return checkMappings(
      developmentMethod,
      outputMappings,
      compatible,
      WhiteboardToolService.moduleName
    );
  }
}
