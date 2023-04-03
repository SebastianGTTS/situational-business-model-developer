import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from 'src/app/nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class BmPhaseProcessNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Methods',
        submenu: [
          {
            id: 'nav-phase-process-overview',
            name: 'Overview',
            route: [
              '/',
              'bmprocess',
              'bmprocessview',
              route.parent?.params.id,
              'phase',
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
              'phase',
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
              'phase',
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
              'phase',
              'context',
            ],
          },
        ],
      },
      link: ['/', 'bmprocess', 'phase'],
      depth: 1,
    };
  }
}
