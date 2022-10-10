import {
  StepArtifact,
  StepArtifactEntry,
  StepArtifactInit,
} from './step-artifact';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface StepInit extends DatabaseInit {
  inputArtifacts?: StepArtifactInit[];
  outputArtifacts?: StepArtifactInit[];
}

export interface StepEntry extends DatabaseEntry {
  inputArtifacts?: StepArtifactEntry[];
  outputArtifacts?: StepArtifactEntry[];
}

export class Step implements StepInit, DatabaseModelPart {
  inputArtifacts?: StepArtifact[];
  outputArtifacts?: StepArtifact[];

  constructor(entry: StepEntry | undefined, init: StepInit | undefined) {
    if (entry != null) {
      this.inputArtifacts =
        entry.inputArtifacts?.map(
          (artifact) => new StepArtifact(artifact, undefined)
        ) ?? this.inputArtifacts;
      this.outputArtifacts =
        entry.outputArtifacts?.map(
          (artifact) => new StepArtifact(artifact, undefined)
        ) ?? this.outputArtifacts;
    } else if (init != null) {
      this.inputArtifacts =
        init.inputArtifacts?.map(
          (artifact) => new StepArtifact(undefined, artifact)
        ) ?? this.inputArtifacts;
      this.outputArtifacts =
        init.outputArtifacts?.map(
          (artifact) => new StepArtifact(undefined, artifact)
        ) ?? this.outputArtifacts;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  finish(output: StepArtifact[]): void {
    this.outputArtifacts = output;
  }

  toDb(): StepEntry {
    return {
      inputArtifacts: this.inputArtifacts
        ? this.inputArtifacts.map((artifact) => artifact.toDb())
        : undefined,
      outputArtifacts: this.outputArtifacts
        ? this.outputArtifacts.map((artifact) => artifact.toDb())
        : undefined,
    };
  }
}
