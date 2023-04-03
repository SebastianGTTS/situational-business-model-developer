import {
  ArtifactData,
  ArtifactDataEntry,
  ArtifactDataInit,
} from './artifact-data';
import { DatabaseModelPart } from '../../database/database-model-part';
import { MetaArtifactType } from '../meta-artifact-definition';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface StepArtifactInit extends DatabaseInit {
  metaArtifactType?: MetaArtifactType;
  data: ArtifactDataInit;
}

export interface StepArtifactEntry extends DatabaseEntry {
  metaArtifactType?: MetaArtifactType;
  data: ArtifactDataEntry;
}

export class StepArtifact implements StepArtifactInit, DatabaseModelPart {
  metaArtifactType?: MetaArtifactType;
  data: ArtifactData;

  constructor(
    entry: StepArtifactEntry | undefined,
    init: StepArtifactInit | undefined
  ) {
    if (entry != null) {
      this.metaArtifactType = entry.metaArtifactType;
      this.data = new ArtifactData(entry.data, undefined);
    } else if (init != null) {
      this.metaArtifactType = init.metaArtifactType;
      this.data = new ArtifactData(undefined, init.data);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): StepArtifactEntry {
    return {
      metaArtifactType: this.metaArtifactType,
      data: this.data.toDb(),
    };
  }
}
