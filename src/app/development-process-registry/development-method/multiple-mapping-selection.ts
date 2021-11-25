import {
  MultipleSelection,
  MultipleSelectionEntry,
} from './multiple-selection';
import {
  MethodElement,
  MethodElementEntry,
} from '../method-elements/method-element';
import { ArtifactMapping, ArtifactMappingEntry } from './artifact-mapping';
import { equalsList } from '../../shared/utils';

export interface MultipleMappingSelectionEntry<T extends MethodElementEntry>
  extends MultipleSelectionEntry<T> {
  mapping: ArtifactMappingEntry[];
}

export class MultipleMappingSelection<
  T extends MethodElement
> extends MultipleSelection<T> {
  mapping: ArtifactMapping[];

  constructor(
    selection: MultipleMappingSelection<T>,
    createElement: (element: Partial<T>) => T
  ) {
    super(selection, createElement);
  }

  update(
    selection: MultipleMappingSelection<T>,
    createElement: (element: Partial<T>) => T
  ): void {
    this.mapping = [];
    super.update(selection, createElement);
    this.element = this.element ? createElement(this.element) : null;
    this.mapping = this.mapping.map((mapping) => new ArtifactMapping(mapping));
  }

  toDb(): MultipleMappingSelectionEntry<ReturnType<T['toDb']>> {
    return {
      ...super.toDb(),
      mapping: this.mapping.map((mapping) => mapping.toDb()),
    };
  }

  equals(other: MultipleSelection<T>): boolean {
    if (!('mapping' in other)) {
      return false;
    }
    return (
      super.equals(other) &&
      equalsList(this.mapping, (other as MultipleMappingSelection<T>).mapping)
    );
  }
}
