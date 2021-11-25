import {
  SituationalFactorDefinition,
  SituationalFactorDefinitionEntry,
} from './situational-factor-definition';
import { Equality } from '../../../shared/equality';
import { DatabaseModelPart } from '../../../database/database-model-part';
import { DatabaseEntry } from '../../../database/database-entry';

export interface SituationalFactorEntry extends DatabaseEntry {
  factor: SituationalFactorDefinitionEntry;
  value: string;
}

export class SituationalFactor
  implements Equality<SituationalFactor>, DatabaseModelPart
{
  factor: SituationalFactorDefinition;
  value: string;

  /**
   * Create a map from situational factors
   *
   * @param situationalFactors the situational factors
   * @returns the situational factors map factor list to name to factor value
   */
  static createMap(situationalFactors: SituationalFactor[]): {
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

  constructor(situationalFactor: Partial<SituationalFactor>) {
    Object.assign(this, situationalFactor);
    this.factor = new SituationalFactorDefinition(this.factor);
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
