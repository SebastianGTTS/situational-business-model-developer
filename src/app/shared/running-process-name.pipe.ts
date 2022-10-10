import { Pipe, PipeTransform } from '@angular/core';
import {
  RunningProcess,
  RunningProcessEntry,
} from '../development-process-registry/running-process/running-process';

@Pipe({
  name: 'runningProcessName',
})
export class RunningProcessNamePipe implements PipeTransform {
  transform(runningProcess: RunningProcess | RunningProcessEntry): string {
    if (runningProcess.process != null) {
      return runningProcess.process.name + ' \u2013 ' + runningProcess.name;
    } else {
      return runningProcess.name;
    }
  }
}
