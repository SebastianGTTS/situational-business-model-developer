import { DatabaseModel } from '../../database/database-model';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../method-elements/situational-factor/situational-factor';
import { DevelopmentMethod } from '../development-method/development-method';
import { Decision, DecisionEntry, DecisionInit } from './decision';
import { Domain, DomainEntry, DomainInit } from '../knowledge/domain';
import { Selection, SelectionEntry } from '../development-method/selection';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';

export interface BmProcessInit extends DatabaseRootInit {
  initial?: boolean;
  name: string;
  processDiagram?: string;
  domains?: DomainInit[];
  situationalFactors?: Selection<SituationalFactor>[];
  decisions?: { [elementId: string]: Decision };
}

export interface BmProcessEntry extends DatabaseRootEntry {
  initial: boolean;
  name: string;
  processDiagram: string;
  domains: DomainEntry[];
  situationalFactors: SelectionEntry<SituationalFactorEntry>[];
  decisions: { [elementId: string]: DecisionEntry };
}

export class BmProcess extends DatabaseModel {
  static readonly typeName = 'BmProcess';

  initial = true;

  name: string;

  processDiagram: string;

  domains: Domain[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  decisions: { [elementId: string]: Decision } = {};

  constructor(
    entry: BmProcessEntry | undefined,
    init: BmProcessInit | undefined
  ) {
    super(entry, init, BmProcess.typeName);
    const element = entry ?? init;
    this.initial = element.initial ?? this.initial;
    this.name = element.name;
    this.processDiagram = element.processDiagram;
    if (entry != null) {
      this.domains =
        entry.domains?.map((domain) => new Domain(domain, undefined)) ??
        this.domains;
      this.situationalFactors =
        entry.situationalFactors?.map(
          (selection) =>
            new Selection<SituationalFactor>(
              selection,
              undefined,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
      if (entry.decisions) {
        Object.entries(entry.decisions).forEach(
          ([elementId, decision]) =>
            (this.decisions[elementId] = new Decision(decision, undefined))
        );
      }
    } else if (init != null) {
      this.domains =
        init.domains?.map((domain) => new Domain(undefined, domain)) ??
        this.domains;
      this.situationalFactors =
        init.situationalFactors?.map(
          (selection) =>
            new Selection<SituationalFactor>(
              undefined,
              selection,
              SituationalFactor
            )
        ) ?? this.situationalFactors;
      if (init.decisions) {
        Object.entries(init.decisions).forEach(
          ([elementId, decision]) =>
            (this.decisions[elementId] = new Decision(undefined, decision))
        );
      }
    }
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

  addDecision(id: string, method: DevelopmentMethod): void {
    this.decisions[id] = new Decision(undefined, {
      method: method,
      stakeholders: {},
      inputArtifacts: {},
      outputArtifacts: {},
      tools: {},
      stepDecisions: method.executionSteps.map(() => null),
    });
  }

  removeDecision(id: string): void {
    delete this.decisions[id];
  }

  /**
   * Finish the initialization process of a bm process, i.e.,
   * the context selection is finished.
   */
  finishInitialization(): void {
    this.initial = false;
  }

  /**
   * Update the decisions of this bm process.
   *
   * @param decisions the new decisions
   */
  updateDecisions(decisions: { [elementId: string]: DecisionInit }): void {
    this.decisions = {};
    Object.entries(decisions).forEach(
      ([elementId, decision]) =>
        (this.decisions[elementId] = new Decision(undefined, decision))
    );
  }

  toDb(): BmProcessEntry {
    const decisions: { [elementId: string]: DecisionEntry } = {};
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
