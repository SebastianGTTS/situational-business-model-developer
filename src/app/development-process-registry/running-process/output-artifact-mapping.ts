import { ArtifactData } from './artifact-data';
import { DatabaseModelPart } from '../../database/database-model-part';

export class OutputArtifactMapping implements DatabaseModelPart {
  isDefinition: boolean;
  artifact?: number;
  artifactName?: string;
  data: ArtifactData;

  constructor(outputArtifactMapping: Partial<OutputArtifactMapping>) {
    Object.assign(this, outputArtifactMapping);
    this.data = new ArtifactData(this.data);
  }

  toDb(): any {
    return {
      isDefinition: this.isDefinition,
      artifact: this.artifact,
      artifactName: this.artifactName,
      data: this.data.toDb(),
    };
  }
}
