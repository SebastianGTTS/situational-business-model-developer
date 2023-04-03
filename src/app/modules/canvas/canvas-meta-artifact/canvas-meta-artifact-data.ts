import { DbId } from '../../../database/database-entry';
import { MetaArtifactData } from '../../../development-process-registry/method-elements/artifact/artifact';

/**
 * Stores to which canvas model an artifact belongs.
 */
export interface CanvasMetaArtifactData extends MetaArtifactData {
  /**
   * The id of the canvas definition
   */
  definitionId: DbId;
}
