import {
  EmptyExecutionStep,
  EmptyExecutionStepEntry,
  EmptyExecutionStepInit,
} from './empty-execution-step';
import {
  MethodExecutionStep,
  MethodExecutionStepEntry,
  MethodExecutionStepInit,
} from './method-execution-step';

export type ExecutionStepInit =
  | EmptyExecutionStepInit
  | MethodExecutionStepInit;

export type ExecutionStepEntry =
  | EmptyExecutionStepEntry
  | MethodExecutionStepEntry;

export type ExecutionStep = EmptyExecutionStep | MethodExecutionStep;

export function createExecutionStep(
  entry: ExecutionStepEntry | undefined,
  init: ExecutionStepInit | undefined
): ExecutionStep {
  if (entry != null) {
    if (isMethodExecutionStep(entry)) {
      return new MethodExecutionStep(entry, undefined);
    } else {
      return new EmptyExecutionStep(entry, undefined);
    }
  } else if (init != null) {
    if (isMethodExecutionStep(init)) {
      return new MethodExecutionStep(undefined, init);
    } else {
      return new EmptyExecutionStep(undefined, init);
    }
  } else {
    throw new Error('Either entry or init must be provided.');
  }
}

export function isMethodExecutionStep(
  step: ExecutionStepEntry | ExecutionStepInit
): step is MethodExecutionStepEntry | MethodExecutionStepInit {
  return (
    (step as MethodExecutionStepEntry | MethodExecutionStepInit).method != null
  );
}
