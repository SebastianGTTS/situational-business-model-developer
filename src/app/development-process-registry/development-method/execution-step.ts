import {
  ArtifactMapping,
  ArtifactMappingEntry,
  ArtifactMappingInit,
} from './artifact-mapping';
import { Equality } from '../../shared/equality';
import { equalsListOfLists } from '../../shared/utils';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface ExecutionStepInit extends DatabaseInit {
  module?: string;
  method?: string;
  predefinedInput?: any;
  outputMappings?: ArtifactMappingInit[][];
}

export interface ExecutionStepEntry extends DatabaseEntry {
  module: string;
  method: string;
  predefinedInput: any;
  outputMappings: ArtifactMappingEntry[][];
}

export class ExecutionStep
  implements ExecutionStepInit, Equality<ExecutionStep>, DatabaseModelPart
{
  module: string;
  method: string;
  predefinedInput: any;
  outputMappings: ArtifactMapping[][] = [];

  constructor(
    entry: ExecutionStepEntry | undefined,
    init: ExecutionStepInit | undefined
  ) {
    const element = entry ?? init;
    this.module = element.module;
    this.method = element.method;
    this.predefinedInput = element.predefinedInput;
    if (entry != null) {
      this.outputMappings =
        entry.outputMappings?.map((mappings) =>
          mappings.map((mapping) => new ArtifactMapping(mapping, undefined))
        ) ?? this.outputMappings;
    } else if (init != null) {
      this.outputMappings =
        init.outputMappings?.map((mappings) =>
          mappings.map((mapping) => new ArtifactMapping(undefined, mapping))
        ) ?? this.outputMappings;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): ExecutionStepEntry {
    return {
      module: this.module,
      method: this.method,
      predefinedInput: this.predefinedInput,
      outputMappings: this.outputMappings.map((mappings) =>
        mappings.map((mapping) => mapping.toDb())
      ),
    };
  }

  equals(other: ExecutionStep): boolean {
    if (other == null) {
      return false;
    }
    return (
      this.module === other.module &&
      this.method === other.method &&
      equalsListOfLists(this.outputMappings, other.outputMappings)
    );
  }
}
