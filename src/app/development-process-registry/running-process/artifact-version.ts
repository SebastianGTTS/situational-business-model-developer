import { ArtifactData } from './artifact-data';

export class ArtifactVersion {

  time: number;
  createdBy: 'manual' | string;
  executedBy: string;
  data: ArtifactData;

  constructor(artifactVersion: Partial<ArtifactVersion>) {
    Object.assign(this, artifactVersion);
    this.data = new ArtifactData(this.data);
    if (this.time === undefined) {
      this.time = Date.now();
    }
  }

  toPouchDb(): any {
    return {
      time: this.time,
      createdBy: this.createdBy,
      executedBy: this.executedBy,
      data: this.data.toPouchDb(),
    };
  }

}
