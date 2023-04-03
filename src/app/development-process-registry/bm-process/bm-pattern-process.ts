import { DevelopmentMethod } from '../development-method/development-method';
import {
  MethodDecision,
  MethodDecisionEntry,
  MethodDecisionInit,
} from './method-decision';
import { BmProcess, BmProcessEntry, BmProcessInit } from './bm-process';
import { IconInit } from '../../model/icon';

export type BmProcessDiagram = string;

export interface BmPatternProcessInit extends BmProcessInit {
  processDiagram: BmProcessDiagram;
  decisions?: { [elementId: string]: MethodDecisionInit };
}

export interface BmPatternProcessEntry extends BmProcessEntry {
  processDiagram: BmProcessDiagram;
  decisions: { [elementId: string]: MethodDecisionEntry };
}

export class BmPatternProcess extends BmProcess {
  static readonly defaultIcon: IconInit = { icon: 'bi-diagram-3' };

  processDiagram: BmProcessDiagram;

  decisions: { [elementId: string]: MethodDecision } = {};

  constructor(
    entry: BmPatternProcessEntry | undefined,
    init: BmPatternProcessInit | undefined
  ) {
    if (init != null && init.icon == null) {
      init.icon = BmPatternProcess.defaultIcon;
    }
    super(entry, init);
    let element;
    if (entry != null) {
      element = entry;
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
    this.processDiagram = element.processDiagram;
  }

  /**
   * Add a method to a node in the bpmn model
   *
   * @param id the id of the node in the bpmn model
   * @param method the method to add
   */
  addDecision(id: string, method: DevelopmentMethod): MethodDecision {
    return (this.decisions[id] = new MethodDecision(undefined, {
      method: method,
    }));
  }

  /**
   * Remove a method from a node in the bpmn model
   *
   * @param id the id of the node in the bpmn model
   */
  removeDecision(id: string): void {
    delete this.decisions[id];
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

  toDb(): BmPatternProcessEntry {
    const decisions: { [elementId: string]: MethodDecisionEntry } = {};
    Object.entries(this.decisions).forEach(([id, decision]) => {
      decisions[id] = decision.toDb();
    });
    return {
      ...super.toDb(),
      processDiagram: this.processDiagram,
      decisions,
    };
  }
}

export function isBmPatternProcess(
  bmProcess: BmProcess
): bmProcess is BmPatternProcess {
  return (bmProcess as BmPatternProcess).processDiagram != null;
}

export function isBmPatternProcessEntry(
  bmProcess: BmProcessEntry
): bmProcess is BmPatternProcessEntry {
  return (bmProcess as BmPatternProcessEntry).processDiagram != null;
}

export function isBmPatternProcessInit(
  bmProcess: BmProcessInit
): bmProcess is BmPatternProcessInit {
  return (bmProcess as BmPatternProcessInit).processDiagram != null;
}
