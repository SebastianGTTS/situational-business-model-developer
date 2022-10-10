import { DatabaseModel } from '../../database/database-model';
import {
  SituationalFactor,
  SituationalFactorEntry,
} from '../method-elements/situational-factor/situational-factor';
import { DevelopmentMethod } from '../development-method/development-method';
import { Domain, DomainEntry, DomainInit } from '../knowledge/domain';
import { Selection, SelectionEntry } from '../development-method/selection';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';
import {
  MethodDecision,
  MethodDecisionEntry,
  MethodDecisionInit,
} from './method-decision';

export type BmProcessDiagram = string;

export interface BmProcessInit extends DatabaseRootInit {
  initial?: boolean;
  name: string;
  processDiagram: BmProcessDiagram;
  domains?: DomainInit[];
  situationalFactors?: Selection<SituationalFactor>[];
  decisions?: { [elementId: string]: MethodDecisionInit };
}

export interface BmProcessEntry extends DatabaseRootEntry {
  initial: boolean;
  name: string;
  processDiagram: BmProcessDiagram;
  domains: DomainEntry[];
  situationalFactors: SelectionEntry<SituationalFactorEntry>[];
  decisions: { [elementId: string]: MethodDecisionEntry };
}

export class BmProcess extends DatabaseModel {
  static readonly typeName = 'BmProcess';

  initial = true;

  name: string;

  processDiagram: BmProcessDiagram;

  domains: Domain[] = [];
  situationalFactors: Selection<SituationalFactor>[] = [];

  decisions: { [elementId: string]: MethodDecision } = {};

  constructor(
    entry: BmProcessEntry | undefined,
    init: BmProcessInit | undefined
  ) {
    super(entry, init, BmProcess.typeName);
    let element;
    if (entry != null) {
      element = entry;
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
            (this.decisions[elementId] = new MethodDecision(
              decision,
              undefined
            ))
        );
      }
    } else if (init != null) {
      element = init;
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
            (this.decisions[elementId] = new MethodDecision(
              undefined,
              decision
            ))
        );
      }
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.initial = element.initial ?? this.initial;
    this.name = element.name;
    this.processDiagram = element.processDiagram;
  }

  addDecision(id: string, method: DevelopmentMethod): void {
    this.decisions[id] = new MethodDecision(undefined, {
      method: method,
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
  updateDecisions(decisions: {
    [elementId: string]: MethodDecisionInit;
  }): void {
    this.decisions = {};
    Object.entries(decisions).forEach(
      ([elementId, decision]) =>
        (this.decisions[elementId] = new MethodDecision(undefined, decision))
    );
  }

  /**
   * Checks whether all method decisions are correctly filled out, except for the step decisions.
   */
  isComplete(): boolean {
    return Object.values(this.decisions).every((decision) =>
      decision.isComplete()
    );
  }

  toDb(): BmProcessEntry {
    const decisions: { [elementId: string]: MethodDecisionEntry } = {};
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
