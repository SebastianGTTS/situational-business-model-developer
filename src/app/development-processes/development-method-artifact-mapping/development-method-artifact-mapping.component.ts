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
import {
  ExecutionStepsFormService,
  ExecutionStepsFormValue,
} from '../shared/execution-steps-form.service';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { MetaModelIdentifier } from '../../development-process-registry/meta-model-definition';
import { isMethodExecutionStep } from '../../development-process-registry/development-method/execution-step';
import {
  Artifact,
  MetaModelData,
} from '../../development-process-registry/method-elements/artifact/artifact';
import { MetaModelService } from '../../development-process-registry/meta-model.service';

interface ArtifactInfo {
  compatible: boolean;
  name: string;
}

@Component({
  selector: 'app-development-method-artifact-mapping',
  templateUrl: './development-method-artifact-mapping.component.html',
  styleUrls: ['./development-method-artifact-mapping.component.css'],
})
export class DevelopmentMethodArtifactMappingComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() executionStepsFormValue?: ExecutionStepsFormValue;
  @Input() developmentMethod!: DevelopmentMethod;
  @Input() metaModel!: Readonly<MetaModelIdentifier>;
  @Input() metaModelData?: MetaModelData;
  @Input() stepNumber?: number;

  @Output() remove = new EventEmitter<void>();

  artifacts: ArtifactInfo[] = [];

  private outputChangeSubscription?: Subscription;
  private stepChangeSubscription?: Subscription;
  private groupChangeSubscription?: Subscription;

  constructor(
    private artifactMappingService: ArtifactMappingFormService,
    private executionStepsFormService: ExecutionStepsFormService,
    private formGroupDirective: FormGroupDirective,
    private metaModelService: MetaModelService,
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
    if (this.outputChangeSubscription != null) {
      this.outputChangeSubscription.unsubscribe();
    }
    if (this.stepChangeSubscription != null) {
      this.stepChangeSubscription.unsubscribe();
    }
    if (this.groupChangeSubscription != null) {
      this.groupChangeSubscription.unsubscribe();
    }
  }

  updateSubscriptions(): void {
    if (this.stepChangeSubscription) {
      this.stepChangeSubscription.unsubscribe();
      this.stepChangeSubscription = undefined;
    }
    if (this.groupChangeSubscription) {
      this.groupChangeSubscription.unsubscribe();
      this.groupChangeSubscription = undefined;
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
        .pipe(
          tap((stepNumber) => {
            if (stepNumber == null) {
              this.artifacts = [];
            } else {
              this.artifactControl.reset();
              this.updateStepArtifacts(stepNumber);
            }
          })
        )
        .subscribe();
    }
  }

  updateGroupArtifacts(groupNumber: number): void {
    const group = this.developmentMethod.outputArtifacts.groups[groupNumber];
    if (group == null) {
      this.artifacts = [];
    } else {
      this.artifacts = group.items
        .filter(
          (artifact) =>
            artifact.element != null && artifact.element.metaModel != null
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((artifact) => artifact.element!)
        .map((artifact) => {
          return {
            compatible: this.isArtifactCompatible(artifact),
            name: artifact.name,
          };
        });
    }
  }

  private isArtifactCompatible(artifact: Artifact): boolean {
    if (artifact.metaModel?.type !== this.metaModel.type) {
      return false;
    }
    if (this.metaModelData != null) {
      const api = this.metaModelService.getMetaModelDefinition(
        this.metaModel.type
      )?.api;
      if (api != null && api.compatibleMetaModelData != null) {
        return api.compatibleMetaModelData(
          this.metaModelData,
          artifact.metaModelData
        );
      }
    }
    return true;
  }

  updateStepArtifacts(stepNumber: number): void {
    let artifacts: MetaModelIdentifier[] = [];
    if (this.executionStepsFormValue != null) {
      const step = this.executionStepsFormValue[stepNumber];
      if (this.executionStepsFormService.isMethodExecutionStepFormValue(step)) {
        const method = step.method;
        if (method != null) {
          artifacts = method.input;
        }
      }
    } else {
      const step = this.developmentMethod.executionSteps[stepNumber];
      if (isMethodExecutionStep(step)) {
        const method = this.moduleService.getModuleMethod(
          step.module,
          step.method
        );
        if (method != null) {
          artifacts = method.input;
        }
      }
    }
    this.artifacts = artifacts.map((metaModelIdentifier) => {
      return {
        compatible: metaModelIdentifier.type === this.metaModel.type,
        name: metaModelIdentifier.name,
      };
    });
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

  get artifactControl(): FormControl {
    return this.formGroup.get('artifact') as FormControl;
  }
}
