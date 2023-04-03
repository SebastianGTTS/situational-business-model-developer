import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from 'src/app/nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class RunningLightProcessNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Running Methods',
        submenu: [
          {
            id: 'nav-running-light-process-overview',
            name: 'Overview',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'light',
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
              'light',
              'general',
            ],
          },
          {
            id: 'nav-running-light-process-execution',
            name: 'Execution',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'light',
              'execution',
            ],
          },
          {
            id: 'nav-running-light-process-artifacts',
            name: 'Artifacts',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'light',
              'artifacts',
            ],
          },
          {
            name: 'Context',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'light',
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
