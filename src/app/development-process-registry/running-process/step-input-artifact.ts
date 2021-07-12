import { StepArtifact } from './step-artifact';

export class StepInputArtifact extends StepArtifact {

  versionInfo: {
    number: number,
    time: number,
    createdBy: string,
  };

  constructor(stepInputArtifact: Partial<StepInputArtifact>) {
    super(stepInputArtifact);
  }

  toPouchDb() {
    return {
      ...super.toPouchDb(),
      versionInfo: this.versionInfo,
    };
  }

}
