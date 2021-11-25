import { Component, Input } from '@angular/core';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { FormArray, FormArrayName } from '@angular/forms';
import { ArtifactMappingFormService } from '../shared/artifact-mapping-form.service';
import { ExecutionStepsFormValue } from '../shared/execution-steps-form.service';

@Component({
  selector: 'app-development-method-artifact-mappings',
  templateUrl: './development-method-artifact-mappings.component.html',
  styleUrls: ['./development-method-artifact-mappings.component.css'],
})
export class DevelopmentMethodArtifactMappingsComponent {
  @Input() executionStepsFormValue?: ExecutionStepsFormValue[];
  @Input() developmentMethod: DevelopmentMethod;
  @Input() metaModel: { name: string; metaModelType: any };
  @Input() stepNumber: number = null;

  constructor(
    private artifactMappingService: ArtifactMappingFormService,
    private formArrayName: FormArrayName
  ) {}

  addMapping(): void {
    this.formArray.push(this.artifactMappingService.createMappingForm());
  }

  removeMapping(index: number): void {
    this.formArray.removeAt(index);
  }

  get formArray(): FormArray {
    return this.formArrayName.control;
  }
}
