import { Artifact } from '../method-elements/artifact/artifact';
import { ArtifactVersion } from './artifact-version';

export class RunningArtifact {

  identifier: string;
  artifact: Artifact;
  versions: ArtifactVersion[] = [];

  constructor(runningArtifact: Partial<RunningArtifact>) {
    Object.assign(this, runningArtifact);
    this.artifact = new Artifact(this.artifact);
    this.versions = this.versions.map((version) => new ArtifactVersion(version));
  }

  addVersion(version: Partial<ArtifactVersion>) {
    this.versions.push(new ArtifactVersion(version));
  }

  toPouchDb(): any {
    return {
      identifier: this.identifier,
      artifact: this.artifact.toPouchDb(),
      versions: this.versions.map((version) => version.toPouchDb()),
    };
  }

}
