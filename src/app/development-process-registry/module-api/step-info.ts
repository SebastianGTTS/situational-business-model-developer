/**
 * Identifies which step of a development step
 * (method building block, internal: development method)
 * is currently executed.
 */
export interface StepInfo {
  runningProcessId: string | undefined;
  executionId: string | undefined;
  step: number | undefined;
}
