import {
  MultipleSelection,
  MultipleSelectionEntry,
  MultipleSelectionInit,
} from './multiple-selection';
import {
  ArtifactMapping,
  ArtifactMappingEntry,
  ArtifactMappingInit,
} from './artifact-mapping';
import { equalsList } from '../../shared/utils';
import {
  Artifact,
  ArtifactEntry,
  ArtifactInit,
} from '../method-elements/artifact/artifact';

export interface ArtifactMultipleMappingSelectionInit
  extends MultipleSelectionInit<ArtifactInit> {
  mapping?: ArtifactMappingInit[];
}

export interface ArtifactMultipleMappingSelectionEntry
  extends MultipleSelectionEntry<ArtifactEntry> {
  mapping: ArtifactMappingEntry[];
}

export class ArtifactMultipleMappingSelection
  extends MultipleSelection<Artifact>
  implements ArtifactMultipleMappingSelectionInit
{
  mapping: ArtifactMapping[] = [];

  constructor(
    entry: ArtifactMultipleMappingSelectionEntry | undefined,
    init: ArtifactMultipleMappingSelectionInit | undefined
  ) {
    super(entry, init, Artifact);
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

  /**
   * @deprecated
   *
   * @param selection
   * @param createElement
   */
  update(
    selection: ArtifactMultipleMappingSelection,
    createElement: (element: Partial<Artifact>) => Artifact
  ): void {
    this.mapping = [];
    super.update(selection, createElement);
    this.element = this.element ? createElement(this.element) : undefined;
    this.mapping = this.mapping.map(
      (mapping) => new ArtifactMapping(undefined, mapping)
    );
  }

  toDb(): ArtifactMultipleMappingSelectionEntry {
    return {
      ...super.toDb(),
      mapping: this.mapping.map((mapping) => mapping.toDb()),
    };
  }

  equals(other: MultipleSelection<Artifact>): boolean {
    if (!('mapping' in other)) {
      return false;
    }
    return (
      super.equals(other) &&
      equalsList(
        this.mapping,
        (other as ArtifactMultipleMappingSelection).mapping
      )
    );
  }
}
