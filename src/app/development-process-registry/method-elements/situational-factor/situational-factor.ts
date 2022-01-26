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

  /**
   * Create a map from situational factors
   *
   * @param situationalFactors the situational factors
   * @returns the situational factors map factor list to name to factor value
   */
  static createMap(
    situationalFactors: (SituationalFactor | SituationalFactorEntry)[]
  ): {
    [listName: string]: { [factorName: string]: string };
  } {
    const map = {};
    situationalFactors.forEach((factor) => {
      if (!(factor.factor.list in map)) {
        map[factor.factor.list] = {};
      }
      map[factor.factor.list][factor.factor.name] = factor.value;
    });
    return map;
  }

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
