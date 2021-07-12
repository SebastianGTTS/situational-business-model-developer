import { StepArtifact } from './step-artifact';

export class Step {

  inputArtifacts: StepArtifact[] = null;
  outputArtifacts: StepArtifact[] = null;

  constructor(step: Partial<Step>) {
    Object.assign(this, step);
    this.inputArtifacts = this.inputArtifacts ? this.inputArtifacts.map((artifact) => new StepArtifact(artifact)) : null;
    this.outputArtifacts = this.outputArtifacts ? this.outputArtifacts.map((artifact) => new StepArtifact(artifact)) : null;
  }

  finish(output: StepArtifact[]) {
    this.outputArtifacts = output;
  }

  toPouchDb() {
    return {
      inputArtifacts: this.inputArtifacts ? this.inputArtifacts.map((artifact) => artifact.toPouchDb()) : null,
      outputArtifacts: this.outputArtifacts ? this.outputArtifacts.map((artifact) => artifact.toPouchDb()) : null,
    };
  }

}
