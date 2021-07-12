import { Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { getTypeaheadInputPipe } from '../../shared/utils';
import { filter, map, tap } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Module } from '../../development-process-registry/module-api/module';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { ConfigurationFormPlaceholderDirective } from '../configuration-form-placeholder.directive';
import { ModuleMethod } from '../../development-process-registry/module-api/module-method';
import { ConfigurationFormComponent } from '../../development-process-registry/module-api/configuration-form-component';
import { ExecutionStepsFormService } from '../shared/execution-steps-form.service';

@Component({
  selector: 'app-development-method-select-execution-step',
  templateUrl: './development-method-select-execution-step.component.html',
  styleUrls: ['./development-method-select-execution-step.component.css']
})
export class DevelopmentMethodSelectExecutionStepComponent implements OnInit, OnDestroy {

  @Input() developmentMethod: DevelopmentMethod;

  modules: Module[];
  methods: ModuleMethod[] = [];

  @Output() remove = new EventEmitter<void>();

  openModuleInput = new Subject<string>();
  openMethodInput = new Subject<string>();

  @ViewChild(ConfigurationFormPlaceholderDirective, {static: true}) configurationFormHost: ConfigurationFormPlaceholderDirective;

  private moduleChangeSubscription: Subscription;
  private methodChangeSubscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private executionStepsFormService: ExecutionStepsFormService,
    private fb: FormBuilder,
    private formGroupDirective: FormGroupDirective,
    private moduleService: ModuleService,
  ) {
  }

  ngOnInit() {
    this.modules = this.moduleService.modules;
    if (this.moduleControl.value != null) {
      this.initMethods(this.moduleControl.value);
    }
    if (this.selectedMethod != null) {
      this.initConfiguration(this.selectedMethod);
    }
    this.moduleChangeSubscription = this.moduleControl.valueChanges.pipe(
      tap(() => this.methodControl.setValue(null)),
      tap(() => this.methods = []),
      filter((module) => module),
      tap((module) => this.initMethods(module)),
    ).subscribe();
    this.methodChangeSubscription = this.methodControl.valueChanges.pipe(
      tap(() => this.outputArtifactsControl.clear()),
      tap(() => this.clearConfiguration()),
      filter((method) => method),
      tap(() => this.selectedMethod.output.forEach(() => this.outputArtifactsControl.push(this.fb.array([])))),
      tap((method: ModuleMethod) => this.initConfiguration(method)),
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.moduleChangeSubscription) {
      this.moduleChangeSubscription.unsubscribe();
    }
    this.openModuleInput.complete();
    this.openMethodInput.complete();
  }

  initMethods(module: Module) {
    this.methods = Object.values(module.methods);
  }

  initConfiguration(method: ModuleMethod) {
    if (method.configurationFormComponent != null && method.createConfigurationForm != null) {
      if (!this.formGroup.contains('predefinedInput')) {
        this.formGroup.addControl('predefinedInput', this.executionStepsFormService.createPredefinedInputForm(method, null));
      }
      const configurationFormComponentFactory = this.componentFactoryResolver.resolveComponentFactory(method.configurationFormComponent);
      const viewContainerRef = this.configurationFormHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent<ConfigurationFormComponent>(configurationFormComponentFactory);
      componentRef.instance.formGroup = this.predefinedInputControl;
    }
  }

  clearConfiguration() {
    this.configurationFormHost.viewContainerRef.clear();
    this.formGroup.removeControl('predefinedInput');
  }

  searchModule = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openModuleInput).pipe(
      map((term) => this.modules.filter((moduleItem) => moduleItem.name.toLowerCase().includes(term.toLowerCase())).slice(0, 7)),
    );
  }

  searchMethod = (input: Observable<string>) => {
    return merge(getTypeaheadInputPipe(input), this.openMethodInput).pipe(
      map((term) => this.methods.filter((methodItem) => methodItem.name.toLowerCase().includes(term.toLowerCase())).slice(0, 8)),
    );
  }

  formatter(x: { name: string }) {
    return x.name;
  }

  get moduleControl() {
    return this.formGroup.get('module') as FormControl;
  }

  get methodControl() {
    return this.formGroup.get('method') as FormControl;
  }

  get outputArtifactsControl() {
    return this.formGroup.get('outputMappings') as FormArray;
  }

  get predefinedInputControl() {
    return this.formGroup.get('predefinedInput') as FormGroup;
  }

  get formGroup() {
    return this.formGroupDirective.control;
  }

  get selectedMethod(): ModuleMethod {
    return this.methodControl.value as ModuleMethod;
  }

}
