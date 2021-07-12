import { ArtifactMapping } from './artifact-mapping';

export class ExecutionStep {

  module: string;
  method: string;
  predefinedInput: any;
  outputMappings: ArtifactMapping[][] = [];

  constructor(executionStep: Partial<ExecutionStep>) {
    Object.assign(this, executionStep);
    this.outputMappings = this.outputMappings.map((mappings) => mappings.map((mapping) => new ArtifactMapping(mapping)));
  }

  toPouchDb(): any {
    return {
      module: this.module,
      method: this.method,
      predefinedInput: this.predefinedInput,
      outputMappings: this.outputMappings.map((mappings) => mappings.map((mapping) => mapping.toPouchDb())),
    };
  }

}
