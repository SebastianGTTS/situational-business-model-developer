import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';
import { IconInit } from '../../../model/icon';

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
  static readonly defaultIcon: IconInit = { icon: 'bi-list-check' };

  values: string[] = [];
  ordered = false;

  constructor(
    entry: SituationalFactorDefinitionEntry | undefined,
    init: SituationalFactorDefinitionInit | undefined
  ) {
    if (init != null && init.icon == null) {
      init.icon = SituationalFactorDefinition.defaultIcon;
    }
    super(entry, init, SituationalFactorDefinition.typeName);
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
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
