import { BmProcess, BmProcessEntry, BmProcessInit } from './bm-process';
import {
  PhaseDecision,
  PhaseDecisionEntry,
  PhaseDecisionInit,
} from './phase-decision';
import { DevelopmentMethod } from '../development-method/development-method';
import { PhaseMethodDecision } from './phase-method-decision';
import { Phase } from '../phase/phase';
import { MethodDecision, MethodDecisionUpdate } from './method-decision';
import { IconInit } from '../../model/icon';

export interface BmPhaseProcessInit extends BmProcessInit {
  phases?: PhaseDecisionInit[];
}

export interface BmPhaseProcessEntry extends BmProcessEntry {
  phases: PhaseDecisionEntry[];
}

export class BmPhaseProcess extends BmProcess {
  static readonly defaultIcon: IconInit = { icon: 'bi-kanban' };

  phases: PhaseDecision[] = [];

  constructor(
    entry: BmPhaseProcessEntry | undefined,
    init: BmPhaseProcessInit | undefined
  ) {
    if (init != null && init.icon == null) {
      init.icon = BmPhaseProcess.defaultIcon;
    }
    super(entry, init);
    if (entry != null) {
      this.phases =
        entry.phases?.map((phase) => new PhaseDecision(phase, undefined)) ??
        this.phases;
    } else if (init != null) {
      this.phases =
        init.phases?.map((phase) => new PhaseDecision(undefined, phase)) ??
        this.phases;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  getPhaseDecision(phaseId: string): PhaseDecision | undefined {
    return this.phases.find((phase) => phase.phase.id === phaseId);
  }

  getAllPhaseMethodDecisions(): PhaseMethodDecision[] {
    return this.phases.map((phase) => phase.decisions).flat();
  }

  /**
   * Get all phase method decisions ordered by their number
   */
  getSortedPhaseMethodDecisions(): PhaseMethodDecision[] {
    const phaseMethodDecisions: PhaseMethodDecision[] =
      this.getAllPhaseMethodDecisions();
    return phaseMethodDecisions.sort(
      (a, b) => (a.number ?? 0) - (b.number ?? 0)
    );
  }

  getPhaseMethodDecision(
    phaseMethodId: string
  ): PhaseMethodDecision | undefined {
    return this.getAllPhaseMethodDecisions().find(
      (phaseMethod) => phaseMethod.id === phaseMethodId
    );
  }

  getPhaseMethodDecisionByExecutionNumber(
    executionNumber: number
  ): PhaseMethodDecision | undefined {
    return this.getAllPhaseMethodDecisions().find(
      (method) => method.number === executionNumber
    );
  }

  /**
   * Update the selected phases of this bm process.
   * Add phases that are not in this process, but in the phases array.
   * Remove phases that are not in the array, but in this process.
   * Move phases to the position in the array.
   *
   * @param phases
   */
  updatePhases(phases: Phase[]): void {
    const phaseMap: { [phaseId: string]: PhaseDecision } = {};
    for (const phaseDecision of this.phases) {
      phaseMap[phaseDecision.phase.id] = phaseDecision;
    }
    const newPhases: PhaseDecision[] = [];
    for (const phase of phases) {
      if (phase.id in phaseMap) {
        phaseMap[phase.id].phase = phase;
        newPhases.push(phaseMap[phase.id]);
      } else {
        newPhases.push(
          new PhaseDecision(undefined, {
            phase: phase,
          })
        );
      }
    }
    this.phases = newPhases;
  }

  /**
   * Add a method to a phase in this process
   *
   * @param phaseId the id of the phase to add the method to
   * @param method the method to add
   */
  addDecision(phaseId: string, method: DevelopmentMethod): PhaseMethodDecision {
    const phaseDecision = this.getPhaseDecision(phaseId);
    if (phaseDecision == null) {
      throw new Error('Phase does not exist');
    }
    const maxNumber = this.getMaxNumber();
    return phaseDecision.addDecision(method, (maxNumber ?? 0) + 1);
  }

  /**
   * Add a decision that was previously removed
   *
   * @param phaseId the id of the phase to add the decision to
   * @param decision
   */
  addRemovedDecision(
    phaseId: string,
    decision: MethodDecision
  ): PhaseMethodDecision {
    const phaseDecision = this.getPhaseDecision(phaseId);
    if (phaseDecision == null) {
      throw new Error('Phase does not exist');
    }
    const maxNumber = this.getMaxNumber();
    return phaseDecision.addRemovedDecision(decision, (maxNumber ?? 0) + 1);
  }

  /**
   * Get the highest currently used decision number
   */
  private getMaxNumber(): number | undefined {
    return this.getAllPhaseMethodDecisions()
      .map((decision) => decision.number)
      .reduce(
        (previousValue, currentValue) =>
          (currentValue ?? 0) > (previousValue ?? 0)
            ? currentValue
            : previousValue,
        0
      );
  }

  /**
   * Update a decision of this process
   *
   * @param id the id of the phase method decision
   * @param methodDecisionUpdate
   */
  updateDecision(id: string, methodDecisionUpdate: MethodDecisionUpdate): void {
    const phaseMethodDecision = this.getPhaseMethodDecision(id);
    if (phaseMethodDecision == null) {
      throw new Error('Phase Method Decision does not exist');
    }
    phaseMethodDecision.decision.update(methodDecisionUpdate);
  }

  /**
   * Update a number a decision has in the enaction.
   *
   * @param id the id of the phase method decision
   * @param number the new number of that decision
   */
  updateDecisionNumber(id: string, number: number): void {
    const phaseMethodDecision = this.getPhaseMethodDecision(id);
    if (phaseMethodDecision == null) {
      throw new Error('Phase Method Decision does not exist');
    }
    if (phaseMethodDecision.number != null && phaseMethodDecision.number > 0) {
      this.reduceWithHigherNumber(phaseMethodDecision.number);
    }
    if (this.getAllPhaseMethodDecisions().some((d) => d.number === number)) {
      this.increaseWithHigherOrEqualNumber(number);
    }
    // increase all decision numbers of all decisions with higher or equal number
    phaseMethodDecision.updateNumber(number);
  }

  private increaseWithHigherOrEqualNumber(number: number): void {
    this.getAllPhaseMethodDecisions()
      .filter((d) => d.number != null && d.number >= number)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .forEach((d) => (d.number! += 1));
  }

  /**
   * Remove a method from a phase in this process
   *
   * @param id the id of the phase method decision
   */
  removeDecision(id: string): void {
    const decision = this.getPhaseMethodDecision(id);
    if (decision == null) {
      throw new Error('Phase Method Decision does not exist');
    }
    if (decision.number != null && decision.number > 0) {
      this.reduceWithHigherNumber(decision.number);
    }
    decision.phaseDecision.removeDecision(decision.id);
  }

  /**
   * Reduce decision numbers of all decisions with higher number
   *
   * @param number
   */
  private reduceWithHigherNumber(number: number): void {
    this.getAllPhaseMethodDecisions()
      .filter((d) => d.number != null && d.number > number)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .forEach((d) => (d.number! -= 1));
  }

  isComplete(): boolean {
    const sortedPhaseMethodDecisions = this.getSortedPhaseMethodDecisions();
    return sortedPhaseMethodDecisions.every(
      (phaseMethodDecision, index) =>
        phaseMethodDecision.isComplete() &&
        (phaseMethodDecision.number ?? 0) - 1 === index
    );
  }

  toDb(): BmPhaseProcessEntry {
    return {
      ...super.toDb(),
      phases: this.phases.map((phase) => phase.toDb()),
    };
  }
}

export function isBmPhaseProcess(
  bmProcess: BmProcess
): bmProcess is BmPhaseProcess {
  return (bmProcess as BmPhaseProcess).phases != null;
}

export function isBmPhaseProcessEntry(
  bmProcess: BmProcessEntry
): bmProcess is BmPhaseProcessEntry {
  return (bmProcess as BmPhaseProcessEntry).phases != null;
}

export function isBmPhaseProcessInit(
  bmProcess: BmProcessInit
): bmProcess is BmPhaseProcessInit {
  return (bmProcess as BmPhaseProcessInit).phases != null;
}
