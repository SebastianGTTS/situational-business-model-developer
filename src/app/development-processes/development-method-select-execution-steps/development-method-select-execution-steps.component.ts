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
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { ExecutionStep } from '../../development-process-registry/development-method/execution-step';
import { ExecutionStepsFormService } from '../shared/execution-steps-form.service';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { equalsList } from '../../shared/utils';
import { ModuleService } from '../../development-process-registry/module-api/module.service';

@Component({
  selector: 'app-development-method-select-execution-steps',
  templateUrl: './development-method-select-execution-steps.component.html',
  styleUrls: ['./development-method-select-execution-steps.component.css'],
})
export class DevelopmentMethodSelectExecutionStepsComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() developmentMethod: DevelopmentMethod;

  @Output() submitExecutionStepsSelectionForm = new EventEmitter<FormArray>();

  executionStepsSelectionForm: FormGroup = this.fb.group({
    steps: this.fb.array([]),
  });
  changed = false;

  private changeSubscription: Subscription;

  constructor(
    private executionStepsFormService: ExecutionStepsFormService,
    private fb: FormBuilder,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.changeSubscription = this.executionStepsSelectionForm.valueChanges
      .pipe(
        debounceTime(300),
        tap(
          (value) =>
            (this.changed = !this.equalExecutionSteps(
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
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  addStep(): void {
    this.executionStepsFormService.addExecutionStep(this.formArray);
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

  private equalExecutionSteps(
    executionStepsA: ExecutionStep[],
    executionStepsB: ExecutionStep[]
  ): boolean {
    if (!equalsList(executionStepsA, executionStepsB)) {
      return false;
    }
    return executionStepsA.every((stepA, index) => {
      if (stepA.module != null && stepA.method != null) {
        const method = this.moduleService.getModuleMethod(
          stepA.module,
          stepA.method
        );
        if (method.equalPredefinedInput) {
          return method.equalPredefinedInput(
            stepA.predefinedInput,
            executionStepsB[index].predefinedInput
          );
        } else {
          return true;
        }
      }
      return false;
    });
  }

  get formArray(): FormArray {
    return this.executionStepsSelectionForm.get('steps') as FormArray;
  }
}
