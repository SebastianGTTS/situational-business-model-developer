import { ArtifactData } from './artifact-data';
import { Artifact } from '../method-elements/artifact/artifact';

export class StepArtifact {

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

  toPouchDb() {
    return {
      identifier: this.identifier,
      artifact: this.artifact.toPouchDb(),
      data: this.data.toPouchDb(),
    };
  }

}
