import { Component, Input } from '@angular/core';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { FormArrayName, UntypedFormArray } from '@angular/forms';
import { ArtifactMappingFormService } from '../../shared/artifact-mapping-form.service';
import { ExecutionStepsFormValue } from '../../shared/execution-steps-form.service';
import { MetaArtifactIdentifier } from '../../../development-process-registry/meta-artifact-definition';
import { MetaArtifactData } from '../../../development-process-registry/method-elements/artifact/artifact';

@Component({
  selector: 'app-development-method-artifact-mappings',
  templateUrl: './development-method-artifact-mappings.component.html',
  styleUrls: ['./development-method-artifact-mappings.component.css'],
})
export class DevelopmentMethodArtifactMappingsComponent {
  @Input() idPrefix?: string;
  @Input() index?: number;

  @Input() executionStepsFormValue?: ExecutionStepsFormValue;
  @Input() developmentMethod!: DevelopmentMethod;
  @Input() metaArtifact!: Readonly<MetaArtifactIdentifier>;
  @Input() metaArtifactData?: MetaArtifactData;
  @Input() stepNumber?: number;

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

  get formArray(): UntypedFormArray {
    return this.formArrayName.control;
  }

  getId(suffix: string): string {
    if (this.idPrefix != null && this.idPrefix != '' && this.index != null) {
      return this.idPrefix + '-' + this.index + '-' + suffix;
    }
    return '';
  }
}
