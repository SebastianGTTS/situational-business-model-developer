import {
  ArtifactData,
  ArtifactDataEntry,
  ArtifactDataInit,
} from './artifact-data';
import { DatabaseModelPart } from '../../database/database-model-part';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';

export interface OutputArtifactMappingInit extends DatabaseInit {
  isDefinition: boolean;
  artifact?: number;
  artifactName?: string;
  data: ArtifactDataInit;
}

export interface OutputArtifactMappingEntry extends DatabaseEntry {
  isDefinition: boolean;
  artifact?: number;
  artifactName?: string;
  data: ArtifactDataEntry;
}

export class OutputArtifactMapping
  implements OutputArtifactMappingInit, DatabaseModelPart
{
  isDefinition: boolean;
  artifact?: number;
  artifactName?: string;
  data: ArtifactData;

  constructor(
    entry: OutputArtifactMappingEntry | undefined,
    init: OutputArtifactMappingInit | undefined
  ) {
    const element = entry ?? init;
    this.isDefinition = element.isDefinition;
    this.artifact = element.artifact;
    this.artifactName = element.artifactName;
    if (entry != null) {
      this.data = new ArtifactData(entry.data, undefined);
    } else if (init != null) {
      this.data = new ArtifactData(undefined, init.data);
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  toDb(): OutputArtifactMappingEntry {
    return {
      isDefinition: this.isDefinition,
      artifact: this.artifact,
      artifactName: this.artifactName,
      data: this.data.toDb(),
    };
  }
}
