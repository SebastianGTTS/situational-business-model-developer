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
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { MethodExecutionStep } from '../../../development-process-registry/development-method/method-execution-step';
import { ExecutionStepsFormService } from '../../shared/execution-steps-form.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsList } from '../../../shared/utils';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import {
  ExecutionStep,
  isMethodExecutionStep,
} from '../../../development-process-registry/development-method/execution-step';
import { Updatable, UPDATABLE } from '../../../shared/updatable';

let developmentMethodSelectExecutionStepsId = 0;

@Component({
  selector: 'app-development-method-select-execution-steps',
  templateUrl: './development-method-select-execution-steps.component.html',
  styleUrls: ['./development-method-select-execution-steps.component.css'],
  providers: [
    {
      provide: UPDATABLE,
      useExisting: DevelopmentMethodSelectExecutionStepsComponent,
    },
  ],
})
export class DevelopmentMethodSelectExecutionStepsComponent
  implements OnInit, OnChanges, OnDestroy, Updatable
{
  @Input() developmentMethod!: DevelopmentMethod;

  @Output() submitExecutionStepsSelectionForm =
    new EventEmitter<UntypedFormArray>();

  id: number;

  executionStepsSelectionForm: UntypedFormGroup = this.fb.group({
    steps: this.fb.array([]),
  });
  changed = false;

  private changeSubscription?: Subscription;

  constructor(
    private executionStepsFormService: ExecutionStepsFormService,
    private fb: UntypedFormBuilder,
    private moduleService: ModuleService
  ) {
    this.id = developmentMethodSelectExecutionStepsId;
    developmentMethodSelectExecutionStepsId += 1;
  }

  ngOnInit(): void {
    this.changeSubscription = this.executionStepsSelectionForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed =
              !this.executionStepsSelectionForm.valid ||
              !this.equalExecutionSteps(
                this.developmentMethod.executionSteps,
                this.executionStepsFormService.getExecutionSteps(value.steps)
              ))
        )
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.developmentMethod) {
      const oldDevelopmentMethod: DevelopmentMethod =
        changes.developmentMethod.previousValue;
      const newDevelopmentMethod: DevelopmentMethod =
        changes.developmentMethod.currentValue;
      if (
        oldDevelopmentMethod == null ||
        !this.equalExecutionSteps(
          oldDevelopmentMethod.executionSteps,
          newDevelopmentMethod.executionSteps
        )
      ) {
        this.loadForm(newDevelopmentMethod.executionSteps);
      }
    }
  }

  ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  addStep(): void {
    this.executionStepsFormService.addExecutionStep(this.formArray);
  }

  changeStep(index: number, isMethod: boolean): void {
    this.executionStepsFormService.executionStepTypeChange(
      this.formArray,
      index,
      isMethod
    );
  }

  removeStep(index: number): void {
    this.executionStepsFormService.removeExecutionStep(this.formArray, index);
  }

  loadForm(executionSteps: ExecutionStep[]): void {
    this.executionStepsSelectionForm.setControl(
      'steps',
      this.executionStepsFormService.createForm(executionSteps)
    );
  }

  submitForm(): void {
    this.submitExecutionStepsSelectionForm.emit(this.formArray);
  }

  update(): void {
    if (this.changed && this.executionStepsSelectionForm.valid) {
      this.submitForm();
    }
  }

  private equalExecutionSteps(
    executionStepsA: ExecutionStep[],
    executionStepsB: ExecutionStep[]
  ): boolean {
    if (!equalsList(executionStepsA, executionStepsB)) {
      return false;
    }
    return executionStepsA.every((stepA, index) => {
      if (!isMethodExecutionStep(stepA)) {
        return true;
      }
      if (stepA.module != null && stepA.method != null) {
        const method = this.moduleService.getModuleMethod(
          stepA.module,
          stepA.method
        );
        if (method?.equalPredefinedInput != null) {
          return method.equalPredefinedInput(
            stepA.predefinedInput,
            (executionStepsB[index] as MethodExecutionStep).predefinedInput
          );
        } else {
          return true;
        }
      }
      return false;
    });
  }

  get formArray(): UntypedFormArray {
    return this.executionStepsSelectionForm.get('steps') as UntypedFormArray;
  }
}
