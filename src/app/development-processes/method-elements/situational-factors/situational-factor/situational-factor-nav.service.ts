import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class SituationalFactorNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Situational Factors',
        submenu: [
          {
            name: 'Edit',
            route: ['/', 'situationalFactors', 'detail', route.params.id],
          },
        ],
      },
      link: ['/', 'situationalFactors'],
      depth: 1,
    };
  }
}
