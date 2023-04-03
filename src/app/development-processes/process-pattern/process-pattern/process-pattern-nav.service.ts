import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessPatternNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Method Patterns',
        submenu: [
          {
            id: 'nav-process-pattern-overview',
            name: 'Overview',
            route: ['/', 'process', 'processview', route.params.id, 'overview'],
          },
          {
            name: 'General',
            route: ['/', 'process', 'processview', route.params.id, 'general'],
          },
          {
            name: 'Selection',
            route: [
              '/',
              'process',
              'processview',
              route.params.id,
              'selection',
            ],
          },
          {
            name: 'Pattern',
            route: ['/', 'process', 'processview', route.params.id, 'pattern'],
          },
        ],
      },
      link: ['/', 'process'],
      depth: 1,
    };
  }
}
