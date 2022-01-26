import {
  StepArtifact,
  StepArtifactEntry,
  StepArtifactInit,
} from './step-artifact';

export interface StepInputArtifactInit extends StepArtifactInit {
  versionInfo: {
    number: number;
    time: number;
    createdBy: string;
  };
}

export interface StepInputArtifactEntry extends StepArtifactEntry {
  versionInfo: {
    number: number;
    time: number;
    createdBy: string;
  };
}

export class StepInputArtifact
  extends StepArtifact
  implements StepInputArtifactInit
{
  versionInfo: {
    number: number;
    time: number;
    createdBy: string;
  };

  constructor(
    entry: StepInputArtifactEntry | undefined,
    init: StepInputArtifactInit | undefined
  ) {
    super(entry, init);
    this.versionInfo = (entry ?? init).versionInfo;
  }

  toDb(): StepInputArtifactEntry {
    return {
      ...super.toDb(),
      versionInfo: this.versionInfo,
    };
  }
}
