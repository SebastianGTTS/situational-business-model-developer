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
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ArtifactMappingFormService } from '../shared/artifact-mapping-form.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { ExecutionStepsFormValue } from '../shared/execution-steps-form.service';
import { ModuleService } from '../../development-process-registry/module-api/module.service';

@Component({
  selector: 'app-development-method-artifact-mapping',
  templateUrl: './development-method-artifact-mapping.component.html',
  styleUrls: ['./development-method-artifact-mapping.component.css'],
})
export class DevelopmentMethodArtifactMappingComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() executionStepsFormValue?: ExecutionStepsFormValue[];
  @Input() developmentMethod: DevelopmentMethod;
  @Input() metaModel: { name: string; metaModelType: any };
  @Input() stepNumber: number = null;

  @Output() remove = new EventEmitter<void>();

  artifacts: { name: string; metaModelType: any }[];

  private outputChangeSubscription: Subscription;
  private stepChangeSubscription: Subscription;
  private groupChangeSubscription: Subscription;

  constructor(
    private artifactMappingService: ArtifactMappingFormService,
    private formGroupDirective: FormGroupDirective,
    private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.updateSubscriptions();
    this.outputChangeSubscription = this.outputControl.valueChanges
      .pipe(
        tap(() => {
          this.artifactMappingService.convertMappingForm(this.formGroup);
          this.artifacts = [];
          this.updateSubscriptions();
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.developmentMethod) {
      this.updateSubscriptions();
    } else if (
      changes.executionStepsFormValue &&
      !this.outputControl.value &&
      this.stepControl.value != null
    ) {
      this.updateStepArtifacts(this.stepControl.value);
    }
  }

  ngOnDestroy(): void {
    if (this.outputChangeSubscription) {
      this.outputChangeSubscription.unsubscribe();
    }
    if (this.stepChangeSubscription) {
      this.stepChangeSubscription.unsubscribe();
    }
  }

  updateSubscriptions(): void {
    if (this.stepChangeSubscription) {
      this.stepChangeSubscription.unsubscribe();
      this.stepChangeSubscription = null;
    }
    if (this.groupChangeSubscription) {
      this.groupChangeSubscription.unsubscribe();
      this.groupChangeSubscription = null;
    }
    if (this.outputControl.value) {
      if (this.groupControl.value != null) {
        this.updateGroupArtifacts(this.groupControl.value);
      }
      this.groupChangeSubscription = this.groupControl.valueChanges
        .pipe(tap((groupNumber) => this.updateGroupArtifacts(groupNumber)))
        .subscribe();
    } else {
      if (this.stepControl.value != null) {
        this.updateStepArtifacts(this.stepControl.value);
      }
      this.stepChangeSubscription = this.stepControl.valueChanges
        .pipe(tap((stepNumber) => this.updateStepArtifacts(stepNumber)))
        .subscribe();
    }
  }

  updateGroupArtifacts(groupNumber: number): void {
    const group = this.developmentMethod.outputArtifacts[groupNumber];
    this.artifacts = group.map((artifact) => {
      if (!artifact.element || !artifact.element.metaModel) {
        return {
          name: 'Placeholer',
          metaModelType: null,
        };
      }
      return {
        name: artifact.element.name,
        metaModelType: artifact.element.metaModel.type,
      };
    });
  }

  updateStepArtifacts(stepNumber: number): void {
    if (this.executionStepsFormValue != null) {
      const method = this.executionStepsFormValue[stepNumber].method;
      if (method != null) {
        this.artifacts = method.input;
      }
    } else {
      const step = this.developmentMethod.executionSteps[stepNumber];
      this.artifacts = this.moduleService.getModuleMethod(
        step.module,
        step.method
      ).input;
    }
  }

  get formGroup(): FormGroup {
    return this.formGroupDirective.control;
  }

  get outputControl(): FormControl {
    return this.formGroup.get('output') as FormControl;
  }

  get stepControl(): FormControl {
    return this.formGroup.get('step') as FormControl;
  }

  get groupControl(): FormControl {
    return this.formGroup.get('group') as FormControl;
  }

  artifactConformsToMetaModel(artifact: {
    name: string;
    metaModelType: any;
  }): boolean {
    return artifact.metaModelType === this.metaModel.metaModelType;
  }
}
