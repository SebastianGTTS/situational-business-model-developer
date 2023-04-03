import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class TypeNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Types',
        submenu: [
          {
            name: 'Edit',
            route: ['/', 'types', 'detail', route.params.id],
          },
        ],
      },
      link: ['/', 'types'],
      depth: 1,
    };
  }
}
