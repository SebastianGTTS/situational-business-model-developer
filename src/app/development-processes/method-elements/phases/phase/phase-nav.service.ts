import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class PhaseNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Phases',
        submenu: [
          {
            name: 'Edit',
            route: ['/', 'phase-list', route.params.id],
          },
        ],
      },
      link: ['/', 'phase-list'],
      depth: 1,
    };
  }
}
