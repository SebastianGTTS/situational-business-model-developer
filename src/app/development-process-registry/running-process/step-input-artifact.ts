import {
  StepArtifact,
  StepArtifactEntry,
  StepArtifactInit,
} from './step-artifact';
import {
  Artifact,
  ArtifactEntry,
  ArtifactInit,
} from '../method-elements/artifact/artifact';

export interface StepInputArtifactInit extends StepArtifactInit {
  identifier: string;
  artifact: ArtifactInit;
  versionInfo: {
    number: number;
    time: number;
    createdBy: string;
  };
}

export interface StepInputArtifactEntry extends StepArtifactEntry {
  identifier: string;
  artifact: ArtifactEntry;
  versionInfo: {
    number: number;
    time: number;
    createdBy: string;
  };
}

export class StepInputArtifact
  extends StepArtifact
  implements StepInputArtifactInit
{
  identifier: string;
  artifact: Artifact;
  versionInfo: {
    number: number;
    time: number;
    createdBy: string;
  };

  constructor(
    entry: StepInputArtifactEntry | undefined,
    init: StepInputArtifactInit | undefined
  ) {
    super(entry, init);
    if (entry != null) {
      this.identifier = entry.identifier;
      this.versionInfo = entry.versionInfo;
      this.artifact = new Artifact(entry.artifact, undefined);
    } else if (init != null) {
      this.identifier = init.identifier;
      this.versionInfo = init.versionInfo;
      this.artifact = new Artifact(undefined, init.artifact);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): StepInputArtifactEntry {
    return {
      ...super.toDb(),
      identifier: this.identifier,
      artifact: this.artifact.toDb(),
      versionInfo: this.versionInfo,
    };
  }
}
