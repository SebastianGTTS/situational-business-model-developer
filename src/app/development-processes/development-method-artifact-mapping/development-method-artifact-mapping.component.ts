import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ModuleService } from '../../development-process-registry/module-api/module.service';
import { ArtifactMappingFormService } from '../shared/artifact-mapping-form.service';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';

@Component({
  selector: 'app-development-method-artifact-mapping',
  templateUrl: './development-method-artifact-mapping.component.html',
  styleUrls: ['./development-method-artifact-mapping.component.css']
})
export class DevelopmentMethodArtifactMappingComponent implements OnInit, OnDestroy {

  @Input() developmentMethod: DevelopmentMethod;
  @Input() metaModel: { name: string, metaModelType: any };

  @Output() remove = new EventEmitter<void>();

  artifacts: { name: string, metaModelType: any }[];

  private outputChangeSubscription: Subscription;
  private stepChangeSubscription: Subscription;
  private groupChangeSubscription: Subscription;

  constructor(
    private artifactMappingService: ArtifactMappingFormService,
    private formGroupDirective: FormGroupDirective,
    private moduleService: ModuleService,
  ) {
  }

  ngOnInit() {
    this.updateSubscriptions();
    this.outputChangeSubscription = this.outputControl.valueChanges.pipe(
      tap(() => {
        this.artifactMappingService.convertMappingForm(this.formGroup);
        this.artifacts = [];
        this.updateSubscriptions();
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.outputChangeSubscription) {
      this.outputChangeSubscription.unsubscribe();
    }
    if (this.stepChangeSubscription) {
      this.stepChangeSubscription.unsubscribe();
    }
  }

  updateSubscriptions() {
    if (this.outputControl.value) {
      if (this.stepChangeSubscription) {
        this.stepChangeSubscription.unsubscribe();
      }
      if (this.groupControl.value != null) {
        this.updateGroupArtifacts(this.groupControl.value);
      }
      this.groupChangeSubscription = this.groupControl.valueChanges.pipe(
        tap((groupNumber) => this.updateGroupArtifacts(groupNumber)),
      ).subscribe();
    } else {
      if (this.groupChangeSubscription) {
        this.groupChangeSubscription.unsubscribe();
      }
      if (this.stepControl.value != null) {
        this.updateStepArtifacts(this.stepControl.value);
      }
      this.stepChangeSubscription = this.stepControl.valueChanges.pipe(
        tap((stepNumber) => this.updateStepArtifacts(stepNumber)),
      ).subscribe();
    }
  }

  updateGroupArtifacts(groupNumber: number) {
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

  updateStepArtifacts(stepNumber: number) {
    const step = this.developmentMethod.executionSteps[stepNumber];
    this.artifacts = this.moduleService.getModuleMethod(step.module, step.method).input;
  }

  get formGroup() {
    return this.formGroupDirective.control;
  }

  get outputControl() {
    return this.formGroup.get('output');
  }

  get stepControl() {
    return this.formGroup.get('step');
  }

  get groupControl() {
    return this.formGroup.get('group');
  }

  artifactConformsToMetaModel(artifact: { name: string, metaModelType: any }) {
    return artifact.metaModelType === this.metaModel.metaModelType;
  }

}
