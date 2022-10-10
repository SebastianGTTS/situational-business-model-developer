import {
  ArtifactGroup,
  ArtifactGroupEntry,
  ArtifactGroupInit,
} from './artifact-group';
import {
  Artifact,
  ArtifactEntry,
  ArtifactInit,
} from '../method-elements/artifact/artifact';
import { Groups, GroupsEntry, GroupsInit } from './groups';

export interface ArtifactGroupsInit extends GroupsInit<ArtifactInit> {
  groups?: ArtifactGroupInit[];
  defaultGroup?: ArtifactGroupInit;
}

export interface ArtifactGroupsEntry extends GroupsEntry<ArtifactEntry> {
  groups: ArtifactGroupEntry[];
  defaultGroup?: number;
}

/**
 * Groups for the input artifacts. Additionally, has mappings for the items.
 */
export class ArtifactGroups
  extends Groups<Artifact>
  implements ArtifactGroupsInit
{
  groups!: ArtifactGroup[];
  defaultGroup?: ArtifactGroup;

  constructor(
    entry: ArtifactGroupsEntry | undefined,
    init: ArtifactGroupsInit | undefined
  ) {
    super(entry, init, Artifact);
  }

  toDb(): ArtifactGroupsEntry {
    return {
      ...super.toDb(),
      groups: this.groups.map((group) => group.toDb()),
    };
  }

  protected createGroup(
    entry: ArtifactGroupEntry | undefined,
    init: ArtifactGroupInit | undefined
  ): ArtifactGroup {
    return new ArtifactGroup(entry, init);
  }
}
