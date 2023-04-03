import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';
import { MetaArtifactIdentifier } from '../../meta-artifact-definition';
import { DatabaseEntry } from '../../../database/database-entry';
import { IconInit } from '../../../model/icon';

export type MetaArtifactData = DatabaseEntry;

export interface ArtifactInit extends MethodElementInit {
  internalArtifact?: boolean;
  metaArtifact?: MetaArtifactIdentifier;
  metaArtifactData?: MetaArtifactData;
}

export interface ArtifactEntry extends MethodElementEntry {
  internalArtifact: boolean;
  metaArtifact?: MetaArtifactIdentifier;
  metaArtifactData?: MetaArtifactData;
}

export class Artifact extends MethodElement implements ArtifactInit {
  static readonly typeName = 'Artifact';
  static readonly defaultIcon: IconInit = { icon: 'bi-file-earmark-richtext' };

  internalArtifact = false;
  metaArtifact?: MetaArtifactIdentifier = undefined;
  metaArtifactData?: MetaArtifactData;

  constructor(
    entry: ArtifactEntry | undefined,
    init: ArtifactInit | undefined
  ) {
    if (init != null && init.icon == null) {
      init.icon = Artifact.defaultIcon;
    }
    super(entry, init, Artifact.typeName);
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.internalArtifact = element.internalArtifact ?? this.internalArtifact;
    this.metaArtifact = element.metaArtifact;
    this.metaArtifactData = element.metaArtifactData;
  }

  /**
   * Update this artifact with new values
   *
   * @param artifact the new values of this artifact (values will be copied to the current object)
   */
  update(artifact: Partial<ArtifactInit>): void {
    Object.assign(this, artifact);
  }

  toDb(): ArtifactEntry {
    return {
      ...super.toDb(),
      internalArtifact: this.internalArtifact,
      metaArtifact: this.metaArtifact
        ? {
            name: this.metaArtifact.name,
            type: this.metaArtifact.type,
          }
        : undefined,
      metaArtifactData: this.metaArtifactData,
    };
  }
}
