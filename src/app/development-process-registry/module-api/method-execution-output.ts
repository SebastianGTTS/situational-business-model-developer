import { ArtifactData } from '../running-process/artifact-data';

/**
 * The output returned by a method of a module as a promise after the execution
 */
export interface MethodExecutionOutput {
  outputArtifactData: ArtifactData[];
}
