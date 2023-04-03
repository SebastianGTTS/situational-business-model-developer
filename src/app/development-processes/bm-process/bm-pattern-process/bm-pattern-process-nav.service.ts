import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from 'src/app/nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class BmPatternProcessNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Methods',
        submenu: [
          {
            id: 'nav-pattern-process-overview',
            name: 'Overview',
            route: [
              '/',
              'bmprocess',
              'bmprocessview',
              route.parent?.params.id,
              'pattern',
              'overview',
            ],
          },
          {
            name: 'General',
            route: [
              '/',
              'bmprocess',
              'bmprocessview',
              route.parent?.params.id,
              'pattern',
              'general',
            ],
          },
          {
            name: 'Method',
            route: [
              '/',
              'bmprocess',
              'bmprocessview',
              route.parent?.params.id,
              'pattern',
              'method',
            ],
          },
          {
            name: 'Context',
            route: [
              '/',
              'bmprocess',
              'bmprocessview',
              route.parent?.params.id,
              'pattern',
              'context',
            ],
          },
        ],
      },
      link: ['/', 'bmprocess', 'pattern'],
      depth: 1,
    };
  }
}
