import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export enum ArtifactDataType {
  CUSTOM,
  STRING,
  REFERENCE,
}

export interface ArtifactDataReference {
  id: string;
  type: string;
}

export interface ArtifactDataInit extends DatabaseInit {
  type?: ArtifactDataType;
  data?: any;
}

export interface ArtifactDataEntry extends DatabaseEntry {
  type: ArtifactDataType;
  data: any;
}

export class ArtifactData implements ArtifactDataInit, DatabaseModelPart {
  type: ArtifactDataType = ArtifactDataType.STRING;
  data: any;

  constructor(
    entry: ArtifactDataEntry | undefined,
    init: ArtifactDataInit | undefined
  ) {
    const element = entry ?? init;
    this.type = element.type ?? this.type;
    this.data = element.data;
  }

  toDb(): ArtifactDataEntry {
    return {
      type: this.type,
      data: this.data,
    };
  }
}
