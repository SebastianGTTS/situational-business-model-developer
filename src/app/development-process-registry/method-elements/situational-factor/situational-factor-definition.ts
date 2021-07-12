import { MethodElement } from '../method-element';

export class SituationalFactorDefinition extends MethodElement {

  static readonly typeName = 'SituationalFactorDefinition';

  values: string[] = [];
  ordered = false;

  constructor(situationalFactorDefinition: Partial<SituationalFactorDefinition>) {
    super(SituationalFactorDefinition.typeName);
    this.update(situationalFactorDefinition);
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      values: this.values,
      ordered: this.ordered,
    };
  }

  update(situationalFactorDefinition: Partial<SituationalFactorDefinition>) {
    Object.assign(this, situationalFactorDefinition);
  }
}
