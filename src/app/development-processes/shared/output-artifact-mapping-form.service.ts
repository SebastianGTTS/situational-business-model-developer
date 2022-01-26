import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactDataType } from '../../development-process-registry/running-process/artifact-data';
import { OutputArtifactMapping } from '../../development-process-registry/running-process/output-artifact-mapping';

export interface OutputArtifactMappingFormValue {
  isDefinition: boolean;
  artifact?: number;
  artifactName?: string;
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class OutputArtifactMappingFormService {
  constructor(private fb: FormBuilder) {}

  createForm(
    artifacts: Artifact[],
    outputArtifacts?: OutputArtifactMapping[]
  ): FormGroup {
    const form = this.fb.group({
      outputArtifacts: this.fb.array([]),
    });
    let formGroups: FormGroup[];
    if (outputArtifacts != null) {
      formGroups = artifacts.map((artifact, index) =>
        this.createOutputArtifactMappingControl(outputArtifacts[index])
      );
    } else {
      formGroups = artifacts.map(() =>
        this.createOutputArtifactMappingControl()
      );
    }
    form.setControl('outputArtifacts', this.fb.array(formGroups));
    return form;
  }

  createOutputArtifactMappingControl(
    outputArtifact?: OutputArtifactMapping
  ): FormGroup {
    if (outputArtifact == null) {
      outputArtifact = new OutputArtifactMapping(undefined, {
        isDefinition: false,
        artifact: null,
        artifactName: null,
        data: {
          type: ArtifactDataType.STRING,
          data: '',
        },
      });
    }
    return this.fb.group(
      {
        isDefinition: this.fb.control(
          outputArtifact.isDefinition,
          Validators.required
        ),
        artifact: this.fb.control(outputArtifact.artifact),
        artifactName: this.fb.control(outputArtifact.artifactName),
        data: this.fb.control(
          outputArtifact.data.type === ArtifactDataType.STRING
            ? outputArtifact.data.data
            : ''
        ),
      },
      {
        validators: (group) => {
          if (group.get('isDefinition').value) {
            if (!group.get('artifactName').value) {
              return { requiredName: true };
            } else {
              return null;
            }
          } else {
            if (
              group.get('artifact').value === null ||
              group.get('artifact').value === undefined
            ) {
              return { requiredArtifact: true };
            } else {
              return null;
            }
          }
        },
      }
    );
  }

  get(formValue: OutputArtifactMappingFormValue[]): OutputArtifactMapping[] {
    return formValue.map((item) => {
      return new OutputArtifactMapping(undefined, {
        isDefinition: item.isDefinition,
        artifact: item.artifact,
        artifactName: item.artifactName,
        data: {
          data: item.data,
          type: ArtifactDataType.STRING,
        },
      });
    });
  }
}
