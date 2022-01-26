import {
  MethodElement,
  MethodElementEntry,
  MethodElementInit,
} from '../method-element';
import { MetaModelIdentifier } from '../../meta-model-definition';

export interface ArtifactInit extends MethodElementInit {
  internalArtifact?: boolean;
  metaModel?: MetaModelIdentifier;
}

export interface ArtifactEntry extends MethodElementEntry {
  internalArtifact: boolean;
  metaModel?: MetaModelIdentifier;
}

export class Artifact extends MethodElement implements ArtifactInit {
  static readonly typeName = 'Artifact';

  internalArtifact = false;
  metaModel?: MetaModelIdentifier = undefined;

  constructor(
    entry: ArtifactEntry | undefined,
    init: ArtifactInit | undefined
  ) {
    super(entry, init, Artifact.typeName);
    const element = entry ?? init;
    this.internalArtifact = element.internalArtifact ?? this.internalArtifact;
    this.metaModel = element.metaModel;
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
    };
  }
}
