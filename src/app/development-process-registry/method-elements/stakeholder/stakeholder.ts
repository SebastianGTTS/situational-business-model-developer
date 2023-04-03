import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';
import { IconInit } from '../../../model/icon';

export type StakeholderInit = MethodElementInit;

export type StakeholderEntry = MethodElementEntry;

export class Stakeholder extends MethodElement implements StakeholderInit {
  static readonly typeName = 'Stakeholder';
  static readonly defaultIcon: IconInit = { icon: 'bi-person' };

  constructor(
    entry: StakeholderEntry | undefined,
    init: StakeholderInit | undefined
  ) {
    if (init != null && init.icon == null) {
      init.icon = Stakeholder.defaultIcon;
    }
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
