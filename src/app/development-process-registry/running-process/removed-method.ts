import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { DatabaseModelPart } from '../../database/database-model-part';
import {
  MethodDecision,
  MethodDecisionEntry,
  MethodDecisionInit,
} from '../bm-process/method-decision';
import { v4 as uuidv4 } from 'uuid';

export interface RemovedMethodInit extends DatabaseInit {
  id?: string;
  executions: string[];
  decision: MethodDecisionInit;
}

export interface RemovedMethodEntry extends DatabaseEntry {
  id: string;
  executions: string[];
  decision: MethodDecisionEntry;
}

export class RemovedMethod implements RemovedMethodInit, DatabaseModelPart {
  id: string;
  executions: string[];
  decision: MethodDecision;

  constructor(
    entry: RemovedMethodEntry | undefined,
    init: RemovedMethodInit | undefined
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
    this.executions = element.executions;
  }

  toDb(): RemovedMethodEntry {
    return {
      id: this.id,
      executions: this.executions,
      decision: this.decision.toDb(),
    };
  }
}
