import { Reference } from '../meta-artifact-definition';
import { ArtifactVersionId } from '../running-process/artifact-version';

export interface ApiQueryParams {
  runningProcessId?: string;
  executionId?: string;
  step?: number;
  artifactId?: string;
  artifactVersionId?: ArtifactVersionId;
}

/**
 * Converts a reference to api query params
 *
 * @param reference
 */
export function referenceToApiQueryParams(
  reference: Reference
): ApiQueryParams {
  let queryParams: ApiQueryParams;
  switch (reference.referenceType) {
    case 'Process':
      queryParams = {
        runningProcessId: reference.runningProcessId,
        artifactVersionId: reference.artifactVersionId,
      };
      break;
    case 'Method':
      queryParams = {
        runningProcessId: reference.runningProcessId,
        executionId: reference.executionId,
      };
      break;
    case 'Artifact':
      queryParams = {
        artifactId: reference.artifactId,
        artifactVersionId: reference.versionId,
      };
      break;
  }
  return queryParams;
}
