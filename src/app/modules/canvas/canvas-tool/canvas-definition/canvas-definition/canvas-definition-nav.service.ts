import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NavDescription } from '../../../../../nav/nav.service';

@Injectable({
  providedIn: 'root',
})
export class CanvasDefinitionNavService implements Resolve<NavDescription> {
  resolve(route: ActivatedRouteSnapshot): NavDescription {
    return {
      menu: {
        name: 'Canvas Models',
        submenu: [
          {
            name: 'Overview',
            route: ['/', 'canvas', 'definitions', route.params.id, 'overview'],
          },
          {
            name: 'General',
            route: ['/', 'canvas', 'definitions', route.params.id, 'general'],
          },
          {
            name: 'Model',
            route: ['/', 'canvas', 'definitions', route.params.id, 'model'],
          },
        ],
      },
      link: ['/', 'canvas', 'definitions'],
      depth: 1,
    };
  }
}
