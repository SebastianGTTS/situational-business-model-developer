import {
  Component,
  ComponentFactoryResolver,
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

@Component({
  selector: 'app-development-method-select-execution-step',
  templateUrl: './development-method-select-execution-step.component.html',
  styleUrls: ['./development-method-select-execution-step.component.css'],
})
export class DevelopmentMethodSelectExecutionStepComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() executionStepsFormValue?: ExecutionStepsFormValue;
  @Input() developmentMethod: DevelopmentMethod;
  @Input() stepNumber: number;

  modules: Module[];
  methods: ModuleMethod[] = [];

  artifactInputs: { isStep: boolean; index: number; artifact: number }[][];

  @Output() remove = new EventEmitter<void>();

  openModuleInput = new Subject<string>();
  openMethodInput = new Subject<string>();

  @ViewChild(ConfigurationFormPlaceholderDirective, { static: true })
  configurationFormHost: ConfigurationFormPlaceholderDirective;

  private moduleChangeSubscription: Subscription;
  private methodChangeSubscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
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
          this.executionStepsFormService.createPredefinedInputForm(method, null)
        );
      }
      const configurationFormComponentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
          method.configurationFormComponent
        );
      const viewContainerRef = this.configurationFormHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef =
        viewContainerRef.createComponent<ConfigurationFormComponent>(
          configurationFormComponentFactory
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
      this.artifactInputs = this.developmentMethod.checkStepInputArtifacts(
        this.stepNumber,
        this.selectedMethod.input.length
      );
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
