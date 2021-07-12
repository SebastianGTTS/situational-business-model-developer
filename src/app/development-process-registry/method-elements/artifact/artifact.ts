import { MethodElement } from '../method-element';

export class Artifact extends MethodElement {

  static readonly typeName = 'Artifact';

  internalArtifact = false;
  metaModel: { name: string, type: any } = null;

  constructor(artifact: Partial<Artifact>) {
    super(Artifact.typeName);
    this.update(artifact);
  }

  /**
   * Update this artifact with new values
   *
   * @param artifact the new values of this artifact (values will be copied to the current object)
   */
  update(artifact: Partial<Artifact>) {
    Object.assign(this, artifact);
  }

  toPouchDb(): any {
    return {
      ...super.toPouchDb(),
      internalArtifact: this.internalArtifact,
      metaModel: this.metaModel ? {
        name: this.metaModel.name,
        type: this.metaModel.type,
      } : null,
    };
  }

}
