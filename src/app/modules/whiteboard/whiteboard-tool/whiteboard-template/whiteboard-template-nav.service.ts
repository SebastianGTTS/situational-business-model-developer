import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardTemplateNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Templates',
        submenu: [
          {
            name: 'Overview',
            route: [
              '/',
              'whiteboard',
              'templates',
              route.params.id,
              'overview',
            ],
          },
          {
            name: 'General',
            route: ['/', 'whiteboard', 'templates', route.params.id, 'general'],
          },
          {
            name: 'Edit Whiteboard',
            route: ['/', 'whiteboard', 'templates', route.params.id, 'edit'],
          },
        ],
      },
      link: ['/', 'whiteboard', 'templates'],
      depth: 1,
    };
  }
}
