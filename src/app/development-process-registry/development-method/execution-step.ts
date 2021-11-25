import { ArtifactMapping, ArtifactMappingEntry } from './artifact-mapping';
import { Equality } from '../../shared/equality';
import { equalsListOfLists } from '../../shared/utils';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry } from '../../database/database-entry';

export interface ExecutionStepEntry extends DatabaseEntry {
  module: string;
  method: string;
  predefinedInput: any;
  outputMappings: ArtifactMappingEntry[][];
}

export class ExecutionStep
  implements Equality<ExecutionStep>, DatabaseModelPart
{
  module: string;
  method: string;
  predefinedInput: any;
  outputMappings: ArtifactMapping[][] = [];

  constructor(executionStep: Partial<ExecutionStep>) {
    Object.assign(this, executionStep);
    this.outputMappings = this.outputMappings.map((mappings) =>
      mappings.map((mapping) => new ArtifactMapping(mapping))
    );
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
