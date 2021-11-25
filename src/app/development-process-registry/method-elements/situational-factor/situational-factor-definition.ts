import { MethodElement, MethodElementEntry } from '../method-element';

export interface SituationalFactorDefinitionEntry extends MethodElementEntry {
  values: string[];
  ordered: boolean;
}

export class SituationalFactorDefinition extends MethodElement {
  static readonly typeName = 'SituationalFactorDefinition';

  values: string[] = [];
  ordered = false;

  constructor(
    situationalFactorDefinition: Partial<SituationalFactorDefinition>
  ) {
    super(SituationalFactorDefinition.typeName);
    this.update(situationalFactorDefinition);
  }

  toDb(): SituationalFactorDefinitionEntry {
    return {
      ...super.toDb(),
      values: this.values,
      ordered: this.ordered,
    };
  }

  update(
    situationalFactorDefinition: Partial<SituationalFactorDefinition>
  ): void {
    Object.assign(this, situationalFactorDefinition);
  }
}
