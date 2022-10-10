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
  ExecutionStepsFormValueValid,
} from '../shared/execution-steps-form.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { ArtifactMappingFormService } from '../shared/artifact-mapping-form.service';
import { Component } from '@angular/core';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { MethodExecutionStep } from '../../development-process-registry/development-method/method-execution-step';
import { ArtifactMapping } from '../../development-process-registry/development-method/artifact-mapping';
import { Module } from '../../development-process-registry/module-api/module';
import { MetaModelIdentifier } from '../../development-process-registry/meta-model-definition';
import { MetaModelService } from '../../development-process-registry/meta-model.service';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { Groups } from '../../development-process-registry/development-method/groups';

@Component({ selector: 'app-custom-host', template: '' })
class ArtifactMappingHostComponent {
  developmentMethod?: DevelopmentMethod;
  metaModel?: MetaModelIdentifier;
  stepNumber = 0;

  form?: FormArray;
  mappingsForm?: FormGroup;

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
      const executionStepsValue: ExecutionStepsFormValueValid = this.form.value;
      if (executionStepsValue.length > 0) {
        const firstExecutionStep = executionStepsValue[0];
        if (
          this.executionStepsFormService.isMethodExecutionStepFormValue(
            firstExecutionStep
          ) &&
          firstExecutionStep.outputMappings.length > 0 &&
          firstExecutionStep.outputMappings[0].length > 0
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
      mockProvider(MetaModelService),
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
      [executionStepsFormValue]='form.value'
      [developmentMethod]='developmentMethod'
      [metaModel]='metaModel'
      [stepNumber]='stepNumber'
      [formGroup]='mappingsForm'>
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
      defaultModule = new Module(
        'Test List',
        'Test Module',
        [
          {
            name: 'editCanvas',
            description: '',
            input: [],
            output: [defaultMetaModel],
          },
          {
            name: 'refineCanvas',
            description: '',
            input: [defaultMetaModel],
            output: [defaultMetaModel],
          },
        ],
        {
          executeMethod: (): void => undefined,
        },
        []
      );
    });

    /**
     * Add development method.
     */
    beforeEach(() => {
      method = new DevelopmentMethod(undefined, {
        name: 'Test Method',
        author: {},
        executionSteps: [
          new MethodExecutionStep(undefined, {
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
          new MethodExecutionStep(undefined, {
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      form = spectator.hostComponent.form!;
    });

    it('should create', () => {
      spectator.detectChanges();
      expect(spectator.component).toBeTruthy();
      expect(spectator.query('#selectOutput-0')).toHaveSelectedOptions(
        spectator.query(byText('Step')) as HTMLOptionElement
      );
      expect(spectator.query('#inputStep-0')).toHaveSelectedOptions(
        spectator.query(byText('#2')) as HTMLOptionElement
      );
      expect(spectator.query('#inputArtifact-0')).toHaveSelectedOptions(
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
      expect(spectator.query('#selectOutput-0')).toHaveSelectedOptions(
        spectator.query(byText('Step')) as HTMLOptionElement
      );
      expect(spectator.component.stepControl.value).toBeNull();
      expect(spectator.component.artifactControl.value).toBeNull();
    });

    it('should detect changed methods', () => {
      spectator.detectChanges();
      form.at(1).get('method')?.setValue(defaultModule.methods['editCanvas']);
      executionStepsFormService.executionStepMethodChange(form, 1);
      spectator.detectChanges();
      expect(spectator.component.stepControl.value).toBe(1);
      expect(spectator.component.artifactControl.value).toBeNull();
      expect(spectator.component.artifacts).toStrictEqual([]);
    });

    it('should detect removed methods', () => {
      spectator.detectChanges();
      form.at(1).get('method')?.setValue(null);
      executionStepsFormService.executionStepMethodChange(form, 1);
      spectator.detectChanges();
      expect(spectator.component.stepControl.value).toBe(1);
      expect(spectator.component.artifactControl.value).toBeNull();
      expect(spectator.component.artifacts).toStrictEqual([]);
    });

    it('should reset on changing output', () => {
      spectator.detectChanges();
      const selectOutputSelect =
        spectator.query('#selectOutput-0') ?? undefined;
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
      const inputStepSelect = spectator.query('#inputStep-0') ?? undefined;
      const option = spectator.query(byText('#3')) as HTMLOptionElement;
      spectator.selectOption(inputStepSelect, option);
      expect(inputStepSelect).toHaveSelectedOptions(option);
      expect(spectator.component.stepControl.value).toBe(2);
      expect(spectator.component.artifactControl.value).toBeNull();
    });

    describe('add another method', () => {
      beforeEach(() => {
        method.executionSteps.push(
          new MethodExecutionStep(undefined, {
            module: 'Canvas Module',
            method: 'editCanvas',
            outputMappings: [[]],
          })
        );
        (method.executionSteps[1] as MethodExecutionStep).outputMappings = [
          [
            new ArtifactMapping(undefined, {
              artifact: 0,
              output: false,
              step: 2,
            }),
          ],
        ];
        spectator.hostComponent.generateFormGroup();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        form = spectator.hostComponent.form!;
      });

      it('should detect removed first method', () => {
        spectator.detectChanges();
        expect(spectator.component.stepControl.value).toBe(1);
        executionStepsFormService.removeExecutionStep(form, 0);
        spectator.hostComponent.mappingsForm = (
          (form.at(0).get('outputMappings') as FormArray).at(0) as FormArray
        ).at(0) as FormGroup;
        spectator.detectChanges();
        expect(spectator.component.stepControl.value).toBe(1);
        expect(spectator.component.artifactControl.value).toBe(0);
      });
    });

    describe('add output artifact', () => {
      beforeEach(() => {
        method.outputArtifacts = new Groups<Artifact>(
          undefined,
          {
            groups: [
              {
                items: [
                  {
                    element: new Artifact(undefined, {
                      name: 'Default Artifact',
                      list: 'Default List',
                      metaModel: defaultMetaModel,
                      internalArtifact: true,
                    }),
                    list: 'Default List',
                  },
                ],
              },
            ],
          },
          Artifact
        );
        (method.executionSteps[0] as MethodExecutionStep).outputMappings = [
          [
            new ArtifactMapping(undefined, {
              output: true,
              group: 0,
              artifact: 0,
            }),
          ],
        ];
        spectator.hostComponent.generateFormGroup();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        form = spectator.hostComponent.form!;
      });

      it('should detect deleted output artifact', () => {
        spectator.detectChanges();
        expect(spectator.component.groupControl.value).toBe(0);
        method.update({
          outputArtifacts: new Groups<Artifact>(
            undefined,
            {
              groups: [],
            },
            Artifact
          ),
        });
        method = new DevelopmentMethod(undefined, method);
        spectator.setInput({ developmentMethod: method });
      });
    });
  });
});
