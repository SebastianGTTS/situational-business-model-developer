import { StepArtifact } from './step-artifact';
import { DatabaseModelPart } from '../../database/database-model-part';

export class Step implements DatabaseModelPart {
  inputArtifacts: StepArtifact[] = null;
  outputArtifacts: StepArtifact[] = null;

  constructor(step: Partial<Step>) {
    Object.assign(this, step);
    this.inputArtifacts = this.inputArtifacts
      ? this.inputArtifacts.map((artifact) => new StepArtifact(artifact))
      : null;
    this.outputArtifacts = this.outputArtifacts
      ? this.outputArtifacts.map((artifact) => new StepArtifact(artifact))
      : null;
  }

  finish(output: StepArtifact[]) {
    this.outputArtifacts = output;
  }

  toDb(): any {
    return {
      inputArtifacts: this.inputArtifacts
        ? this.inputArtifacts.map((artifact) => artifact.toDb())
        : null,
      outputArtifacts: this.outputArtifacts
        ? this.outputArtifacts.map((artifact) => artifact.toDb())
        : null,
    };
  }
}
