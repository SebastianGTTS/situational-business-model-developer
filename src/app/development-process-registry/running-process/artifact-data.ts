import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export enum ArtifactDataType {
  CUSTOM,
  STRING,
  REFERENCE,
}

export type DataType = DatabaseEntry | string | ArtifactDataReference;

/**
 * Holds a reference to the actual data of the artifact, e.g., the
 * actual canvas model. This type can be arbitrarily extended by
 * the module developer as long as it is possible to save it in the
 * database and the type can be used to identify the correct meta artifact
 * module to use.
 *
 * The module developer does not need to use the provided database by the
 * SBMD but can use any storage for the artifacts and adapt this type
 * to be able to identify the saved artifacts again.
 */
export interface ArtifactDataReference extends DatabaseEntry {
  /**
   * SBMD uses this attribute only for logging purposes.
   * It is up to the module developer to extend this type or just use
   * the id to identify artifacts.
   */
  id: string;

  /**
   * Used to resolve the correct artifact module api service
   * (MetaArtifactApi).
   */
  type: string;
}

export interface ArtifactDataInit extends DatabaseInit {
  type?: ArtifactDataType;
  data: DataType;
}

export interface ArtifactDataEntry extends DatabaseEntry {
  type: ArtifactDataType;
  data: DataType;
}

export class ArtifactData implements ArtifactDataInit, DatabaseModelPart {
  type: ArtifactDataType = ArtifactDataType.STRING;
  data: DataType;

  constructor(
    entry: ArtifactDataEntry | undefined,
    init: ArtifactDataInit | undefined
  ) {
    const element = entry ?? init;
    if (element == null) {
      throw new Error('Either entry or init must be provided.');
    }
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
