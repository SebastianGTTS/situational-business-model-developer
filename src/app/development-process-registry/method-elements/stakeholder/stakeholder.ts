import { MethodElement, MethodElementEntry } from '../method-element';

export interface StakeholderEntry extends MethodElementEntry {}

export class Stakeholder extends MethodElement {
  static readonly typeName = 'Stakeholder';

  constructor(stakeholder: Partial<Stakeholder>) {
    super(Stakeholder.typeName);
    this.update(stakeholder);
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
