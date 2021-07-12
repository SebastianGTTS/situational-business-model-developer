import { MethodExecutionInput } from './method-execution-input';

export interface ModuleApiService {

  /**
   * Execute a method of this service. After the execution call ``finishExecuteStep`` in ``RunningProcessService``.
   *
   * @param methodName the name of the method to execute
   * @param input the input for the method
   */
  executeMethod(methodName: string, input: MethodExecutionInput): void;

}
