import { SituationalFactorDefinition } from './situational-factor-definition';

export class SituationalFactor {

  factor: SituationalFactorDefinition;
  value: string;

  /**
   * Create a map from situational factors
   *
   * @param situationalFactors the situational factors
   * @returns the situational factors map factor list to name to factor value
   */
  static createMap(situationalFactors: SituationalFactor[]): { [listName: string]: { [factorName: string]: string } } {
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

  toPouchDb(): any {
    return {
      factor: this.factor.toPouchDb(),
      value: this.value,
    };
  }

}
