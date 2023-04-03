import { Injectable } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { ArtifactDataType } from '../../development-process-registry/running-process/artifact-data';
import { OutputArtifactMapping } from '../../development-process-registry/running-process/output-artifact-mapping';
import { SelectedElementOptional } from '../../development-process-registry/bm-process/element-decision';

export interface OutputArtifactMappingFormValue {
  isDefinition?: boolean;
  artifact?: number;
  artifactName?: string;
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class OutputArtifactMappingFormService {
  constructor(private fb: UntypedFormBuilder) {}

  createForm(
    artifacts: SelectedElementOptional<Artifact>[],
    outputArtifacts?: (OutputArtifactMapping | undefined)[]
  ): UntypedFormGroup {
    const form = this.fb.group({
      outputArtifacts: this.fb.array([]),
    });
    let formGroups: UntypedFormGroup[];
    if (outputArtifacts != null) {
      formGroups = artifacts.map((artifact, index) =>
        this.createOutputArtifactMappingControl(
          outputArtifacts[index],
          artifact.optional
        )
      );
    } else {
      formGroups = artifacts.map((artifact) =>
        this.createOutputArtifactMappingControl(undefined, artifact.optional)
      );
    }
    form.setControl('outputArtifacts', this.fb.array(formGroups));
    return form;
  }

  createOutputArtifactMappingControl(
    outputArtifact?: OutputArtifactMapping,
    optionalAllowed?: boolean
  ): UntypedFormGroup {
    return this.fb.group(
      {
        isDefinition: this.fb.control(
          outputArtifact
            ? outputArtifact.isDefinition
            : optionalAllowed
            ? undefined
            : true,
          optionalAllowed ? undefined : Validators.required
        ),
        artifact: this.fb.control(outputArtifact?.artifact),
        artifactName: this.fb.control(outputArtifact?.artifactName),
        data: this.fb.control(
          outputArtifact?.data.type === ArtifactDataType.STRING
            ? outputArtifact.data.data
            : ''
        ),
      },
      {
        validators: (group) => {
          if (group.get('isDefinition')?.value == null) {
            return null;
          }
          if (group.get('isDefinition')?.value) {
            if (!group.get('artifactName')?.value) {
              return { requiredName: true };
            } else {
              return null;
            }
          } else {
            if (
              group.get('artifact')?.value === null ||
              group.get('artifact')?.value === undefined
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

  get(
    formValue: OutputArtifactMappingFormValue[]
  ): (OutputArtifactMapping | undefined)[] {
    return formValue.map((item) => this.getOutputArtifactMappingControl(item));
  }

  getOutputArtifactMappingControl(
    item: OutputArtifactMappingFormValue
  ): OutputArtifactMapping | undefined {
    if (item.isDefinition == null) {
      return undefined;
    }
    return new OutputArtifactMapping(undefined, {
      isDefinition: item.isDefinition,
      artifact: item.artifact,
      artifactName: item.artifactName,
      data: {
        data: item.data,
        type: ArtifactDataType.STRING,
      },
    });
  }
}
