import { Injectable } from '@angular/core';
import { DevelopmentMethod } from './development-method';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { Type } from '../method-elements/type/type';
import { DefaultElementService } from '../../database/default-element.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { ModuleService } from '../module-api/module.service';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class DevelopmentMethodService extends DefaultElementService<DevelopmentMethod> {
  protected get typeName(): string {
    return DevelopmentMethod.typeName;
  }

  constructor(
    private moduleService: ModuleService,
    pouchdbService: PouchdbService
  ) {
    super(pouchdbService);
  }

  /**
   * Get a list of development methods that have the needed types, but not the forbidden ones.
   *
   * @param needed needed types
   * @param forbidden forbidden types
   */
  async getValidDevelopmentMethods(
    needed: { list: string; element: { _id: string; name: string } }[],
    forbidden: { list: string; element: { _id: string; name: string } }[]
  ): Promise<DevelopmentMethod[]> {
    return (
      await this.pouchdbService.find<DevelopmentMethod>(
        DevelopmentMethod.typeName,
        {
          selector: {},
        }
      )
    ).filter((method) => Type.validTypes(method.types, needed, forbidden));
  }

  /**
   * Update the development method.
   *
   * @param id id of the development method
   * @param developmentMethod the new values of the object (values will be copied)
   */
  update(id: string, developmentMethod: Partial<DevelopmentMethod>) {
    return this.get(id).then((method) => {
      method.update(developmentMethod);
      return this.save(method);
    });
  }

  /**
   * Checks whether the development method is correctly defined
   *
   * @param developmentMethod the development method to check
   * @return true if the development method is correctly defined and can
   * be used in processes
   */
  isCorrectlyDefined(developmentMethod: DevelopmentMethod): boolean {
    return this.isExecutionStepsCorrectlyDefined(developmentMethod);
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
    return developmentMethod.executionSteps.every((executionStep, index) =>
      this.isExecutionStepCorrectlyDefined(developmentMethod, index)
    );
  }

  /**
   * Checks whether a single execution step is correctly defined
   *
   * @param developmentMethod the development method to check
   * @param step the step to check
   * @return true if the execution step is correctly defined
   */
  isExecutionStepCorrectlyDefined(
    developmentMethod: DevelopmentMethod,
    step: number
  ): boolean {
    return (
      this.hasInputArtifactForStep(developmentMethod, step) &&
      this.isPredefinedInputDefined(developmentMethod, step)
    );
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
    const method = this.moduleService.getModuleMethod(
      executionStep.module,
      executionStep.method
    );
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
    const method = this.moduleService.getModuleMethod(
      executionStep.module,
      executionStep.method
    );
    const artifactInputs = developmentMethod.checkStepInputArtifacts(
      step,
      method.input.length
    );
    return artifactInputs.every((artifactInput) => {
      if (artifactInput.length === 0) {
        return false;
      }
      return (
        artifactInput
          .filter((input) => input.isStep)
          .some((input) => input.index < step) ||
        developmentMethod.inputArtifacts.every(
          (group, index) =>
            artifactInput.filter(
              (input) => !input.isStep && input.index === index
            ).length > 0
        )
      );
    });
  }

  protected createElement(
    element: Partial<DevelopmentMethod>
  ): DevelopmentMethod {
    return new DevelopmentMethod(element);
  }
}
