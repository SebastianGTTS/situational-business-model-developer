import { DbId } from '../../../database/database-entry';
import { MetaModelData } from '../../../development-process-registry/method-elements/artifact/artifact';

/**
 * Stores to which canvas model an artifact belongs.
 */
export interface CanvasMetaModelData extends MetaModelData {
  /**
   * The id of the canvas definition
   */
  definitionId: DbId;
}
