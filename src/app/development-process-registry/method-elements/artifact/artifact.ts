import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';
import { MetaModelIdentifier } from '../../meta-model-definition';
import { DatabaseEntry } from '../../../database/database-entry';

export type MetaModelData = DatabaseEntry;

export interface ArtifactInit extends MethodElementInit {
  internalArtifact?: boolean;
  metaModel?: MetaModelIdentifier;
  metaModelData?: MetaModelData;
}

export interface ArtifactEntry extends MethodElementEntry {
  internalArtifact: boolean;
  metaModel?: MetaModelIdentifier;
  metaModelData?: MetaModelData;
}

export class Artifact extends MethodElement implements ArtifactInit {
  static readonly typeName = 'Artifact';

  internalArtifact = false;
  metaModel?: MetaModelIdentifier = undefined;
  metaModelData?: MetaModelData;

  constructor(
    entry: ArtifactEntry | undefined,
    init: ArtifactInit | undefined
  ) {
    super(entry, init, Artifact.typeName);
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
    this.internalArtifact = element.internalArtifact ?? this.internalArtifact;
    this.metaModel = element.metaModel;
    this.metaModelData = element.metaModelData;
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
      metaModel: this.metaModel
        ? {
            name: this.metaModel.name,
            type: this.metaModel.type,
          }
        : undefined,
      metaModelData: this.metaModelData,
    };
  }
}
