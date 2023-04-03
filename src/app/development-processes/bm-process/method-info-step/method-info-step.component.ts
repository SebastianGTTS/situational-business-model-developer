import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { ConfigurationFormPlaceholderDirective } from '../../configuration-form-placeholder.directive';
import { ControlContainer, UntypedFormGroup } from '@angular/forms';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { StepDecision } from '../../../development-process-registry/module-api/module-method';
import {
  ExecutionStep,
  isMethodExecutionStep,
} from '../../../development-process-registry/development-method/execution-step';
import { MethodExecutionStep } from '../../../development-process-registry/development-method/method-execution-step';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';

@Component({
  selector: 'app-method-info-step',
  templateUrl: './method-info-step.component.html',
  styleUrls: ['./method-info-step.component.css'],
})
export class MethodInfoStepComponent implements OnChanges {
  @Input() bmProcess?: BmProcess;
  @Input() runningProcess?: RunningProcess;
  @Input() contextDomains!: Domain[];
  @Input() step!: ExecutionStep;
  @Input() stepDecision?: StepDecision;

  @Output() forceUpdate = new EventEmitter<StepDecision>();

  @ViewChild(ConfigurationFormPlaceholderDirective, { static: true })
  configurationFormHost!: ConfigurationFormPlaceholderDirective;

  constructor(
    private controlContainer: ControlContainer,
    private moduleService: ModuleService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bmProcess || changes.step) {
      this.initConfiguration(changes.step.currentValue);
    }
  }

  initConfiguration(step: ExecutionStep): void {
    if (isMethodExecutionStep(step)) {
      const method = this.moduleService.getModuleMethod(
        step.module,
        step.method
      );
      if (
        method?.decisionConfigurationFormComponent != null &&
        method.createDecisionConfigurationForm != null
      ) {
        const viewContainerRef = this.configurationFormHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(
          method.decisionConfigurationFormComponent
        );
        componentRef.instance.formGroup = this.formGroup;
        componentRef.instance.bmProcess = this.bmProcess;
        componentRef.instance.runningProcess = this.runningProcess;
        componentRef.instance.predefinedInput = step.predefinedInput;
        componentRef.instance.contextDomains = this.contextDomains;
        componentRef.instance.forceUpdate = this.forceUpdate;
        componentRef.instance.stepDecision = this.stepDecision;
      }
    }
  }

  get formGroup(): UntypedFormGroup {
    return this.controlContainer.control as UntypedFormGroup;
  }

  isMethodExecutionStep(step: ExecutionStep): step is MethodExecutionStep {
    return isMethodExecutionStep(step);
  }
}
