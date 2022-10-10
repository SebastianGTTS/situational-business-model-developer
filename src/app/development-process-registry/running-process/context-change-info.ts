import {
  DatabaseEntry,
  DatabaseInit,
  DbId,
} from '../../database/database-entry';
import { DatabaseModelPart } from '../../database/database-model-part';
import { Domain, DomainEntry, DomainInit } from '../knowledge/domain';
import {
  Selection,
  SelectionEntry,
  SelectionInit,
} from '../development-method/selection';
import {
  SituationalFactor,
  SituationalFactorEntry,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import {
  RemovedMethod,
  RemovedMethodEntry,
  RemovedMethodInit,
} from './removed-method';

export interface ContextChangeInfoInit extends DatabaseInit {
  comment: string;
  suggestedDomains: DomainInit[];
  suggestedSituationalFactors: SelectionInit<SituationalFactorInit>[];
  oldDomains: DomainInit[];
  oldSituationalFactors: SelectionInit<SituationalFactorInit>[];
  removedMethods?: RemovedMethodInit[];
  step?: string;
}

export interface ContextChangeInfoEntry extends DatabaseEntry {
  comment: string;
  suggestedDomains: DomainEntry[];
  suggestedSituationalFactors: SelectionEntry<SituationalFactorEntry>[];
  oldDomains: DomainEntry[];
  oldSituationalFactors: SelectionEntry<SituationalFactorEntry>[];
  removedMethods: RemovedMethodEntry[];
  step?: string;
}

export class ContextChangeInfo
  implements ContextChangeInfoInit, DatabaseModelPart
{
  /**
   * The comment for the method engineer from the business developer,
   * which explains why and what changes are necessary for
   * the context change.
   */
  comment: string;

  suggestedDomains: Domain[];
  suggestedSituationalFactors: Selection<SituationalFactor>[];

  /**
   * The domains before this context change was executed
   */
  oldDomains: Domain[];
  /**
   * The situational factors before this context change was executed
   */
  oldSituationalFactors: Selection<SituationalFactor>[];

  removedMethods: RemovedMethod[] = [];

  /**
   * The current step at which the context change is
   */
  step?: string;

  constructor(
    entry: ContextChangeInfoEntry | undefined,
    init: ContextChangeInfoInit | undefined
  ) {
    let element;
    if (entry != null) {
      element = entry;
      this.suggestedDomains = entry.suggestedDomains.map(
        (domain) => new Domain(domain, undefined)
      );
      this.suggestedSituationalFactors = entry.suggestedSituationalFactors.map(
        (factor) =>
          new Selection<SituationalFactor>(factor, undefined, SituationalFactor)
      );
      this.oldDomains = entry.oldDomains.map(
        (domain) => new Domain(domain, undefined)
      );
      this.oldSituationalFactors = entry.oldSituationalFactors.map(
        (factor) =>
          new Selection<SituationalFactor>(factor, undefined, SituationalFactor)
      );
      this.removedMethods =
        entry.removedMethods?.map(
          (method) => new RemovedMethod(method, undefined)
        ) ?? this.removedMethods;
    } else if (init != null) {
      element = init;
      this.suggestedDomains = init.suggestedDomains.map(
        (domain) => new Domain(undefined, domain)
      );
      this.suggestedSituationalFactors = init.suggestedSituationalFactors.map(
        (factor) =>
          new Selection<SituationalFactor>(undefined, factor, SituationalFactor)
      );
      this.oldDomains = init.oldDomains.map(
        (domain) => new Domain(undefined, domain)
      );
      this.oldSituationalFactors = init.oldSituationalFactors.map(
        (factor) =>
          new Selection<SituationalFactor>(undefined, factor, SituationalFactor)
      );
      this.removedMethods =
        init.removedMethods?.map(
          (method) => new RemovedMethod(undefined, method)
        ) ?? this.removedMethods;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
    this.comment = element.comment;
    this.step = element.step;
  }

  addRemovedMethod(removedMethod: RemovedMethod): void {
    this.removedMethods.push(removedMethod);
  }

  removeRemovedMethod(removedMethodId: string): void {
    this.removedMethods = this.removedMethods.filter(
      (removedMethod) => removedMethod.id !== removedMethodId
    );
  }

  /**
   * Get all removed decisions based on the development method
   *
   * @param developmentMethodId
   */
  getRemovedMethods(developmentMethodId: DbId): RemovedMethod[] {
    return this.removedMethods.filter(
      (method) => method.decision.method._id === developmentMethodId
    );
  }

  /**
   * Get a removed method via its id
   *
   * @param id
   */
  getRemovedMethod(id: string): RemovedMethod {
    const method = this.removedMethods.find(
      (removedMethod) => removedMethod.id === id
    );
    if (method == null) {
      throw new Error('Removed method does not exist');
    }
    return method;
  }

  /**
   * Remove an executed method from removed methods reference.
   *
   * @param executionId
   */
  removeExecutedMethod(executionId: string): void {
    for (const method of this.removedMethods) {
      method.executions = method.executions.filter(
        (execution) => execution !== executionId
      );
    }
  }

  toDb(): ContextChangeInfoEntry {
    return {
      comment: this.comment,
      suggestedDomains: this.suggestedDomains.map((domain) => domain.toDb()),
      suggestedSituationalFactors: this.suggestedSituationalFactors.map(
        (factor) => factor.toDb()
      ),
      oldDomains: this.oldDomains.map((domain) => domain.toDb()),
      oldSituationalFactors: this.oldSituationalFactors.map((factor) =>
        factor.toDb()
      ),
      removedMethods: this.removedMethods.map((method) => method.toDb()),
      step: this.step,
    };
  }
}
