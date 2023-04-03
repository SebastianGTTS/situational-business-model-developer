import { Injectable } from '@angular/core';
import {
  DevelopmentMethod,
  DevelopmentMethodEntry,
  DevelopmentMethodInit,
} from './development-method';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { Type } from '../method-elements/type/type';
import { DefaultElementService } from '../../database/default-element.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { ModuleService } from '../module-api/module.service';
import { ExecutionStep, isMethodExecutionStep } from './execution-step';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { SituationalFactorService } from '../method-elements/situational-factor/situational-factor.service';
import { ArtifactMultipleMappingSelection } from './artifact-multiple-mapping-selection';
import {
  ArtifactMapping,
  ArtifactOutputMapping,
  ArtifactStepMapping,
} from './artifact-mapping';
import { MetaArtifactService } from '../meta-artifact.service';
import { ModuleMethod } from '../module-api/module-method';
import { MetaArtifactType } from '../meta-artifact-definition';
import { Artifact } from '../method-elements/artifact/artifact';
import { Groups } from './groups';
import { IconInit } from '../../model/icon';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class DevelopmentMethodService extends DefaultElementService<
  DevelopmentMethod,
  DevelopmentMethodInit
> {
  protected readonly typeName = DevelopmentMethod.typeName;

  protected readonly elementConstructor = DevelopmentMethod;

  constructor(
    private metaArtifactService: MetaArtifactService,
    private moduleService: ModuleService,
    pouchdbService: PouchdbService,
    private situationalFactorService: SituationalFactorService
  ) {
    super(pouchdbService);
  }

  /**
   * Get a list sorted by the distance to the situational factors
   *
   * @param situationalFactors
   */
  async getSortedList(
    situationalFactors: SituationalFactor[]
  ): Promise<DevelopmentMethodEntry[]> {
    const list = await this.getList();
    return this.situationalFactorService.sortByDistance(
      situationalFactors,
      list
    );
  }

  /**
   * Get a list of development methods that have the needed types, but not the forbidden ones.
   *
   * @param needed needed types
   * @param forbidden forbidden types
   */
  async getValidDevelopmentMethods(
    needed: { list: string; element?: { _id: string; name: string } }[],
    forbidden: { list: string; element?: { _id: string; name: string } }[]
  ): Promise<DevelopmentMethodEntry[]> {
    return (
      await this.pouchdbService.find<DevelopmentMethodEntry>(
        DevelopmentMethod.typeName,
        {
          selector: {},
        }
      )
    ).filter((method) => Type.validTypes(method.types, needed, forbidden));
  }

  /**
   * Get a list of development methods that have the needed types, but not the forbidden ones.
   * Additionally, sorted by the distance to the situational factors.
   *
   * @param needed needed types
   * @param forbidden forbidden types
   * @param situationalFactors
   */
  async getSortedValidDevelopmentMethods(
    needed: { list: string; element?: { _id: string; name: string } }[],
    forbidden: { list: string; element?: { _id: string; name: string } }[],
    situationalFactors: SituationalFactor[]
  ): Promise<DevelopmentMethodEntry[]> {
    const list = await this.getValidDevelopmentMethods(needed, forbidden);
    return this.situationalFactorService.sortByDistance(
      situationalFactors,
      list
    );
  }

  /**
   * Get a list of development methods that have the desired phase.
   * Additionally, sorted by the distance to the situational factors.
   *
   * @param phaseId
   * @param situationalFactors
   */
  async getValidPhaseDevelopmentMethods(
    phaseId: string,
    situationalFactors: SituationalFactor[]
  ): Promise<DevelopmentMethodEntry[]> {
    const list = (await this.getList()).filter(
      (method) => method.phases?.some((phase) => phase.id === phaseId) ?? false
    );
    return this.situationalFactorService.sortByDistance(
      situationalFactors,
      list
    );
  }

  /**
   * Update the development method.
   *
   * @param id id of the development method
   * @param developmentMethod the new values of the object (values will be copied)
   */
  async update(
    id: string,
    developmentMethod: Partial<DevelopmentMethod>
  ): Promise<void> {
    try {
      const method = await this.getWrite(id);
      method.update(developmentMethod);
      await this.save(method);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the icon of a development method
   *
   * @param id
   * @param icon
   */
  async updateIcon(id: string, icon: IconInit): Promise<void> {
    try {
      const method = await this.getWrite(id);
      method.updateIcon(icon);
      await this.save(method);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Checks whether the development method is correctly defined
   *
   * @param developmentMethod the development method to check
   * @return true if the development method is correctly defined and can
   * be used in processes
   */
  isCorrectlyDefined(developmentMethod: DevelopmentMethod): boolean {
    return (
      developmentMethod.isComplete() &&
      this.isInputArtifactsCorrectlyDefined(developmentMethod) &&
      this.isExecutionStepsCorrectlyDefined(developmentMethod)
    );
  }

  /**
   * Checks whether all input artifacts are correctly defined.
   * Checks mappings.
   *
   * @param developmentMethod
   */
  isInputArtifactsCorrectlyDefined(
    developmentMethod: DevelopmentMethod
  ): boolean {
    return developmentMethod.inputArtifacts.groups.every((group) =>
      group.items.every((item) =>
        this.isInputArtifactCorrectlyDefined(developmentMethod, item)
      )
    );
  }

  /**
   * Checks whether a specific artifact is correctly defined.
   * Checks mappings.
   *
   * @param developmentMethod
   * @param artifactSelection
   */
  isInputArtifactCorrectlyDefined(
    developmentMethod: DevelopmentMethod,
    artifactSelection: ArtifactMultipleMappingSelection
  ): boolean {
    if (
      artifactSelection.element == null ||
      artifactSelection.element.metaArtifact == null ||
      artifactSelection.optional
    ) {
      return artifactSelection.mapping.length === 0;
    }
    return artifactSelection.mapping.every((mapping) =>
      this.isInputArtifactMappingCorrectlyDefined(
        developmentMethod,
        artifactSelection,
        mapping
      )
    );
  }

  /**
   * Checks whether a specific input mapping is pointing to the correct
   * output mappings or steps.
   *
   * @param developmentMethod
   * @param artifactSelection
   * @param mapping
   */
  isInputArtifactMappingCorrectlyDefined(
    developmentMethod: DevelopmentMethod,
    artifactSelection: ArtifactMultipleMappingSelection,
    mapping: ArtifactMapping
  ): boolean {
    if (mapping.isOutputMapping()) {
      if (
        !this.mappingPointsToDefinedOutput(
          developmentMethod.outputArtifacts,
          artifactSelection.element?.metaArtifact?.type,
          mapping
        )
      ) {
        return false;
      }
      const outputArtifact =
        developmentMethod.outputArtifacts.groups[mapping.group].items[
          mapping.artifact
        ];
      const api = this.metaArtifactService.getMetaArtifactDefinition(
        outputArtifact.element?.metaArtifact?.type
      )?.api;
      if (api != null && api.compatibleMetaArtifactData != null) {
        return api.compatibleMetaArtifactData(
          artifactSelection.element?.metaArtifactData,
          outputArtifact.element?.metaArtifactData
        );
      }
      return true;
    } else if (mapping.isStepMapping()) {
      return this.mappingPointsToDefinedStepInput(
        developmentMethod.executionSteps,
        artifactSelection.element?.metaArtifact?.type,
        mapping
      );
    } else {
      return false;
    }
  }

  /**
   * Checks whether the execution steps of the development method are
   * correctly defined
   *
   * @param developmentMethod the development method to check
   * @return true if the development method's execution steps are correctly
   * defined
   */
  isExecutionStepsCorrectlyDefined(
    developmentMethod: DevelopmentMethod
  ): boolean {
    const toolNames = developmentMethod.getAllToolNames();
    return developmentMethod.executionSteps.every((executionStep, index) =>
      this.isExecutionStepCorrectlyDefined(developmentMethod, toolNames, index)
    );
  }

  /**
   * Checks whether a single execution step is correctly defined
   *
   * @param developmentMethod the development method to check
   * @param toolNames
   * @param step the step to check
   * @return true if the execution step is correctly defined
   */
  isExecutionStepCorrectlyDefined(
    developmentMethod: DevelopmentMethod,
    toolNames: Set<string>,
    step: number
  ): boolean {
    return (
      this.hasInputArtifactForStep(developmentMethod, step) &&
      this.isPredefinedInputDefined(developmentMethod, step) &&
      this.isDefinedInTools(developmentMethod, toolNames, step) &&
      this.isStepMappingsCorrectlyDefined(developmentMethod, step) &&
      this.isExecutionStepMethodCorrect(developmentMethod, step)
    );
  }

  /**
   * Checks whether the mappings and selected predefined input fit.
   *
   * @param developmentMethod
   * @param step
   */
  isExecutionStepMethodCorrect(
    developmentMethod: DevelopmentMethod,
    step: number
  ): boolean {
    const executionStep = developmentMethod.executionSteps[step];
    if (!isMethodExecutionStep(executionStep)) {
      return true;
    }
    const method = this.moduleService.getModuleMethod(
      executionStep.module,
      executionStep.method
    );
    if (method == null) {
      return false;
    }
    if (method.isMethodCorrectlyDefined == null) {
      return true;
    }
    const inputArtifacts = developmentMethod.checkStepInputArtifacts(
      step,
      method.input.length
    );
    return method.isMethodCorrectlyDefined(
      developmentMethod,
      inputArtifacts,
      executionStep.predefinedInput,
      executionStep.outputMappings
    );
  }

  /**
   * Checks whether all mappings of a step are correctly defined.
   *
   * @param developmentMethod
   * @param step
   */
  isStepMappingsCorrectlyDefined(
    developmentMethod: DevelopmentMethod,
    step: number
  ): boolean {
    const executionStep = developmentMethod.executionSteps[step];
    if (!isMethodExecutionStep(executionStep)) {
      return true;
    }
    const method = this.moduleService.getModuleMethod(
      executionStep.module,
      executionStep.method
    );
    if (method == null) {
      return false;
    }
    return executionStep.outputMappings.every((artifactMappings, index) =>
      artifactMappings.every((mapping) =>
        this.isStepMappingCorrectlyDefined(
          developmentMethod,
          method,
          index,
          mapping
        )
      )
    );
  }

  /**
   * Checks whether a specific mapping of a specific step is correctly defined.
   *
   * @param developmentMethod
   * @param method
   * @param artifactIndex
   * @param mapping
   */
  isStepMappingCorrectlyDefined(
    developmentMethod: DevelopmentMethod,
    method: ModuleMethod,
    artifactIndex: number,
    mapping: ArtifactMapping
  ): boolean {
    if (mapping.isOutputMapping()) {
      return this.mappingPointsToDefinedOutput(
        developmentMethod.outputArtifacts,
        method.output[artifactIndex].type,
        mapping
      );
    } else if (mapping.isStepMapping()) {
      return this.mappingPointsToDefinedStepInput(
        developmentMethod.executionSteps,
        method.output[artifactIndex].type,
        mapping
      );
    } else {
      return false;
    }
  }

  /**
   * Checks whether an execution step is selected in tools.
   *
   * @param developmentMethod
   * @param toolNames
   * @param step
   */
  isDefinedInTools(
    developmentMethod: DevelopmentMethod,
    toolNames: Set<string>,
    step: number
  ): boolean {
    const executionStep = developmentMethod.executionSteps[step];
    if (!isMethodExecutionStep(executionStep)) {
      return true;
    }
    return toolNames.has(executionStep.module);
  }

  /**
   * Checks whether a single execution step has predefined input defined
   * or does not need it
   *
   * @param developmentMethod the development method to check
   * @param step the step to check
   * @return true if the execution step has predefined input defined or does not
   * need it
   */
  isPredefinedInputDefined(
    developmentMethod: DevelopmentMethod,
    step: number
  ): boolean {
    const executionStep = developmentMethod.executionSteps[step];
    if (!isMethodExecutionStep(executionStep)) {
      return true;
    }
    const method = this.moduleService.getModuleMethod(
      executionStep.module,
      executionStep.method
    );
    if (method == null) {
      throw new Error('ExecutionStep uses unknown method');
    }
    if (method.createConfigurationForm != null) {
      const form = method.createConfigurationForm(
        executionStep.predefinedInput
      );
      return form.valid;
    }
    return true;
  }

  /**
   * Checks whether all input artifacts can be gathered through any input group
   * or a previous step
   *
   * @param developmentMethod the development method to check
   * @param step the step to check
   * @return true if the execution step will have input artifacts available
   */
  hasInputArtifactForStep(
    developmentMethod: DevelopmentMethod,
    step: number
  ): boolean {
    const executionStep = developmentMethod.executionSteps[step];
    if (!isMethodExecutionStep(executionStep)) {
      return true;
    }
    const method = this.moduleService.getModuleMethod(
      executionStep.module,
      executionStep.method
    );
    if (method == null) {
      throw new Error('ExecutionStep uses unknown method');
    }
    const artifactInputs = developmentMethod.checkStepInputArtifacts(
      step,
      method.input.length
    );
    return artifactInputs.every((artifactInput) =>
      this.hasInputArtifactForStepArtifact(
        developmentMethod,
        step,
        artifactInput
      )
    );
  }

  /**
   * Check whether a specific artifact of a specific execution step has
   * enough input artifacts.
   * This means either one step provides the artifact or at least one
   * mapping is defined in every input group.
   *
   * @param developmentMethod
   * @param step
   * @param artifactInput
   */
  hasInputArtifactForStepArtifact(
    developmentMethod: DevelopmentMethod,
    step: number,
    artifactInput: { isStep: boolean; index: number; artifact: number }[]
  ): boolean {
    if (artifactInput.length === 0) {
      return false;
    }
    return (
      artifactInput
        .filter((input) => input.isStep)
        .some((input) => input.index < step) ||
      developmentMethod.inputArtifacts.groups.every(
        (group, index) =>
          artifactInput.filter(
            (input) => !input.isStep && input.index === index
          ).length > 0
      )
    );
  }

  /**
   * Checks whether a mapping points to an existing output artifact and the
   * meta artifact types match.
   *
   * @param outputArtifacts
   * @param metaArtifactType
   * @param mapping
   */
  private mappingPointsToDefinedOutput(
    outputArtifacts: Groups<Artifact>,
    metaArtifactType: MetaArtifactType | undefined,
    mapping: ArtifactOutputMapping
  ): boolean {
    if (
      outputArtifacts.groups.length <= mapping.group ||
      outputArtifacts.groups[mapping.group].items.length <= mapping.artifact
    ) {
      return false;
    }
    const outputArtifact =
      outputArtifacts.groups[mapping.group].items[mapping.artifact];
    if (
      outputArtifact.element == null ||
      outputArtifact.element.metaArtifact == null
    ) {
      return false;
    }
    return outputArtifact.element.metaArtifact.type === metaArtifactType;
  }

  /**
   * Checks whether a mapping points to an existing step input and the
   * meta artifact types match.
   *
   * @param executionSteps
   * @param metaArtifactType
   * @param mapping
   */
  private mappingPointsToDefinedStepInput(
    executionSteps: ExecutionStep[],
    metaArtifactType: MetaArtifactType | undefined,
    mapping: ArtifactStepMapping
  ): boolean {
    if (executionSteps.length <= mapping.step) {
      return false;
    }
    const step = executionSteps[mapping.step];
    if (!isMethodExecutionStep(step)) {
      return false;
    }
    const method = this.moduleService.getModuleMethod(step.module, step.method);
    if (method == null || method.input.length <= mapping.artifact) {
      return false;
    }
    const input = method.input[mapping.artifact];
    return input.type === metaArtifactType;
  }
}
