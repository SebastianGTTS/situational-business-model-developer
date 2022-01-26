import { byText } from '@ngneat/spectator';
import {
  createHostFactory,
  mockProvider,
  SpectatorHost,
} from '@ngneat/spectator/jest';
import { DevelopmentMethodArtifactMappingComponent } from './development-method-artifact-mapping.component';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ExecutionStepsFormService,
  ExecutionStepsFormValue,
} from '../shared/execution-steps-form.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { ArtifactMappingFormService } from '../shared/artifact-mapping-form.service';
import { Component } from '@angular/core';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { ExecutionStep } from '../../development-process-registry/development-method/execution-step';
import { ArtifactMapping } from '../../development-process-registry/development-method/artifact-mapping';
import { Module } from '../../development-process-registry/module-api/module';
import { MetaModelIdentifier } from '../../development-process-registry/meta-model-definition';

@Component({ selector: 'app-custom-host', template: '' })
class ArtifactMappingHostComponent {
  developmentMethod: DevelopmentMethod;
  metaModel: MetaModelIdentifier;
  stepNumber: number = 0;

  form: FormArray;
  mappingsForm: FormGroup;

  constructor(
    public artifactMappingFormService: ArtifactMappingFormService,
    public executionStepsFormService: ExecutionStepsFormService
  ) {}

  generateFormGroup(): void {
    if (this.developmentMethod != null) {
      this.form = this.executionStepsFormService.createForm(
        this.developmentMethod.executionSteps
      );
    }
    if (this.form != null) {
      const executionStepsValue: ExecutionStepsFormValue = this.form.value;
      if (
        executionStepsValue.length > 0 &&
        executionStepsValue[0].outputMappings.length > 0 &&
        executionStepsValue[0].outputMappings[0].length > 0
      ) {
        this.mappingsForm = (
          (this.form.at(0).get('outputMappings') as FormArray).at(
            0
          ) as FormArray
        ).at(0) as FormGroup;
      }
    }
  }
}

describe('DevelopmentMethodArtifactMappingComponent', () => {
  let spectator: SpectatorHost<
    DevelopmentMethodArtifactMappingComponent,
    ArtifactMappingHostComponent
  >;
  const createHost = createHostFactory({
    component: DevelopmentMethodArtifactMappingComponent,
    host: ArtifactMappingHostComponent,
    imports: [ReactiveFormsModule],
    providers: [
      ArtifactMappingFormService,
      ExecutionStepsFormService,
      mockProvider(ModuleService),
    ],
  });

  /**
   * Basic set up.
   */
  beforeEach(() => {
    spectator = createHost(
      `
    <app-development-method-artifact-mapping
      [executionStepsFormValue]="form.value"
      [developmentMethod]="developmentMethod"
      [metaModel]="metaModel"
      [stepNumber]="stepNumber"
      [formGroup]="mappingsForm">
    </app-development-method-artifact-mapping>
    `,
      {
        detectChanges: false,
      }
    );
  });

  describe('default', () => {
    const defaultMetaModel: Readonly<MetaModelIdentifier> = {
      type: 'Test Type',
      name: 'Test Model',
    };
    let defaultModule: Module;
    let method: DevelopmentMethod;

    let executionStepsFormService: ExecutionStepsFormService;
    let form: FormArray;

    /**
     * Set up default module.
     */
    beforeAll(() => {
      defaultModule = new Module();
      defaultModule.addMethod({
        name: 'editCanvas',
        description: '',
        input: [],
        output: [defaultMetaModel],
      });
      defaultModule.addMethod({
        name: 'refineCanvas',
        description: '',
        input: [defaultMetaModel],
        output: [],
      });
    });

    /**
     * Add development method.
     */
    beforeEach(() => {
      method = new DevelopmentMethod(undefined, {
        name: 'Test Method',
        author: {},
        executionSteps: [
          new ExecutionStep(undefined, {
            module: 'Canvas Module',
            method: 'editCanvas',
            outputMappings: [
              [
                new ArtifactMapping(undefined, {
                  artifact: 0,
                  output: false,
                  step: 1,
                }),
              ],
            ],
          }),
          new ExecutionStep(undefined, {
            module: 'Canvas Module',
            method: 'refineCanvas',
            outputMappings: [[]],
          }),
        ],
      });
    });

    beforeEach(() => {
      spectator.hostComponent.developmentMethod = method;
      spectator.hostComponent.metaModel = defaultMetaModel;
      spectator.inject(ModuleService).getModule.andReturn(defaultModule);
      spectator.hostComponent.generateFormGroup();
      executionStepsFormService =
        spectator.hostComponent.executionStepsFormService;
      form = spectator.hostComponent.form;
    });

    it('should create', () => {
      spectator.detectChanges();
      expect(spectator.component).toBeTruthy();
      expect(spectator.query('#selectOutput')).toHaveSelectedOptions(
        spectator.query(byText('Step')) as HTMLOptionElement
      );
      expect(spectator.query('#inputStep')).toHaveSelectedOptions(
        spectator.query(byText('#2')) as HTMLOptionElement
      );
      expect(spectator.query('#inputArtifact')).toHaveSelectedOptions(
        spectator.query(
          byText('#1 ' + defaultMetaModel.name)
        ) as HTMLOptionElement
      );
      expect(spectator.component.outputControl.value).toBe(false);
      expect(spectator.component.stepControl.value).toBe(1);
      expect(spectator.component.artifactControl.value).toBe(0);
    });

    it('should detect missing execution steps', () => {
      spectator.detectChanges();
      executionStepsFormService.removeExecutionStep(form, 1);
      spectator.detectChanges();
      expect(spectator.query('#selectOutput')).toHaveSelectedOptions(
        spectator.query(byText('Step')) as HTMLOptionElement
      );
      expect(spectator.component.stepControl.value).toBeNull();
      expect(spectator.component.artifactControl.value).toBeNull();
    });

    it('should detect changed methods', () => {
      spectator.detectChanges();
      form.at(1).get('method').setValue(defaultModule.methods['editCanvas']);
      executionStepsFormService.executionStepMethodChange(form, 1);
      spectator.detectChanges();
      expect(spectator.component.stepControl.value).toBe(1);
      expect(spectator.component.artifactControl.value).toBeNull();
      expect(spectator.component.artifacts).toStrictEqual([]);
    });

    it('should detect removed methods', () => {
      spectator.detectChanges();
      form.at(1).get('method').setValue(null);
      executionStepsFormService.executionStepMethodChange(form, 1);
      spectator.detectChanges();
      expect(spectator.component.stepControl.value).toBe(1);
      expect(spectator.component.artifactControl.value).toBeNull();
      expect(spectator.component.artifacts).toStrictEqual([]);
    });

    it('should reset on changing output', () => {
      spectator.detectChanges();
      const selectOutputSelect = spectator.query('#selectOutput');
      const option = spectator.query(byText('Output')) as HTMLOptionElement;
      spectator.selectOption(selectOutputSelect, option);
      expect(selectOutputSelect).toHaveSelectedOptions(option);
      expect(spectator.component.outputControl.value).toBe(true);
      expect(spectator.component.stepControl).toBeNull();
      expect(spectator.component.groupControl.value).toBeNull();
      expect(spectator.component.artifactControl.value).toBeNull();
    });

    it('should reset selected artifact', () => {
      spectator.detectChanges();
      executionStepsFormService.addExecutionStep(form);
      spectator.detectChanges();
      const inputStepSelect = spectator.query('#inputStep');
      const option = spectator.query(byText('#3')) as HTMLOptionElement;
      spectator.selectOption(inputStepSelect, option);
      expect(inputStepSelect).toHaveSelectedOptions(option);
      expect(spectator.component.stepControl.value).toBe(2);
      expect(spectator.component.artifactControl.value).toBeNull();
    });
  });
});
