import {
  ArtifactMapping,
  ArtifactMappingEntry,
  ArtifactMappingInit,
} from './artifact-mapping';
import { Equality } from '../../shared/equality';
import { equalsListOfLists } from '../../shared/utils';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { PredefinedInput } from '../module-api/module-method';

export interface MethodExecutionStepInit extends DatabaseInit {
  module: string;
  method: string;
  predefinedInput?: PredefinedInput;
  outputMappings?: ArtifactMappingInit[][];
}

export interface MethodExecutionStepEntry extends DatabaseEntry {
  module: string;
  method: string;
  predefinedInput?: PredefinedInput;
  outputMappings: ArtifactMappingEntry[][];
}

export class MethodExecutionStep
  implements
    MethodExecutionStepInit,
    Equality<MethodExecutionStep>,
    DatabaseModelPart
{
  module: string;
  method: string;
  predefinedInput?: PredefinedInput;
  outputMappings: ArtifactMapping[][] = [];

  constructor(
    entry: MethodExecutionStepEntry | undefined,
    init: MethodExecutionStepInit | undefined
  ) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
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
    }
  }

  toDb(): MethodExecutionStepEntry {
    return {
      module: this.module,
      method: this.method,
      predefinedInput: this.predefinedInput,
      outputMappings: this.outputMappings.map((mappings) =>
        mappings.map((mapping) => mapping.toDb())
      ),
    };
  }

  equals(other: MethodExecutionStep): boolean {
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
