import {
  ArtifactData,
  ArtifactDataEntry,
  ArtifactDataInit,
} from './artifact-data';
import { DatabaseModelPart } from '../../database/database-model-part';
import { MetaModelType } from '../meta-model-definition';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface StepArtifactInit extends DatabaseInit {
  metaModelType?: MetaModelType;
  data: ArtifactDataInit;
}

export interface StepArtifactEntry extends DatabaseEntry {
  metaModelType?: MetaModelType;
  data: ArtifactDataEntry;
}

export class StepArtifact implements StepArtifactInit, DatabaseModelPart {
  metaModelType?: MetaModelType;
  data: ArtifactData;

  constructor(
    entry: StepArtifactEntry | undefined,
    init: StepArtifactInit | undefined
  ) {
    if (entry != null) {
      this.metaModelType = entry.metaModelType;
      this.data = new ArtifactData(entry.data, undefined);
    } else if (init != null) {
      this.metaModelType = init.metaModelType;
      this.data = new ArtifactData(undefined, init.data);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): StepArtifactEntry {
    return {
      metaModelType: this.metaModelType,
      data: this.data.toDb(),
    };
  }
}
