import { AnyConstructor } from '../../shared/utils';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { ProcessApiService } from '../../development-process-registry/module-api/process-api.service';

export interface ProcessApiMixin {
  get runningProcess(): RunningProcess | undefined;

  get runningMethod(): RunningMethod | undefined;

  isCorrectStep(): boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ProcessApiMixin<T extends AnyConstructor>(Base: T) {
  abstract class ProcessApi extends Base implements ProcessApiMixin {
    protected abstract get processApiService(): ProcessApiService;

    get runningProcess(): RunningProcess | undefined {
      return this.processApiService.runningProcess;
    }

    get runningMethod(): RunningMethod | undefined {
      return this.processApiService.runningMethod;
    }

    isCorrectStep(): boolean {
      return this.processApiService.isCorrectStep();
    }
  }

  return ProcessApi;
}
