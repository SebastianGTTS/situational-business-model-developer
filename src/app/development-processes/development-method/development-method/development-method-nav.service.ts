import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class DevelopmentMethodNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Method Building Blocks',
        submenu: [
          {
            id: 'nav-development-method-overview',
            name: 'Overview',
            route: ['/', 'methods', 'methodview', route.params.id, 'overview'],
          },
          {
            name: 'General',
            route: ['/', 'methods', 'methodview', route.params.id, 'general'],
          },
          {
            name: 'Selection',
            route: ['/', 'methods', 'methodview', route.params.id, 'selection'],
          },
          {
            name: 'Execution',
            route: ['/', 'methods', 'methodview', route.params.id, 'execution'],
          },
        ],
      },
      link: ['/', 'methods'],
      depth: 1,
    };
  }
}
