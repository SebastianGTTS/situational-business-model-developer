import { DatabaseModelPart } from '../../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';

export interface TraceInit extends DatabaseInit {
  expertFeatureIdMap?: { [expertModelFeatureId: string]: string };
}

export interface TraceEntry extends DatabaseEntry {
  expertFeatureIdMap: { [expertModelFeatureId: string]: string };
}

export class Trace implements DatabaseModelPart {
  // stored
  expertFeatureIdMap: { [expertModelFeatureId: string]: string } = {};

  constructor(entry: TraceEntry | undefined, init: TraceInit | undefined) {
    const element = entry ?? init;
    this.expertFeatureIdMap =
      element?.expertFeatureIdMap ?? this.expertFeatureIdMap;
  }

  addTrace(expertFeatureId: string, companyFeatureId: string): void {
    this.expertFeatureIdMap[expertFeatureId] = companyFeatureId;
  }

  deleteTrace(expertFeatureId: string): void {
    delete this.expertFeatureIdMap[expertFeatureId];
  }

  toDb(): TraceEntry {
    return {
      expertFeatureIdMap: this.expertFeatureIdMap,
    };
  }
}
