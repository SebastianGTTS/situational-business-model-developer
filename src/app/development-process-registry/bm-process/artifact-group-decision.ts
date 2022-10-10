import {
  GroupDecision,
  GroupDecisionEntry,
  GroupDecisionInit,
} from './group-decision';
import { Artifact, ArtifactEntry } from '../method-elements/artifact/artifact';
import { ArtifactGroup } from '../development-method/artifact-group';
import { ArtifactGroups } from '../development-method/artifact-groups';

export type ArtifactGroupDecisionInit = GroupDecisionInit<Artifact>;

export type ArtifactGroupDecisionEntry = GroupDecisionEntry<ArtifactEntry>;

/**
 * Group decision for input artifact groups.
 */
export class ArtifactGroupDecision extends GroupDecision<Artifact> {
  readonly groups: Readonly<ArtifactGroups>;
  /**
   * The selected group of output artifacts
   */
  group?: Readonly<ArtifactGroup>;

  constructor(
    entry: ArtifactGroupDecisionEntry | undefined,
    init: ArtifactGroupDecisionInit | undefined,
    groups: ArtifactGroups
  ) {
    super(entry, init, Artifact, groups);
    this.groups = groups;
  }
}
