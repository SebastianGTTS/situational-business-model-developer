import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionEntry,
  SituationalFactorDefinitionInit,
} from './situational-factor-definition';
import { Equality } from '../../../shared/equality';
import { DatabaseModelPart } from '../../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../../database/database-entry';

export interface SituationalFactorInit extends DatabaseInit {
  factor: SituationalFactorDefinitionInit;
  value: string;
}

export interface SituationalFactorEntry extends DatabaseEntry {
  factor: SituationalFactorDefinitionEntry;
  value: string;
}

export class SituationalFactor
  implements
    SituationalFactorInit,
    Equality<SituationalFactor>,
    DatabaseModelPart
{
  factor: SituationalFactorDefinition;
  value: string;

  constructor(
    entry: SituationalFactorEntry | undefined,
    init: SituationalFactorInit | undefined
  ) {
    if (entry != null) {
      this.factor = new SituationalFactorDefinition(entry.factor, undefined);
      this.value = entry.value;
    } else if (init != null) {
      this.factor = new SituationalFactorDefinition(undefined, init.factor);
      this.value = init.value;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): SituationalFactorEntry {
    return {
      factor: this.factor.toDb(),
      value: this.value,
    };
  }

  equals(other: SituationalFactor): boolean {
    if (other == null) {
      return false;
    }
    return other.value === this.value && this.factor.equals(other.factor);
  }
}
