import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ArtifactMapping,
  ArtifactMappingInit,
} from '../../development-process-registry/development-method/artifact-mapping';

export type MappingsFormValue = MappingFormValue[];
export type MappingsFormValueValid = MappingFormValueValid[];

export interface MappingFormValue {
  output: boolean;
  step?: number;
  group?: number;
  artifact?: number;
}

export interface MappingFormValueValid extends MappingFormValue {
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

  createMappingForm(mapping?: ArtifactMapping): FormGroup {
    if (mapping == null) {
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
    if (mappingForm.get('output')?.value) {
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
    mappingForm.get('artifact')?.reset();
  }

  /**
   * Resets the step and artifact. Additionally, update step value if
   * number changes due to removal.
   *
   * @param mappingsForm the mappings in which to search
   * @param step the step to which a mapping should point to reset it
   */
  removeMappingTo(mappingsForm: FormArray, step: number): void {
    mappingsForm.controls.forEach((mappingForm) => {
      if (
        mappingForm.get('output')?.value === false &&
        mappingForm.get('step')?.value === step
      ) {
        mappingForm.get('step')?.reset();
        mappingForm.get('artifact')?.reset();
      } else if (
        mappingForm.get('output')?.value === false &&
        mappingForm.get('step')?.value > step
      ) {
        mappingForm
          .get('step')
          ?.setValue(mappingForm.get('step')?.value - 1, { emitEvent: false });
      }
    });
  }

  /**
   * Resets only the artifact.
   *
   * @param mappingsForm the mappings in which to search
   * @param step the step to which a mapping should point to reset it
   */
  resetMappingTo(mappingsForm: FormArray, step: number): void {
    mappingsForm.controls.forEach((mappingForm) => {
      if (
        mappingForm.get('output')?.value === false &&
        mappingForm.get('step')?.value === step
      ) {
        mappingForm.get('artifact')?.reset();
      }
    });
  }

  getMappings(mappings: MappingsFormValueValid): ArtifactMappingInit[] {
    return mappings.map((mapping) => this.getMapping(mapping));
  }

  getMapping(mapping: MappingFormValueValid): ArtifactMappingInit {
    if (mapping.output) {
      return {
        output: mapping.output,
        group: mapping.group,
        artifact: mapping.artifact,
      };
    } else {
      return {
        output: mapping.output,
        step: mapping.step,
        artifact: mapping.artifact,
      };
    }
  }
}
