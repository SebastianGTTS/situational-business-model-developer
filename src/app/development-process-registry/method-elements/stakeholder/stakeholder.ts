import { MethodElement } from '../method-element';

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
  update(stakeholder: Partial<Stakeholder>) {
    Object.assign(this, stakeholder);
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
    };
  }

}
