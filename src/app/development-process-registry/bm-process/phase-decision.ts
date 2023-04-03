import { Phase, PhaseEntry, PhaseInit } from '../phase/phase';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { DatabaseModelPart } from '../../database/database-model-part';
import {
  PhaseMethodDecision,
  PhaseMethodDecisionEntry,
  PhaseMethodDecisionInit,
} from './phase-method-decision';
import { DevelopmentMethodInit } from '../development-method/development-method';
import { MethodDecision } from './method-decision';

export interface PhaseDecisionInit extends DatabaseInit {
  phase: PhaseInit;
  decisions?: PhaseMethodDecisionInit[];
}

export interface PhaseDecisionEntry extends DatabaseEntry {
  phase: PhaseEntry;
  decisions: PhaseMethodDecisionEntry[];
}

export class PhaseDecision implements DatabaseModelPart {
  phase: Phase;
  decisions: PhaseMethodDecision[] = [];

  constructor(
    entry: PhaseDecisionEntry | undefined,
    init: PhaseDecisionInit | undefined
  ) {
    if (entry != null) {
      this.phase = new Phase(entry.phase, undefined);
      this.decisions =
        entry.decisions?.map(
          (decision) => new PhaseMethodDecision(decision, undefined, this)
        ) ?? this.decisions;
    } else if (init != null) {
      this.phase = new Phase(undefined, init.phase);
      this.decisions =
        init.decisions?.map(
          (decision) => new PhaseMethodDecision(undefined, decision, this)
        ) ?? this.decisions;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  addDecision(
    method: DevelopmentMethodInit,
    number: number
  ): PhaseMethodDecision {
    const phaseMethodDecision = new PhaseMethodDecision(
      undefined,
      {
        decision: {
          method: method,
        },
        number: number,
      },
      this
    );
    this.decisions.push(phaseMethodDecision);
    return phaseMethodDecision;
  }

  addRemovedDecision(
    decision: MethodDecision,
    number: number
  ): PhaseMethodDecision {
    const phaseMethodDecision = new PhaseMethodDecision(
      undefined,
      {
        decision: decision,
        number: number,
      },
      this
    );
    this.decisions.push(phaseMethodDecision);
    return phaseMethodDecision;
  }

  removeDecision(id: string): void {
    this.decisions = this.decisions.filter((decision) => decision.id !== id);
  }

  toDb(): PhaseDecisionEntry {
    return {
      phase: this.phase.toDb(),
      decisions: this.decisions.map((decision) => decision.toDb()),
    };
  }
}
