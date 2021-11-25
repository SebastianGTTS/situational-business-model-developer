import { MethodElement, MethodElementEntry } from '../method-element';

export interface ArtifactEntry extends MethodElementEntry {
  internalArtifact: boolean;
  metaModel: { name: string; type: any };
}

export class Artifact extends MethodElement {
  static readonly typeName = 'Artifact';

  internalArtifact = false;
  metaModel: { name: string; type: any } = null;

  constructor(artifact: Partial<Artifact>) {
    super(Artifact.typeName);
    this.update(artifact);
  }

  /**
   * Update this artifact with new values
   *
   * @param artifact the new values of this artifact (values will be copied to the current object)
   */
  update(artifact: Partial<Artifact>): void {
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
        : null,
    };
  }
}
