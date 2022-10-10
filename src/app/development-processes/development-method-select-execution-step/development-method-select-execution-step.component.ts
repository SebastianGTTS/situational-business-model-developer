import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { filter, map, tap } from 'rxjs/operators';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { Module } from '../../development-process-registry/module-api/module';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { ConfigurationFormPlaceholderDirective } from '../configuration-form-placeholder.directive';
import { ModuleMethod } from '../../development-process-registry/module-api/module-method';
import { ConfigurationFormComponent } from '../../development-process-registry/module-api/configuration-form-component';
import {
  ExecutionStepsFormService,
  ExecutionStepsFormValue,
} from '../shared/execution-steps-form.service';
import {
  ArtifactMappingFormService,
  MappingsFormValueValid,
} from '../shared/artifact-mapping-form.service';
import { ArtifactMapping } from '../../development-process-registry/development-method/artifact-mapping';
import { DevelopmentMethodService } from '../../development-process-registry/development-method/development-method.service';

@Component({
  selector: 'app-development-method-select-execution-step',
  templateUrl: './development-method-select-execution-step.component.html',
  styleUrls: ['./development-method-select-execution-step.component.css'],
})
export class DevelopmentMethodSelectExecutionStepComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() executionStepsFormValue?: ExecutionStepsFormValue;
  @Input() developmentMethod!: DevelopmentMethod;
  @Input() stepNumber!: number;

  private modules: Module[] = [];
  private methods: ModuleMethod[] = [];

  artifactInputs: {
    complete: boolean;
    inputs: {
      isStep: boolean;
      index: number;
      artifact: number;
    }[];
  }[] = [];

  @Output() remove = new EventEmitter<void>();

  moduleDefinedInTools = true;
  stepError: string | undefined;

  openModuleInput = new Subject<string>();
  openMethodInput = new Subject<string>();

  @ViewChild(ConfigurationFormPlaceholderDirective, { static: true })
  configurationFormHost!: ConfigurationFormPlaceholderDirective;

  private moduleChangeSubscription?: Subscription;
  private methodChangeSubscription?: Subscription;

  constructor(
    private artifactMappingService: ArtifactMappingFormService,
    private developmentMethodService: DevelopmentMethodService,
    private executionStepsFormService: ExecutionStepsFormService,
    private fb: FormBuilder,
    private formGroupDirective: FormGroupDirective,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    if (this.moduleControl.value != null) {
      this.initMethods(this.moduleControl.value);
    }
    if (this.selectedMethod != null) {
      this.initConfiguration(this.selectedMethod);
    }
    this.moduleChangeSubscription = this.moduleControl.valueChanges
      .pipe(
        tap(() => this.methodControl.setValue(null)),
        tap(() => (this.methods = [])),
        tap((module) => this.updateModuleDefinedInTools(module)),
        filter((module) => module),
        tap((module) => this.initMethods(module))
      )
      .subscribe();
    this.methodChangeSubscription = this.methodControl.valueChanges
      .pipe(
        tap(() => this.outputArtifactsControl.clear()),
        tap(() => this.clearConfiguration()),
        tap(() =>
          this.executionStepsFormService.executionStepMethodChange(
            this.formGroup.parent as FormArray,
            this.stepNumber
          )
        ),
        filter((method) => method),
        tap(() =>
          this.selectedMethod.output.forEach(() =>
            this.outputArtifactsControl.push(this.fb.array([]))
          )
        ),
        tap((method: ModuleMethod) => this.initConfiguration(method)),
        tap(() => this.calculateInput())
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.developmentMethod) {
      const developmentMethod: DevelopmentMethod =
        changes.developmentMethod.currentValue;
      const toolNames = developmentMethod.getAllToolNames();
      this.modules = this.moduleService.modules.filter((module) =>
        toolNames.has(module.name)
      );
      this.updateModuleDefinedInTools(this.moduleControl.value);
      this.updateStepError();
    }
    if (changes.developmentMethod || changes.stepNumber) {
      this.calculateInput();
    }
  }

  ngOnDestroy(): void {
    if (this.moduleChangeSubscription) {
      this.moduleChangeSubscription.unsubscribe();
    }
    this.openModuleInput.complete();
    this.openMethodInput.complete();
  }

  private updateModuleDefinedInTools(module: Module | undefined): void {
    this.moduleDefinedInTools =
      module == null ||
      this.developmentMethod.getAllToolNames().has(module.name);
  }

  /**
   * Update the step error help text.
   */
  private updateStepError(): void {
    if (
      this.selectedMethod != null &&
      this.selectedMethod.isMethodCorrectlyDefined != null &&
      this.formGroup.valid
    ) {
      const inputArtifacts = this.developmentMethod.checkStepInputArtifacts(
        this.stepNumber,
        this.selectedMethod.input.length
      );
      const predefinedInput = this.formGroup.get('predefinedInput')?.value;
      const outputMappingsFormValue: MappingsFormValueValid[] =
        this.formGroup.get('outputMappings')?.value;
      const outputMappings: ArtifactMapping[][] = outputMappingsFormValue.map(
        (output: MappingsFormValueValid) =>
          this.artifactMappingService
            .getMappings(output)
            .map((mapping) => new ArtifactMapping(undefined, mapping))
      );
      if (
        this.selectedMethod.isMethodCorrectlyDefined(
          this.developmentMethod,
          inputArtifacts,
          predefinedInput,
          outputMappings
        )
      ) {
        this.stepError = undefined;
      } else if (
        this.selectedMethod.getHelpTextForMethodCorrectlyDefined != null
      ) {
        this.stepError =
          this.selectedMethod.getHelpTextForMethodCorrectlyDefined(
            this.developmentMethod,
            inputArtifacts,
            predefinedInput,
            outputMappings
          );
      } else {
        this.stepError = 'The module reports an error in this execution step.';
      }
    } else {
      this.stepError = undefined;
    }
  }

  initMethods(module: Module): void {
    this.methods = Object.values(module.methods);
  }

  initConfiguration(method: ModuleMethod): void {
    if (
      method.configurationFormComponent != null &&
      method.createConfigurationForm != null
    ) {
      if (!this.formGroup.contains('predefinedInput')) {
        this.formGroup.addControl(
          'predefinedInput',
          this.executionStepsFormService.createPredefinedInputForm(
            method,
            undefined
          ) as FormGroup
        );
      }
      const viewContainerRef = this.configurationFormHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef =
        viewContainerRef.createComponent<ConfigurationFormComponent>(
          method.configurationFormComponent
        );
      componentRef.instance.formGroup = this.predefinedInputControl;
    }
  }

  clearConfiguration(): void {
    this.configurationFormHost.viewContainerRef.clear();
    this.formGroup.removeControl('predefinedInput');
  }

  calculateInput(): void {
    if (this.selectedMethod != null) {
      this.artifactInputs = this.developmentMethod
        .checkStepInputArtifacts(
          this.stepNumber,
          this.selectedMethod.input.length
        )
        .map((inputs) => {
          return {
            complete:
              this.developmentMethodService.hasInputArtifactForStepArtifact(
                this.developmentMethod,
                this.stepNumber,
                inputs
              ),
            inputs: inputs,
          };
        });
    } else {
      this.artifactInputs = [];
    }
  }

  searchModule = (input: Observable<string>): Observable<Module[]> => {
    return merge(getTypeaheadInputPipe(input), this.openModuleInput).pipe(
      map((term) =>
        this.modules
          .filter((moduleItem) =>
            moduleItem.name.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 7)
      )
    );
  };

  searchMethod = (input: Observable<string>): Observable<ModuleMethod[]> => {
    return merge(getTypeaheadInputPipe(input), this.openMethodInput).pipe(
      map((term) =>
        this.methods
          .filter((methodItem) =>
            methodItem.name.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 8)
      )
    );
  };

  formatter(x: { name: string }): string {
    return x.name;
  }

  get moduleControl(): FormControl {
    return this.formGroup.get('module') as FormControl;
  }

  get methodControl(): FormControl {
    return this.formGroup.get('method') as FormControl;
  }

  get outputArtifactsControl(): FormArray {
    return this.formGroup.get('outputMappings') as FormArray;
  }

  get predefinedInputControl(): FormGroup {
    return this.formGroup.get('predefinedInput') as FormGroup;
  }

  get formGroup(): FormGroup {
    return this.formGroupDirective.control;
  }

  get selectedMethod(): ModuleMethod {
    return this.methodControl.value as ModuleMethod;
  }
}
