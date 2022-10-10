import {
  Artifact,
  ArtifactEntry,
  ArtifactInit,
} from '../method-elements/artifact/artifact';
import {
  ArtifactVersion,
  ArtifactVersionEntry,
  ArtifactVersionId,
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
    if (entry != null) {
      this.identifier = entry.identifier;
      this.artifact = new Artifact(entry.artifact, undefined);
      this.versions =
        entry.versions?.map(
          (version) => new ArtifactVersion(version, undefined)
        ) ?? this.versions;
    } else if (init != null) {
      this.identifier = init.identifier;
      this.artifact = new Artifact(undefined, init.artifact);
      this.versions =
        init.versions?.map(
          (version) => new ArtifactVersion(undefined, version)
        ) ?? this.versions;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  addVersion(version: ArtifactVersionInit): void {
    this.versions.push(new ArtifactVersion(undefined, version));
  }

  /**
   * Get an artifact version by a versionId
   *
   * @param versionId
   */
  getVersion(versionId: ArtifactVersionId): ArtifactVersion | undefined {
    return this.versions.find((version) => version.id === versionId);
  }

  /**
   * Get the version id of an artifact version, starting with 0
   *
   * @param version
   */
  getVersionNumber(version: ArtifactVersion): number {
    const versionNumber = this.versions.indexOf(version);
    if (versionNumber === -1) {
      throw new Error('Artifact and version do not match');
    }
    return versionNumber;
  }

  getLatestVersion(): ArtifactVersion | undefined {
    if (this.versions.length === 0) {
      return undefined;
    }
    return this.versions[this.versions.length - 1];
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
