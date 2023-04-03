import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { MethodInfoStepsFormService } from '../../shared/method-info-steps-form.service';
import { Domain } from '../../../development-process-registry/knowledge/domain';
import { BmProcess } from '../../../development-process-registry/bm-process/bm-process';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { StepDecision } from '../../../development-process-registry/module-api/module-method';
import {
  ExecutionStep,
  isMethodExecutionStep,
} from '../../../development-process-registry/development-method/execution-step';
import { RunningProcess } from '../../../development-process-registry/running-process/running-process';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

@Component({
  selector: 'app-method-info-steps',
  templateUrl: './method-info-steps.component.html',
  styleUrls: ['./method-info-steps.component.css'],
  providers: [{ provide: UPDATABLE, useExisting: MethodInfoStepsComponent }],
})
export class MethodInfoStepsComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() bmProcess?: BmProcess;
  @Input() runningProcess?: RunningProcess;
  @Input() contextDomains!: Domain[];
  @Input() steps!: ExecutionStep[];
  @Input() stepDecisions!: (StepDecision | undefined)[];

  @Output() submitStepsForm = new EventEmitter<StepDecision[]>();
  @Output() forceUpdate = new EventEmitter<{
    step: number;
    stepDecision: StepDecision;
  }>();

  form: UntypedFormGroup = this.fb.group({
    steps: this.fb.array([]),
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private methodInfoStepsFormService: MethodInfoStepsFormService,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.changeSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !this.equalStepDecisions(
              this.stepDecisions,
              this.methodInfoStepsFormService.getStepDecisions(value.steps)
            ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.stepDecisions) {
      const oldStepDecisions: StepDecision[] =
        changes.stepDecisions.previousValue;
      const newStepDecisions: StepDecision[] =
        changes.stepDecisions.currentValue;
      if (
        oldStepDecisions == null ||
        !this.equalStepDecisions(oldStepDecisions, newStepDecisions)
      ) {
        this.form.setControl(
          'steps',
          this.methodInfoStepsFormService.createForm(
            this.steps,
            this.stepDecisions
          )
        );
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeSubscription != null) {
      this.changeSubscription.unsubscribe();
    }
  }

  submitForm(): void {
    this.submitStepsForm.emit(
      this.methodInfoStepsFormService.getStepDecisions(this.formArray.value)
    );
  }

  get formArray(): UntypedFormArray {
    return this.form.get('steps') as UntypedFormArray;
  }

  private equalStepDecisions(
    stepDecisionsA: (StepDecision | undefined)[],
    stepDecisionsB: (StepDecision | undefined)[]
  ): boolean {
    if (stepDecisionsA == null && stepDecisionsB == null) {
      return true;
    }
    if (stepDecisionsA == null || stepDecisionsB == null) {
      return false;
    }
    if (stepDecisionsA.length !== stepDecisionsB.length) {
      return false;
    }
    return stepDecisionsA.every((stepDecisionA, index): boolean => {
      const stepDecisionB = stepDecisionsB[index];
      const step = this.steps[index];
      if (isMethodExecutionStep(step)) {
        const method = this.moduleService.getModuleMethod(
          step.module,
          step.method
        );
        if (method != null && method.equalStepDecision) {
          return method.equalStepDecision(stepDecisionA, stepDecisionB);
        }
      }
      return true;
    });
  }

  update(): void {
    if (this.changed && this.form.valid) {
      this.submitForm();
    }
  }
}
