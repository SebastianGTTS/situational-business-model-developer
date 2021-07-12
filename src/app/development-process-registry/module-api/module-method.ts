import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigurationFormComponent } from './configuration-form-component';
import { DecisionConfigurationFormComponent } from './decision-configuration-form-component';

export interface ModuleMethod {

  name: string;
  description: string;
  input: { name: string, metaModelType: any }[];
  output: { name: string, metaModelType: any }[];

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
   * Create the configuration form needed for the decisionConfigurationFormComponent
   *
   * @param stepDecision the step decision input
   * @return the form group
   */
  createDecisionConfigurationForm?(stepDecision: any): FormGroup;

}
