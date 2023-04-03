export enum State {
  LOADING,
  INPUT_SELECTION,
  EXECUTION,
  OUTPUT_SELECTION,
}

export interface RunningProcessMethod {
  getState(): State;

  hasInputArtifacts(): boolean;

  hasStepsLeft(): boolean;
}
