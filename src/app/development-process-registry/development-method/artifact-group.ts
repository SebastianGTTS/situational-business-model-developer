import {
  ArtifactMultipleMappingSelection,
  ArtifactMultipleMappingSelectionEntry,
  ArtifactMultipleMappingSelectionInit,
} from './artifact-multiple-mapping-selection';
import { Group, GroupEntry, GroupInit } from './group';
import {
  Artifact,
  ArtifactEntry,
  ArtifactInit,
} from '../method-elements/artifact/artifact';

export interface ArtifactGroupInit extends GroupInit<ArtifactInit> {
  items?: ArtifactMultipleMappingSelectionInit[];
}

export interface ArtifactGroupEntry extends GroupEntry<ArtifactEntry> {
  items: ArtifactMultipleMappingSelectionEntry[];
}

/**
 * Input artifact group. Additionally, has mappings for the items.
 */
export class ArtifactGroup
  extends Group<Artifact>
  implements ArtifactGroupInit
{
  items!: ArtifactMultipleMappingSelection[];

  constructor(
    entry: ArtifactGroupEntry | undefined,
    init: ArtifactGroupInit | undefined
  ) {
    super(entry, init, Artifact);
  }

  toDb(): ArtifactGroupEntry {
    return {
      items: this.items.map((item) => item.toDb()),
    };
  }

  protected createMultipleSelection(
    entry: ArtifactMultipleMappingSelectionEntry | undefined,
    init: ArtifactMultipleMappingSelectionInit | undefined
  ): ArtifactMultipleMappingSelection {
    return new ArtifactMultipleMappingSelection(entry, init);
  }
}
