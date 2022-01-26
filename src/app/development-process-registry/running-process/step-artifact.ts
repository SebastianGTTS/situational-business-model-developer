import {
  ArtifactData,
  ArtifactDataEntry,
  ArtifactDataInit,
} from './artifact-data';
import {
  Artifact,
  ArtifactEntry,
  ArtifactInit,
} from '../method-elements/artifact/artifact';
import { DatabaseModelPart } from '../../database/database-model-part';
import { MetaModelType } from '../meta-model-definition';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface StepArtifactInit extends DatabaseInit {
  identifier: string;
  artifact: ArtifactInit;
  data: ArtifactDataInit;
}

export interface StepArtifactEntry extends DatabaseEntry {
  identifier: string;
  artifact: ArtifactEntry;
  data: ArtifactDataEntry;
}

export class StepArtifact implements StepArtifactInit, DatabaseModelPart {
  identifier: string;
  artifact: Artifact;
  data: ArtifactData;

  constructor(
    entry: StepArtifactEntry | undefined,
    init: StepArtifactInit | undefined
  ) {
    this.identifier = (entry ?? init).identifier;
    if (entry != null) {
      this.artifact = new Artifact(entry.artifact, undefined);
      this.data = new ArtifactData(entry.data, undefined);
    } else if (init != null) {
      this.artifact = new Artifact(undefined, init.artifact);
      this.data = new ArtifactData(undefined, init.data);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  get metaModelType(): MetaModelType {
    return this.artifact.metaModel.type;
  }

  toDb(): StepArtifactEntry {
    return {
      identifier: this.identifier,
      artifact: this.artifact.toDb(),
      data: this.data.toDb(),
    };
  }
}
