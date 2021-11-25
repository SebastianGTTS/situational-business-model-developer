import { Artifact } from '../method-elements/artifact/artifact';
import { ArtifactVersion } from './artifact-version';
import { DatabaseModel } from '../../database/database-model';

export class RunningArtifact extends DatabaseModel {
  static readonly typeName = 'RunningArtifact';

  identifier: string;
  artifact: Artifact;
  versions: ArtifactVersion[] = [];

  constructor(runningArtifact: Partial<RunningArtifact>) {
    super(RunningArtifact.typeName);
    this.update(runningArtifact);
  }

  addVersion(version: Partial<ArtifactVersion>) {
    this.versions.push(new ArtifactVersion(version));
  }

  update(runningArtifact: Partial<RunningArtifact>) {
    Object.assign(this, runningArtifact);
    this.artifact = new Artifact(this.artifact);
    this.versions = this.versions.map(
      (version) => new ArtifactVersion(version)
    );
  }

  toDb(): any {
    return {
      ...super.toDb(),
      identifier: this.identifier,
      artifact: this.artifact.toDb(),
      versions: this.versions.map((version) => version.toDb()),
    };
  }
}
