import { Equality } from '../../shared/equality';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface ArtifactMappingInit extends DatabaseInit {
  output: boolean;
  step?: number;
  group?: number;
  artifact: number;
}

export interface ArtifactMappingEntry extends DatabaseEntry {
  output: boolean;
  step?: number;
  group?: number;
  artifact: number;
}

export type ArtifactStepMapping = ArtifactMapping & {
  output: false;
  step: number;
  group: undefined;
};
export type ArtifactOutputMapping = ArtifactMapping & {
  output: true;
  step: undefined;
  group: number;
};

export class ArtifactMapping
  implements ArtifactMappingInit, Equality<ArtifactMapping>, DatabaseModelPart
{
  output: boolean;
  step?: number;
  group?: number;
  artifact: number;

  constructor(
    entry: ArtifactMappingEntry | undefined,
    init: ArtifactMappingInit | undefined
  ) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.output = element.output;
    this.step = element.step;
    this.group = element.group;
    this.artifact = element.artifact;
  }

  isStepMapping(): this is ArtifactStepMapping {
    return !this.output && this.step != null;
  }

  isOutputMapping(): this is ArtifactOutputMapping {
    return this.output && this.group != null;
  }

  toDb(): ArtifactMappingEntry {
    const pouchDb: ArtifactMappingEntry = {
      artifact: this.artifact,
      output: this.output,
    };
    if (!this.output) {
      pouchDb.step = this.step;
    } else {
      pouchDb.group = this.group;
    }
    return pouchDb;
  }

  equals(other: ArtifactMapping): boolean {
    if (other == null || this.output !== other.output) {
      return false;
    }
    if (this.output) {
      return this.group === other.group && this.artifact === other.artifact;
    } else {
      return this.step === other.step && this.artifact === other.artifact;
    }
  }
}
