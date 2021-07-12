export class ArtifactMapping {

  output: boolean;
  step?: number;
  group?: number;
  artifact: number;

  constructor(artifactMapping: Partial<ArtifactMapping>) {
    Object.assign(this, artifactMapping);
  }

  toPouchDb(): any {
    const pouchDb: any = {
      output: this.output,
    };
    if (!this.output) {
      pouchDb.step = this.step;
    } else {
      pouchDb.group = this.group;
    }
    pouchDb.artifact = this.artifact;
    return pouchDb;
  }

}
