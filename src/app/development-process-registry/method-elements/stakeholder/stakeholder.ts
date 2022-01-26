import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';

export interface StakeholderInit extends MethodElementInit {}

export interface StakeholderEntry extends MethodElementEntry {}

export class Stakeholder extends MethodElement implements StakeholderInit {
  static readonly typeName = 'Stakeholder';

  constructor(
    entry: StakeholderEntry | undefined,
    init: StakeholderInit | undefined
  ) {
    super(entry, init, Stakeholder.typeName);
  }

  /**
   * Update this stakeholder with new values
   *
   * @param stakeholder the new values of this stakeholder (values will be copied to the current object)
   */
  update(stakeholder: Partial<Stakeholder>): void {
    Object.assign(this, stakeholder);
  }

  toDb(): StakeholderEntry {
    return {
      ...super.toDb(),
    };
  }
}
