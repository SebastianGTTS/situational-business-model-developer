import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';

export interface SituationalFactorDefinitionInit extends MethodElementInit {
  values?: string[];
  ordered?: boolean;
}

export interface SituationalFactorDefinitionEntry extends MethodElementEntry {
  values: string[];
  ordered: boolean;
}

export class SituationalFactorDefinition
  extends MethodElement
  implements SituationalFactorDefinitionInit
{
  static readonly typeName = 'SituationalFactorDefinition';

  values: string[] = [];
  ordered = false;

  constructor(
    entry: SituationalFactorDefinitionEntry | undefined,
    init: SituationalFactorDefinitionInit | undefined
  ) {
    super(entry, init, SituationalFactorDefinition.typeName);
    const element = entry ?? init;
    this.values = element.values ?? this.values;
    this.ordered = element.ordered ?? this.ordered;
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
