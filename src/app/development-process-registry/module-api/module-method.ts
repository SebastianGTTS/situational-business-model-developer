import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigurationFormComponent } from './configuration-form-component';
import { DecisionConfigurationFormComponent } from './decision-configuration-form-component';
import { MetaModelIdentifier } from '../meta-model-definition';

export interface ModuleMethod {
  name: string;
  description: string;
  input: Readonly<MetaModelIdentifier>[];
  output: Readonly<MetaModelIdentifier>[];

  configurationFormComponent?: Type<ConfigurationFormComponent>;
  decisionConfigurationFormComponent?: Type<DecisionConfigurationFormComponent>;

  /**
   * Create the configuration form needed for the configurationFormComponent
   *
   * @param predefinedInput the current predefined input
   * @return the form group
   */
  createConfigurationForm?(predefinedInput: any): FormGroup;

  /**
   * Checks whether two predefined inputs are the same
   *
   * @param predefinedInputA the first predefined input
   * @param predefinedInputB the second predefined input
   * @return true if they are the same
   */
  equalPredefinedInput?(predefinedInputA: any, predefinedInputB: any): boolean;

  /**
   * Create the configuration form needed for the decisionConfigurationFormComponent
   *
   * @param stepDecision the step decision input
   * @return the form group
   */
  createDecisionConfigurationForm?(stepDecision: any): FormGroup;
}
