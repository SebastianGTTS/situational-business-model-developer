import { IconInit } from 'src/app/model/icon';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';
import { DatabaseModel } from '../../database/database-model';
import { Phase, PhaseEntry, PhaseInit } from './phase';

export interface PhaseListInit extends DatabaseRootInit {
  phases?: PhaseInit[];
}

export interface PhaseListEntry extends DatabaseRootEntry {
  phases: PhaseEntry[];
}

/**
 * This class represents a phase list for phase based composition.
 * There is only one list of phases for the entire tool.
 */
export class PhaseList extends DatabaseModel {
  static readonly typeName = 'PhaseList';

  phases: Phase[] = [];

  constructor(
    entry: PhaseListEntry | undefined,
    init: PhaseListInit | undefined
  ) {
    super(entry, init, PhaseList.typeName);
    if (entry != null) {
      this.phases = entry.phases.map((phase) => new Phase(phase, undefined));
    } else if (init != null) {
      this.phases =
        init.phases?.map((phase) => new Phase(undefined, phase)) ?? this.phases;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  /**
   * Add a phase to this phase list
   *
   * @param phase
   */
  addPhase(phase: PhaseInit): void {
    this.phases.push(new Phase(undefined, phase));
  }

  /**
   * Get a phase from this phase list
   *
   * @param id
   */
  getPhase(id: string | undefined): Phase | undefined {
    return this.phases.find((phase) => phase.id === id);
  }

  /**
   * Update a phase
   *
   * @param id
   * @param value
   */
  updatePhase(id: string, value: PhaseInit): void {
    const phase = this.getPhase(id);
    if (phase == null) {
      throw new Error('Phase does not exist');
    }
    phase.update(value);
  }

  /**
   * Update the icon of a phase in this phase list
   *
   * @param id
   * @param icon
   */
  updateIcon(id: string, icon: IconInit): void {
    const phase = this.getPhase(id);
    if (phase == null) {
      throw new Error('Phase does not exist');
    }
    phase.updateIcon(icon);
  }

  /**
   * Move a phase
   *
   * @param id
   * @param offset
   */
  movePhase(id: string, offset: number): void {
    const index = this.phases.findIndex((phase) => phase.id === id);
    if (index === -1) {
      throw new Error('Phase does not exist');
    }
    const newPosition = index + offset;
    const newList = this.phases.slice();
    const removed = newList.splice(index, 1);
    newList.splice(newPosition, 0, ...removed);
    this.phases = newList;
  }

  /**
   * Remove a phase from this phase list
   *
   * @param phaseId
   */
  removePhase(phaseId: string): void {
    this.phases = this.phases.filter((phase) => phase.id !== phaseId);
  }

  toDb(): PhaseListEntry {
    return {
      ...super.toDb(),
      phases: this.phases.map((phase) => phase.toDb()),
    };
  }
}
