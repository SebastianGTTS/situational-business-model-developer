import { DatabaseModelPart } from '../../database/database-model-part';

export enum ArtifactDataType {
  CUSTOM,
  STRING,
  REFERENCE,
}

export interface ArtifactDataReference {
  id: string;
  type: string;
}

export class ArtifactData implements DatabaseModelPart {
  type: ArtifactDataType = ArtifactDataType.STRING;
  data: any;

  constructor(artifactData: Partial<ArtifactData>) {
    Object.assign(this, artifactData);
  }

  toDb(): any {
    return {
      type: this.type,
      data: this.data,
    };
  }
}
