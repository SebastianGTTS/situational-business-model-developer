import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';
import { DatabaseModelPart } from '../../../database/database-model-part';

export interface MappingInit extends DatabaseInit {
  experimentDefinitionId: string;
  experimentId: string;
  hypothesisId: string;
  metric: string;
}

export interface MappingEntry extends DatabaseEntry {
  experimentDefinitionId: string;
  experimentId: string;
  hypothesisId: string;
  metric: string;
}

export class Mapping implements MappingInit, DatabaseModelPart {
  // stored
  experimentDefinitionId: string;
  experimentId: string;
  hypothesisId: string;
  metric: string;

  constructor(entry: MappingEntry | undefined, init: MappingInit | undefined) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    // TODO maybe map to concrete objects instead of only ids
    this.experimentDefinitionId = element.experimentDefinitionId;
    this.experimentId = element.experimentId;
    this.hypothesisId = element.hypothesisId;
    this.metric = element.metric;
  }

  toDb(): MappingEntry {
    return {
      experimentDefinitionId: this.experimentDefinitionId,
      experimentId: this.experimentId,
      hypothesisId: this.hypothesisId,
      metric: this.metric,
    };
  }
}
