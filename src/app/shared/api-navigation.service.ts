import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../nav/nav.service';
import { RunningProcessService } from '../development-process-registry/running-process/running-process.service';
import { isRunningFullProcessEntry } from '../development-process-registry/running-process/running-full-process';

@Injectable({
  providedIn: 'root',
})
export class ApiNavigationService implements Resolve<NavDescription> {
  constructor(private runningProcessService: RunningProcessService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<NavDescription> {
    const runningProcessId = route.queryParams.runningProcessId;
    const executionId = route.queryParams.executionId;
    const step = route.queryParams.step;
    const artifactId = route.queryParams.artifactId;

    let link: string[];
    let name: string;
    if (executionId != null) {
      name = 'Method';
      link = [
        '/',
        'runningprocess',
        'runningprocessview',
        runningProcessId,
        'method',
        executionId,
      ];
    } else if (runningProcessId != null) {
      const runningProcess = await this.runningProcessService.getEntry(
        runningProcessId
      );
      if (
        isRunningFullProcessEntry(runningProcess) &&
        runningProcess.contextChange
      ) {
        name = 'Context Change';
        link = ['/', 'bmprocess', 'contextchange', runningProcessId];
      } else {
        name = 'Running Method';
        link = ['/', 'runningprocess', 'runningprocessview', runningProcessId];
      }
    } else if (artifactId != null) {
      name = 'Artifact';
      link = ['/', 'concreteArtifacts', 'detail', artifactId];
    } else {
      name = 'Home';
      link = ['/'];
    }
    return {
      menu: {
        name: name,
        submenu: [
          {
            name: route.data.stepName ?? 'Step',
            route: [],
            queryParams: {
              runningProcessId: runningProcessId,
              executionId: executionId,
              step: step,
              artifactId: artifactId,
            },
          },
        ],
      },
      link: link,
      depth: 3,
    };
  }
}
