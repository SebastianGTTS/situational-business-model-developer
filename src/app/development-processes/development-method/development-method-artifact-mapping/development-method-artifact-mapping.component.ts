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
  FormGroupDirective,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ArtifactMappingFormService } from '../../shared/artifact-mapping-form.service';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import {
  ExecutionStepsFormService,
  ExecutionStepsFormValue,
} from '../../shared/execution-steps-form.service';
import { ModuleService } from '../../../development-process-registry/module-api/module.service';
import { MetaArtifactIdentifier } from '../../../development-process-registry/meta-artifact-definition';
import { isMethodExecutionStep } from '../../../development-process-registry/development-method/execution-step';
import {
  Artifact,
  MetaArtifactData,
} from '../../../development-process-registry/method-elements/artifact/artifact';
import { MetaArtifactService } from '../../../development-process-registry/meta-artifact.service';

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
  @Input() idPrefix?: string;
  @Input() index?: number;

  @Input() executionStepsFormValue?: ExecutionStepsFormValue;
  @Input() developmentMethod!: DevelopmentMethod;
  @Input() metaArtifact!: Readonly<MetaArtifactIdentifier>;
  @Input() metaArtifactData?: MetaArtifactData;
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
    private metaArtifactService: MetaArtifactService,
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

  updateGroupArtifacts(groupNumber: number | undefined): void {
    if (groupNumber == null) {
      this.artifacts = [];
      return;
    }
    const group = this.developmentMethod.outputArtifacts.groups[groupNumber];
    if (group == null) {
      this.artifacts = [];
    } else {
      this.artifacts = group.items
        .filter(
          (artifact) =>
            artifact.element != null && artifact.element.metaArtifact != null
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
    if (artifact.metaArtifact?.type !== this.metaArtifact.type) {
      return false;
    }
    if (this.metaArtifactData != null) {
      const api = this.metaArtifactService.getMetaArtifactDefinition(
        this.metaArtifact.type
      )?.api;
      if (api != null && api.compatibleMetaArtifactData != null) {
        return api.compatibleMetaArtifactData(
          this.metaArtifactData,
          artifact.metaArtifactData
        );
      }
    }
    return true;
  }

  updateStepArtifacts(stepNumber: number | undefined): void {
    if (stepNumber == null) {
      this.artifacts = [];
      return;
    }
    let artifacts: MetaArtifactIdentifier[] = [];
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
    this.artifacts = artifacts.map((metaArtifactIdentifier) => {
      return {
        compatible: metaArtifactIdentifier.type === this.metaArtifact.type,
        name: metaArtifactIdentifier.name,
      };
    });
  }

  get formGroup(): UntypedFormGroup {
    return this.formGroupDirective.control;
  }

  get outputControl(): UntypedFormControl {
    return this.formGroup.get('output') as UntypedFormControl;
  }

  get stepControl(): UntypedFormControl {
    return this.formGroup.get('step') as UntypedFormControl;
  }

  get groupControl(): UntypedFormControl {
    return this.formGroup.get('group') as UntypedFormControl;
  }

  get artifactControl(): UntypedFormControl {
    return this.formGroup.get('artifact') as UntypedFormControl;
  }

  getId(suffix: string): string {
    if (this.idPrefix != null && this.idPrefix != '' && this.index != null) {
      return this.idPrefix + '-' + this.index + '-' + suffix;
    }
    return '';
  }
}
