import {
  MultipleSelection,
  MultipleSelectionEntry,
  MultipleSelectionInit,
} from './multiple-selection';
import {
  MethodElement,
  MethodElementEntry,
} from '../method-elements/method-element';
import {
  ArtifactMapping,
  ArtifactMappingEntry,
  ArtifactMappingInit,
} from './artifact-mapping';
import { equalsList } from '../../shared/utils';
import { DatabaseInit } from '../../database/database-entry';
import {
  DatabaseConstructor,
  EntryType,
  InitType,
} from '../../database/database-model-part';

export interface MultipleMappingSelectionInit<T extends DatabaseInit>
  extends MultipleSelectionInit<T> {
  mapping?: ArtifactMappingInit[];
}

export interface MultipleMappingSelectionEntry<T extends MethodElementEntry>
  extends MultipleSelectionEntry<T> {
  mapping: ArtifactMappingEntry[];
}

export class MultipleMappingSelection<T extends MethodElement>
  extends MultipleSelection<T>
  implements MultipleMappingSelectionInit<T>
{
  mapping: ArtifactMapping[] = [];

  constructor(
    entry: MultipleMappingSelectionEntry<EntryType<T>> | undefined,
    init: MultipleMappingSelectionInit<InitType<T>> | undefined,
    databaseConstructor: DatabaseConstructor<T>
  ) {
    super(entry, init, databaseConstructor);
    if (entry != null) {
      this.mapping =
        entry.mapping?.map(
          (mapping) => new ArtifactMapping(mapping, undefined)
        ) ?? this.mapping;
    } else if (init != null) {
      this.mapping =
        init.mapping?.map(
          (mapping) => new ArtifactMapping(undefined, mapping)
        ) ?? this.mapping;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  update(
    selection: MultipleMappingSelection<T>,
    createElement: (element: Partial<T>) => T
  ): void {
    this.mapping = [];
    super.update(selection, createElement);
    this.element = this.element ? createElement(this.element) : null;
    this.mapping = this.mapping.map(
      (mapping) => new ArtifactMapping(undefined, mapping)
    );
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
