import {
  ArtifactData,
  ArtifactDataEntry,
  ArtifactDataInit,
} from './artifact-data';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface ArtifactVersionInit extends DatabaseInit {
  time?: number;
  createdBy: 'manual' | 'imported' | string;
  importName?: string;
  executedBy: string;
  data?: ArtifactDataInit;
}

export interface ArtifactVersionEntry extends DatabaseEntry {
  time: number;
  createdBy: 'manual' | 'imported' | string;
  importName?: string;
  executedBy: string;
  data: ArtifactDataEntry;
}

export class ArtifactVersion implements DatabaseModelPart {
  time: number;
  createdBy: 'manual' | 'imported' | string;
  importName?: string;
  executedBy: string;
  data: ArtifactData;

  constructor(
    entry: ArtifactVersionEntry | undefined,
    init: ArtifactVersionInit | undefined
  ) {
    const element = entry ?? init;
    this.time = element.time ?? Date.now();
    this.createdBy = element.createdBy;
    this.importName = element.importName;
    this.executedBy = element.executedBy;
    if (entry != null) {
      this.data = new ArtifactData(entry.data, undefined);
    } else if (init != null) {
      this.data = new ArtifactData(undefined, init.data ?? {});
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): ArtifactVersionEntry {
    return {
      time: this.time,
      createdBy: this.createdBy,
      importName: this.importName,
      executedBy: this.executedBy,
      data: this.data.toDb(),
    };
  }
}
