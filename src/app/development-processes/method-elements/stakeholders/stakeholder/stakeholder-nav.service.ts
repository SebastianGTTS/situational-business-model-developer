import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class StakeholderNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Stakeholders',
        submenu: [
          {
            name: 'Edit',
            route: ['/', 'stakeholders', 'detail', route.params.id],
          },
        ],
      },
      link: ['/', 'stakeholders'],
      depth: 1,
    };
  }
}
