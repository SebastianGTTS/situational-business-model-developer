import {
  ArtifactData,
  ArtifactDataEntry,
  ArtifactDataInit,
} from './artifact-data';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { v4 as uuidv4 } from 'uuid';

export type ArtifactVersionId = string;
type CreatedBy = 'manual' | 'added' | 'imported' | string;

export interface ArtifactVersionInit extends DatabaseInit {
  id?: ArtifactVersionId;
  time?: number;
  createdBy: CreatedBy;
  importName?: string;
  executedBy?: string;
  data: ArtifactDataInit;
  editing?: boolean;
}

export interface ArtifactVersionEntry extends DatabaseEntry {
  id: ArtifactVersionId;
  time: number;
  createdBy: CreatedBy;
  importName?: string;
  executedBy?: string;
  data: ArtifactDataEntry;
  editing: boolean;
}

export class ArtifactVersion implements DatabaseModelPart {
  id: ArtifactVersionId;
  time: number;
  createdBy: CreatedBy;
  importName?: string;
  executedBy?: string;
  data: ArtifactData;
  editing = false;

  constructor(
    entry: ArtifactVersionEntry | undefined,
    init: ArtifactVersionInit | undefined
  ) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.id = element.id ?? uuidv4();
    this.time = element.time ?? Date.now();
    this.createdBy = element.createdBy;
    this.importName = element.importName;
    this.executedBy = element.executedBy;
    this.editing = element.editing ?? this.editing;
    if (entry != null) {
      this.data = new ArtifactData(entry.data, undefined);
    } else if (init != null) {
      this.data = new ArtifactData(undefined, init.data);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): ArtifactVersionEntry {
    return {
      id: this.id,
      time: this.time,
      createdBy: this.createdBy,
      importName: this.importName,
      executedBy: this.executedBy,
      data: this.data.toDb(),
      editing: this.editing,
    };
  }
}
