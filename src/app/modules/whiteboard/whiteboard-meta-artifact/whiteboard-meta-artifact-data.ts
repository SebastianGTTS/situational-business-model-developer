import { DbId } from '../../../database/database-entry';
import { MetaArtifactData } from '../../../development-process-registry/method-elements/artifact/artifact';

export interface WhiteboardMetaArtifactData extends MetaArtifactData {
  templateId: DbId;
}
