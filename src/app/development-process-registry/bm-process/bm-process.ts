import { DatabaseModel } from '../../database/database-model';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { DevelopmentMethod } from '../development-method/development-method';
import { Decision, GroupSelection } from './decision';
import { Stakeholder } from '../method-elements/stakeholder/stakeholder';
import { Artifact } from '../method-elements/artifact/artifact';
import { Domain } from '../knowledge/domain';
import { Selection } from '../development-method/selection';

export class BmProcess extends DatabaseModel {
  static readonly typeName = 'BmProcess';

  initial = true;

  name: string;

  processDiagram: string;

  domains: Domain[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  decisions: { [elementId: string]: Decision } = {};

  constructor(bmProcess: Partial<BmProcess>) {
    super(BmProcess.typeName);
    this.update(bmProcess);
  }

  /**
   * Update this bm process with new values
   *
   * @param bmProcess the new values of this bm process (values will be copied to the current object)
   */
  update(bmProcess: Partial<BmProcess>) {
    Object.assign(this, bmProcess);
    this.domains = this.domains.map((domain) => new Domain(domain));
    this.situationalFactors = this.situationalFactors.map(
      (selection) =>
        new Selection(selection, (element) => new SituationalFactor(element))
    );
    const decisions: { [elementId: string]: Decision } = {};
    Object.entries(this.decisions).forEach(([id, decision]) => {
      decisions[id] = new Decision(decision);
    });
    this.decisions = decisions;
  }

  checkMatchByFactor(factorMap: {
    [listName: string]: { [factorName: string]: string };
  }): {
    missing: SituationalFactor[];
    low: SituationalFactor[];
    incorrect: SituationalFactor[];
  } {
    const result: {
      missing: SituationalFactor[];
      low: SituationalFactor[];
      incorrect: SituationalFactor[];
    } = {
      missing: [],
      low: [],
      incorrect: [],
    };
    this.situationalFactors
      .map((element) => element.element)
      .forEach((factor) => {
        if (
          factor.factor.list in factorMap &&
          factor.factor.name in factorMap[factor.factor.list]
        ) {
          const value = factorMap[factor.factor.list][factor.factor.name];
          if (factor.value !== value) {
            if (factor.factor.ordered) {
              if (
                factor.factor.values.indexOf(factor.value) >
                factor.factor.values.indexOf(value)
              ) {
                result.low.push(factor);
              }
            } else {
              result.incorrect.push(factor);
            }
          }
        } else {
          result.missing.push(factor);
        }
      });
    return result;
  }

  /**
   * Check for match between context and given factors
   *
   * @param factorMap the given factors that should fulfill the context of this process
   * @returns factor names that are missing, have too low or incorrect values
   */
  checkMatch(factorMap: {
    [listName: string]: { [factorName: string]: string };
  }): { missing: string[]; low: string[]; incorrect: string[] } {
    const result = this.checkMatchByFactor(factorMap);
    return {
      low: result.low.map((factor) => factor.factor.name),
      incorrect: result.incorrect.map((factor) => factor.factor.name),
      missing: result.missing.map((factor) => factor.factor.name),
    };
  }

  addDecision(id: string, method: DevelopmentMethod) {
    this.decisions[id] = new Decision({
      method,
      stakeholders: new GroupSelection<Stakeholder>({}, null),
      inputArtifacts: new GroupSelection<Artifact>({}, null),
      outputArtifacts: new GroupSelection<Artifact>({}, null),
      tools: null,
      stepDecisions: method.executionSteps.map(() => null),
    });
  }

  removeDecision(id: string) {
    delete this.decisions[id];
  }

  toDb(): any {
    const decisions: { [elementId: string]: Decision } = {};
    Object.entries(this.decisions).forEach(([id, decision]) => {
      decisions[id] = decision.toDb();
    });
    return {
      ...super.toDb(),
      initial: this.initial,
      name: this.name,
      processDiagram: this.processDiagram,
      domains: this.domains.map((domain) => domain.toDb()),
      situationalFactors: this.situationalFactors.map((selection) =>
        selection.toDb()
      ),
      decisions,
    };
  }
}
