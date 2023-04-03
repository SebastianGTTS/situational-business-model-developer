import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from 'src/app/nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class RunningPhaseProcessNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Running Methods',
        submenu: [
          {
            name: 'Overview',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'phase',
              'overview',
            ],
          },
          {
            name: 'General',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'phase',
              'general',
            ],
          },
          {
            name: 'Execution',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'phase',
              'execution',
            ],
          },
          {
            id: 'nav-running-phase-process-artifacts',
            name: 'Artifacts',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'phase',
              'artifacts',
            ],
          },
          {
            id: 'nav-running-phase-process-context',
            name: 'Context',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'phase',
              'context',
            ],
          },
        ],
      },
      link: ['/', 'runningprocess'],
      depth: 1,
    };
  }
}
