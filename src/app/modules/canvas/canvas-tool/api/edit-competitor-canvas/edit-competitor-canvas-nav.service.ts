import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class EditCompetitorCanvasNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    const runningProcessId = route.queryParams.runningProcessId;
    const executionId = route.queryParams.executionId;
    const step = route.queryParams.step;
    const artifactId = route.queryParams.artifactId;

    return {
      menu: {
        name: 'Competitors',
        submenu: [
          {
            name: 'Edit',
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
      link: [
        '/',
        'canvas',
        route.params.companyModelId,
        'instance',
        route.params.instanceId,
        'competitors',
        'edit',
      ],
      queryParams: {
        runningProcessId: runningProcessId,
        executionId: executionId,
        step: step,
        artifactId: artifactId,
      },
      depth: 4,
    };
  }
}
