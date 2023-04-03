import { DevelopmentMethod } from '../development-method/development-method';
import { ArtifactMapping } from '../development-method/artifact-mapping';
import { isMethodExecutionStep } from '../development-method/execution-step';
import { MetaArtifactData } from '../method-elements/artifact/artifact';

/**
 * Checks whether all mappings only go to the correct output artifacts.
 *
 * @param developmentMethod
 * @param outputMappings
 * @param compatible
 * @param module
 */
export function checkMappings(
  developmentMethod: DevelopmentMethod,
  outputMappings: ArtifactMapping[],
  compatible: (data: MetaArtifactData) => boolean,
  module: string
): boolean {
  if (outputMappings.length === 0) {
    return true;
  }
  return outputMappings.every((mapping) => {
    if (mapping.isOutputMapping()) {
      if (
        developmentMethod.outputArtifacts.groups.length <= mapping.group ||
        developmentMethod.outputArtifacts.groups[mapping.group].items.length <=
          mapping.artifact
      ) {
        return true;
      }
      const output =
        developmentMethod.outputArtifacts.groups[mapping.group].items[
          mapping.artifact
        ];
      if (output == null || output.element?.metaArtifactData == null) {
        return true;
      }
      return compatible(output.element.metaArtifactData);
    }
    if (mapping.isStepMapping()) {
      const step = developmentMethod.executionSteps[mapping.step];
      if (!isMethodExecutionStep(step)) {
        return false;
      }
      if (step.module !== module) {
        return true;
      }
      return checkMappings(
        developmentMethod,
        step.outputMappings[0],
        compatible,
        module
      );
    }
    return false;
  });
}
