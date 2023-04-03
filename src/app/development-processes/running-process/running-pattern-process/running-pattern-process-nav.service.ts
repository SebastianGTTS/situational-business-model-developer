import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from 'src/app/nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class RunningPatternProcessNavService
  implements Resolve<NavDescription>
{
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
              'pattern',
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
              'pattern',
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
              'pattern',
              'execution',
            ],
          },
          {
            id: 'nav-running-pattern-process-artifacts',
            name: 'Artifacts',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'pattern',
              'artifacts',
            ],
          },
          {
            id: 'nav-running-pattern-process-context',
            name: 'Context',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.parent?.params.id,
              'pattern',
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
