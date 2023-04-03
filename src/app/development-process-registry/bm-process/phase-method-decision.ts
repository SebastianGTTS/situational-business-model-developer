import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { DatabaseModelPart } from '../../database/database-model-part';
import {
  MethodDecision,
  MethodDecisionEntry,
  MethodDecisionInit,
} from './method-decision';
import { v4 as uuidv4 } from 'uuid';
import { PhaseDecision } from './phase-decision';

export interface PhaseMethodDecisionInit extends DatabaseInit {
  id?: string;
  decision: MethodDecisionInit;
  number?: number;
}

export interface PhaseMethodDecisionEntry extends DatabaseEntry {
  id: string;
  decision: MethodDecisionEntry;
  number?: number;
}

export class PhaseMethodDecision
  implements DatabaseModelPart, PhaseMethodDecisionInit
{
  id: string;
  decision: MethodDecision;
  number?: number;

  constructor(
    entry: PhaseMethodDecisionEntry | undefined,
    init: PhaseMethodDecisionInit | undefined,
    readonly phaseDecision: Readonly<PhaseDecision>
  ) {
    let element;
    if (entry != null) {
      element = entry;
      this.decision = new MethodDecision(entry.decision, undefined);
    } else if (init != null) {
      element = init;
      this.decision = new MethodDecision(undefined, init.decision);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.id = element.id ?? uuidv4();
    this.number = element.number;
  }

  /**
   * Update the enaction number.
   *
   * @param number the new number of this decision
   */
  updateNumber(number: number): void {
    this.number = number;
  }

  /**
   * Whether the decision fulfills all constraints.
   */
  isComplete(): boolean {
    return this.decision.isComplete() && this.number != null;
  }

  toDb(): PhaseMethodDecisionEntry {
    return {
      id: this.id,
      decision: this.decision.toDb(),
      number: this.number,
    };
  }
}
