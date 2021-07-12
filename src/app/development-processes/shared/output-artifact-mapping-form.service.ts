import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactData, ArtifactDataType } from '../../development-process-registry/running-process/artifact-data';

export interface OutputArtifactMappingFormValue {
  isDefinition: boolean;
  artifact: number;
  artifactName: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class OutputArtifactMappingFormService {

  constructor(
    private fb: FormBuilder,
  ) {
  }

  createForm(artifacts: Artifact[]): FormGroup {
    const form = this.fb.group({
      outputArtifacts: this.fb.array([]),
    });
    const formGroups = artifacts.map(() => this.fb.group({
      isDefinition: this.fb.control(false, Validators.required),
      artifact: this.fb.control(null),
      artifactName: this.fb.control(null),
      data: this.fb.control(''),
    }, {
      validators: (group) => {
        if (group.get('isDefinition').value) {
          if (!group.get('artifactName').value) {
            return {requiredName: true};
          } else {
            return null;
          }
        } else {
          if (group.get('artifact').value === null || group.get('artifact').value === undefined) {
            return {requiredArtifact: true};
          } else {
            return null;
          }
        }
      }
    }));
    form.setControl('outputArtifacts', this.fb.array(formGroups));
    return form;
  }

  get(formValue: OutputArtifactMappingFormValue[]): {
    isDefinition: boolean;
    artifact: number;
    artifactName: string;
    data: ArtifactData
  }[] {
    return formValue.map((item) => {
      return {
        isDefinition: item.isDefinition,
        artifact: item.artifact,
        artifactName: item.artifactName,
        data: new ArtifactData({
          data: item.data,
          type: ArtifactDataType.STRING,
        }),
      };
    });
  }
}
