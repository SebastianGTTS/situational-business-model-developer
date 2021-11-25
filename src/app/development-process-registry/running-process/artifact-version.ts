import { ArtifactData } from './artifact-data';
import { DatabaseModelPart } from '../../database/database-model-part';

export class ArtifactVersion implements DatabaseModelPart {
  time: number;
  createdBy: 'manual' | 'imported' | string;
  importName: string;
  executedBy: string;
  data: ArtifactData;

  constructor(artifactVersion: Partial<ArtifactVersion>) {
    Object.assign(this, artifactVersion);
    this.data = new ArtifactData(this.data);
    if (this.time === undefined) {
      this.time = Date.now();
    }
  }

  toDb(): any {
    return {
      time: this.time,
      createdBy: this.createdBy,
      importName: this.importName,
      executedBy: this.executedBy,
      data: this.data.toDb(),
    };
  }
}
