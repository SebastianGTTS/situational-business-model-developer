export enum ArtifactDataType {
  CUSTOM, STRING, REFERENCE
}

export interface ArtifactDataReference {
  id: string;
  type: string;
}

export class ArtifactData {

  type: ArtifactDataType = ArtifactDataType.STRING;
  data: any;

  constructor(artifactData: Partial<ArtifactData>) {
    Object.assign(this, artifactData);
  }

  toPouchDb() {
    return {
      type: this.type,
      data: this.data,
    };
  }

}
