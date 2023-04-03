import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from 'src/app/nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class RunningProcessMethodNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Running Method',
        submenu: [
          {
            name: 'Execute',
            route: [
              '/',
              'runningprocess',
              'runningprocessview',
              route.params.id,
              'method',
              route.params.executionId,
            ],
          },
        ],
      },
      link: [
        '/',
        'runningprocess',
        'runningprocessview',
        route.params.id,
        'light',
        'execution',
      ],
      depth: 2,
    };
  }
}
