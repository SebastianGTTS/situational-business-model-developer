import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class ToolNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Tools',
        submenu: [
          {
            name: 'Edit',
            route: ['/', 'tools', 'detail', route.params.id],
          },
        ],
      },
      link: ['/', 'tools'],
      depth: 1,
    };
  }
}
