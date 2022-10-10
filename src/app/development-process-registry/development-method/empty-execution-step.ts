import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { Equality } from '../../shared/equality';
import { DatabaseModelPart } from '../../database/database-model-part';

export interface EmptyExecutionStepInit extends DatabaseInit {
  name: string;
  description: string;
}

export interface EmptyExecutionStepEntry extends DatabaseEntry {
  name: string;
  description: string;
}

export class EmptyExecutionStep
  implements
    EmptyExecutionStepInit,
    Equality<EmptyExecutionStep>,
    DatabaseModelPart
{
  name: string;
  description: string;

  constructor(
    entry: EmptyExecutionStepEntry | undefined,
    init: EmptyExecutionStepInit | undefined
  ) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.name = element.name;
    this.description = element.description;
  }

  equals(other: EmptyExecutionStep): boolean {
    if (other == null) {
      return false;
    }
    return this.name === other.name && this.description === other.description;
  }

  toDb(): EmptyExecutionStepEntry {
    return {
      name: this.name,
      description: this.description,
    };
  }
}
