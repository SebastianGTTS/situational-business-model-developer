import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ExecutionStep } from '../../development-process-registry/development-method/execution-step';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { ConfigurationFormPlaceholderDirective } from '../configuration-form-placeholder.directive';
import { ControlContainer, FormGroup } from '@angular/forms';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { BmProcess } from '../../development-process-registry/bm-process/bm-process';

@Component({
  selector: 'app-method-info-step',
  templateUrl: './method-info-step.component.html',
  styleUrls: ['./method-info-step.component.css'],
})
export class MethodInfoStepComponent implements OnChanges {
  @Input() bmProcess: BmProcess;
  @Input() contextDomains: Domain[];
  @Input() step: ExecutionStep;
  @Input() stepDecision: any;

  @Output() forceUpdate = new EventEmitter<any>();

  @ViewChild(ConfigurationFormPlaceholderDirective, { static: true })
  configurationFormHost: ConfigurationFormPlaceholderDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private controlContainer: ControlContainer,
    private moduleService: ModuleService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bmProcess || changes.step) {
      this.initConfiguration(changes.step.currentValue);
    }
  }

  initConfiguration(step: ExecutionStep) {
    const method = this.moduleService.getModuleMethod(step.module, step.method);
    if (
      method.decisionConfigurationFormComponent != null &&
      method.createDecisionConfigurationForm != null
    ) {
      const configurationFormComponentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
          method.decisionConfigurationFormComponent
        );
      const viewContainerRef = this.configurationFormHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(
        configurationFormComponentFactory
      );
      componentRef.instance.formGroup = this.formGroup;
      componentRef.instance.bmProcess = this.bmProcess;
      componentRef.instance.predefinedInput = this.step.predefinedInput;
      componentRef.instance.contextDomains = this.contextDomains;
      componentRef.instance.forceUpdate = this.forceUpdate;
      componentRef.instance.stepDecision = this.stepDecision;
    }
  }

  get formGroup() {
    return this.controlContainer.control as FormGroup;
  }
}
