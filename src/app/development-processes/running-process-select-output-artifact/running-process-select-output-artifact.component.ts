import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { RunningArtifact } from '../../development-process-registry/running-process/running-artifact';
import { OutputArtifactMappingFormValue } from '../shared/output-artifact-mapping-form.service';
import { Subscription } from 'rxjs';
import { StepArtifact } from '../../development-process-registry/running-process/step-artifact';
import { MetaModelService } from '../../development-process-registry/meta-model.service';
import {
  ArtifactDataReference,
  ArtifactDataType,
} from '../../development-process-registry/running-process/artifact-data';
import { SelectedElementOptional } from '../../development-process-registry/bm-process/element-decision';

@Component({
  selector: 'app-running-process-select-output-artifact',
  templateUrl: './running-process-select-output-artifact.component.html',
  styleUrls: ['./running-process-select-output-artifact.component.css'],
})
export class RunningProcessSelectOutputArtifactComponent
  implements OnInit, OnDestroy
{
  @Input() artifactOptional!: SelectedElementOptional<Artifact>;
  @Input() internalArtifact?: StepArtifact;
  @Input() processArtifacts!: RunningArtifact[];

  private artifactIsDefinitionChangeSubscription?: Subscription;
  private artifactSelectionChangeSubscription?: Subscription;

  constructor(
    private controlContainer: ControlContainer,
    private metaModelService: MetaModelService
  ) {}

  ngOnInit(): void {
    this.artifactIsDefinitionChangeSubscription =
      this.definitionControl.valueChanges.subscribe(async (value) => {
        if (value && !this.artifactNameControl.value) {
          await this.setDefaultName();
        }
      });
    this.artifactSelectionChangeSubscription =
      this.artifactControl.valueChanges.subscribe((value: number) =>
        this.loadData(value)
      );
  }

  ngOnDestroy(): void {
    if (this.artifactIsDefinitionChangeSubscription != null) {
      this.artifactIsDefinitionChangeSubscription.unsubscribe();
    }
    if (this.artifactSelectionChangeSubscription != null) {
      this.artifactSelectionChangeSubscription.unsubscribe();
    }
  }

  /**
   * Load the data of an artifact into the data control.
   *
   * @param artifact the number of the artifact to load
   */
  loadData(artifact: number): void {
    const runningArtifact = this.processArtifacts[artifact];
    this.dataControl.setValue(
      runningArtifact.versions[runningArtifact.versions.length - 1].data.data
    );
  }

  async setDefaultName(): Promise<void> {
    if (
      this.internalArtifact != null &&
      this.internalArtifact.data.type === ArtifactDataType.REFERENCE
    ) {
      const api = this.metaModelService.getMetaModelApi(
        this.internalArtifact.metaModelType
      );
      const name = await api.getName(
        this.internalArtifact.data.data as ArtifactDataReference
      );
      if (name != null) {
        this.artifactNameControl.setValue(name);
      }
    }
  }

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get definitionControl(): AbstractControl {
    return this.formGroup.get('isDefinition') as AbstractControl;
  }

  get artifactNameControl(): AbstractControl {
    return this.formGroup.get('artifactName') as AbstractControl;
  }

  get artifactControl(): AbstractControl {
    return this.formGroup.get('artifact') as AbstractControl;
  }

  get dataControl(): AbstractControl {
    return this.formGroup.get('data') as AbstractControl;
  }

  get showNotes(): boolean {
    if (this.artifact.internalArtifact) {
      return false;
    }
    const formValue: OutputArtifactMappingFormValue = this.formGroup.value;
    if (formValue.isDefinition == null) {
      return false;
    }
    if (formValue.isDefinition) {
      return true;
    }
    return formValue.artifact != null;
  }

  get artifact(): Artifact {
    return this.artifactOptional.element;
  }

  get isOptional(): boolean {
    return this.artifactOptional.optional;
  }
}
