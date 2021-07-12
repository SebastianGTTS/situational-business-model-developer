import { Component, Input } from '@angular/core';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { FormArrayName } from '@angular/forms';
import { ArtifactMappingFormService } from '../shared/artifact-mapping-form.service';

@Component({
  selector: 'app-development-method-artifact-mappings',
  templateUrl: './development-method-artifact-mappings.component.html',
  styleUrls: ['./development-method-artifact-mappings.component.css']
})
export class DevelopmentMethodArtifactMappingsComponent {

  @Input() developmentMethod: DevelopmentMethod;
  @Input() metaModel: { name: string, metaModelType: any };

  constructor(
    private artifactMappingService: ArtifactMappingFormService,
    private formArrayName: FormArrayName,
  ) {
  }

  addMapping() {
    this.formArray.push(this.artifactMappingService.createMappingForm());
  }

  removeMapping(index: number) {
    this.formArray.removeAt(index);
  }

  get formArray() {
    return this.formArrayName.control;
  }

}
