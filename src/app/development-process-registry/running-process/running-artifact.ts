import {
  Artifact,
  ArtifactEntry,
  ArtifactInit,
} from '../method-elements/artifact/artifact';
import {
  ArtifactVersion,
  ArtifactVersionEntry,
  ArtifactVersionInit,
} from './artifact-version';
import { DatabaseModel } from '../../database/database-model';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';

export interface RunningArtifactInit extends DatabaseRootInit {
  identifier: string;
  artifact: ArtifactInit;
  versions?: ArtifactVersionInit[];
}

export interface RunningArtifactEntry extends DatabaseRootEntry {
  identifier: string;
  artifact: ArtifactEntry;
  versions: ArtifactVersionEntry[];
}

export class RunningArtifact
  extends DatabaseModel
  implements RunningArtifactInit
{
  static readonly typeName = 'RunningArtifact';

  identifier: string;
  artifact: Artifact;
  versions: ArtifactVersion[] = [];

  constructor(
    entry: RunningArtifactEntry | undefined,
    init: RunningArtifactInit | undefined
  ) {
    super(entry, init, RunningArtifact.typeName);
    const element = entry ?? init;
    this.identifier = element.identifier;
    if (entry != null) {
      this.artifact = new Artifact(entry.artifact, undefined);
      this.versions =
        entry.versions?.map(
          (version) => new ArtifactVersion(version, undefined)
        ) ?? this.versions;
    } else {
      this.artifact = new Artifact(undefined, init.artifact);
      this.versions =
        init.versions?.map(
          (version) => new ArtifactVersion(undefined, version)
        ) ?? this.versions;
    }
  }

  addVersion(version: ArtifactVersionInit): void {
    this.versions.push(new ArtifactVersion(undefined, version));
  }

  toDb(): RunningArtifactEntry {
    return {
      ...super.toDb(),
      identifier: this.identifier,
      artifact: this.artifact.toDb(),
      versions: this.versions.map((version) => version.toDb()),
    };
  }
}
