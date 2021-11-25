import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArtifactMapping } from '../../development-process-registry/development-method/artifact-mapping';

export interface MappingFormValue {
  output: boolean;
  step?: number;
  group?: number;
  artifact: number;
}

@Injectable({
  providedIn: 'root',
})
export class ArtifactMappingFormService {
  constructor(private fb: FormBuilder) {}

  createMappingsForm(mappings: ArtifactMapping[]): FormArray {
    return this.fb.array(
      mappings.map((mapping) => this.createMappingForm(mapping))
    );
  }

  createMappingForm(mapping: ArtifactMapping = null): FormGroup {
    if (!mapping) {
      return this.fb.group({
        output: this.fb.control(false, Validators.required),
        step: this.fb.control(null, Validators.required),
        artifact: this.fb.control(null, Validators.required),
      });
    } else if (mapping.output) {
      return this.fb.group({
        output: this.fb.control(true, Validators.required),
        group: this.fb.control(mapping.group, Validators.required),
        artifact: this.fb.control(mapping.artifact, Validators.required),
      });
    } else {
      return this.fb.group({
        output: this.fb.control(false, Validators.required),
        step: this.fb.control(mapping.step, Validators.required),
        artifact: this.fb.control(mapping.artifact, Validators.required),
      });
    }
  }

  convertMappingForm(mappingForm: FormGroup): void {
    if (mappingForm.get('output').value) {
      mappingForm.removeControl('step');
      mappingForm.addControl(
        'group',
        this.fb.control(null, Validators.required)
      );
    } else {
      mappingForm.removeControl('group');
      mappingForm.addControl(
        'step',
        this.fb.control(null, Validators.required)
      );
    }
  }

  getMappings(mappings: MappingFormValue[]): ArtifactMapping[] {
    return mappings.map((mapping) => this.getMapping(mapping));
  }

  getMapping(mapping: MappingFormValue): ArtifactMapping {
    if (mapping.output) {
      return new ArtifactMapping({
        output: mapping.output,
        group: mapping.group,
        artifact: mapping.artifact,
      });
    } else {
      return new ArtifactMapping({
        output: mapping.output,
        step: mapping.step,
        artifact: mapping.artifact,
      });
    }
  }
}
