import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigurationFormComponent } from './configuration-form-component';
import { DecisionConfigurationFormComponent } from './decision-configuration-form-component';
import { MetaModelIdentifier } from '../meta-model-definition';
import { DatabaseEntry } from '../../database/database-entry';
import { ArtifactMapping } from '../development-method/artifact-mapping';
import { DevelopmentMethod } from '../development-method/development-method';

export type PredefinedInput = DatabaseEntry;
export type StepDecision = DatabaseEntry;

export interface ModuleMethod {
  /**
   * The module wide unique name of the method.
   */
  readonly name: string;

  /**
   * The description is used to present the business model developer
   * a description when executing this method.
   */
  readonly description: string;

  /**
   * The input artifacts of this method.
   */
  readonly input: Readonly<MetaModelIdentifier>[];

  /**
   * The output artifacts of this method.
   */
  readonly output: Readonly<MetaModelIdentifier>[];

  /**
   * Optional configuration component that is displayed when the execution
   * step is selected in the method building block (internal: development method)
   */
  readonly configurationFormComponent?: Type<ConfigurationFormComponent>;

  /**
   * Optional configuration component that is displayed when the building
   * block containing this method is configured in the method composition
   * (internal: configure development method in bm process)
   */
  readonly decisionConfigurationFormComponent?: Type<DecisionConfigurationFormComponent>;

  /**
   * Create the configuration form needed for the configurationFormComponent
   *
   * @param predefinedInput the current predefined input
   * @return the form group
   */
  createConfigurationForm?(
    predefinedInput: PredefinedInput | undefined
  ): FormGroup;

  /**
   * Checks whether two predefined inputs are the same
   *
   * @param predefinedInputA the first predefined input
   * @param predefinedInputB the second predefined input
   * @return true if they are the same
   */
  equalPredefinedInput?(
    predefinedInputA: PredefinedInput | undefined,
    predefinedInputB: PredefinedInput | undefined
  ): boolean;

  /**
   * Create the configuration form needed for the decisionConfigurationFormComponent
   *
   * @param stepDecision the step decision input
   * @return the form group
   */
  createDecisionConfigurationForm?(
    stepDecision: StepDecision | undefined
  ): FormGroup;

  /**
   * Checks whether two step decisions are the same
   *
   * @param stepDecisionA
   * @param stepDecisionB
   * @return true if they are the same
   */
  equalStepDecision?(
    stepDecisionA: StepDecision | undefined,
    stepDecisionB: StepDecision | undefined
  ): boolean;

  /**
   * Called to check whether the potential inputs, predefined input, and
   * output mappings fit together.
   *
   * Many constraints are already checked by the framework, e.g., every
   * input of the method will have an input at execution time, the input
   * matches the metamodel type, the output mappings match the metamodel types
   * where they are mapped to, the predefined input is correctly defined
   * according to the provided form, the module is defined in tools.
   *
   * The main reason for this method is to check whether the predefinedInput
   * and the resulting mappings fit together to potential metamodel data of
   * output artifacts.
   *
   * @param developmentMethod
   * @param inputs the potential inputs per input for the method. An input
   * artifact describes whether it comes from a step or an input artifact of
   * the whole building block. The index is then the execution step index or
   * the group index and artifact is the index of the artifact in that input
   * group or execution step.
   * @param predefinedInput predefined input if defined by the method
   * @param outputMappings the output mappings per output of the method
   */
  isMethodCorrectlyDefined?(
    developmentMethod: DevelopmentMethod,
    inputs: { isStep: boolean; index: number; artifact: number }[][],
    predefinedInput: PredefinedInput | undefined,
    outputMappings: ArtifactMapping[][]
  ): boolean;

  /**
   * Same as isMethodCorrectlyDefined, but only called after
   * isMethodCorrectlyDefined returned false to get a help text for the user.
   *
   * @param developmentMethod
   * @param inputs
   * @param predefinedInput
   * @param outputMappings
   */
  getHelpTextForMethodCorrectlyDefined?(
    developmentMethod: DevelopmentMethod,
    inputs: { isStep: boolean; index: number; artifact: number }[][],
    predefinedInput: PredefinedInput | undefined,
    outputMappings: ArtifactMapping[][]
  ): string | undefined;
}
