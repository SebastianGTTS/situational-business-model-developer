import { ArtifactData } from './artifact-data';
import { Artifact } from '../method-elements/artifact/artifact';
import { DatabaseModelPart } from '../../database/database-model-part';

export class StepArtifact implements DatabaseModelPart {
  identifier: string;
  artifact: Artifact;
  data: ArtifactData;

  constructor(stepArtifact: Partial<StepArtifact>) {
    Object.assign(this, stepArtifact);
    this.artifact = new Artifact(this.artifact);
    this.data = new ArtifactData(this.data);
  }

  get metaModelType(): any {
    return this.artifact.metaModel.type;
  }

  toDb(): any {
    return {
      identifier: this.identifier,
      artifact: this.artifact.toDb(),
      data: this.data.toDb(),
    };
  }
}
